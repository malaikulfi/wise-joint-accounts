import { useState, useEffect, useRef } from 'react';
import { Cross, Plus, ChevronRight, Money, Savings, Suitcase, People } from '@transferwise/icons';
import { Flag } from '@wise/art';

function WiseLogoIcon() {
  return (
    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M1.875 15.28 7.35 8.838h-.002L4.02 3h18.105l-7.008 19.375h-3.97L16.95 6.3H9.463l1.665 2.883-.008.08-2.56 2.979h4.188l-1.098 3.037z" />
    </svg>
  );
}

function resolveIcon(iconName: string) {
  switch (iconName) {
    case 'Savings': return <Savings size={16} />;
    case 'Suitcase': return <Suitcase size={16} />;
    case 'Money': return <Money size={16} />;
    case 'People': return <People size={16} />;
    default: return <WiseLogoIcon />;
  }
}

export type PickerAccount = {
  label: string;
  style: { color: string; textColor: string; iconName: string };
  currencies: { code: string; name: string; symbol: string; balance: number }[];
};

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  accounts: PickerAccount[];
  selectedCode: string;
  onSelect: (code: string, accountLabel: string, style: PickerAccount['style']) => void;
};

export function CurrencyAccountPicker({ open, onClose, title, accounts, selectedCode, onSelect }: Props) {
  const [visible, setVisible] = useState(false);
  const [animOpen, setAnimOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setVisible(true);
    } else {
      setAnimOpen(false);
      const timer = setTimeout(() => setVisible(false), 450);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Force layout paint at translateY(100%) before animating in
  useEffect(() => {
    if (visible && !animOpen) {
      sheetRef.current?.getBoundingClientRect();
      setAnimOpen(true);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <>
      <div
        className={`currency-picker-sheet__backdrop${animOpen ? ' currency-picker-sheet__backdrop--visible' : ''}`}
        onClick={onClose}
      />
      <div
        ref={sheetRef}
        className={`currency-picker-sheet${animOpen ? ' currency-picker-sheet--open' : ''}`}
      >
        <div className="currency-picker-sheet__header">
          <button type="button" className="currency-picker-sheet__close" onClick={onClose} aria-label="Close">
            <Cross size={16} />
          </button>
          <h2 className="currency-picker-sheet__title">{title}</h2>
        </div>

        <div className="currency-picker-sheet__body">
          {accounts.map((account) => (
            <div key={account.label} className="currency-picker-sheet__account-card">
              <div className="currency-picker-sheet__account-header">
                <div
                  className="currency-picker-sheet__account-avatar"
                  style={{ backgroundColor: account.style.color, color: account.style.textColor }}
                >
                  {resolveIcon(account.style.iconName)}
                </div>
                <span className="currency-picker-sheet__account-name">{account.label}</span>
                <button type="button" className="currency-picker-sheet__add-btn" aria-label="Add currency" tabIndex={-1}>
                  <Plus size={16} />
                </button>
              </div>

              <div className="currency-picker-sheet__divider" />

              {account.currencies.map((currency) => {
                const balanceStr = `${currency.balance.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency.code}`;
                const isSelected = currency.code === selectedCode;
                return (
                  <button
                    key={currency.code}
                    type="button"
                    className={`currency-picker-sheet__currency-row${isSelected ? ' currency-picker-sheet__currency-row--selected' : ''}`}
                    onClick={() => { onSelect(currency.code, account.label, account.style); onClose(); }}
                  >
                    <div className="currency-picker-sheet__currency-flag">
                      <Flag code={currency.code} loading="eager" />
                    </div>
                    <span className="currency-picker-sheet__currency-amount">{balanceStr}</span>
                    <ChevronRight size={16} className="currency-picker-sheet__chevron" />
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
