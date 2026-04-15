import { useState, useCallback, useEffect, useRef } from 'react';
import { SnackbarProvider, Loader, ListItem } from '@transferwise/components';
import { Bank, Receive, Convert, Send, FastFlag, People } from '@transferwise/icons';
import { type Transaction } from '@shared/data/transactions';
import { BottomSheet } from './components/BottomSheet';
import { Agentation } from 'agentation';
import { LanguageProvider, useLanguage } from './context/Language';
import { triggerHaptic } from './hooks/useHaptics';
import { PrototypeNamesProvider, usePrototypeNames } from './context/PrototypeNames';
import { LiveRatesProvider } from './context/LiveRates';
import { ShimmerProvider } from './context/Shimmer';
import { IOSTopBar } from './components/IOSTopBar';
import { MobileNav, type MobileNavHandle } from './components/MobileNav';
import { PrototypeSettings } from './components/PrototypeSettings';
import { PageTransition } from './components/PageTransition';
import { Home } from './pages/Home';
import { Cards } from './pages/Cards';
import { Transactions } from './pages/Transactions';
import { Payments } from './pages/Payments';
import { Recipients } from './pages/Recipients';
import { Insights } from './pages/Insights';
import { Account } from './pages/Account';
import { CurrentAccount } from './pages/CurrentAccount';
import { CurrencyPage } from './pages/CurrencyPage';
import { AccountDetailsList } from './pages/AccountDetailsList';
import { AccountDetailsPage } from './pages/AccountDetailsPage';
import { Team } from './pages/Team';
import { GetMoreFromWise } from './pages/GetMoreFromWise';
import { AddMoneyFlow } from './flows/AddMoneyFlow';
import { ConvertFlow } from './flows/ConvertFlow';
import { type PickerAccount } from './components/CurrencyAccountPicker';
import { SendFlow } from './flows/SendFlow';
import { RequestFlow } from './flows/RequestFlow';
import { PaymentLinkFlow } from './flows/PaymentLinkFlow';
import { JointAccountInviteFlow } from './flows/JointAccountInviteFlow';
import { JointInvitePendingFlow } from './flows/JointInvitePendingFlow';
import { JointAccountAcceptFlow } from './flows/JointAccountAcceptFlow';
import { JointAccountPitch } from './pages/JointAccountPitch';
import { ScheduledTransfersFlow } from './flows/ScheduledTransfersFlow';
import { CloseAccountFlow } from './flows/CloseAccountFlow';
import { DirectDebitsFlow } from './flows/DirectDebitsFlow';

import { useSwipeBack } from './hooks/useSwipeBack';
import { currencies } from '@shared/data/currencies';
import { businessCurrencies } from '@shared/data/business-currencies';
import { groupCurrencies } from '@shared/data/taxes-data';
import { getJar, GROUP_IDS, savingsJar, suppliesJar } from '@shared/data/jar-data';
import { jointAccountCurrencies } from '@shared/data/joint-account-data';

export type AccountType = 'personal' | 'business';

type SubPage =
  | { type: 'account' }
  | { type: 'taxes-account' }
  | { type: 'jar-account'; jarId: string }
  | { type: 'joint-account'; initialTab?: string }
  | { type: 'currency'; code: string; from?: 'account' | 'home' | 'taxes-account' | 'jar-account' | 'joint-account'; jar?: 'taxes' | 'joint'; jarId?: string }
  | { type: 'account-details-list'; from: 'account' | 'payments' | 'home' | 'joint-account'; accountCurrencyCodes?: string[]; jar?: 'joint' }
  | { type: 'account-details'; code: string; from: 'currency' | 'account-details-list' | 'payments'; jar?: 'taxes'; listFrom?: 'account' | 'payments' | 'home' | 'joint-account'; listAccountCurrencyCodes?: string[] }
  | { type: 'get-more' }
  | null;

type JointAcceptScreen = 'pitch' | 'card-type' | 'address' | 'delivery' | 'name-on-card' | 'pin' | 'pin-confirm' | 'review' | 'confirm' | 'success';

function getInitials(name: string): string {
  return name.split(/\s+/).map((w) => w[0] || '').join('').toUpperCase();
}

type SendRecipient = {
  name: string;
  subtitle: string;
  avatarUrl?: string;
  initials?: string;
  hasFastFlag: boolean;
  badgeFlagCode?: string;
};

type AccountStyle = { color: string; textColor: string; iconName: string };

type ConvertParams = {
  fromCurrency: string;
  toCurrency: string;
  accountLabel?: string;
  toAccountLabel?: string;
  jar?: 'taxes';
  jarId?: string;
  accountStyle?: AccountStyle;
  toAccountStyle?: AccountStyle;
};

type ActiveFlow =
  | { type: 'add-money'; defaultCurrency: string; accountLabel: string; accountStyle: AccountStyle; jar?: 'joint' }
  | { type: 'convert'; fromCurrency: string; toCurrency: string; accountLabel: string; toAccountLabel?: string; jar?: 'taxes'; jarId?: string; accountStyle: AccountStyle; toAccountStyle?: AccountStyle }
  | { type: 'send'; defaultCurrency: string; accountLabel: string; jar?: 'taxes'; accountStyle: AccountStyle; recipient?: SendRecipient; prefillAmount?: number; prefillReceiveAmount?: number; startStep?: 'recipient' | 'amount'; forcedReceiveCurrency?: string; step?: string; forceClose?: boolean }
  | { type: 'request'; defaultCurrency: string; accountLabel: string; jar?: 'taxes'; step?: string }
  | { type: 'payment-link'; defaultCurrency: string; accountLabel: string; jar?: 'taxes' }
  | { type: 'joint-invite'; step?: 'pitch' | 'select' | 'success' }
  | { type: 'joint-pending'; recipientName: string }
  | { type: 'joint-accept'; screen?: JointAcceptScreen; inviterName: string; inviterAvatarUrl: string }
  | { type: 'scheduled-transfers' }
  | { type: 'close-account'; accountLabel: string; balance?: number }
  | { type: 'direct-debits' }
  | null;

function flowToPath(flow: ActiveFlow): string | null {
  if (!flow) return null;
  switch (flow.type) {
    case 'send': return `/send/${flow.step ?? 'recipient'}`;
    case 'request': return `/request/${flow.step ?? 'recipient'}`;
    case 'convert': return '/convert';
    case 'add-money': return '/add';
    case 'payment-link': return '/request';
    case 'joint-pitch': return '/joint-pitch';
    case 'joint-invite': return `/joint-invite/${flow.step ?? 'select'}`;
    case 'joint-pending': return '/joint-pending';
    case 'joint-accept': return `/joint-accept/${flow.screen ?? 'pitch'}`;
    case 'scheduled-transfers': return '/scheduled-transfers';
    case 'close-account': return '/close-account';
    case 'direct-debits': return '/direct-debits';
  }
}

function resetScroll() {
  window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  document.getElementById('main')?.scrollTo(0, 0);
  document.querySelector('.df-screen-content')?.scrollTo(0, 0);
}

// ── URL ↔ State routing helpers ──────────────────────────────────────────────

// Map balanceId → group context for URL resolution
type BalanceOwner = { code: string; from: 'home' | 'taxes-account' | 'jar-account' | 'joint-account'; jar?: 'taxes' | 'joint'; jarId?: string };
const balanceOwnerMap = new Map<string, BalanceOwner>();
for (const c of currencies) balanceOwnerMap.set(c.balanceId, { code: c.code, from: 'home' });
for (const c of businessCurrencies) balanceOwnerMap.set(c.balanceId, { code: c.code, from: 'home' });
for (const c of groupCurrencies) balanceOwnerMap.set(c.balanceId, { code: c.code, from: 'taxes-account', jar: 'taxes' });
for (const c of savingsJar.currencies) balanceOwnerMap.set(c.balanceId, { code: c.code, from: 'jar-account', jarId: savingsJar.id });
for (const c of suppliesJar.currencies) balanceOwnerMap.set(c.balanceId, { code: c.code, from: 'jar-account', jarId: suppliesJar.id });
for (const c of jointAccountCurrencies) balanceOwnerMap.set(c.balanceId, { code: c.code, from: 'joint-account', jar: 'joint' });

function parseUrl(pathname: string): { navItem: string; subPage: SubPage } {
  // /groups/:id (8-digit numeric IDs)
  const groupMatch = pathname.match(/^\/groups\/(\d+)$/);
  if (groupMatch) {
    const id = groupMatch[1];
    if (id === GROUP_IDS.currentAccount) return { navItem: 'Home', subPage: { type: 'account' } };
    if (id === GROUP_IDS.taxes) return { navItem: 'Home', subPage: { type: 'taxes-account' } };
    if (id === GROUP_IDS.joint) return { navItem: 'Home', subPage: { type: 'joint-account' } };
    return { navItem: 'Home', subPage: { type: 'jar-account', jarId: id } };
  }

  // /balances/:balanceId — group context derived from the balanceId itself
  const balanceMatch = pathname.match(/^\/balances\/(\d+)$/);
  if (balanceMatch) {
    const owner = balanceOwnerMap.get(balanceMatch[1]);
    if (owner) {
      return { navItem: 'Home', subPage: { type: 'currency', code: owner.code, from: owner.from, jar: owner.jar, jarId: owner.jarId } };
    }
  }

  // /account-details/:id — if id matches a group ID → list, otherwise → individual balance detail
  const detailsMatch = pathname.match(/^\/account-details\/(\d+)$/);
  if (detailsMatch) {
    const id = detailsMatch[1];
    // Known group ID → account details list for that group
    const allGroupIds = new Set<string>(Object.values(GROUP_IDS));
    if (allGroupIds.has(id)) {
      return { navItem: 'Home', subPage: { type: 'account-details-list', from: 'account' } };
    }
    // Balance ID → individual account details page
    const owner = balanceOwnerMap.get(id);
    if (owner) {
      return { navItem: 'Home', subPage: { type: 'account-details', code: owner.code, from: 'account-details-list', jar: owner.jar === 'taxes' ? 'taxes' : undefined } };
    }
  }

  // Flow paths — can't reconstruct flow state from URL, so fall through to Home
  if (pathname.startsWith('/send/') || pathname === '/convert' || pathname === '/add' || pathname.startsWith('/request/') || pathname === '/payment-link') {
    return { navItem: 'Home', subPage: null };
  }

  // Top-level nav pages
  switch (pathname) {
    case '/your-account': return { navItem: 'Account', subPage: null };
    case '/cards': return { navItem: 'Cards', subPage: null };
    case '/all-transactions': return { navItem: 'Transactions', subPage: null };
    case '/payments': return { navItem: 'Payments', subPage: null };
    case '/recipients': return { navItem: 'Recipients', subPage: null };
    case '/account-summary': return { navItem: 'Insights', subPage: null };
    case '/team': return { navItem: 'Team', subPage: null };
    default: return { navItem: 'Home', subPage: null };
  }
}

function stateToPath(navItem: string, subPage: SubPage, accountType: AccountType): string {
  if (subPage) {
    switch (subPage.type) {
      case 'account': return `/groups/${GROUP_IDS.currentAccount}`;
      case 'taxes-account': return `/groups/${GROUP_IDS.taxes}`;
      case 'jar-account': return `/groups/${subPage.jarId}`;
      case 'joint-account': return `/groups/${GROUP_IDS.joint}`;
      case 'currency': {
        const jarDef = subPage.jarId ? getJar(subPage.jarId) : undefined;
        const currencyList = jarDef ? jarDef.currencies : subPage.jar === 'taxes' ? groupCurrencies : subPage.jar === 'joint' ? jointAccountCurrencies : (accountType === 'business' ? businessCurrencies : currencies);
        const currencyData = currencyList.find((c) => c.code === subPage.code);
        return `/balances/${currencyData?.balanceId ?? subPage.code}`;
      }
      case 'account-details-list': return `/account-details/${GROUP_IDS.currentAccount}`;
      case 'account-details': {
        const currencyList = subPage.jar === 'taxes' ? groupCurrencies : (accountType === 'business' ? businessCurrencies : currencies);
        const currencyData = currencyList.find((c) => c.code === subPage.code);
        return `/account-details/${currencyData?.balanceId ?? subPage.code}`;
      }
    }
  }
  switch (navItem) {
    case 'Account': return '/your-account';
    case 'Cards': return '/cards';
    case 'Transactions': return '/all-transactions';
    case 'Payments': return '/payments';
    case 'Recipients': return '/recipients';
    case 'Insights': return '/account-summary';
    case 'Team': return '/team';
    default: return '/home';
  }
}

// ── App ─────────────────────────────────────────────────────────────────────

function AppInner() {
  const { consumerName, businessName, consumerHomeCurrency, businessHomeCurrency, hasIncomingInvite, setHasIncomingInvite, pendingJointInviteName, setPendingJointInviteName, jointAccountAccepted, setJointAccountAccepted, jointCardType, setJointCardType, jointCardImg, setJointCardImg, scheduledTransfers, setScheduledTransfers, directDebits, jointBalanceAdjustment, setJointBalanceAdjustment, setJointPartnerName, jointTransactions, setJointTransactions, setRecentPersonalTransactions, savingsTransactions, setSavingsTransactions, savingsBalanceAdjustment, setSavingsBalanceAdjustment } = usePrototypeNames();
  const { t } = useLanguage();

  // Initialise state from the current URL
  const initial = parseUrl(window.location.pathname);
  const [activeNavItem, setActiveNavItem] = useState(initial.navItem);
  const [previousNavItem, setPreviousNavItem] = useState('Home');
  const [subPage, setSubPage] = useState<SubPage>(initial.subPage);
  const [accountType, setAccountType] = useState<AccountType>('personal');
  const [activeFlow, setActiveFlow] = useState<ActiveFlow>(null);
  const [addMoneySourceSheet, setAddMoneySourceSheet] = useState<{ defaultCurrency: string; accountLabel: string; accountStyle: AccountStyle; convertParams?: ConvertParams } | null>(null);
  const [transitionDirection, setTransitionDirection] = useState<'push' | 'pop' | null>(null);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [closeAccountSelectOpen, setCloseAccountSelectOpen] = useState(false);
  const [cardsInitialIndex, setCardsInitialIndex] = useState(1);

  // Sync URL when state changes (skip when handling popstate)
  const isPopstateRef = useRef(false);
  useEffect(() => {
    if (isPopstateRef.current) { isPopstateRef.current = false; return; }
    const target = activeFlow ? flowToPath(activeFlow) : stateToPath(activeNavItem, subPage, accountType);
    if (!target) return;
    const current = window.location.pathname + window.location.search;
    if (current !== target) {
      window.history.pushState(null, '', target);
    }
  }, [activeNavItem, subPage, activeFlow, accountType]);

  // Handle browser back/forward
  useEffect(() => {
    const handler = () => {
      isPopstateRef.current = true;
      const state = parseUrl(window.location.pathname);
      setActiveNavItem(state.navItem);
      setSubPage(state.subPage);
      setActiveFlow(null);
    };
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  const activeName = accountType === 'business' ? businessName : consumerName;
  const activeInitials = getInitials(activeName);
  const avatarUrl = accountType === 'business' ? '/berry-design-logo.png' : 'https://www.tapback.co/api/avatar/connor-berry.webp';

  // Account avatar styles — single source of truth for all account types
  const currentAccountStyle: AccountStyle = accountType === 'business'
    ? { color: '#163300', textColor: '#9fe870', iconName: 'Wise' }
    : { color: 'var(--color-interactive-accent)', textColor: 'var(--color-interactive-control)', iconName: 'Wise' };
  const taxesGroupStyle: AccountStyle = { color: '#FFEB69', textColor: '#3a341c', iconName: 'Money' };
  const jointAccountStyle: AccountStyle = { color: '#0e3d2e', textColor: '#9fe870', iconName: 'People' };
  function jarStyle(jar: { color: string; iconName: string }): AccountStyle {
    return { color: jar.color, textColor: '#121511', iconName: jar.iconName };
  }

  const activeJar = accountType === 'business' ? suppliesJar : savingsJar;
  const pickerAccounts: PickerAccount[] = [
    { label: t('home.currentAccount'), style: currentAccountStyle, currencies: accountType === 'business' ? businessCurrencies : currencies },
    ...(accountType === 'business' ? [{ label: t('home.taxes'), style: taxesGroupStyle, currencies: groupCurrencies }] : []),
    { label: t(activeJar.nameKey), style: jarStyle(activeJar), currencies: activeJar.currencies },
    ...(jointAccountAccepted ? [{
      label: 'Joint account',
      style: jointAccountStyle,
      currencies: jointAccountCurrencies.map(c => ({ ...c, balance: c.code === 'GBP' ? c.balance + jointBalanceAdjustment : c.balance })),
    }] : []),
  ];

  const handleOpenAddMoney = useCallback((defaultCurrency: string, accountLabel?: string, accountStyle?: AccountStyle, convertParams?: ConvertParams) => {
    setAddMoneySourceSheet({ defaultCurrency, accountLabel: accountLabel ?? t('home.currentAccount'), accountStyle: accountStyle ?? currentAccountStyle, convertParams });
  }, [t, currentAccountStyle]);

  const handleAddMoneyFromSource = useCallback((sheet: { defaultCurrency: string; accountLabel: string; accountStyle: AccountStyle; convertParams?: ConvertParams }, source: 'external' | 'wise') => {
    setAddMoneySourceSheet(null);
    if (source === 'wise') {
      const cp = sheet.convertParams;
      const homeCurrency = accountType === 'business' ? businessHomeCurrency : consumerHomeCurrency;
      setActiveFlow({
        type: 'convert',
        fromCurrency: cp?.fromCurrency ?? homeCurrency,
        toCurrency: cp?.toCurrency ?? sheet.defaultCurrency,
        accountLabel: cp?.accountLabel ?? t('home.currentAccount'),
        toAccountLabel: cp?.toAccountLabel,
        jar: cp?.jar,
        jarId: cp?.jarId,
        accountStyle: cp?.accountStyle ?? currentAccountStyle,
        toAccountStyle: cp?.toAccountStyle,
      });
    } else {
      setActiveFlow({ type: 'add-money', defaultCurrency: sheet.defaultCurrency, accountLabel: sheet.accountLabel, accountStyle: sheet.accountStyle, jar: sheet.accountLabel === 'Joint account' ? 'joint' : undefined });
    }
  }, [accountType, businessHomeCurrency, consumerHomeCurrency, t, currentAccountStyle]);

  const handleOpenConvert = useCallback((fromCurrency: string, toCurrency: string, accountLabel?: string, jar?: 'taxes', toAccountLabel?: string, accountStyle?: AccountStyle, toAccountStyle?: AccountStyle, jarId?: string) => {
    setActiveFlow({ type: 'convert', fromCurrency, toCurrency, accountLabel: accountLabel ?? t('home.currentAccount'), toAccountLabel, jar, accountStyle: accountStyle ?? currentAccountStyle, toAccountStyle, jarId });
  }, [t, currentAccountStyle]);

  const handleOpenSend = useCallback((defaultCurrency: string, accountLabel?: string, jar?: 'taxes', recipient?: SendRecipient, prefillAmount?: number, forceClose?: boolean, accountStyle?: AccountStyle) => {
    setActiveFlow({
      type: 'send',
      defaultCurrency,
      accountLabel: accountLabel ?? t('home.currentAccount'),
      jar,
      accountStyle: accountStyle ?? currentAccountStyle,
      recipient,
      prefillAmount,
      startStep: recipient ? 'amount' : 'recipient',
      forceClose,
    });
  }, [t, currentAccountStyle]);

  const handleOpenRequest = useCallback((defaultCurrency: string, accountLabel?: string, jar?: 'taxes') => {
    setActiveFlow({ type: 'request', defaultCurrency, accountLabel: accountLabel ?? t('home.currentAccount'), jar });
  }, [t]);

  const handleOpenPaymentLink = useCallback((defaultCurrency: string, accountLabel?: string, jar?: 'taxes') => {
    setActiveFlow({ type: 'payment-link', defaultCurrency, accountLabel: accountLabel ?? t('home.currentAccount'), jar });
  }, [t]);

  const handleOpenGetMore = useCallback(() => {
    setTransitionDirection('push');
    setSubPage({ type: 'get-more' });
  }, []);

  const handleOpenJointInvite = useCallback(() => {
    setActiveFlow({ type: 'joint-invite' });
  }, []);

  const handleOpenJointAccept = useCallback((inviterName: string, inviterAvatarUrl: string) => {
    setActiveFlow({ type: 'joint-accept', inviterName, inviterAvatarUrl });
  }, []);

  const handleNavigateJointAccount = useCallback((initialTab?: string) => {
    setTransitionDirection('push');
    setSubPage({ type: 'joint-account', initialTab });
  }, []);

  const handleCloseAccount = useCallback(() => {
    setCloseAccountSelectOpen(true);
  }, []);

  // Flow overlay animation state
  const [flowVisible, setFlowVisible] = useState(false);
  const [flowAnimating, setFlowAnimating] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flowClosingRef = useRef(false);
  const flowOverlayRef = useRef<HTMLDivElement>(null);
  const mobileNavRef = useRef<MobileNavHandle>(null);

  // When activeFlow is set, mount the overlay (skip if already open)
  useEffect(() => {
    if (activeFlow) {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
      flowClosingRef.current = false;
      if (!flowVisible) {
        setFlowAnimating(false);
        setFlowVisible(true);
      }
    }
  }, [activeFlow]);

  // Once overlay is mounted, force layout then animate in
  useEffect(() => {
    if (flowVisible && !flowAnimating && !flowClosingRef.current) {
      // Force browser to paint the element at translateY(100%) before transitioning
      flowOverlayRef.current?.getBoundingClientRect();
      setFlowAnimating(true);
    }
  }, [flowVisible]);

  const handleCloseFlow = useCallback(() => {
    flowClosingRef.current = true;
    setFlowAnimating(false);
    closeTimerRef.current = setTimeout(() => {
      closeTimerRef.current = null;
      flowClosingRef.current = false;
      setFlowVisible(false);
      setActiveFlow(null);
    }, 500);
  }, []);

  const handleSwitchAccount = useCallback((type: AccountType) => {
    setSwitching(true);
    setTimeout(() => {
      setAccountType(type);
      setActiveNavItem('Home');
      setPreviousNavItem('Home');
      setSubPage(null);
      resetScroll();
      setTimeout(() => setSwitching(false), 400);
    }, 800);
  }, []);

  const handleNavigate = useCallback((label: string, push?: boolean) => {
    if (push) setTransitionDirection('push');
    setPreviousNavItem(activeNavItem);
    setActiveNavItem(label);
    setSubPage(null);
    if (!push) resetScroll();
  }, [activeNavItem]);

  const handleNavigateToCards = useCallback((cardIndex: number) => {
    setCardsInitialIndex(cardIndex);
    handleNavigate('Cards');
  }, [handleNavigate]);

  const MOBILE_NAV_TABS = ['Home', 'Cards', 'Recipients', 'Payments'];
  const handleNavigateAnimated = useCallback((label: string, push?: boolean) => {
    if (!push && mobileNavRef.current && MOBILE_NAV_TABS.includes(label)) {
      mobileNavRef.current.animateTo(label);
    } else {
      handleNavigate(label, push);
    }
  }, [handleNavigate]);

  const handleAccountClick = () => {
    setShowMoreMenu(false);
    setTransitionDirection('push');
    setPreviousNavItem(activeNavItem);
    setActiveNavItem('Account');
    setSubPage(null);
  };

  const handleAccountBack = () => {
    setShowMoreMenu(false);
    setTransitionDirection('pop');
    setActiveNavItem(previousNavItem);
    setSubPage(null);
  };

  const handleNavigateSubAccount = useCallback(() => {
    setTransitionDirection('push');
    setSubPage({ type: 'account' });
  }, []);

  const handleNavigateCurrencyFromAccount = useCallback((code: string) => {
    setTransitionDirection('push');
    setSubPage({ type: 'currency', code, from: 'account' });
  }, []);

  const handleNavigateGroupAccount = useCallback(() => {
    setTransitionDirection('push');
    setSubPage({ type: 'taxes-account' });
  }, []);

  const handleNavigateCurrencyFromGroup = useCallback((code: string) => {
    setTransitionDirection('push');
    setSubPage({ type: 'currency', code, from: 'taxes-account', jar: 'taxes' });
  }, []);

  const handleNavigateCurrencyFromJointAccount = useCallback((code: string) => {
    setTransitionDirection('push');
    setSubPage({ type: 'currency', code, from: 'joint-account', jar: 'joint' });
  }, []);

  const handleNavigateGroupCurrencyFromHome = useCallback((code: string) => {
    setTransitionDirection('push');
    setSubPage({ type: 'currency', code, from: 'home', jar: 'taxes' });
  }, []);

  const handleNavigateJarAccount = useCallback((jarId: string) => {
    setTransitionDirection('push');
    setSubPage({ type: 'jar-account', jarId });
  }, []);

  const handleNavigateCurrencyFromJar = useCallback((jarId: string, code: string) => {
    setTransitionDirection('push');
    setSubPage({ type: 'currency', code, from: 'jar-account', jarId });
  }, []);

  const handleNavigateJarCurrencyFromHome = useCallback((jarId: string, code: string) => {
    setTransitionDirection('push');
    setSubPage({ type: 'currency', code, from: 'home', jarId });
  }, []);

  const handleNavigateCurrencyFromHome = useCallback((code: string) => {
    setTransitionDirection('push');
    setSubPage({ type: 'currency', code, from: 'home' });
  }, []);

  const handleNavigateAccountDetailsList = useCallback((from: 'account' | 'payments' | 'home' | 'joint-account', accountCurrencyCodes?: string[], jar?: 'joint') => {
    setTransitionDirection('push');
    setSubPage({ type: 'account-details-list', from, accountCurrencyCodes, ...(jar ? { jar } : {}) });
  }, []);

  const handleNavigateAccountDetails = useCallback((code: string, from: 'currency' | 'account-details-list' | 'payments', jar?: 'taxes', listFrom?: 'account' | 'payments' | 'home' | 'joint-account', listAccountCurrencyCodes?: string[]) => {
    setTransitionDirection('push');
    setSubPage({ type: 'account-details', code, from, jar, listFrom, listAccountCurrencyCodes });
  }, []);

  const handleSubPageBack = useCallback(() => {
    setTransitionDirection('pop');
    if (subPage?.type === 'account-details') {
      if (subPage.from === 'currency') {
        const currencyFrom = subPage.listFrom === 'home' ? 'home' : 'account';
        setSubPage({ type: 'currency', code: subPage.code, from: currencyFrom as any, jar: subPage.jar });
      } else if (subPage.from === 'account-details-list') {
        setSubPage({ type: 'account-details-list', from: subPage.listFrom ?? 'account', accountCurrencyCodes: subPage.listAccountCurrencyCodes });
      } else {
        setSubPage(null);
      }
    } else if (subPage?.type === 'account-details-list') {
      if (subPage.from === 'account') {
        setSubPage({ type: 'account' });
      } else if (subPage.from === 'joint-account') {
        setSubPage({ type: 'joint-account' });
      } else if (subPage.from === 'home') {
        setSubPage(null);
      } else {
        setSubPage(null);
      }
    } else if (subPage?.type === 'jar-account') {
      setSubPage(null);
    } else if (subPage?.type === 'currency' && subPage.from === 'account') {
      setSubPage({ type: 'account' });
    } else if (subPage?.type === 'currency' && subPage.from === 'taxes-account') {
      setSubPage({ type: 'taxes-account' });
    } else if (subPage?.type === 'currency' && subPage.from === 'joint-account') {
      setSubPage({ type: 'joint-account' });
    } else if (subPage?.type === 'currency' && subPage.from === 'jar-account' && subPage.jarId) {
      setSubPage({ type: 'jar-account', jarId: subPage.jarId });
    } else {
      setSubPage(null);
    }
  }, [subPage]);

  const showBack = activeNavItem === 'Account' || ['Transactions', 'Insights'].includes(activeNavItem) || subPage !== null;


  // Scroll title: show small centered title when page h1 scrolls behind the top bar
  const [scrollTitle, setScrollTitle] = useState<string | null>(null);
  const mainRef = useRef<HTMLElement>(null);
  const scrollTitlePages = ['Payments', 'Recipients'];
  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    if (subPage || transitionDirection || !scrollTitlePages.includes(activeNavItem)) { setScrollTitle(null); return; }
    const h1 = main.querySelector(':scope > *:first-child .np-text-title-screen') as HTMLElement | null;
    if (!h1) { setScrollTitle(null); return; }
    const fade = document.querySelector('.ios-top-bar__fade') as HTMLElement | null;
    const fadeHeight = fade ? fade.offsetHeight : 126;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setScrollTitle(entry.isIntersecting ? null : h1.textContent);
      },
      { threshold: 0, rootMargin: `-${fadeHeight}px 0px 0px 0px` }
    );
    observer.observe(h1);
    return () => observer.disconnect();
  }, [activeNavItem, subPage, transitionDirection]);

  const handleBack = () => {
    if (subPage !== null) {
      handleSubPageBack();
    } else if (activeNavItem === 'Account') {
      handleAccountBack();
    } else {
      setTransitionDirection('pop');
      setActiveNavItem(previousNavItem || 'Home');
      setSubPage(null);
    }
  };

  // Swipe from left edge to go back (sub-pages) or close flow
  useSwipeBack(
    () => { flowVisible ? handleCloseFlow() : handleBack(); },
    showBack || flowVisible,
  );

  const renderContent = () => {
    if (subPage) {
      if (subPage.type === 'get-more') {
        return <GetMoreFromWise onClose={() => { setTransitionDirection('pop'); setSubPage(null); }} onOpenJointPitch={() => setActiveFlow({ type: 'joint-invite', step: 'pitch' })} onOpenJointPending={pendingJointInviteName ? () => setActiveFlow({ type: 'joint-pending', recipientName: pendingJointInviteName }) : undefined} pendingInviteName={pendingJointInviteName} jointAccountAccepted={jointAccountAccepted} />;
      }
      if (subPage.type === 'joint-invite') {
        return (
          <JointAccountInviteFlow
            onClose={() => { setTransitionDirection('pop'); setSubPage(null); }}
            onInviteSent={(name) => {
              setPendingJointInviteName(name);
              setTransitionDirection('pop');
              setSubPage(null);
            }}
            accountType={accountType}
            accountLabel={t('home.currentAccount')}
            avatarUrl={avatarUrl}
            initials={activeInitials}
          />
        );
      }
      if (subPage.type === 'account') {
        const activeCurrencies = accountType === 'business' ? businessCurrencies : currencies;
        return <CurrentAccount onNavigateCurrency={handleNavigateCurrencyFromAccount} onNavigateCards={() => handleNavigate('Cards')} onAccountDetails={() => handleNavigateAccountDetailsList('account')} accountType={accountType} onAdd={() => handleOpenAddMoney(activeCurrencies[0]?.code ?? 'GBP', undefined, undefined, { fromCurrency: activeCurrencies[0]?.code ?? 'GBP', toCurrency: activeCurrencies[1]?.code ?? activeCurrencies[0]?.code ?? 'GBP', accountLabel: t('home.currentAccount'), accountStyle: currentAccountStyle })} onConvert={() => handleOpenConvert(activeCurrencies[0]?.code ?? 'GBP', activeCurrencies[1]?.code ?? activeCurrencies[0]?.code ?? 'GBP')} onSend={() => handleOpenSend(activeCurrencies[0]?.code ?? 'GBP')} onRequest={() => handleOpenRequest(activeCurrencies[0]?.code ?? 'GBP')} onPaymentLink={() => handleOpenPaymentLink(activeCurrencies[0]?.code ?? 'GBP')} moreMenuOpen={showMoreMenu} onMoreMenuClose={() => setShowMoreMenu(false)} />;
      }
      if (subPage.type === 'taxes-account') {
        return <CurrentAccount onNavigateCurrency={handleNavigateCurrencyFromGroup} onNavigateCards={() => handleNavigate('Cards')} accountType={accountType} jar="taxes" onAdd={() => handleOpenAddMoney('GBP', t('home.taxes'), taxesGroupStyle, { fromCurrency: 'GBP', toCurrency: 'EUR', accountLabel: t('home.taxes'), jar: 'taxes', toAccountLabel: t('home.currentAccount'), accountStyle: taxesGroupStyle, toAccountStyle: currentAccountStyle })} onConvert={() => handleOpenConvert('GBP', 'EUR', t('home.taxes'), 'taxes', t('home.currentAccount'), taxesGroupStyle, currentAccountStyle)} onSend={() => handleOpenSend('GBP', t('home.taxes'), 'taxes', undefined, undefined, undefined, taxesGroupStyle)} onRequest={() => handleOpenRequest('GBP', t('home.taxes'), 'taxes')} onPaymentLink={() => handleOpenPaymentLink('GBP', t('home.taxes'), 'taxes')} moreMenuOpen={showMoreMenu} onMoreMenuClose={() => setShowMoreMenu(false)} />;
      }
      if (subPage.type === 'joint-account') {
        return <CurrentAccount jar="joint" initialTab={subPage.initialTab ?? 'currencies'} onNavigateCurrency={handleNavigateCurrencyFromJointAccount} onNavigateCards={() => handleNavigate('Cards')} onAccountDetails={() => handleNavigateAccountDetailsList('joint-account', ['GBP'])} accountType={accountType} onAdd={() => handleOpenAddMoney('GBP', 'Joint account', jointAccountStyle, { fromCurrency: 'GBP', toCurrency: 'EUR', accountLabel: 'Joint account', toAccountLabel: t('home.currentAccount'), accountStyle: jointAccountStyle, toAccountStyle: currentAccountStyle })} onConvert={() => handleOpenConvert('GBP', 'EUR', 'Joint account', undefined, t('home.currentAccount'), jointAccountStyle, currentAccountStyle)} onSend={() => handleOpenSend('GBP', 'Joint account', undefined, undefined, undefined, undefined, jointAccountStyle)} onRequest={() => handleOpenRequest('GBP', 'Joint account')} onPaymentLink={() => handleOpenPaymentLink('GBP', 'Joint account')} moreMenuOpen={showMoreMenu} onMoreMenuClose={() => setShowMoreMenu(false)} balanceAdjustment={jointBalanceAdjustment} txList={jointTransactions} onViewScheduled={() => setActiveFlow({ type: 'scheduled-transfers' })} onViewDirectDebits={() => setActiveFlow({ type: 'direct-debits' })} onCloseJointAccount={() => setTimeout(() => setActiveFlow({ type: 'close-account', accountLabel: 'Joint account', balance: jointBalanceAdjustment }), 350)} />;
      }
      if (subPage.type === 'jar-account') {
        const jar = getJar(subPage.jarId);
        if (!jar) return <div>Jar not found.</div>;
        const jarName = t(jar.nameKey);
        return <CurrentAccount onNavigateCurrency={(code) => handleNavigateCurrencyFromJar(subPage.jarId, code)} accountType={accountType} jar={subPage.jarId} jarConfig={jar} onAdd={() => handleOpenAddMoney(jar.currencies[0]?.code ?? 'GBP', jarName, jarStyle(jar), { fromCurrency: jar.currencies[0]?.code ?? 'GBP', toCurrency: 'EUR', accountLabel: jarName, toAccountLabel: t('home.currentAccount'), accountStyle: jarStyle(jar), toAccountStyle: currentAccountStyle, jarId: jar.id })} onConvert={() => handleOpenConvert(jar.currencies[0]?.code ?? 'GBP', 'EUR', jarName, undefined, t('home.currentAccount'), jarStyle(jar), currentAccountStyle, jar.id)} onSend={() => handleOpenSend(jar.currencies[0]?.code ?? 'GBP', jarName, undefined, undefined, undefined, undefined, jarStyle(jar))} moreMenuOpen={showMoreMenu} onMoreMenuClose={() => setShowMoreMenu(false)} balanceAdjustment={subPage.jarId === GROUP_IDS.savings ? savingsBalanceAdjustment : undefined} txList={subPage.jarId === GROUP_IDS.savings ? savingsTransactions : undefined} />;
      }
      if (subPage.type === 'account-details-list') {
        const acctCurrencies = accountType === 'business' ? businessCurrencies : currencies;
        const currencyCodes = subPage.accountCurrencyCodes ?? acctCurrencies.map(c => c.code);
        return <AccountDetailsList accountType={accountType} jar={subPage.jar} onSelectCurrency={(code) => handleNavigateAccountDetails(code, 'account-details-list', undefined, subPage.from, subPage.accountCurrencyCodes)} accountCurrencyCodes={currencyCodes} />;
      }
      if (subPage.type === 'account-details') {
        return <AccountDetailsPage code={subPage.code} accountType={accountType} isJoint={subPage.listFrom === 'joint-account'} />;
      }
      if (subPage.type === 'currency') {
        const jarDef = subPage.jarId ? getJar(subPage.jarId) : undefined;
        const isJointCurrency = subPage.jar === 'joint';
        const currencyList = jarDef ? jarDef.currencies : subPage.jar === 'taxes' ? groupCurrencies : isJointCurrency ? jointAccountCurrencies : (accountType === 'business' ? businessCurrencies : currencies);
        const mainCurrencies = accountType === 'business' ? businessCurrencies : currencies;
        const sameScopeCurrency = currencyList.find((c) => c.code !== subPage.code)?.code;
        const crossAccountCurrency = mainCurrencies.find((c) => c.code !== subPage.code)?.code;
        const secondCurrency = sameScopeCurrency ?? crossAccountCurrency ?? subPage.code;
        const isCrossAccount = !sameScopeCurrency && !!crossAccountCurrency;
        const jarLabel = jarDef ? t(jarDef.nameKey) : subPage.jar === 'taxes' ? t('home.taxes') : isJointCurrency ? 'Joint account' : undefined;
        const isJar = !!jarDef;
        const convertToLabel = isCrossAccount ? t('home.currentAccount') : undefined;
        const currencyAccountStyle = jarDef ? jarStyle(jarDef) : subPage.jar === 'taxes' ? taxesGroupStyle : isJointCurrency ? jointAccountStyle : undefined;
        return (
          <CurrencyPage
            code={subPage.code}
            onNavigateAccount={isJar ? () => handleNavigateJarAccount(subPage.jarId!) : subPage.jar === 'taxes' ? handleNavigateGroupAccount : isJointCurrency ? () => handleNavigateJointAccount() : subPage.from === 'home' ? () => { setTransitionDirection('pop'); setSubPage(null); } : handleNavigateSubAccount}
            onAccountDetails={isJar ? undefined : isJointCurrency ? () => handleNavigateAccountDetailsList('joint-account', ['GBP']) : () => handleNavigateAccountDetails(subPage.code, 'currency', subPage.jar as 'taxes' | undefined, subPage.from === 'home' ? 'home' : undefined)}
            accountType={accountType}
            jar={subPage.jar}
            jarConfig={jarDef}
            onAdd={() => handleOpenAddMoney(subPage.code, jarLabel, currencyAccountStyle, { fromCurrency: subPage.code, toCurrency: secondCurrency, accountLabel: jarLabel, toAccountLabel: convertToLabel, jar: isJointCurrency ? undefined : subPage.jar as 'taxes' | undefined, accountStyle: currencyAccountStyle, toAccountStyle: isCrossAccount ? currentAccountStyle : undefined, jarId: jarDef?.id })}
            onConvert={() => handleOpenConvert(subPage.code, secondCurrency, jarLabel, isJointCurrency ? undefined : subPage.jar as 'taxes' | undefined, convertToLabel, currencyAccountStyle, isCrossAccount ? currentAccountStyle : undefined, jarDef?.id)}
            onSend={() => handleOpenSend(subPage.code, jarLabel, undefined, undefined, undefined, undefined, currencyAccountStyle)}
            onRequest={isJar ? undefined : () => handleOpenRequest(subPage.code, jarLabel, isJointCurrency ? undefined : subPage.jar as 'taxes' | undefined)}
            onPaymentLink={isJar ? undefined : () => handleOpenPaymentLink(subPage.code, jarLabel, isJointCurrency ? undefined : subPage.jar as 'taxes' | undefined)}
            moreMenuOpen={showMoreMenu}
            onMoreMenuClose={() => setShowMoreMenu(false)}
            balanceAdjustment={isJointCurrency ? jointBalanceAdjustment : jarDef?.id === GROUP_IDS.savings ? savingsBalanceAdjustment : undefined}
            txList={isJointCurrency ? jointTransactions : jarDef?.id === GROUP_IDS.savings ? savingsTransactions : undefined}
          />
        );
      }
    }

    switch (activeNavItem) {
      case 'Account': return <Account onBack={handleAccountBack} accountType={accountType} onSwitchAccount={handleSwitchAccount} onCloseAccount={handleCloseAccount} />;
      case 'Cards': return <Cards accountType={accountType} initialSelectedIndex={cardsInitialIndex} />;
      case 'Transactions': return <Transactions accountType={accountType} jointTransactions={jointTransactions} />;
      case 'Payments': return <Payments accountType={accountType} onSend={() => handleOpenSend(accountType === 'business' ? businessHomeCurrency : consumerHomeCurrency)} onRequest={() => handleOpenRequest(accountType === 'business' ? businessHomeCurrency : consumerHomeCurrency)} onPaymentLink={() => handleOpenPaymentLink(accountType === 'business' ? businessHomeCurrency : consumerHomeCurrency)} onAccountDetailsGroup={(codes, jar) => handleNavigateAccountDetailsList('payments', codes, jar)} onScheduledTransfers={() => setActiveFlow({ type: 'scheduled-transfers' })} scheduledTransfersCount={scheduledTransfers.length} onDirectDebits={() => setActiveFlow({ type: 'direct-debits' })} directDebitsCount={directDebits.length} />;
      case 'Recipients': return <Recipients accountType={accountType} />;
      case 'Insights': return <Insights accountType={accountType} />;
      case 'Team': return <Team />;
      default: return (
        <Home
          onNavigate={handleNavigateAnimated}
          onNavigateAccount={handleNavigateSubAccount}
          onNavigateCurrency={handleNavigateCurrencyFromHome}
          onNavigateGroupAccount={handleNavigateGroupAccount}
          onNavigateGroupCurrency={handleNavigateGroupCurrencyFromHome}
          onNavigateJarAccount={handleNavigateJarAccount}
          onNavigateJarCurrency={(jarId: string, code: string) => handleNavigateJarCurrencyFromHome(jarId, code)}
          accountType={accountType}
          onAddMoney={() => { const ac = accountType === 'business' ? businessCurrencies : currencies; handleOpenAddMoney(ac[0]?.code ?? 'GBP', undefined, undefined, { fromCurrency: ac[0]?.code ?? 'GBP', toCurrency: ac[1]?.code ?? ac[0]?.code ?? 'GBP', accountLabel: t('home.currentAccount'), accountStyle: currentAccountStyle }); }}
          onSend={() => handleOpenSend(accountType === 'business' ? businessHomeCurrency : consumerHomeCurrency)}
          onSendWithCurrency={(sourceCurrency: string, targetCurrency: string, sourceAmount?: string, targetAmount?: string) => {
            const parseSendAmt = (s?: string) => s ? parseFloat(s.replace(/,/g, '')) || undefined : undefined;
            setActiveFlow({
              type: 'send',
              defaultCurrency: sourceCurrency,
              accountLabel: t('home.currentAccount'),
              accountStyle: currentAccountStyle,
              forcedReceiveCurrency: targetCurrency,
              prefillAmount: parseSendAmt(sourceAmount),
              prefillReceiveAmount: parseSendAmt(targetAmount),
              startStep: 'recipient',
            });
          }}
          onSendAgain={(recipient, amountStr) => {
            const homeCurrency = accountType === 'business' ? businessHomeCurrency : consumerHomeCurrency;
            const parsedCurrency = amountStr ? amountStr.split(' ').pop() ?? homeCurrency : (recipient.badgeFlagCode ?? homeCurrency);
            const parsedAmount = amountStr ? parseFloat(amountStr.replace(/,/g, '')) || undefined : undefined;
            handleOpenSend(parsedCurrency, undefined, undefined, recipient, parsedAmount, true);
          }}
          onRequest={() => handleOpenRequest(accountType === 'business' ? businessHomeCurrency : consumerHomeCurrency)}
          onPaymentLink={() => handleOpenPaymentLink(accountType === 'business' ? businessHomeCurrency : consumerHomeCurrency)}
          onAccountDetails={() => handleNavigateAccountDetailsList('home')}
          onNavigateToCards={handleNavigateToCards}
          pendingJointInviteName={pendingJointInviteName}
          hasIncomingInvite={hasIncomingInvite}
          jointAccountAccepted={jointAccountAccepted}
          jointCardType={jointCardType}
          onOpenJointInvite={handleOpenGetMore}
          onReviewIncomingInvite={() => handleOpenJointAccept('Sky Dog', 'https://www.tapback.co/api/avatar/sky-dog.webp')}
          onReviewPendingInvite={() => pendingJointInviteName && setActiveFlow({ type: 'joint-pending', recipientName: pendingJointInviteName })}
          onNavigateJointAccount={() => handleNavigateJointAccount('currencies')}
          onJointAccountDetails={() => handleNavigateAccountDetailsList('home', ['GBP'])}
          onNavigateJointCurrency={handleNavigateCurrencyFromJointAccount}
          jointBalanceAdjustment={jointBalanceAdjustment}
          jointTransactions={jointTransactions}
        />
      );
    }
  };

  const flowContent = activeFlow && (
    <>
      {activeFlow.type === 'add-money' && (
        <AddMoneyFlow
          defaultCurrency={activeFlow.defaultCurrency}
          accountLabel={activeFlow.accountLabel}
          accountStyle={activeFlow.accountStyle}
          onClose={handleCloseFlow}
          onSuccess={activeFlow.jar === 'joint' ? (amount) => {
            setJointBalanceAdjustment(prev => prev + amount);
            const fmt = (n: number) => n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            setJointTransactions(prev => [{
              name: 'Bank transfer',
              subtitle: 'Added by you',
              amount: `+${fmt(amount)} GBP`,
              isPositive: true,
              icon: <Receive size={24} />,
              date: 'Today',
              currency: 'GBP',
            }, ...prev]);
          } : undefined}
          accountType={accountType}
          avatarUrl={avatarUrl}
          initials={activeInitials}
          pickerAccounts={pickerAccounts}
        />
      )}
      {activeFlow.type === 'convert' && (
        <ConvertFlow
          fromCurrency={activeFlow.fromCurrency}
          toCurrency={activeFlow.toCurrency}
          accountLabel={activeFlow.accountLabel}
          toAccountLabel={activeFlow.toAccountLabel}
          accountStyle={activeFlow.accountStyle}
          toAccountStyle={activeFlow.toAccountStyle}
          jarId={activeFlow.jarId}
          onClose={handleCloseFlow}
          onSuccess={(fromAmt, fromCur, fromLabel, toAmt, toCur, toLabel) => {
            const fmt = (n: number) => n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            if (toLabel === 'Joint account' && toCur === 'GBP') {
              setJointBalanceAdjustment(prev => prev + toAmt);
              const isSameCurrency = fromCur === toCur;
              setJointTransactions(prev => [{
                name: isSameCurrency ? `To ${toLabel}` : `To ${toCur}`,
                subtitle: 'Moved by you',
                amount: `+${fmt(toAmt)} GBP`,
                isPositive: true,
                icon: <Convert size={24} />,
                date: 'Today',
                currency: 'GBP',
                ...(!isSameCurrency ? { conversion: { fromCurrency: fromCur, toCurrency: toCur, fromAmount: `${fmt(fromAmt)} ${fromCur}`, toAmount: `${fmt(toAmt)} ${toCur}` } } : {}),
              }, ...prev]);
              setRecentPersonalTransactions(prev => [{
                name: `To ${toLabel}`,
                subtitle: 'Moved by you',
                amount: `-${fmt(fromAmt)} ${fromCur}`,
                isPositive: false,
                icon: <Convert size={24} />,
                date: 'Today',
                currency: fromCur,
              }, ...prev]);
            }
            if (fromLabel === 'Joint account' && fromCur === 'GBP') {
              setJointBalanceAdjustment(prev => prev - fromAmt);
              const isSameCurrency = fromCur === toCur;
              setJointTransactions(prev => [{
                name: isSameCurrency ? `To ${toLabel}` : `To ${toCur}`,
                subtitle: 'Moved by you',
                amount: `-${fmt(fromAmt)} GBP`,
                isPositive: false,
                icon: <Convert size={24} />,
                date: 'Today',
                currency: 'GBP',
                ...(!isSameCurrency ? { conversion: { fromCurrency: fromCur, toCurrency: toCur, fromAmount: `${fmt(fromAmt)} ${fromCur}`, toAmount: `${fmt(toAmt)} ${toCur}` } } : {}),
              }, ...prev]);
              setRecentPersonalTransactions(prev => [{
                name: `From ${fromLabel}`,
                subtitle: 'Moved by you',
                amount: `+${fmt(toAmt)} ${toCur}`,
                isPositive: true,
                icon: <Convert size={24} />,
                date: 'Today',
                currency: toCur,
              }, ...prev]);
            }
            const savingsLabel = t('home.savings');
            if (toLabel === savingsLabel) {
              setSavingsBalanceAdjustment(prev => prev + toAmt);
              const isSameCurrency = fromCur === toCur;
              setSavingsTransactions(prev => [{
                name: `To ${toLabel}`,
                subtitle: 'Moved by you',
                amount: `+${fmt(toAmt)} ${toCur}`,
                isPositive: true,
                icon: <Convert size={24} />,
                date: 'Today',
                currency: toCur,
              }, ...prev]);
              setRecentPersonalTransactions(prev => [{
                name: `To ${toLabel}`,
                subtitle: 'Moved by you',
                amount: `-${fmt(fromAmt)} ${fromCur}`,
                isPositive: false,
                icon: <Convert size={24} />,
                date: 'Today',
                currency: fromCur,
              }, ...prev]);
            }
            if (fromLabel === savingsLabel) {
              setSavingsBalanceAdjustment(prev => prev - fromAmt);
              setSavingsTransactions(prev => [{
                name: `To ${toLabel}`,
                subtitle: 'Moved by you',
                amount: `-${fmt(fromAmt)} ${fromCur}`,
                isPositive: false,
                icon: <Convert size={24} />,
                date: 'Today',
                currency: fromCur,
              }, ...prev]);
              setRecentPersonalTransactions(prev => [{
                name: `From ${fromLabel}`,
                subtitle: 'Moved by you',
                amount: `+${fmt(toAmt)} ${toCur}`,
                isPositive: true,
                icon: <Convert size={24} />,
                date: 'Today',
                currency: toCur,
              }, ...prev]);
            }
          }}
          accountType={accountType}
          avatarUrl={avatarUrl}
          initials={activeInitials}
          pickerAccounts={pickerAccounts}
        />
      )}
      {activeFlow.type === 'send' && (
        <SendFlow
          defaultCurrency={activeFlow.defaultCurrency}
          accountLabel={activeFlow.accountLabel}
          accountStyle={activeFlow.accountStyle}
          onClose={handleCloseFlow}
          onStepChange={(step) => setActiveFlow((prev) => prev?.type === 'send' ? { ...prev, step } : prev)}
          accountType={accountType}
          avatarUrl={avatarUrl}
          initials={activeInitials}
          recipient={activeFlow.recipient}
          prefillAmount={activeFlow.prefillAmount}
          prefillReceiveAmount={activeFlow.prefillReceiveAmount}
          startStep={activeFlow.startStep}
          forcedReceiveCurrency={activeFlow.forcedReceiveCurrency}
          forceClose={activeFlow.forceClose}
          onSuccess={activeFlow.accountLabel === 'Joint account' ? (amount, currency, recipientName, recurring, scheduleDate, scheduleRepeats) => {
            const fmt = (n: number) => n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            setJointBalanceAdjustment(prev => prev - amount);
            setJointTransactions(prev => [{
              name: recipientName,
              subtitle: recurring ? 'Recurring · Monthly' : 'Sent by you',
              amount: `-${fmt(amount)} ${currency}`,
              isPositive: false,
              icon: <Send size={24} />,
              date: 'Today',
              currency,
            }, ...prev]);
            if (scheduleDate) {
              setScheduledTransfers(prev => [{
                id: `st-${Date.now()}`,
                recipientName,
                amount,
                currency,
                repeats: scheduleRepeats ?? 'never',
                nextDate: scheduleDate,
              }, ...prev]);
            }
          } : undefined}
          onViewScheduled={activeFlow.accountLabel === 'Joint account' ? () => setActiveFlow({ type: 'scheduled-transfers' }) : undefined}
        />
      )}
      {activeFlow.type === 'request' && (
        <RequestFlow
          defaultCurrency={activeFlow.defaultCurrency}
          accountLabel={activeFlow.accountLabel}
          jar={activeFlow.jar}
          onClose={handleCloseFlow}
          onStepChange={(step) => setActiveFlow((prev) => prev?.type === 'request' ? { ...prev, step } : prev)}
          accountType={accountType}
          avatarUrl={avatarUrl}
          initials={activeInitials}
        />
      )}
      {activeFlow.type === 'payment-link' && (
        <PaymentLinkFlow
          defaultCurrency={activeFlow.defaultCurrency}
          accountLabel={activeFlow.accountLabel}
          jar={activeFlow.jar}
          onClose={handleCloseFlow}
          accountType={accountType}
          avatarUrl={avatarUrl}
          initials={activeInitials}
        />
      )}
      {activeFlow.type === 'joint-invite' && (
        <JointAccountInviteFlow
          onClose={handleCloseFlow}
          onDone={() => {
            setActiveNavItem('Home');
            setSubPage(null);
            handleCloseFlow();
          }}
          onInviteSent={(name) => {
            setPendingJointInviteName(name);
          }}
          onStepChange={(step) => setActiveFlow((prev) => prev?.type === 'joint-invite' ? { ...prev, step } : prev)}
          accountType={accountType}
          accountLabel={t('home.currentAccount')}
          avatarUrl={avatarUrl}
          initials={activeInitials}
          startStep={activeFlow.step}
          recipientName={pendingJointInviteName ?? undefined}
        />
      )}
      {activeFlow.type === 'joint-pending' && (
        <JointInvitePendingFlow
          recipientName={activeFlow.recipientName}
          onClose={handleCloseFlow}
          onCancel={() => {
            setPendingJointInviteName(null);
            handleCloseFlow();
          }}
        />
      )}
      {activeFlow.type === 'joint-accept' && (
        <JointAccountAcceptFlow
          inviterName={activeFlow.inviterName}
          inviterAvatarUrl={activeFlow.inviterAvatarUrl}
          userAvatarUrl={avatarUrl}
          onClose={handleCloseFlow}
          onAccept={(cardType, cardImg) => {
            setHasIncomingInvite(false);
            setJointAccountAccepted(true);
            setJointCardType(cardType);
            setJointCardImg(cardImg ?? null);
            setJointPartnerName(activeFlow.inviterName);
            handleCloseFlow();
          }}
          onViewAccount={(cardType, cardImg) => {
            setHasIncomingInvite(false);
            setJointAccountAccepted(true);
            setJointCardType(cardType);
            setJointCardImg(cardImg ?? null);
            setJointPartnerName(activeFlow.inviterName);
            handleCloseFlow();
            setTransitionDirection('push');
            setSubPage({ type: 'joint-account', initialTab: 'options' });
          }}
          onDecline={() => {
            setHasIncomingInvite(false);
            handleCloseFlow();
          }}
          onStepChange={(screen) => setActiveFlow((prev) =>
            prev?.type === 'joint-accept' ? { ...prev, screen: screen as JointAcceptScreen } : prev
          )}
          accountType={accountType}
        />
      )}
      {activeFlow.type === 'scheduled-transfers' && (
        <ScheduledTransfersFlow
          transfers={scheduledTransfers}
          onClose={handleCloseFlow}
          onScheduleNew={() => setActiveFlow({
            type: 'send',
            defaultCurrency: 'GBP',
            accountLabel: 'Joint account',
            accountStyle: jointAccountStyle,
            startStep: 'recipient',
          })}
        />
      )}
      {activeFlow.type === 'direct-debits' && (
        <DirectDebitsFlow
          debits={directDebits}
          onClose={handleCloseFlow}
        />
      )}
      {activeFlow.type === 'close-account' && (
        <CloseAccountFlow
          accountLabel={activeFlow.accountLabel}
          accountType={accountType}
          balance={activeFlow.balance}
          onClose={handleCloseFlow}
        />
      )}
    </>
  );

  return (
    <SnackbarProvider>
    <div className="page-layout">
      {import.meta.env.DEV && <Agentation />}
      <div className="column-layout-main">
        {subPage?.type !== 'joint-invite' && <IOSTopBar name={activeName} initials={activeInitials} avatarUrl={avatarUrl} onAccountClick={handleAccountClick} showBack={showBack} onBack={handleBack} hideAccountSwitcher={activeNavItem === 'Account'} activeNavItem={activeNavItem} subPageType={subPage?.type ?? null} subPageCode={subPage?.type === 'account-details' ? subPage.code : undefined} scrollTitle={scrollTitle} accountType={accountType} onInsightsClick={() => { setShowMoreMenu(false); setTransitionDirection('push'); setPreviousNavItem(activeNavItem); setActiveNavItem('Insights'); setSubPage(null); }} onMore={() => { triggerHaptic(); setShowMoreMenu(true); }} onOpenJointInvite={handleOpenGetMore} jointAccountAccepted={jointAccountAccepted} />}
        <main className="container-content" id="main" ref={mainRef}>
          <PageTransition direction={transitionDirection} onComplete={() => setTransitionDirection(null)}>
            {renderContent()}
          </PageTransition>
        </main>
      </div>

      {flowVisible && (
        <div ref={flowOverlayRef} className={`flow-overlay${flowAnimating ? ' flow-overlay--open' : ''}`}>
          {flowContent}
          <PrototypeSettings />
        </div>
      )}

      <BottomSheet
        open={!!addMoneySourceSheet}
        onClose={() => setAddMoneySourceSheet(null)}
        title={t('addMoney.sourceTitle')}
      >
        {addMoneySourceSheet && (
          <>
            <ListItem
              title={t('addMoney.externalAccount')}
              media={
                <ListItem.AvatarView size={48} style={{ backgroundColor: 'var(--color-background-neutral)', border: 'none' }}>
                  <Bank size={24} />
                </ListItem.AvatarView>
              }
              control={<ListItem.Navigation onClick={() => handleAddMoneyFromSource(addMoneySourceSheet, 'external')} />}
            />
            <ListItem
              title={t('addMoney.wiseAccount')}
              media={
                <ListItem.AvatarView size={48} style={{ backgroundColor: 'var(--color-background-neutral)', border: 'none' }}>
                  <Receive size={24} />
                </ListItem.AvatarView>
              }
              control={<ListItem.Navigation onClick={() => handleAddMoneyFromSource(addMoneySourceSheet, 'wise')} />}
            />
          </>
        )}
      </BottomSheet>

      <BottomSheet
        open={closeAccountSelectOpen}
        onClose={() => setCloseAccountSelectOpen(false)}
        title="Close an account"
      >
        <div style={{ padding: '0 16px' }}>
          <ListItem
            title={<span className="np-text-body-large" style={{ fontWeight: 600 }}>Current account</span>}
            subtitle="Your personal Wise account"
            media={
              <ListItem.AvatarView size={48} style={{ backgroundColor: 'var(--color-interactive-accent)', border: 'none', color: 'var(--color-interactive-control)' }}>
                <FastFlag size={24} />
              </ListItem.AvatarView>
            }
            control={<ListItem.Navigation onClick={() => { setCloseAccountSelectOpen(false); setTimeout(() => setActiveFlow({ type: 'close-account', accountLabel: 'Current account' }), 350); }} />}
          />
          <ListItem
            title={<span className="np-text-body-large" style={{ fontWeight: 600 }}>Joint account</span>}
            subtitle="Shared account"
            media={
              <ListItem.AvatarView size={48} style={{ backgroundColor: '#0e3d2e', border: 'none', color: '#9fe870' }}>
                <People size={24} />
              </ListItem.AvatarView>
            }
            control={<ListItem.Navigation onClick={() => { setCloseAccountSelectOpen(false); setTimeout(() => setActiveFlow({ type: 'close-account', accountLabel: 'Joint account', balance: jointBalanceAdjustment }), 350); }} />}
          />
        </div>
      </BottomSheet>

      {activeNavItem !== 'Insights' && activeNavItem !== 'Transactions' && activeNavItem !== 'Account' && !subPage && <MobileNav ref={mobileNavRef} activeItem={activeNavItem} onSelect={handleNavigate} />}
      <PrototypeSettings />

      {/* Account switch overlay */}
      <div className={`account-switch-overlay${switching ? ' account-switch-overlay--visible' : ''}`}>
        <Loader size="md" displayInstantly />
      </div>
    </div>
    </SnackbarProvider>
  );
}

function App() {
  return (
    <LanguageProvider>
      <PrototypeNamesProvider>
        <LiveRatesProvider>
          <ShimmerProvider>
            <AppInner />
          </ShimmerProvider>
        </LiveRatesProvider>
      </PrototypeNamesProvider>
    </LanguageProvider>
  );
}

export default App;
