import type { ReactNode } from 'react';
import { Cross, ArrowLeft } from '@transferwise/icons';
import { useLiquidGlass } from '../hooks/useLiquidGlass';

export function GlassCircle({ children, onClick, ariaLabel }: { children: ReactNode; onClick?: () => void; ariaLabel?: string }) {
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

export function GlassPill({ children, className, onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  const glass = useLiquidGlass<HTMLButtonElement>();
  return (
    <button
      ref={glass.ref}
      className={`ios-glass-btn ios-glass-btn--pill ${className || ''}`}
      onClick={onClick}
      onPointerDown={glass.onPointerDown}
      onPointerMove={glass.onPointerMove}
      onPointerUp={glass.onPointerUp}
      onPointerCancel={glass.onPointerUp}
    >
      {children}
    </button>
  );
}

type FlowHeaderProps = {
  onClose: () => void;
  onBack?: () => void;
  trailing?: ReactNode;
  forceClose?: boolean;
};

export function FlowHeader({ onClose, onBack, trailing, forceClose }: FlowHeaderProps) {
  const showBack = !forceClose && !!onBack;

  return (
    <header className="flow-header">
      <div className="flow-header__fade" />
      <div className="flow-header__bar">
        {showBack ? (
          <GlassCircle onClick={onBack} ariaLabel="Go back">
            <span className="ios-glass-btn__icon">
              <ArrowLeft size={24} />
            </span>
          </GlassCircle>
        ) : (
          <GlassCircle onClick={onClose} ariaLabel="Close">
            <span className="ios-glass-btn__icon">
              <Cross size={24} />
            </span>
          </GlassCircle>
        )}
        <div className="flow-header__spacer" />
        {trailing && (
          <div className="flow-header__trailing">
            {trailing}
          </div>
        )}
      </div>
    </header>
  );
}
