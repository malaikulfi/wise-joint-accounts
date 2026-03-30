import { useState } from 'react';
import { Button } from '@transferwise/components';
import { Cross } from '@transferwise/icons';
import { Illustration } from '@wise/art';
import { BottomSheet } from '../components/BottomSheet';
import { useLiquidGlass } from '../hooks/useLiquidGlass';

function GlassCircle({ children, onClick, ariaLabel }: { children: React.ReactNode; onClick?: () => void; ariaLabel?: string }) {
  const glass = useLiquidGlass<HTMLButtonElement>();
  return (
    <button
      ref={glass.ref}
      className="ios-glass-btn ios-glass-btn--circle"
      onClick={onClick}
      aria-label={ariaLabel}
      onPointerDown={glass.onPointerDown}
      onPointerMove={glass.onPointerMove}
      onPointerUp={glass.onPointerUp}
      onPointerCancel={glass.onPointerUp}
    >
      {children}
    </button>
  );
}

type Props = {
  recipientName: string;
  onClose: () => void;
  onCancel?: () => void;
};

export function JointInvitePendingFlow({ recipientName, onClose, onCancel }: Props) {
  const [showCancelSheet, setShowCancelSheet] = useState(false);

  return (
    <div className="joint-invite-pending">
      <div className="joint-invite-success__close">
        <GlassCircle onClick={onClose} ariaLabel="Close">
          <span className="ios-glass-btn__icon">
            <Cross size={24} />
          </span>
        </GlassCircle>
      </div>
      <div className="joint-invite-success__body">
        <Illustration name="sand-timer" size="large" />
        <h1 className="np-display np-text-display-medium joint-invite-success__title">
          We're waiting for {recipientName} to accept
        </h1>
        <p className="np-text-body-large joint-invite-success__subtitle">
          The invite expires on 29 April 2026.
        </p>
      </div>
      <div className="joint-invite-success__footer">
        <Button v2 size="lg" priority="secondary" sentiment="negative" block onClick={() => setShowCancelSheet(true)}>
          Cancel invite
        </Button>
      </div>

      <BottomSheet open={showCancelSheet} onClose={() => setShowCancelSheet(false)} title="Cancel invite">
        <div className="joint-invite-sheet__content">
          <p className="np-text-body-large" style={{ margin: '0 0 20px', color: 'var(--color-content-secondary)' }}>
            Are you sure you want to cancel this invite?
          </p>
          <Button v2 size="lg" priority="primary" sentiment="negative" block onClick={() => { setShowCancelSheet(false); onCancel?.(); }}>
            Cancel
          </Button>
        </div>
      </BottomSheet>
    </div>
  );
}
