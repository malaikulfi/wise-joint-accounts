import { Cross, DirectDebits } from '@transferwise/icons';
import { GlassCircle } from '../components/FlowHeader';
import type { DirectDebitItem } from '../context/PrototypeNames';

const MONTH_NAMES_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatNextDate(date: Date): string {
  const d = date.getDate();
  const mon = MONTH_NAMES_SHORT[date.getMonth()];
  return `Monthly · Next: ${mon} ${d}`;
}

function fmtAmount(n: number, currency: string): string {
  const amt = n % 1 === 0 ? n.toString() : n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `${amt} ${currency}`;
}

type Props = {
  debits: DirectDebitItem[];
  onClose: () => void;
};

export function DirectDebitsFlow({ debits, onClose }: Props) {
  return (
    <div className="direct-debits-flow">
      {/* Header */}
      <div className="direct-debits-flow__header">
        <GlassCircle onClick={onClose} ariaLabel="Close">
          <span className="ios-glass-btn__icon"><Cross size={24} /></span>
        </GlassCircle>
        <h1 className="direct-debits-flow__title">Direct debits</h1>
      </div>

      {/* Body */}
      <div className="direct-debits-flow__body">
        {debits.length === 0 && (
          <p className="direct-debits-flow__empty">No direct debits set up</p>
        )}

        {debits.length > 0 && (
          <>
            <p className="direct-debits-flow__section-label">Active</p>
            {debits.map((debit) => (
              <div key={debit.id} className="direct-debits-flow__item">
                <div className="direct-debits-flow__item-icon">
                  {debit.logoSrc ? (
                    <img src={debit.logoSrc} alt={debit.merchantName} className="direct-debits-flow__item-logo" />
                  ) : (
                    <DirectDebits size={24} />
                  )}
                </div>
                <div className="direct-debits-flow__item-info">
                  <p className="direct-debits-flow__item-name">{debit.merchantName}</p>
                  <p className="direct-debits-flow__item-sub">{formatNextDate(debit.nextDate)}</p>
                </div>
                <div className="direct-debits-flow__item-right">
                  <p className="direct-debits-flow__item-amount">{fmtAmount(debit.amount, debit.currency)}</p>
                  <p className="direct-debits-flow__item-ref">{debit.reference}</p>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
