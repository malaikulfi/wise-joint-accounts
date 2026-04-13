import { Cross, Calendar } from '@transferwise/icons';
import { Button } from '@transferwise/components';
import { GlassCircle } from '../components/FlowHeader';
import type { ScheduledTransferItem } from '../context/PrototypeNames';

export type { ScheduledTransferItem };

type Props = {
  transfers: ScheduledTransferItem[];
  onClose: () => void;
  onScheduleNew: () => void;
};

const DAY_NAMES_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_NAMES_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_NAMES_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatSubtitle(date: Date, repeats: 'never' | 'weekly' | 'monthly'): string {
  const dayShort = DAY_NAMES_SHORT[date.getDay()];
  const mon = MONTH_NAMES_SHORT[date.getMonth()];
  const d = date.getDate();
  if (repeats === 'never') return `Scheduled · ${DAY_NAMES_LONG[date.getDay()]}`;
  if (repeats === 'monthly') return `Monthly | Next: ${dayShort}, ${mon} ${d}`;
  return `Weekly | Next: ${dayShort}, ${mon} ${d}`;
}

function fmtAmount(n: number): string {
  return n % 1 === 0 ? n.toString() : n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function sumWithin(transfers: ScheduledTransferItem[], days: number): number {
  const cutoff = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  return transfers.filter(t => t.nextDate <= cutoff).reduce((s, t) => s + t.amount, 0);
}

export function ScheduledTransfersFlow({ transfers, onClose, onScheduleNew }: Props) {
  const currency = transfers[0]?.currency ?? 'GBP';
  const within7 = sumWithin(transfers, 7);
  const within30 = sumWithin(transfers, 30);
  const oneTime = transfers.filter(t => t.repeats === 'never');
  const recurring = transfers.filter(t => t.repeats !== 'never');

  return (
    <div className="sched-transfers">
      {/* Header */}
      <div className="sched-transfers__header">
        <GlassCircle onClick={onClose} ariaLabel="Close">
          <span className="ios-glass-btn__icon"><Cross size={24} /></span>
        </GlassCircle>
        <h1 className="sched-transfers__title">Scheduled transfers</h1>
      </div>

      {/* Summary card */}
      {transfers.length > 0 && (
        <div className="sched-transfers__summary-card">
          <div className="sched-transfers__summary-row">
            <span className="sched-transfers__summary-label">In the next 7 days</span>
            <span className="sched-transfers__summary-amount">{fmtAmount(within7)} {currency}</span>
          </div>
          <div className="sched-transfers__summary-divider" />
          <div className="sched-transfers__summary-row">
            <span className="sched-transfers__summary-label">In the next 30 days</span>
            <span className="sched-transfers__summary-amount">{fmtAmount(within30)} {currency}</span>
          </div>
        </div>
      )}

      {/* Body */}
      <div className="sched-transfers__body">
        {transfers.length === 0 && (
          <p className="sched-transfers__empty">No scheduled transfers yet</p>
        )}

        {oneTime.length > 0 && (
          <>
            <p className="sched-transfers__section-label">Upcoming</p>
            {oneTime.map(t => (
              <div key={t.id} className="sched-transfers__item">
                <div className="sched-transfers__item-icon">
                  <Calendar size={24} />
                </div>
                <div className="sched-transfers__item-info">
                  <p className="sched-transfers__item-name">{t.recipientName}</p>
                  <p className="sched-transfers__item-sub">{formatSubtitle(t.nextDate, t.repeats)}</p>
                </div>
                <div className="sched-transfers__item-right">
                  <p className="sched-transfers__item-amount">{fmtAmount(t.amount)} {t.currency}</p>
                  <p className="sched-transfers__item-from">From {t.currency}</p>
                </div>
              </div>
            ))}
          </>
        )}

        {recurring.length > 0 && (
          <>
            <p className="sched-transfers__section-label">Scheduled</p>
            {recurring.map(t => (
              <div key={t.id} className="sched-transfers__item">
                <div className="sched-transfers__item-icon">
                  <Calendar size={24} />
                </div>
                <div className="sched-transfers__item-info">
                  <p className="sched-transfers__item-name">{t.recipientName}</p>
                  <p className="sched-transfers__item-sub">{formatSubtitle(t.nextDate, t.repeats)}</p>
                </div>
                <div className="sched-transfers__item-right">
                  <p className="sched-transfers__item-amount">{fmtAmount(t.amount)} {t.currency}</p>
                  <p className="sched-transfers__item-from">From {t.currency}</p>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="sched-transfers__footer">
        <Button v2 size="lg" priority="primary" block onClick={onScheduleNew}>
          Schedule transfer
        </Button>
      </div>
    </div>
  );
}
