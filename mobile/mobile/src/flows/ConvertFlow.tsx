import { useState, useEffect, useRef, useCallback } from 'react';
import { Button, ExpressiveMoneyInput, ListItem } from '@transferwise/components';
import { InfoCircle, ChevronDown, ChevronRight, SwitchVertical, AutoConvert, Money, Savings, Suitcase, Cross, People } from '@transferwise/icons';
import { Flag, Illustration } from '@wise/art';
import { FlowHeader, GlassPill, GlassCircle } from '../components/FlowHeader';
import { ButtonCue } from '../components/ButtonCue';
import { CurrencyAccountPicker, type PickerAccount } from '../components/CurrencyAccountPicker';
import { useLanguage } from '../context/Language';
import { useLiveRates } from '../context/LiveRates';
import { convertToHomeCurrency } from '@shared/data/currency-rates';
import { currencies } from '@shared/data/currencies';
import { businessCurrencies } from '@shared/data/business-currencies';
import { groupCurrencies } from '@shared/data/taxes-data';
import { getJar } from '@shared/data/jar-data';
import type { AccountType } from '../App';

function WiseLogoIcon() {
  return (
    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M1.875 15.28 7.35 8.838h-.002L4.02 3h18.105l-7.008 19.375h-3.97L16.95 6.3H9.463l1.665 2.883-.008.08-2.56 2.979h4.188l-1.098 3.037z" />
    </svg>
  );
}

type ButtonState = 'disabled' | 'loading' | 'active';

export type AccountStyle = { color: string; textColor: string; iconName: string };

function resolveIcon(iconName: string) {
  switch (iconName) {
    case 'Savings': return <Savings size={16} />;
    case 'Suitcase': return <Suitcase size={16} />;
    case 'Money': return <Money size={16} />;
    case 'People': return <People size={16} />;
    default: return <WiseLogoIcon />;
  }
}

type Props = {
  fromCurrency: string;
  toCurrency: string;
  accountLabel: string;
  toAccountLabel?: string;
  jar?: 'taxes';
  jarId?: string;
  accountStyle: AccountStyle;
  toAccountStyle?: AccountStyle;
  onClose: () => void;
  onSuccess?: (fromAmount: number, fromCurrency: string, fromAccountLabel: string, toAmount: number, toCurrency: string, toAccountLabel: string) => void;
  accountType: AccountType;
  avatarUrl: string;
  initials: string;
  pickerAccounts?: PickerAccount[];
};

export function ConvertFlow({ fromCurrency: initFrom, toCurrency: initTo, accountLabel, toAccountLabel, jar, jarId, accountStyle, toAccountStyle, onClose, onSuccess, accountType, avatarUrl, initials, pickerAccounts }: Props) {
  const { t } = useLanguage();
  const rates = useLiveRates();

  const [step, setStep] = useState<'convert' | 'success'>('convert');
  const [fromCurrency, setFromCurrency] = useState(initFrom);
  const [toCurrency, setToCurrency] = useState(initTo);
  const [fromAmount, setFromAmount] = useState<number | null>(null);
  const [toAmount, setToAmount] = useState<number | null>(null);
  const [activeInput, setActiveInput] = useState<'from' | 'to'>('from');
  const [cueVisible, setCueVisible] = useState(false);
  const [fromFocused, setFromFocused] = useState(false);
  const [toFocused, setToFocused] = useState(false);
  const [buttonState, setButtonState] = useState<ButtonState>('disabled');
  const [hasInteracted, setHasInteracted] = useState(false);
  const [openPicker, setOpenPicker] = useState<'from' | 'to' | null>(null);
  const loadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isBusiness = accountType === 'business';
  const isGroup = jar === 'taxes';

  // Per-side account style and label — updated independently on swap or picker selection
  const resolvedToStyle = toAccountStyle ?? accountStyle;
  const [currentFromStyle, setCurrentFromStyle] = useState<AccountStyle>(accountStyle);
  const [currentToStyle, setCurrentToStyle] = useState<AccountStyle>(resolvedToStyle);
  const [currentFromLabel, setCurrentFromLabel] = useState(accountLabel);
  const [currentToLabel, setCurrentToLabel] = useState(toAccountLabel ?? accountLabel);

  const fromAvatarStyle = { backgroundColor: currentFromStyle.color, color: currentFromStyle.textColor };
  const fromAvatarIcon = resolveIcon(currentFromStyle.iconName);
  const toAvatarStyle = { backgroundColor: currentToStyle.color, color: currentToStyle.textColor };
  const toAvatarIcon = resolveIcon(currentToStyle.iconName);

  // Find the balance for the "from" currency
  const jarDef = jarId ? getJar(jarId) : undefined;
  const fallbackFromCurrencies = jarDef ? jarDef.currencies : isGroup ? groupCurrencies : (isBusiness ? businessCurrencies : currencies);
  const fromCurrencyData = pickerAccounts
    ? (pickerAccounts.find(a => a.label === currentFromLabel)?.currencies.find(c => c.code === fromCurrency)
        ?? pickerAccounts.flatMap(a => a.currencies).find(c => c.code === fromCurrency))
    : fallbackFromCurrencies.find(c => c.code === fromCurrency);
  const availableBalance = fromCurrencyData
    ? `${fromCurrencyData.symbol}${fromCurrencyData.balance.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : `0.00 ${fromCurrency}`;

  // Compute exchange rate for the rate pill
  const rateValue = convertToHomeCurrency(1, fromCurrency, toCurrency, rates);
  const rateDisplay = rateValue.toFixed(4);

  const bodyRef = useRef<HTMLDivElement>(null);
  const hasAmountRef = useRef(false);

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

  const handleFromAmountChange = useCallback((newAmount: number | null) => {
    setFromAmount(newAmount);
    setActiveInput('from');
    if (!hasInteracted) setHasInteracted(true);
    const hasVal = newAmount !== null && newAmount !== 0;
    if (hasVal) {
      setToAmount(Math.round(convertToHomeCurrency(newAmount!, fromCurrency, toCurrency, rates) * 100) / 100);
    } else {
      setToAmount(null);
    }
    updateButtonState(hasVal);
  }, [fromCurrency, toCurrency, rates, updateButtonState, hasInteracted]);

  const handleToAmountChange = useCallback((newAmount: number | null) => {
    setToAmount(newAmount);
    setActiveInput('to');
    if (!hasInteracted) setHasInteracted(true);
    const hasVal = newAmount !== null && newAmount !== 0;
    if (hasVal) {
      setFromAmount(Math.round(convertToHomeCurrency(newAmount!, toCurrency, fromCurrency, rates) * 100) / 100);
    } else {
      setFromAmount(null);
    }
    updateButtonState(hasVal);
  }, [fromCurrency, toCurrency, rates, updateButtonState, hasInteracted]);

  const handleSwap = useCallback(() => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setCurrentFromStyle(currentToStyle);
    setCurrentToStyle(currentFromStyle);
    setCurrentFromLabel(currentToLabel);
    setCurrentToLabel(currentFromLabel);
    if (activeInput === 'from' && fromAmount !== null && fromAmount !== 0) {
      setToAmount(Math.round(convertToHomeCurrency(fromAmount, toCurrency, fromCurrency, rates) * 100) / 100);
    } else if (activeInput === 'to' && toAmount !== null && toAmount !== 0) {
      setFromAmount(Math.round(convertToHomeCurrency(toAmount, fromCurrency, toCurrency, rates) * 100) / 100);
    }
  }, [fromCurrency, toCurrency, fromAmount, toAmount, activeInput, rates, currentFromStyle, currentToStyle, currentFromLabel, currentToLabel]);

  const handlePickerSelect = useCallback((code: string, label: string, style: AccountStyle) => {
    if (openPicker === 'from') {
      setFromCurrency(code);
      setCurrentFromStyle(style);
      setCurrentFromLabel(label);
      if (toAmount !== null && toAmount !== 0) {
        setFromAmount(Math.round(convertToHomeCurrency(toAmount, toCurrency, code, rates) * 100) / 100);
      } else if (fromAmount !== null && fromAmount !== 0) {
        setToAmount(Math.round(convertToHomeCurrency(fromAmount, code, toCurrency, rates) * 100) / 100);
      }
    } else if (openPicker === 'to') {
      setToCurrency(code);
      setCurrentToStyle(style);
      setCurrentToLabel(label);
      if (fromAmount !== null && fromAmount !== 0) {
        setToAmount(Math.round(convertToHomeCurrency(fromAmount, fromCurrency, code, rates) * 100) / 100);
      } else if (toAmount !== null && toAmount !== 0) {
        setFromAmount(Math.round(convertToHomeCurrency(toAmount, code, fromCurrency, rates) * 100) / 100);
      }
    }
    setOpenPicker(null);
  }, [openPicker, fromCurrency, toCurrency, fromAmount, toAmount, rates]);

  useEffect(() => {
    return () => {
      if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
    };
  }, []);

  // Delay focus and show cue
  useEffect(() => {
    const focusTimer = setTimeout(() => {
      const input = bodyRef.current?.querySelector<HTMLInputElement>('.convert-flow__from-input .wds-expressive-money-input input');
      input?.focus();
    }, 400);

    const cueTimer = setTimeout(() => {
      setCueVisible(true);
    }, 500);

    return () => {
      clearTimeout(focusTimer);
      clearTimeout(cueTimer);
    };
  }, []);

  const handleConfirm = useCallback(() => {
    if (fromAmount !== null && toAmount !== null) {
      onSuccess?.(fromAmount, fromCurrency, currentFromLabel, toAmount, toCurrency, currentToLabel);
      setStep('success');
    }
  }, [fromAmount, toAmount, fromCurrency, toCurrency, currentFromLabel, currentToLabel, onSuccess]);

  // Dividers expand when either input is focused, collapse when neither is
  const dividersExpanded = fromFocused || toFocused;

  if (step === 'success') {
    const fmtFrom = fromAmount?.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? '0.00';
    const fmtTo = toAmount?.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? '0.00';
    return (
      <div className="convert-flow" style={{ background: '#163300', padding: '56px 24px 44px', overflow: 'hidden' }}>
        <div className="add-money-success__header">
          <GlassCircle onClick={onClose} ariaLabel="Close">
            <span className="ios-glass-btn__icon"><Cross size={24} /></span>
          </GlassCircle>
        </div>
        <div className="add-money-success__content">
          <div className="add-money-success__illustration">
            <Illustration name="confetti" size="large" />
          </div>
          <h1 className="add-money-success__title">{t('addMoney.successTitle')}</h1>
          <div className="convert-success__rows">
            <div className="convert-success__row">
              <span className="convert-success__amount convert-success__amount--from">-{fmtFrom} {fromCurrency}</span>
              <span className="convert-success__label">from {currentFromLabel}</span>
            </div>
            <div className="convert-success__arrow">↓</div>
            <div className="convert-success__row">
              <span className="convert-success__amount convert-success__amount--to">+{fmtTo} {toCurrency}</span>
              <span className="convert-success__label">to {currentToLabel}</span>
            </div>
          </div>
        </div>
        <div className="add-money-success__footer">
          <Button v2 size="lg" priority="primary" block onClick={onClose}>
            {t('addMoney.gotIt')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="convert-flow">
      <FlowHeader
        onClose={onClose}
        trailing={
          <GlassPill>
            <span className="flow-header__rate-clip">
              <span className="flow-header__rate-flipper">
                <span className="flow-header__rate-line">
                  <span className="ios-glass-btn__label" style={{ fontSize: 14 }}>
                    {t('convert.rate', { from: fromCurrency, rate: rateDisplay, to: toCurrency })}
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
        }
      />

      <div className="convert-flow__body" ref={bodyRef}>
        {/* From section */}
        <div className="convert-flow__from-input">
          <ExpressiveMoneyInput
            label={<span style={{ whiteSpace: 'nowrap' }}>{t('convert.from')} <strong>{currentFromLabel}</strong></span>}
            currency={fromCurrency}
            amount={fromAmount}
            onAmountChange={handleFromAmountChange}
            currencySelector={{
              customRender: ({ id, labelId }) => (
                <div id={id} aria-labelledby={labelId} className="wds-expressive-money-input-currency-selector">
                  <Button v2 size="md" priority="secondary-neutral" className="wds-currency-selector"
                    addonStart={{ type: 'avatar', value: [{ style: fromAvatarStyle, asset: fromAvatarIcon }, { asset: <Flag code={fromCurrency} loading="eager" /> }] }}
                    addonEnd={{ type: 'icon', value: <ChevronDown size={16} /> }}
                    onClick={pickerAccounts ? () => setOpenPicker('from') : undefined}
                  >
                    {fromCurrency}
                  </Button>
                </div>
              ),
            }}
            showChevron={!fromFocused && !toFocused && !fromAmount && !toAmount}
            onFocusChange={setFromFocused}
          />
          <p className="convert-flow__available np-text-body-default">
            Available: <button type="button" className="convert-flow__available-link" onClick={() => handleFromAmountChange(fromCurrencyData?.balance ?? 0)}>{availableBalance}</button>
          </p>
        </div>

        {/* Swap divider */}
        <div className="convert-flow__swap">
          <div className={`convert-flow__swap-line${dividersExpanded ? ' convert-flow__swap-line--expanded' : ''}`} />
          <button
            type="button"
            className="convert-flow__swap-btn"
            onClick={handleSwap}
            aria-label={t('common.convert')}
          >
            <SwitchVertical size={24} />
          </button>
          <div className={`convert-flow__swap-line${dividersExpanded ? ' convert-flow__swap-line--expanded' : ''}`} />
        </div>

        {/* To section */}
        <div className="convert-flow__to-input">
          <ExpressiveMoneyInput
            label={<span style={{ whiteSpace: 'nowrap' }}>{t('convert.to')} <strong>{currentToLabel}</strong></span>}
            currency={toCurrency}
            amount={toAmount}
            onAmountChange={handleToAmountChange}
            currencySelector={{
              customRender: ({ id, labelId }) => (
                <div id={id} aria-labelledby={labelId} className="wds-expressive-money-input-currency-selector">
                  <Button v2 size="md" priority="secondary-neutral" className="wds-currency-selector"
                    addonStart={{ type: 'avatar', value: [{ style: toAvatarStyle, asset: toAvatarIcon }, { asset: <Flag code={toCurrency} loading="eager" /> }] }}
                    addonEnd={{ type: 'icon', value: <ChevronDown size={16} /> }}
                    onClick={pickerAccounts ? () => setOpenPicker('to') : undefined}
                  >
                    {toCurrency}
                  </Button>
                </div>
              ),
            }}
            showChevron={!fromFocused && !toFocused && !fromAmount && !toAmount}
            onFocusChange={setToFocused}
          />
          {/* Static divider below the "To" input */}
          <div className="convert-flow__to-divider" />
        </div>

        {/* Auto conversion list item */}
        <div className="convert-flow__auto-convert">
          <ListItem
            title={t('convert.autoConvert')}
            subtitle={t('convert.autoConvertSub')}
            media={
              <ListItem.AvatarView size={48} style={{ backgroundColor: 'var(--color-background-neutral)', border: 'none' }}>
                <AutoConvert size={24} />
              </ListItem.AvatarView>
            }
            control={<ListItem.Navigation onClick={() => {}} />}
          />
        </div>

        {/* ButtonCue + Review button */}
        <div className={`convert-flow__review${buttonState === 'active' ? ' convert-flow__review--active' : ''}`}>
          <ButtonCue
            visible={cueVisible && buttonState === 'disabled'}
            hint={
              <>
                <InfoCircle size={16} />
                <span className="np-text-body-default">
                  {(() => {
                    const text = t('convert.enterAmount');
                    const idx = text.indexOf('either amount');
                    if (idx === -1) return text;
                    return <>{text.slice(0, idx)}<span style={{ fontWeight: 600 }}>either amount</span>{text.slice(idx + 'either amount'.length)}</>;
                  })()}
                </span>
              </>
            }
          >
            <Button
              v2
              size="lg"
              priority="primary"
              disabled={buttonState !== 'active'}
              loading={buttonState === 'loading'}
              className={buttonState === 'loading' ? 'convert-flow__btn-loading' : undefined}
              block
              onClick={handleConfirm}
            >
              {t('convert.confirm')}
            </Button>
          </ButtonCue>
        </div>
      </div>

      {pickerAccounts && (
        <>
          <CurrencyAccountPicker
            open={openPicker === 'from'}
            onClose={() => setOpenPicker(null)}
            title={t('convert.from')}
            accounts={pickerAccounts}
            selectedCode={fromCurrency}
            onSelect={handlePickerSelect}
          />
          <CurrencyAccountPicker
            open={openPicker === 'to'}
            onClose={() => setOpenPicker(null)}
            title={t('convert.to')}
            accounts={pickerAccounts}
            selectedCode={toCurrency}
            onSelect={handlePickerSelect}
          />
        </>
      )}

    </div>
  );
}
