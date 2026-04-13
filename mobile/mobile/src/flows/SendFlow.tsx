import { useState, useEffect, useLayoutEffect, useRef, useCallback, useMemo } from 'react';
import { Button, ExpressiveMoneyInput, Chips, ListItem } from '@transferwise/components';
import { InfoCircle, ChevronDown, ChevronRight, Search, Plus, CameraSparkle, Send, Document, Cross, People } from '@transferwise/icons';
import { Illustration } from '@wise/art';
import { Flag } from '@wise/art';
import { FlowHeader, GlassPill, GlassCircle } from '../components/FlowHeader';
import { ButtonCue } from '../components/ButtonCue';
import { RecentContactCard } from '../components/RecentContactCard';
import { RecipientSearchEmpty } from '../components/RecipientSearchEmpty';
import { CurrencySheet } from '../components/CurrencySheet';
import { useLanguage } from '../context/Language';
import { usePrototypeNames } from '../context/PrototypeNames';
import { useLiveRates } from '../context/LiveRates';
import { convertToHomeCurrency } from '@shared/data/currency-rates';
import { formatBalance } from '@shared/data/balances';
import { recipients, businessRecipients, recentContacts, businessRecentContacts, getAvatarSrc, getBadge, type Recipient } from '@shared/data/recipients';
import { currencies } from '@shared/data/currencies';
import { businessCurrencies } from '@shared/data/business-currencies';
import { groupCurrencies } from '@shared/data/taxes-data';
import type { AccountType } from '../App';

function WiseLogoIcon() {
  return (
    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M1.875 15.28 7.35 8.838h-.002L4.02 3h18.105l-7.008 19.375h-3.97L16.95 6.3H9.463l1.665 2.883-.008.08-2.56 2.979h4.188l-1.098 3.037z" />
    </svg>
  );
}

function resolveIcon(iconName: string) {
  switch (iconName) {
    case 'People': return <People size={16} />;
    default: return <WiseLogoIcon />;
  }
}

type ButtonState = 'disabled' | 'loading' | 'active';

type RecipientInfo = {
  name: string;
  subtitle: string;
  avatarUrl?: string;
  initials?: string;
  hasFastFlag: boolean;
  badgeFlagCode?: string;
};

export type AccountStyle = { color: string; textColor: string; iconName: string };

type Props = {
  defaultCurrency: string;
  accountLabel: string;
  jar?: 'taxes';
  accountStyle: AccountStyle;
  onClose: () => void;
  onStepChange?: (step: string) => void;
  onSuccess?: (amount: number, currency: string, recipientName: string, isRecurring: boolean, scheduleDate?: Date | null, scheduleRepeats?: 'never' | 'weekly' | 'monthly') => void;
  onViewScheduled?: () => void;
  accountType: AccountType;
  avatarUrl: string;
  initials: string;
  recipient?: RecipientInfo;
  prefillAmount?: number;
  prefillReceiveAmount?: number;
  startStep?: 'recipient' | 'amount';
  forcedReceiveCurrency?: string;
  forceClose?: boolean;
};

// Helper constants and functions
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const formatScheduleDate = (d: Date) => `${DAY_NAMES[d.getDay()]}, ${d.getDate()} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
const formatScheduleDateShort = (d: Date) => `${DAY_NAMES[d.getDay()]}, ${MONTH_NAMES[d.getMonth()]} ${d.getDate()}`;
const buildCalendarCells = (year: number, month: number): (number | null)[] => {
  const firstDow = new Date(year, month, 1).getDay();
  const monStart = firstDow === 0 ? 6 : firstDow - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = Array(monStart).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
};
const TODAY = new Date(2026, 3, 12); // April 12 2026

export function SendFlow({ defaultCurrency, accountLabel, jar, accountStyle, onClose, onStepChange, onSuccess, onViewScheduled, accountType, avatarUrl, initials, recipient: initialRecipient, prefillAmount, prefillReceiveAmount, startStep = 'recipient', forcedReceiveCurrency, forceClose }: Props) {
  const { t } = useLanguage();
  const { consumerName } = usePrototypeNames();
  const rates = useLiveRates();

  const isBusiness = accountType === 'business';
  const isGroup = jar === 'taxes';

  const [step, setStep] = useState<'recipient' | 'amount' | 'schedule' | 'confirm' | 'success'>(initialRecipient ? 'amount' : startStep);
  const [selectedRecipient, setSelectedRecipient] = useState<RecipientInfo | null>(initialRecipient ?? null);
  const [currency, setCurrency] = useState(initialRecipient?.badgeFlagCode ?? defaultCurrency);
  const [sendCurrency, setSendCurrency] = useState(defaultCurrency);
  const [currencySheetTarget, setCurrencySheetTarget] = useState<'send' | 'receive' | null>(null);
  const [userOverrodeReceiveCurrency, setUserOverrodeReceiveCurrency] = useState(false);
  const [crossTransition, setCrossTransition] = useState<'idle' | 'shimmer' | 'revealing' | 'collapsing'>('idle');
  const reverseShimmerRef = useRef(false);
  const pendingSendCurrencyRef = useRef<string | null>(null);
  const sameCurrencyBottomRef = useRef<HTMLDivElement>(null);
  const [amount, setAmount] = useState<number | null>(prefillAmount ?? null);
  const [receiveAmount, setReceiveAmount] = useState<number | null>(prefillReceiveAmount ?? null);
  const [activeInput, setActiveInput] = useState<'send' | 'receive'>('send');
  const [buttonState, setButtonState] = useState<ButtonState>(prefillAmount ? 'active' : 'disabled');
  const [cueVisible, setCueVisible] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [sendInputFocused, setSendInputFocused] = useState(false);
  const [searchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isAnimating, setIsAnimating] = useState(false);
  const loadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const hasAmountRef = useRef(false);
  const crossTopRef = useRef<HTMLDivElement>(null);
  const slideWrapperRef = useRef<HTMLDivElement>(null);
  const slideAnimRef = useRef<Animation | null>(null);
  // Snapshot of confirm data — written once in handleConfirm so success screen never loses its data
  const successDataRef = useRef<{ amount: number; currency: string; recipientName: string; scheduleDate: Date | null; scheduleRepeats: string } | null>(null);

  // Schedule state
  const [scheduleDate, setScheduleDate] = useState<Date | null>(null);
  const [scheduleRepeats, setScheduleRepeats] = useState<'never' | 'weekly' | 'monthly'>('never');
  const [scheduleEndDate, setScheduleEndDate] = useState('never');
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarYear, setCalendarYear] = useState(2026);
  const [calendarMonth, setCalendarMonth] = useState(3); // April
  const [referenceText, setReferenceText] = useState('');
  const isScheduled = scheduleDate !== null;

  // Open currency sheet
  const openCurrencySheet = useCallback((target: 'send' | 'receive') => {
    setCurrencySheetTarget(target);
  }, []);

  // Determine if we are in cross-currency mode
  const recipientCurrency = (forcedReceiveCurrency && !userOverrodeReceiveCurrency) ? forcedReceiveCurrency : currency;
  const isCrossCurrency = sendCurrency !== recipientCurrency;
  const crossRate = isCrossCurrency ? convertToHomeCurrency(1, sendCurrency, recipientCurrency, rates).toFixed(4) : '';

  // Dynamic business recipients with consumer name
  const dynamicBusinessRecipients = useMemo(() =>
    businessRecipients.map((r) => r.id === 104 ? { ...r, name: consumerName } : r),
    [consumerName],
  );
  const dynamicBusinessRecentContacts = useMemo(() =>
    businessRecentContacts.map((c) => c.name === 'Connor Berry' ? { ...c, name: consumerName } : c),
    [consumerName],
  );

  const activeRecipients = isBusiness ? dynamicBusinessRecipients : recipients;
  const activeRecentContacts = isBusiness ? dynamicBusinessRecentContacts : recentContacts;
  const PROFILE_AVATAR = isBusiness ? '/berry-design-logo.png' : 'https://www.tapback.co/api/avatar/connor-berry.webp';

  const filterChips = useMemo(() => [
    { value: 'all', label: t('recipients.filterAll') },
    { value: 'my-accounts', label: t('recipients.filterMyAccounts') },
  ], [t]);

  const filteredRecipients = useMemo(() => {
    let filtered = activeRecipients;
    if (selectedFilter === 'my-accounts') {
      filtered = filtered.filter((r) => r.isMyAccount);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) => r.name.toLowerCase().includes(q) || r.subtitle.toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [searchQuery, selectedFilter, activeRecipients]);

  const isSearching = searchQuery.trim().length > 0;

  // Find balance for the sending currency
  const allCurrencies = [...(isGroup ? groupCurrencies : []), ...(isBusiness ? businessCurrencies : currencies)];
  const sendCurrencyData = allCurrencies.find((c) => c.code === sendCurrency);
  const availableBalance = sendCurrencyData ? formatBalance(sendCurrencyData) : `0.00 ${sendCurrency}`;

  // Currency name for "You send" section
  const sendCurrencyName = sendCurrencyData?.name ?? sendCurrency;

  // Account avatar style for currency selector — driven by props
  const accountAvatarStyle = { backgroundColor: accountStyle.color, color: accountStyle.textColor };

  // Short date string for the "Arrives/Sends on" row
  const shortDate = scheduleDate ? formatScheduleDateShort(scheduleDate) : '';

  // Select a recipient and transition to amount step
  const handleSelectRecipient = useCallback((r: Recipient) => {
    const info: RecipientInfo = {
      name: r.name,
      subtitle: r.subtitle,
      avatarUrl: r.isMyAccount ? PROFILE_AVATAR : getAvatarSrc(r),
      initials: r.initials,
      hasFastFlag: r.hasFastFlag,
      badgeFlagCode: r.badgeFlagCode,
    };
    setSelectedRecipient(info);
    setSendCurrency(defaultCurrency);
    setCurrency(forcedReceiveCurrency ?? r.badgeFlagCode ?? defaultCurrency);
    setCurrencySheetTarget(null);
    setCrossTransition('idle');
    if (loadingTimerRef.current) {
      clearTimeout(loadingTimerRef.current);
      loadingTimerRef.current = null;
    }
    const hasPrefill = prefillAmount != null || prefillReceiveAmount != null;
    if (hasPrefill) {
      setAmount(prefillAmount ?? null);
      setReceiveAmount(prefillReceiveAmount ?? null);
      hasAmountRef.current = true;
      setButtonState('active');
    } else {
      setAmount(null);
      setReceiveAmount(null);
      setActiveInput('send');
      hasAmountRef.current = false;
      setButtonState('disabled');
    }
    setCueVisible(false);
    setStep('amount');
    onStepChange?.('amount');
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);

    setTimeout(() => {
      const input = bodyRef.current?.querySelector<HTMLInputElement>('.wds-expressive-money-input input');
      input?.focus();
    }, 700);
  }, [defaultCurrency, forcedReceiveCurrency, prefillAmount, prefillReceiveAmount]);

  const handleSelectRecentContact = useCallback((contact: { name: string; subtitle: string }) => {
    const match = activeRecipients.find((r) => r.name === contact.name && r.subtitle.includes(contact.subtitle));
    if (match) {
      handleSelectRecipient(match);
    }
  }, [activeRecipients, handleSelectRecipient]);

  // Button state machine helper
  const updateButtonState = useCallback((hasAmount: boolean) => {
    const hadAmount = hasAmountRef.current;
    hasAmountRef.current = hasAmount;

    if (hasAmount && !hadAmount) {
      setButtonState('loading');
      if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
      loadingTimerRef.current = setTimeout(() => setButtonState('active'), 2000);
    } else if (!hasAmount && hadAmount) {
      setButtonState('loading');
      if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
      loadingTimerRef.current = setTimeout(() => setButtonState('disabled'), 2000);
    }
  }, []);

  // Same-currency: single amount handler
  const handleAmountChange = useCallback((newAmount: number | null) => {
    setAmount(newAmount);
    updateButtonState(newAmount !== null && newAmount !== 0);
  }, [updateButtonState]);

  // Cross-currency: "You send" amount handler
  const handleSendAmountChange = useCallback((newAmount: number | null) => {
    setAmount(newAmount);
    setActiveInput('send');
    const hasVal = newAmount !== null && newAmount !== 0;
    if (hasVal) {
      setReceiveAmount(Math.round(convertToHomeCurrency(newAmount!, sendCurrency, recipientCurrency, rates) * 100) / 100);
    } else {
      setReceiveAmount(null);
    }
    updateButtonState(hasVal);
  }, [sendCurrency, recipientCurrency, rates, updateButtonState]);

  // Cross-currency: "{Name} gets" amount handler
  const handleReceiveAmountChange = useCallback((newAmount: number | null) => {
    setReceiveAmount(newAmount);
    setActiveInput('receive');
    const hasVal = newAmount !== null && newAmount !== 0;
    if (hasVal) {
      setAmount(Math.round(convertToHomeCurrency(newAmount!, recipientCurrency, sendCurrency, rates) * 100) / 100);
    } else {
      setAmount(null);
    }
    updateButtonState(hasVal);
  }, [sendCurrency, recipientCurrency, rates, updateButtonState]);

  // Cleanup timers
  useEffect(() => {
    return () => {
      if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
    };
  }, []);

  // Animate the slide-down of gets input + button when cross-top appears (and reverse on collapse)
  useEffect(() => {
    if (crossTransition === 'revealing' && crossTopRef.current && slideWrapperRef.current) {
      const getsInput = slideWrapperRef.current.querySelector<HTMLInputElement>('.wds-expressive-money-input input');
      getsInput?.focus();

      const height = crossTopRef.current.offsetHeight;
      slideAnimRef.current = slideWrapperRef.current.animate(
        [
          { transform: `translateY(-${height}px)` },
          { transform: 'translateY(0)' },
        ],
        {
          duration: 550,
          easing: 'cubic-bezier(0.4, 0, 0.1, 1.08)',
          fill: 'forwards',
        },
      );
    } else if (crossTransition === 'collapsing' && crossTopRef.current && slideWrapperRef.current) {
      const getsInput = slideWrapperRef.current.querySelector<HTMLInputElement>('.wds-expressive-money-input input');
      getsInput?.focus();

      const crossHeight = crossTopRef.current.offsetHeight;
      crossTopRef.current.style.overflow = 'hidden';
      slideAnimRef.current = crossTopRef.current.animate(
        [
          { height: `${crossHeight}px`, opacity: 1 },
          { height: '0px', opacity: 0 },
        ],
        {
          duration: 480,
          easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
          fill: 'forwards',
        },
      );

      if (reverseShimmerRef.current && sameCurrencyBottomRef.current) {
        const el = sameCurrencyBottomRef.current;
        el.style.overflow = 'hidden';
        const targetHeight = el.scrollHeight;
        el.animate(
          [
            { height: '0px', opacity: 0 },
            { height: `${targetHeight}px`, opacity: 1 },
          ],
          {
            duration: 480,
            easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
            fill: 'forwards',
          },
        ).onfinish = () => {
          el.style.overflow = '';
          el.style.height = '';
        };
      }
    } else if ((crossTransition === 'idle' || crossTransition === 'shimmer') && slideAnimRef.current) {
      slideAnimRef.current.cancel();
      slideAnimRef.current = null;
    }
  }, [crossTransition]);

  // Clean up same-bottom styles when transitioning from collapsing to shimmer/idle
  useLayoutEffect(() => {
    if ((crossTransition === 'shimmer' || crossTransition === 'idle') && sameCurrencyBottomRef.current) {
      const el = sameCurrencyBottomRef.current;
      el.style.overflow = '';
      el.style.height = '';
    }
  }, [crossTransition]);

  // Recent = account currencies (ones the user has)
  const recentCurrencyCodes = useMemo(() =>
    allCurrencies.map((c) => c.code),
  [allCurrencies]);

  const handleSelectSendCurrency = useCallback((code: string) => {
    const wasCross = sendCurrency !== recipientCurrency;
    const wasNotCross = !wasCross;
    const willBeCross = code !== recipientCurrency;

    if (amount !== null && amount !== 0 && willBeCross) {
      setReceiveAmount(Math.round(convertToHomeCurrency(amount, code, recipientCurrency, rates) * 100) / 100);
    }

    if (wasNotCross && willBeCross) {
      setSendCurrency(code);
      setCrossTransition('shimmer');
      setTimeout(() => setCrossTransition('revealing'), 1200);
      setTimeout(() => setCrossTransition('idle'), 2000);
    } else if (wasCross && !willBeCross) {
      reverseShimmerRef.current = true;
      pendingSendCurrencyRef.current = code;
      setCrossTransition('collapsing');
      setTimeout(() => {
        setSendCurrency(code);
        if (amount !== null && amount !== 0) {
          setReceiveAmount(null);
        }
        pendingSendCurrencyRef.current = null;
        reverseShimmerRef.current = false;
        setCrossTransition('shimmer');
        setTimeout(() => {
          setCrossTransition('idle');
          setTimeout(() => {
            const input = bodyRef.current?.querySelector<HTMLInputElement>('.wds-expressive-money-input input');
            input?.focus();
          }, 100);
        }, 600);
      }, 500);
    } else {
      setSendCurrency(code);
      if (wasCross && willBeCross && amount !== null && amount !== 0) {
        setReceiveAmount(Math.round(convertToHomeCurrency(amount, code, recipientCurrency, rates) * 100) / 100);
      }
    }
  }, [amount, recipientCurrency, rates, sendCurrency]);

  const handleSelectReceiveCurrency = useCallback((code: string) => {
    const wasCross = sendCurrency !== recipientCurrency;
    const willBeCross = sendCurrency !== code;

    setUserOverrodeReceiveCurrency(true);

    if (!wasCross && willBeCross) {
      setCurrency(code);
      setCrossTransition('shimmer');
      if (amount !== null && amount !== 0) {
        setReceiveAmount(Math.round(convertToHomeCurrency(amount, sendCurrency, code, rates) * 100) / 100);
      }
      setTimeout(() => setCrossTransition('revealing'), 1200);
      setTimeout(() => setCrossTransition('idle'), 2000);
    } else if (wasCross && !willBeCross) {
      reverseShimmerRef.current = true;
      pendingSendCurrencyRef.current = sendCurrency;
      setCrossTransition('collapsing');
      setTimeout(() => {
        setCurrency(code);
        setReceiveAmount(null);
        pendingSendCurrencyRef.current = null;
        reverseShimmerRef.current = false;
        setCrossTransition('shimmer');
        setTimeout(() => {
          setCrossTransition('idle');
          setTimeout(() => {
            const input = bodyRef.current?.querySelector<HTMLInputElement>('.wds-expressive-money-input input');
            input?.focus();
          }, 100);
        }, 600);
      }, 500);
    } else {
      setCurrency(code);
      if (amount !== null && amount !== 0) {
        setReceiveAmount(Math.round(convertToHomeCurrency(amount, sendCurrency, code, rates) * 100) / 100);
      }
    }
  }, [amount, sendCurrency, recipientCurrency, rates]);

  // Show cue after mount when on amount step
  useEffect(() => {
    if (step === 'amount' && !prefillAmount) {
      const focusTimer = setTimeout(() => {
        const input = bodyRef.current?.querySelector<HTMLInputElement>('.wds-expressive-money-input input');
        input?.focus();
      }, 400);

      const cueTimer = setTimeout(() => {
        setCueVisible(true);
      }, 500);

      return () => {
        clearTimeout(focusTimer);
        clearTimeout(cueTimer);
      };
    }
  }, [step, prefillAmount]);

  // Handle back button
  const handleBack = useCallback(() => {
    if (step === 'confirm') { setStep('amount'); return; }
    if (step === 'amount') {
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
        loadingTimerRef.current = null;
      }
      setStep('recipient');
      onStepChange?.('recipient');
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 600);
      setCueVisible(false);

      const panel = document.querySelector('.send-flow__panel:first-child');
      if (panel) panel.scrollTop = 0;

      setTimeout(() => {
        setSelectedRecipient(null);
        setAmount(null);
        setReceiveAmount(null);
        setSendCurrency(defaultCurrency);
        setCurrencySheetTarget(null);
        setCrossTransition('idle');
        setButtonState('disabled');
      }, 600);
    }
  }, [step]);

  const handleConfirm = useCallback(() => {
    if (amount !== null && selectedRecipient) {
      // Snapshot all data the success screen needs before any state changes happen
      successDataRef.current = { amount, currency: sendCurrency, recipientName: selectedRecipient.name, scheduleDate, scheduleRepeats };
      onSuccess?.(amount, sendCurrency, selectedRecipient.name, scheduleRepeats !== 'never', scheduleDate, scheduleRepeats);
      setStep('success');
    }
  }, [amount, sendCurrency, selectedRecipient, scheduleRepeats, scheduleDate, onSuccess]);

  // Schedule step — early return
  if (step === 'schedule') {
    const calCells = buildCalendarCells(calendarYear, calendarMonth);
    return (
      <div className="send-flow">
        <div className="send-flow__body" style={{ overflowY: 'auto', padding: '56px 24px 40px', display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
          <button
            type="button"
            className="send-flow__schedule-close-btn"
            onClick={() => setStep('amount')}
            aria-label="Close"
          >
            <Cross size={16} />
          </button>

          <h1 className="send-flow__schedule-heading">Create a scheduled or recurring transfer</h1>
          <p className="send-flow__schedule-body-text">
            You can choose to send this transfer at a later date, and whether it repeats. You'll need enough money in your account to pay on the scheduled date.
          </p>

          <div className="send-flow__schedule-fields">
            {/* Date field */}
            <div>
              <p className="send-flow__schedule-field-label">Date</p>
              <button
                type="button"
                className={`send-flow__dropdown-trigger${!scheduleDate ? ' send-flow__dropdown-trigger--placeholder' : ''}`}
                onClick={() => setCalendarOpen((prev) => !prev)}
              >
                <span>{scheduleDate ? formatScheduleDate(scheduleDate) : 'Select a date'}</span>
                <ChevronDown size={16} />
              </button>

              {calendarOpen && (
                <div className="send-flow__calendar-popup">
                  <div className="send-flow__cal-header">
                    <div className="send-flow__cal-month-label">
                      <span>{MONTH_NAMES[calendarMonth]} {calendarYear}</span>
                      <ChevronRight size={16} />
                    </div>
                    <button
                      type="button"
                      className="send-flow__cal-nav-btn"
                      aria-label="Previous month"
                      onClick={() => {
                        if (calendarMonth === 0) {
                          setCalendarMonth(11);
                          setCalendarYear((y) => y - 1);
                        } else {
                          setCalendarMonth((m) => m - 1);
                        }
                      }}
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      className="send-flow__cal-nav-btn"
                      aria-label="Next month"
                      onClick={() => {
                        if (calendarMonth === 11) {
                          setCalendarMonth(0);
                          setCalendarYear((y) => y + 1);
                        } else {
                          setCalendarMonth((m) => m + 1);
                        }
                      }}
                    >
                      ›
                    </button>
                    <button
                      type="button"
                      className="send-flow__cal-close-btn"
                      aria-label="Close calendar"
                      onClick={() => setCalendarOpen(false)}
                    >
                      <Cross size={16} />
                    </button>
                  </div>

                  <div className="send-flow__cal-weekdays">
                    {['MON','TUE','WED','THU','FRI','SAT','SUN'].map((d) => (
                      <div key={d} className="send-flow__cal-weekday">{d}</div>
                    ))}
                  </div>

                  <div className="send-flow__cal-days">
                    {calCells.map((day, idx) => {
                      if (day === null) {
                        return <button key={idx} type="button" className="send-flow__cal-day send-flow__cal-day--empty" disabled aria-hidden="true" />;
                      }
                      const cellDate = new Date(calendarYear, calendarMonth, day);
                      const isToday = cellDate.getTime() === TODAY.getTime();
                      const isPast = cellDate < TODAY;
                      const isSelected = scheduleDate !== null && cellDate.getTime() === scheduleDate.getTime();
                      let cls = 'send-flow__cal-day';
                      if (isToday) cls += ' send-flow__cal-day--today';
                      if (isPast) cls += ' send-flow__cal-day--past';
                      if (isSelected) cls += ' send-flow__cal-day--selected';
                      return (
                        <button
                          key={idx}
                          type="button"
                          className={cls}
                          disabled={isPast}
                          onClick={() => {
                            if (!isPast) {
                              setScheduleDate(new Date(calendarYear, calendarMonth, day));
                              setCalendarOpen(false);
                            }
                          }}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Repeats field — only show when scheduleDate is set */}
            {scheduleDate && (
              <div>
                <p className="send-flow__schedule-field-label">Repeats</p>
                <select
                  className="send-flow__dropdown-select"
                  value={scheduleRepeats}
                  onChange={(e) => setScheduleRepeats(e.target.value as 'never' | 'weekly' | 'monthly')}
                >
                  <option value="never">Never</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            )}

            {/* End date field — only show when scheduleRepeats !== 'never' */}
            {scheduleRepeats !== 'never' && (
              <div>
                <p className="send-flow__schedule-field-label">End date</p>
                <select
                  className="send-flow__dropdown-select"
                  value={scheduleEndDate}
                  onChange={(e) => setScheduleEndDate(e.target.value)}
                >
                  <option value="never">Never</option>
                  <option value="after-6-months">After 6 months</option>
                  <option value="after-1-year">After 1 year</option>
                </select>
              </div>
            )}

            <div style={{ flex: 1 }} />

            <Button
              v2
              size="lg"
              priority="primary"
              block
              disabled={!scheduleDate}
              onClick={() => {
                setCalendarOpen(false);
                setStep('amount');
              }}
            >
              Set schedule
            </Button>
            <Button
              v2
              size="lg"
              priority="secondary"
              block
              onClick={() => {
                setScheduleDate(null);
                setScheduleRepeats('never');
                setStep('amount');
              }}
            >
              Send now instead
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Success — unconditional early return using snapshotted data from handleConfirm
  if (step === 'success') {
    const d = successDataRef.current;
    const fmtAmount = d ? d.amount.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : (amount?.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? '0.00');
    const recipientName = d?.recipientName ?? selectedRecipient?.name ?? '';
    const successScheduleDate = d?.scheduleDate ?? scheduleDate;
    const successScheduleRepeats = d?.scheduleRepeats ?? scheduleRepeats;
    const successCurrency = d?.currency ?? sendCurrency;

    return (
      <div className="send-flow" style={{ background: '#163300', color: '#fff', padding: '56px 24px 44px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div className="add-money-success__header">
          <GlassCircle onClick={onClose} ariaLabel="Close">
            <span className="ios-glass-btn__icon"><Cross size={24} /></span>
          </GlassCircle>
        </div>
        {successScheduleDate !== null ? (
          <div className="add-money-success__content">
            <div className="send-success__scheduled-icon">
              <Illustration name="confetti" size="large" />
            </div>
            <h1 className="send-success__scheduled-title">
              {successScheduleRepeats !== 'never' ? 'YOUR TRANSFERS ARE SCHEDULED' : 'YOUR TRANSFER IS SCHEDULED'}
            </h1>
            <p className="send-success__scheduled-desc">
              We've scheduled {successScheduleRepeats !== 'never' ? successScheduleRepeats + ' ' : ''}transfers of {fmtAmount} {successCurrency} to {recipientName}, starting on {successScheduleDate ? formatScheduleDateShort(successScheduleDate) : ''}.
            </p>
            <p className="send-success__scheduled-note">
              Ensure your account has enough money before each scheduled date to prevent delays.
            </p>
          </div>
        ) : (
          <div className="add-money-success__content">
            <div className="add-money-success__illustration">
              <Illustration name="confetti" size="large" />
            </div>
            <h1 className="add-money-success__title">{t('send.successTitle')}</h1>
            <div className="send-success__details">
              <p className="send-success__amount">{fmtAmount} {successCurrency}</p>
              <p className="send-success__recipient">to {recipientName}</p>
              <div className="send-success__meta">
                <span className="send-success__tag send-success__tag--account">{accountLabel}</span>
              </div>
            </div>
          </div>
        )}
        <div className="add-money-success__footer" style={successScheduleDate !== null ? { display: 'flex', flexDirection: 'column', gap: 12 } : undefined}>
          {successScheduleDate !== null ? (
            <>
              <Button v2 size="lg" priority="primary" block onClick={onClose}>Add money</Button>
              <Button v2 size="lg" priority="secondary" block onClick={onViewScheduled ?? onClose}>View scheduled transfers</Button>
            </>
          ) : (
            <Button v2 size="lg" priority="primary" block onClick={onClose}>{t('addMoney.gotIt')}</Button>
          )}
        </div>
      </div>
    );
  }

  // Confirm
  if (step === 'confirm' && selectedRecipient) {
    const fmtAmount = amount?.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? '0.00';
    return (
      <div className="send-flow">
        <div style={{ overflowY: 'auto', flex: 1 }}>
            <div className="send-flow__confirm-step">
              <div style={{ padding: '56px 24px 0', display: 'flex', alignItems: 'center' }}>
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px 4px 0', display: 'flex', alignItems: 'center', color: 'var(--color-content-primary)' }}
                  onClick={() => setStep('amount')}
                  aria-label="Back"
                >
                  <span style={{ transform: 'rotate(180deg)', display: 'inline-flex' }}><ChevronRight size={24} /></span>
                </button>
              </div>
              <h1 className="send-flow__confirm-title">Confirm and send</h1>

              {/* Payment method */}
              <div className="send-flow__confirm-section">
                <div className="send-flow__confirm-section-header">
                  <p className="send-flow__confirm-section-label">Payment method</p>
                </div>
                <div className="send-flow__confirm-payment-row">
                  <ListItem.AvatarView size={40} style={accountAvatarStyle}>
                    {resolveIcon(accountStyle.iconName)}
                  </ListItem.AvatarView>
                  <div className="send-flow__confirm-payment-info">
                    <p className="send-flow__confirm-payment-title">{accountLabel} / {sendCurrency}</p>
                    <p className="send-flow__confirm-payment-sub">{availableBalance} available</p>
                  </div>
                </div>
              </div>

              {/* Transfer details */}
              <div className="send-flow__confirm-section">
                <div className="send-flow__confirm-section-header">
                  <p className="send-flow__confirm-section-label">Transfer details</p>
                  <button type="button" className="send-flow__confirm-change-btn" onClick={() => setStep('amount')}>Change</button>
                </div>
                <div className="send-flow__confirm-row">
                  <p className="send-flow__confirm-key">You send</p>
                  <p className="send-flow__confirm-val">{fmtAmount} {sendCurrency}</p>
                </div>
                <div className="send-flow__confirm-row">
                  <p className="send-flow__confirm-key">Total fees (included)</p>
                  <p className="send-flow__confirm-val">0 {sendCurrency}</p>
                </div>
                <div className="send-flow__confirm-row">
                  <p className="send-flow__confirm-key">{selectedRecipient.name} gets exactly</p>
                  <p className="send-flow__confirm-val">{fmtAmount} {sendCurrency}</p>
                </div>
              </div>

              {/* Recipient details */}
              <div className="send-flow__confirm-section">
                <div className="send-flow__confirm-section-header">
                  <p className="send-flow__confirm-section-label">Recipient details</p>
                  <button type="button" className="send-flow__confirm-change-btn" onClick={() => setStep('recipient')}>Change</button>
                </div>
                <div className="send-flow__confirm-row">
                  <p className="send-flow__confirm-key">Account holder name</p>
                  <p className="send-flow__confirm-val">{selectedRecipient.name}</p>
                </div>
                <div className="send-flow__confirm-row">
                  <p className="send-flow__confirm-key">Account provider</p>
                  <p className="send-flow__confirm-val">Wise</p>
                </div>
              </div>

              {/* Schedule details — only if isScheduled */}
              {isScheduled && scheduleDate && (
                <div className="send-flow__confirm-section">
                  <div className="send-flow__confirm-section-header">
                    <p className="send-flow__confirm-section-label">Schedule details</p>
                    <button type="button" className="send-flow__confirm-change-btn" onClick={() => setStep('schedule')}>Change</button>
                  </div>
                  <div className="send-flow__confirm-row">
                    <p className="send-flow__confirm-key">Sends on</p>
                    <p className="send-flow__confirm-val">{formatScheduleDateShort(scheduleDate)}</p>
                  </div>
                  <div className="send-flow__confirm-row">
                    <p className="send-flow__confirm-key">Repeats</p>
                    <p className="send-flow__confirm-val">
                      {scheduleRepeats === 'monthly' ? 'Monthly' : scheduleRepeats === 'weekly' ? 'Weekly' : 'Once'}
                    </p>
                  </div>
                  {scheduleRepeats !== 'never' && (
                    <div className="send-flow__confirm-row">
                      <p className="send-flow__confirm-key">End date</p>
                      <p className="send-flow__confirm-val">
                        {scheduleEndDate === 'never' ? 'Never' : scheduleEndDate}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Footer */}
              <div className="send-flow__confirm-footer">
                <Button v2 size="lg" priority="primary" block onClick={handleConfirm}>
                  {isScheduled ? 'Schedule transfer' : 'Confirm and send'}
                </Button>
              </div>
            </div>
          </div>
      </div>
    );
  }

  return (
    <div className={`send-flow${isSearching ? ' send-flow--searching' : ''}`}>
      <FlowHeader
        onClose={onClose}
        onBack={step === 'amount' ? handleBack : undefined}
        forceClose={forceClose}
        trailing={step === 'recipient' ? (
          <>
            <GlassPill className="ios-glass-btn--accent">
              <span className="ios-glass-btn__icon"><Plus size={16} /></span>
              <span className="ios-glass-btn__label">{t('common.add')}</span>
            </GlassPill>
            <GlassCircle ariaLabel="Scan">
              <span className="ios-glass-btn__icon"><CameraSparkle size={24} /></span>
            </GlassCircle>
          </>
        ) : step === 'amount' && isCrossCurrency ? (
          <GlassPill>
            <span className="flow-header__rate-clip">
              <span className="flow-header__rate-flipper">
                <span className="flow-header__rate-line">
                  <span className="ios-glass-btn__label" style={{ fontSize: 14 }}>
                    {t('send.rate', { from: sendCurrency, rate: crossRate, to: recipientCurrency })}
                  </span>
                </span>
                <span className="flow-header__rate-line">
                  <span className="ios-glass-btn__label" style={{ fontSize: 14 }}>
                    Guaranteed for 3h
                  </span>
                </span>
              </span>
            </span>
            <span className="ios-glass-btn__icon" style={{ transform: 'scale(0.75)' }}><ChevronRight size={16} /></span>
          </GlassPill>
        ) : undefined}
      />

      <div className={`send-flow__track${step === 'amount' ? ' send-flow__track--step-amount' : ''}${isAnimating ? ' send-flow__track--animating' : ''}`}>
        {/* Step 1: Recipient */}
        <div className="send-flow__panel">
        <div className="send-flow__body" ref={step === 'recipient' ? bodyRef : undefined}>
          <>
            {/* Title */}
            <h1 className="send-flow__title np-display np-text-display-small">Who are you<br />sending to?</h1>

            {/* Recents */}
            <div className="send-flow__recents-section">
              <p className="np-text-title-group" style={{ margin: '0 0 8px' }}>{t('send.recents')}</p>
              <div className="send-flow__recents">
                {activeRecentContacts.slice(0, 6).map((contact, i) => {
                  const isMyAccount = activeRecipients.some((r) => r.name === contact.name && r.isMyAccount);
                  const contactImg = isMyAccount ? PROFILE_AVATAR : contact.imgSrc;
                  return (
                    <RecentContactCard
                      key={i}
                      name={contact.name}
                      subtitle={contact.subtitle}
                      imgSrc={contactImg}
                      initials={contact.initials}
                      badge={contact.badge}
                      onClick={() => handleSelectRecentContact(contact)}

                    />
                  );
                })}
              </div>
            </div>

            {/* Filter + Search */}
            <div className="send-flow__all-section">
            <div className="send-flow__filters">
              <Chips
                chips={filterChips}
                selected={selectedFilter}
                onChange={({ selectedValue }: { isEnabled: boolean; selectedValue: string | number }) => setSelectedFilter(String(selectedValue))}
              />
              <div className="send-flow__filter-spacer" />
              <Button v2 size="sm" priority="secondary-neutral" addonStart={{ type: 'icon', value: <Search size={16} /> }}>{t('recipients.search')}</Button>
            </div>

            {/* Recipient list or empty state */}
            {filteredRecipients.length > 0 ? (
              <ul className="send-flow__list">
                {filteredRecipients.map((r) => {
                  const badge = getBadge(r);
                  let imgSrc: string | undefined;
                  let avatarChildren: string | undefined;

                  if (r.isMyAccount) {
                    imgSrc = PROFILE_AVATAR;
                  } else if (r.avatarType === 'photo') {
                    imgSrc = getAvatarSrc(r);
                  } else {
                    avatarChildren = r.initials;
                  }

                  const avatarMedia = avatarChildren !== undefined ? (
                    <ListItem.AvatarView key={r.id} size={48} badge={badge} style={{ backgroundColor: 'var(--color-background-neutral)', border: 'none' }}>
                      {avatarChildren}
                    </ListItem.AvatarView>
                  ) : (
                    <ListItem.AvatarView key={r.id} size={48} imgSrc={imgSrc} profileName={r.name} badge={badge} />
                  );

                  return (
                    <ListItem
                      key={r.id}
                      title={<span className="np-text-body-large" style={{ fontWeight: 600 }}>{r.name}</span>}
                      subtitle={r.subtitle}
                      media={avatarMedia}
                      control={<ListItem.Navigation onClick={() => handleSelectRecipient(r)} />}
                    />
                  );
                })}
              </ul>
            ) : searchQuery.trim() ? (
              <RecipientSearchEmpty query={searchQuery.trim()} />
            ) : null}
            </div>
          </>
        </div>
        </div>

        {/* Step 2: Amount */}
        <div className="send-flow__panel">
        <div className="send-flow__body" ref={step === 'amount' ? bodyRef : undefined}>
          {/* === CROSS-TOP: rate pill + send input + divider === */}
          {selectedRecipient && (crossTransition === 'revealing' || crossTransition === 'collapsing' || (isCrossCurrency && crossTransition === 'idle')) && (
            <div ref={crossTopRef} className={`send-flow__cross-top${crossTransition === 'revealing' ? ' send-flow__cross-top--revealing' : crossTransition === 'collapsing' ? ' send-flow__cross-top--collapsing' : ' send-flow__cross-top--expanded'}`}>
              {/* You send input */}
              <div className="send-flow__send-input">
                <ExpressiveMoneyInput
                  label={<span style={{ whiteSpace: 'nowrap' }}>{t('send.youSend')}</span>}
                  currency={sendCurrency}
                  amount={amount}
                  onAmountChange={handleSendAmountChange}
                  currencySelector={{
                    customRender: ({ id, labelId }) => (
                      <div id={id} aria-labelledby={labelId} className="wds-expressive-money-input-currency-selector">
                        <Button v2 size="md" priority="secondary-neutral" className="wds-currency-selector"
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            setCurrencySheetTarget(currencySheetTarget === 'send' ? null : 'send');
                          }}
                          addonStart={{ type: 'avatar', value: [{ asset: <Flag code={sendCurrency} loading="eager" /> }] }}
                          addonEnd={{ type: 'icon', value: <ChevronDown size={16} /> }}
                        >
                          {sendCurrency}
                        </Button>
                      </div>
                    ),
                  }}
                  showChevron={!sendInputFocused && !inputFocused && !amount && !receiveAmount}
                  onFocusChange={setSendInputFocused}
                />
                <p className="convert-flow__available np-text-body-default">
                  Amount available: <button type="button" className="convert-flow__available-link" onClick={() => handleSendAmountChange(sendCurrencyData?.balance ?? 0)}>{availableBalance}</button>
                </p>
              </div>

              {/* Cross divider */}
              <div className={`send-flow__cross-divider${sendInputFocused || inputFocused ? ' send-flow__cross-divider--visible' : ''}`} />
            </div>
          )}

          {/* === SLIDE WRAPPER: gets + bottom section + button — slides down via Web Animations API === */}
          <div ref={slideWrapperRef} className="send-flow__slide-wrapper">

          {/* Gets input — always visible, physically slides down when cross-top appears */}
          {selectedRecipient && (
          <div className="send-flow__gets-wrapper">
            <ExpressiveMoneyInput
              label={<span style={{ whiteSpace: 'nowrap' }}>{t(inputFocused ? 'send.recipientGetsExactly' : 'send.recipientGets', { name: selectedRecipient.name })}</span>}
              currency={recipientCurrency}
              amount={isCrossCurrency && crossTransition !== 'shimmer' ? receiveAmount : amount}
              onAmountChange={isCrossCurrency && crossTransition !== 'shimmer' ? handleReceiveAmountChange : handleAmountChange}
              currencySelector={{
                customRender: ({ id, labelId }) => (
                  <div id={id} aria-labelledby={labelId} className="wds-expressive-money-input-currency-selector">
                    <Button v2 size="md" priority="secondary-neutral" className="wds-currency-selector"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        setCurrencySheetTarget(currencySheetTarget === 'receive' ? null : 'receive');
                      }}
                      addonStart={{
                        type: 'avatar',
                        value: selectedRecipient.avatarUrl
                          ? [{ imgSrc: selectedRecipient.avatarUrl }, { asset: <Flag code={recipientCurrency} loading="eager" /> }]
                          : [{ style: selectedRecipient.initials ? { backgroundColor: 'transparent' } as React.CSSProperties : accountAvatarStyle, asset: selectedRecipient.initials ? <span style={{ fontSize: 10, fontWeight: 600 }}>{selectedRecipient.initials}</span> : <WiseLogoIcon /> }, { asset: <Flag code={recipientCurrency} loading="eager" /> }],
                      }}
                      addonEnd={{ type: 'icon', value: <ChevronDown size={16} /> }}
                    >
                      {recipientCurrency}
                    </Button>
                  </div>
                ),
              }}
              showChevron={!inputFocused && !sendInputFocused && !amount && !receiveAmount}
              onFocusChange={setInputFocused}
            />

            {/* Amount available — show below gets input in same-currency mode, shimmer, and reverse-collapsing */}
            {(!isCrossCurrency || crossTransition === 'shimmer' || (crossTransition === 'collapsing' && reverseShimmerRef.current)) && (
              <p className="convert-flow__available np-text-body-default">
                Amount available: <button type="button" className="convert-flow__available-link" onClick={() => {
                  const bal = allCurrencies.find((c) => c.code === recipientCurrency)?.balance ?? 0;
                  if (isCrossCurrency && crossTransition !== 'shimmer') {
                    handleReceiveAmountChange(bal);
                  } else {
                    handleAmountChange(bal);
                  }
                }}>{ (() => { const c = allCurrencies.find((c) => c.code === recipientCurrency); return c ? formatBalance(c) : `0.00 ${recipientCurrency}`; })() }</button>
              </p>
            )}
          </div>
          )}

          {/* === SAME-CURRENCY BOTTOM: divider + list item / shimmer === */}
          {selectedRecipient && ((!isCrossCurrency && crossTransition === 'idle') || crossTransition === 'shimmer' || (crossTransition === 'collapsing' && reverseShimmerRef.current)) && (
            <div ref={sameCurrencyBottomRef} className="send-flow__same-bottom">
              {/* List item — same-currency idle only */}
              {!isCrossCurrency && crossTransition === 'idle' && (
                <div className="send-flow__you-send" onClick={() => setCurrencySheetTarget(currencySheetTarget === 'send' ? null : 'send')} style={{ cursor: 'pointer' }}>
                  <ListItem
                    title={<span className="np-text-body-default" style={{ fontWeight: 400, color: 'var(--color-content-secondary)' }}>{t('send.youSend')}</span>}
                    subtitle={<span className="np-text-body-large" style={{ fontWeight: 600, color: 'var(--color-content-primary)' }}>{sendCurrencyName}</span>}
                    media={
                      <ListItem.AvatarView size={40}>
                        <Flag code={sendCurrency} loading="eager" />
                      </ListItem.AvatarView>
                    }
                    control={
                      <Button v2 size="sm" priority="secondary">{t('send.change')}</Button>
                    }
                  />
                </div>
              )}

              {/* Shimmer skeleton — visible during shimmer phase and reverse-collapsing */}
              {(crossTransition === 'shimmer' || (crossTransition === 'collapsing' && reverseShimmerRef.current)) && (
                <div className="send-flow__shimmer-row">
                  <div className="send-flow__shimmer-el send-flow__shimmer-circle" />
                  <div className="send-flow__shimmer-bars">
                    <div className="send-flow__shimmer-el send-flow__shimmer-bar send-flow__shimmer-bar--sm" />
                    <div className="send-flow__shimmer-el send-flow__shimmer-bar send-flow__shimmer-bar--lg" />
                  </div>
                  <div className="send-flow__shimmer-el send-flow__shimmer-pill" />
                </div>
              )}
            </div>
          )}

          </div>{/* end slide-wrapper */}

          {/* Review metadata rows — only show when selectedRecipient && !isCrossCurrency && crossTransition === 'idle' */}
          {selectedRecipient && !isCrossCurrency && crossTransition === 'idle' && (
            <div className="send-flow__review-rows">
              {/* Paying with */}
              <ListItem
                title={<span className="np-text-body-default" style={{ fontWeight: 400, color: 'var(--color-content-secondary)' }}>Paying with</span>}
                subtitle={<span className="np-text-body-large" style={{ fontWeight: 600, color: 'var(--color-content-primary)' }}>{accountLabel} / {sendCurrency}</span>}
                media={
                  <ListItem.AvatarView size={40} style={accountAvatarStyle}>
                    {resolveIcon(accountStyle.iconName)}
                  </ListItem.AvatarView>
                }
              />

              {/* Arrives/Sends on */}
              <ListItem
                title={
                  <span className="np-text-body-default" style={{ fontWeight: 400, color: 'var(--color-content-secondary)' }}>
                    {scheduleDate ? `Sends on ${shortDate}` : 'Arrives'}
                  </span>
                }
                subtitle={
                  scheduleDate && scheduleRepeats !== 'never'
                    ? <span className="np-text-body-large" style={{ fontWeight: 600, color: 'var(--color-content-primary)' }}>Repeats {scheduleRepeats}</span>
                    : scheduleDate
                    ? undefined
                    : <span className="np-text-body-large" style={{ fontWeight: 600, color: 'var(--color-content-primary)' }}>Today — in seconds</span>
                }
                media={
                  <ListItem.AvatarView size={40} style={{ backgroundColor: 'var(--color-background-neutral)', border: 'none' }}>
                    <Send size={16} />
                  </ListItem.AvatarView>
                }
                control={
                  onSuccess ? (
                    <Button v2 size="sm" priority="secondary-neutral" onClick={() => setStep('schedule')}>
                      Schedule
                    </Button>
                  ) : undefined
                }
              />

              {/* Total fees */}
              <ListItem
                title={<span className="np-text-body-default" style={{ fontWeight: 400, color: 'var(--color-content-secondary)' }}>Total fees</span>}
                subtitle={<span className="np-text-body-large" style={{ fontWeight: 600, color: 'var(--color-content-primary)' }}>Free — no fees to pay</span>}
                media={
                  <ListItem.AvatarView size={40} style={{ backgroundColor: 'var(--color-background-neutral)', border: 'none' }}>
                    <Document size={16} />
                  </ListItem.AvatarView>
                }
              />

              {/* Reference input */}
              <div className="send-flow__reference-wrap">
                <p className="send-flow__reference-label">Reference for {selectedRecipient.name} (optional)</p>
                <input
                  type="text"
                  className="send-flow__reference-input"
                  value={referenceText}
                  onChange={(e) => setReferenceText(e.target.value)}
                  placeholder=""
                />
              </div>
            </div>
          )}

          {/* Continue button — outside slide-wrapper so it doesn't move during cross-currency transition */}
          {selectedRecipient && (
            <div className="send-flow__continue" style={isCrossCurrency ? { marginTop: 40 } : undefined}>
              <ButtonCue
                visible={cueVisible && buttonState === 'disabled' && crossTransition === 'idle'}
                hint={
                  <>
                    <InfoCircle size={16} />
                    <span className="np-text-body-default">
                      {isCrossCurrency ? (() => {
                        const text = t('send.enterEitherAmount');
                        const idx = text.indexOf('either amount');
                        if (idx === -1) return text;
                        return <>{text.slice(0, idx)}<span style={{ fontWeight: 600 }}>either amount</span>{text.slice(idx + 'either amount'.length)}</>;
                      })() : t('send.enterAmount')}
                    </span>
                  </>
                }
              >
                <Button
                  v2
                  size="lg"
                  priority="primary"
                  disabled={buttonState !== 'active' || crossTransition !== 'idle'}
                  loading={buttonState === 'loading' || crossTransition === 'shimmer'}
                  className={(buttonState === 'loading' || crossTransition === 'shimmer') ? 'send-flow__btn-loading' : undefined}
                  block
                  onClick={onSuccess ? () => {
                    if (buttonState !== 'active') return;
                    if (isScheduled && amount !== null && selectedRecipient) {
                      // Scheduled payment — skip confirm, go straight to success
                      successDataRef.current = { amount, currency: sendCurrency, recipientName: selectedRecipient.name, scheduleDate, scheduleRepeats };
                      onSuccess(amount, sendCurrency, selectedRecipient.name, scheduleRepeats !== 'never', scheduleDate, scheduleRepeats);
                      setStep('success');
                    } else {
                      setStep('confirm');
                    }
                  } : undefined}
                >
                  {t('send.continue')}
                </Button>
              </ButtonCue>
            </div>
          )}

        </div>
        </div>
      </div>

      {/* Currency sheet — full screen sheet for send/receive currency selection */}
      <CurrencySheet
        open={currencySheetTarget !== null}
        onClose={() => setCurrencySheetTarget(null)}
        onSelect={(code) => currencySheetTarget === 'send' ? handleSelectSendCurrency(code) : handleSelectReceiveCurrency(code)}
        selectedCode={currencySheetTarget === 'send' ? sendCurrency : recipientCurrency}
        recentCodes={recentCurrencyCodes}
      />

    </div>
  );
}
