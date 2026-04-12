import { useState, useEffect, useRef, useCallback } from 'react';
import { Button, ExpressiveMoneyInput, ListItem } from '@transferwise/components';
import { InfoCircle, ChevronDown, ChevronRight, Money, Savings, Suitcase, Bank, LightningBolt, Receipt } from '@transferwise/icons';
import { Flag } from '@wise/art';
import { FlowHeader } from '../components/FlowHeader';
import { ButtonCue } from '../components/ButtonCue';
import { useLanguage } from '../context/Language';
import type { AccountType } from '../App';
import { currencies } from '@shared/data/currencies';
import { businessCurrencies } from '@shared/data/business-currencies';

function WiseLogoIcon() {
  return (
    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M1.875 15.28 7.35 8.838h-.002L4.02 3h18.105l-7.008 19.375h-3.97L16.95 6.3H9.463l1.665 2.883-.008.08-2.56 2.979h4.188l-1.098 3.037z" />
    </svg>
  );
}

/* ---- AddMoneyFlow ---- */

type ButtonState = 'disabled' | 'loading' | 'active';

export type AccountStyle = { color: string; textColor: string; iconName: string };

function resolveIcon(iconName: string) {
  switch (iconName) {
    case 'Savings': return <Savings size={16} />;
    case 'Suitcase': return <Suitcase size={16} />;
    case 'Money': return <Money size={16} />;
    default: return <WiseLogoIcon />;
  }
}

function getCurrencyName(code: string): string {
  const allCurrencies = [...currencies, ...businessCurrencies];
  return allCurrencies.find((c) => c.code === code)?.name ?? code;
}

type Props = {
  defaultCurrency: string;
  accountLabel: string;
  accountStyle: AccountStyle;
  onClose: () => void;
  accountType: AccountType;
  avatarUrl: string;
  initials: string;
};

export function AddMoneyFlow({ defaultCurrency, accountLabel, accountStyle, onClose, accountType, avatarUrl, initials }: Props) {
  const { t } = useLanguage();
  const [step, setStep] = useState<'amount' | 'details'>('amount');
  const [amount, setAmount] = useState<number | null>(null);
  const [cueVisible, setCueVisible] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [buttonState, setButtonState] = useState<ButtonState>('disabled');
  const loadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const accountAvatarStyle = { backgroundColor: accountStyle.color, color: accountStyle.textColor };
  const accountAvatarIcon = resolveIcon(accountStyle.iconName);

  const bodyRef = useRef<HTMLDivElement>(null);
  const amountRef = useRef(amount);
  amountRef.current = amount;

  const handleAmountChange = useCallback((newAmount: number | null) => {
    const wasEmpty = amountRef.current === null || amountRef.current === 0;
    const nowEmpty = newAmount === null || newAmount === 0;

    if (!nowEmpty && wasEmpty) {
      setButtonState('loading');
      if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
      loadingTimerRef.current = setTimeout(() => {
        setButtonState('active');
      }, 2000);
    } else if (nowEmpty && !wasEmpty) {
      setButtonState('loading');
      if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
      loadingTimerRef.current = setTimeout(() => {
        setButtonState('disabled');
      }, 2000);
    }

    setAmount(newAmount);
  }, []);

  useEffect(() => {
    return () => {
      if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (step !== 'amount') return;
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
  }, [step]);

  const formattedAmount = amount != null
    ? `${amount.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ${defaultCurrency}`
    : `0 ${defaultCurrency}`;
  const currencyName = getCurrencyName(defaultCurrency);

  const neutralStyle = { backgroundColor: 'var(--color-background-neutral)', border: 'none' };

  return (
    <div className="add-money-flow">
      <FlowHeader onClose={onClose} />

      <div className="add-money-flow__body" ref={bodyRef}>
        {step === 'amount' && (
          <ExpressiveMoneyInput
            label={<span style={{ whiteSpace: 'nowrap' }}>{t('addMoney.title')} <strong>{accountLabel}</strong></span>}
            currency={defaultCurrency}
            amount={amount}
            onAmountChange={handleAmountChange}
            currencySelector={{
              customRender: ({ id, labelId }) => (
                <div id={id} aria-labelledby={labelId} className="wds-expressive-money-input-currency-selector">
                  <Button v2 size="md" priority="secondary-neutral" className="wds-currency-selector"
                    addonStart={{ type: 'avatar', value: [{ style: accountAvatarStyle, asset: accountAvatarIcon }, { asset: <Flag code={defaultCurrency} loading="eager" /> }] }}
                    addonEnd={{ type: 'icon', value: <ChevronDown size={16} /> }}
                  >
                    {defaultCurrency}
                  </Button>
                </div>
              ),
            }}
            showChevron={!inputFocused && !amount}
            onFocusChange={setInputFocused}
          />
        )}

        {step === 'details' && (
          <div className="add-money-flow__amount-compact">
            <span className="np-text-body-small add-money-flow__amount-compact-label">
              {t('addMoney.title')} <strong>{accountLabel}</strong>
            </span>
            <div className="add-money-flow__amount-compact-row">
              <Button v2 size="md" priority="secondary-neutral"
                addonStart={{ type: 'avatar', value: [{ style: accountAvatarStyle, asset: accountAvatarIcon }, { asset: <Flag code={defaultCurrency} loading="eager" /> }] }}
                addonEnd={{ type: 'icon', value: <ChevronDown size={16} /> }}
              >
                {defaultCurrency}
              </Button>
              <span className="add-money-flow__amount-compact-value">{formattedAmount}</span>
            </div>
          </div>
        )}

        {step === 'amount' && (
          <div className="add-money-flow__continue">
            <ButtonCue
              visible={cueVisible && buttonState === 'disabled'}
              hint={
                <>
                  <InfoCircle size={16} />
                  <span className="np-text-body-default">{t('addMoney.enterAmount')}</span>
                </>
              }
            >
              <Button
                v2
                size="lg"
                priority="primary"
                disabled={buttonState !== 'active'}
                loading={buttonState === 'loading'}
                className={buttonState === 'loading' ? 'add-money-flow__btn-loading' : undefined}
                block
                onClick={() => setStep('details')}
              >
                {t('addMoney.continue')}
              </Button>
            </ButtonCue>
          </div>
        )}

        {step === 'details' && (
          <>
            <div className="add-money-flow__details-divider" />

            <div className="add-money-flow__details">
              <ListItem
                title={<span className="np-text-body-small" style={{ color: 'var(--color-content-secondary)' }}>{t('addMoney.payingIn')}</span>}
                subtitle={<span className="np-text-body-default" style={{ fontWeight: 600, color: 'var(--color-content-primary)' }}>{currencyName}</span>}
                media={
                  <ListItem.AvatarView size={48} style={{ border: 'none', overflow: 'hidden' }}>
                    <Flag code={defaultCurrency} loading="eager" />
                  </ListItem.AvatarView>
                }
                control={
                  <Button v2 size="sm" priority="secondary">{t('addMoney.change')}</Button>
                }
              />
              <ListItem
                title={<span className="np-text-body-small" style={{ color: 'var(--color-content-secondary)' }}>{t('addMoney.payingWith')}</span>}
                subtitle={<span className="np-text-body-default" style={{ fontWeight: 600, color: 'var(--color-content-primary)' }}>{t('addMoney.bankTransfer')}</span>}
                media={
                  <ListItem.AvatarView size={48} style={neutralStyle}>
                    <Bank size={24} />
                  </ListItem.AvatarView>
                }
                control={
                  <Button v2 size="sm" priority="secondary">{t('addMoney.change')}</Button>
                }
              />
              <ListItem
                title={<span className="np-text-body-small" style={{ color: 'var(--color-content-secondary)' }}>{t('addMoney.arrives')}</span>}
                subtitle={<span className="np-text-body-default" style={{ fontWeight: 600, color: 'var(--color-sentiment-positive)' }}>{t('addMoney.todayInSeconds')}</span>}
                media={
                  <ListItem.AvatarView size={48} style={neutralStyle}>
                    <LightningBolt size={24} />
                  </ListItem.AvatarView>
                }
              />
              <ListItem
                title={<span className="np-text-body-small" style={{ color: 'var(--color-content-secondary)' }}>{t('addMoney.youPay')}</span>}
                subtitle={<span className="np-text-body-default" style={{ fontWeight: 600, color: 'var(--color-content-primary)' }}>{t('addMoney.noFees')}</span>}
                media={
                  <ListItem.AvatarView size={48} style={neutralStyle}>
                    <Receipt size={24} />
                  </ListItem.AvatarView>
                }
                control={
                  <button type="button" className="add-money-flow__detail-amount-btn" onClick={() => {}}>
                    <span className="np-text-body-default" style={{ fontWeight: 600 }}>{formattedAmount}</span>
                    <ChevronRight size={16} />
                  </button>
                }
              />
            </div>

            <div style={{ height: 104 }} />

            <div className="add-money-flow__continue">
              <Button v2 size="lg" priority="primary" block onClick={onClose}>
                {t('addMoney.continue')}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
