import { useState } from 'react';
import { Button, Select } from '@transferwise/components';
import { Illustration } from '@wise/art';
import { FlowHeader } from '../components/FlowHeader';
import type { AccountType } from '../App';

const cardGreenUrl = new URL('../assets/card-green.jpg', import.meta.url).href;
const cardTapestryUrl = new URL('../assets/card-tapestry.jpg', import.meta.url).href;

type Screen = 'pitch' | 'card-type' | 'address' | 'delivery' | 'name-on-card' | 'pin' | 'pin-confirm' | 'review' | 'confirm' | 'success';

type Props = {
  inviterName: string;
  inviterAvatarUrl: string;
  onClose: () => void;
  onAccept?: (cardType: 'digital' | 'physical') => void;
  onDecline?: () => void;
  onStepChange?: (step: string) => void;
  accountType: AccountType;
};

// Simple radio row component
function RadioRow({ label, subtitle, checked, onClick }: { label: string; subtitle?: string; checked: boolean; onClick: () => void }) {
  return (
    <button className="card-radio-row" onClick={onClick} type="button">
      <div className="card-radio-row__text">
        <span className="np-text-body-large card-radio-row__label">{label}</span>
        {subtitle && <span className="np-text-body-default card-radio-row__subtitle">{subtitle}</span>}
      </div>
      <div className={`card-radio-row__dot${checked ? ' card-radio-row__dot--checked' : ''}`} />
    </button>
  );
}

// PIN dot display
function PinDots({ count, filled }: { count: number; filled: number }) {
  return (
    <div className="card-pin__dots">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`card-pin__dot${i < filled ? ' card-pin__dot--filled' : ''}`} />
      ))}
    </div>
  );
}

// Numpad keypad
function Numpad({ onPress, onDelete }: { onPress: (digit: string) => void; onDelete: () => void }) {
  const keys = [
    ['1', '', '2', 'ABC', '3', 'DEF'],
    ['4', 'GHI', '5', 'JKL', '6', 'MNO'],
    ['7', 'PQRS', '8', 'TUV', '9', 'WXYZ'],
    ['', '', '0', '', 'del', ''],
  ];

  return (
    <div className="card-numpad">
      {keys.map((row, ri) => (
        <div key={ri} className="card-numpad__row">
          {[0, 2, 4].map((ci) => {
            const digit = row[ci];
            const sub = row[ci + 1];
            if (digit === 'del') {
              return (
                <button key="del" className="card-numpad__key card-numpad__key--del" onClick={onDelete} type="button">
                  <svg width="24" height="16" viewBox="0 0 24 16" fill="none">
                    <path d="M9 1H22C22.55 1 23 1.45 23 2V14C23 14.55 22.55 15 22 15H9L1 8L9 1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                    <path d="M15 5.5L11 10.5M11 5.5L15 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              );
            }
            if (digit === '') {
              return <div key={ci} className="card-numpad__key card-numpad__key--empty" />;
            }
            return (
              <button key={digit} className="card-numpad__key" onClick={() => onPress(digit)} type="button">
                <span className="card-numpad__digit">{digit}</span>
                {sub && <span className="card-numpad__sub">{sub}</span>}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export function JointAccountAcceptFlow({ inviterName, inviterAvatarUrl, onClose, onAccept, onDecline, onStepChange, accountType: _accountType }: Props) {
  const [screen, setScreen] = useState<Screen>('pitch');
  const [cardType, setCardType] = useState<'digital' | 'physical' | null>(null);
  const [address1, setAddress1] = useState('123 big house');
  const [address2, setAddress2] = useState('');
  const [address3, setAddress3] = useState('');
  const [city, setCity] = useState('London');
  const [postcode, setPostcode] = useState('N1 8TQ');
  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard');
  const [nameOnCard, setNameOnCard] = useState<'first-last' | 'last-first'>('first-last');
  const [pin, setPin] = useState('');
  const [pinConfirm, setPinConfirm] = useState('');

  // Derived: name options based on inviterName (split first/last)
  const nameParts = inviterName.trim().split(' ');
  const firstName = nameParts[0] ?? '';
  const lastName = nameParts.slice(1).join(' ') || firstName;
  const nameFirstLast = `${firstName} ${lastName}`.trim();
  const nameLastFirst = `${lastName} ${firstName}`.trim();
  const selectedName = nameOnCard === 'first-last' ? nameFirstLast : nameLastFirst;

  const deliveryCost = deliveryMethod === 'standard' ? 0 : 12;
  const cardCost = 7;
  const totalCost = cardCost + deliveryCost;

  const handleScreenChange = (newScreen: Screen) => {
    setScreen(newScreen);
    onStepChange?.(newScreen);
  };

  // ── SUCCESS ──────────────────────────────────────────────────────────────
  if (screen === 'success') {
    return (
      <div className="joint-accept">
        <div className="joint-accept__scroll card-success">
          <div className="card-success__skip">
            <Button v2 size="sm" priority="tertiary" onClick={() => onAccept?.('physical')}>Skip</Button>
          </div>

          <div className="card-success__hero">
            <Illustration name="marble-card" size="large" />
          </div>

          <div className="card-success__body">
            <h1 className="np-display np-text-display-medium card-success__title">
              YOUR CARD HAS BEEN ORDERED
            </h1>
            <p className="np-text-body-large card-success__subtitle">
              It should arrive in the next few days. For now, you can add money so you're all set up to spend.
            </p>
          </div>
        </div>

        <div className="joint-accept__footer">
          <Button v2 size="lg" priority="primary" block onClick={() => onAccept?.(cardType || 'physical')}>
            Add money
          </Button>
        </div>
      </div>
    );
  }

  // ── CONFIRM ORDER ─────────────────────────────────────────────────────────
  if (screen === 'confirm') {
    return (
      <div className="joint-accept">
        <FlowHeader onClose={onClose} onBack={() => handleScreenChange('review')} />
        <div className="joint-accept__scroll">
          <div className="card-confirm__body">
            <h1 className="np-display np-text-display-small card-confirm__title">
              Confirm your order
            </h1>

            <div className="card-confirm__section">
              <div className="card-confirm__section-label np-text-body-default">Your order</div>
              <div className="card-confirm__item">
                <div className="card-confirm__item-icon">
                  <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
                    <rect x="1" y="1" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="1" y="4" width="18" height="3" fill="currentColor" />
                  </svg>
                </div>
                <div className="card-confirm__item-text">
                  <span className="np-text-body-large-bold">{selectedName}'s card</span>
                  <span className="np-text-body-default card-confirm__item-sub">One-time fee</span>
                </div>
                <span className="np-text-body-large-bold">{totalCost} GBP</span>
              </div>
            </div>

            <div className="card-confirm__section">
              <div className="card-confirm__section-header">
                <span className="card-confirm__section-label np-text-body-default">Payment method</span>
                <button className="card-confirm__change np-text-body-default-bold" type="button">Change</button>
              </div>
              <div className="card-confirm__payment">
                <div className="card-confirm__applepay-badge">
                  <svg width="38" height="16" viewBox="0 0 38 16" fill="none">
                    <rect width="38" height="16" rx="3" fill="black" />
                    <path d="M7.5 5C7.9 4.4 8.5 4 9.2 4C9.3 4.8 8.9 5.6 8.4 6.1C7.9 6.7 7.2 7.1 6.5 7C6.4 6.2 6.9 5.5 7.5 5ZM9.2 7.1C10.3 7.1 11 7.8 11 7.8C11 7.8 10.1 9.4 10.1 11C10.1 12.8 11.2 13.5 11.2 13.5C11.2 13.5 10.5 14.5 9.4 14.5C8.7 14.5 8.2 14 7.6 14C7 14 6.4 14.5 5.8 14.5C4.8 14.5 4 13.4 4 11C4 8.5 5.5 7.1 7 7.1C7.6 7.1 8.1 7.5 8.6 7.5C9.1 7.5 9.2 7.1 9.2 7.1Z" fill="white" />
                    <text x="14" y="11.5" fontSize="7" fontWeight="600" fill="white" fontFamily="system-ui">Pay</text>
                  </svg>
                </div>
                <span className="np-text-body-large">Apple Pay</span>
              </div>
            </div>

            <div className="card-confirm__section">
              <div className="card-confirm__section-label np-text-body-default">Price breakdown</div>
              <div className="card-confirm__breakdown-row">
                <span className="np-text-body-default">Card order</span>
                <span className="np-text-body-default">{cardCost} GBP</span>
              </div>
              {deliveryMethod === 'express' && (
                <div className="card-confirm__breakdown-row">
                  <span className="np-text-body-default">DHL Express</span>
                  <span className="np-text-body-default">{deliveryCost} GBP</span>
                </div>
              )}
              <div className="card-confirm__breakdown-row card-confirm__breakdown-row--total">
                <span className="np-text-body-default">Total</span>
                <span className="np-text-body-large-bold">{totalCost} GBP</span>
              </div>
            </div>
          </div>
        </div>
        <div className="joint-accept__footer">
          <button className="card-confirm__applepay-btn" onClick={() => handleScreenChange('success')} type="button">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M4.5 2C4.9 1.4 5.5 1 6.2 1C6.3 1.8 5.9 2.6 5.4 3.1C4.9 3.7 4.2 4.1 3.5 4C3.4 3.2 3.9 2.5 4.5 2ZM6.2 4.1C7.3 4.1 8 4.8 8 4.8C8 4.8 7.1 6.4 7.1 8C7.1 9.8 8.2 10.5 8.2 10.5C8.2 10.5 7.5 11.5 6.4 11.5C5.7 11.5 5.2 11 4.6 11C4 11 3.4 11.5 2.8 11.5C1.8 11.5 1 10.4 1 8C1 5.5 2.5 4.1 4 4.1C4.6 4.1 5.1 4.5 5.6 4.5C6.1 4.5 6.2 4.1 6.2 4.1Z" fill="white" />
            </svg>
            <span>Pay</span>
          </button>
        </div>
      </div>
    );
  }

  // ── REVIEW ORDER ─────────────────────────────────────────────────────────
  if (screen === 'review') {
    const addressFull = [address1, address2, address3, postcode, city, 'United Kingdom'].filter(Boolean);

    return (
      <div className="joint-accept">
        <FlowHeader onClose={onClose} onBack={() => handleScreenChange('pin-confirm')} />
        <div className="joint-accept__scroll">
          <div className="card-review2__body">
            <h1 className="np-display np-text-display-small card-review2__title">
              Review your order
            </h1>

            {/* Card thumb */}
            <div className="card-review2__card-thumb">
              <img src={cardGreenUrl} alt="" className="card-review2__card-thumb-img" />
              <div className="card-review2__card-thumb-text">
                <span className="np-text-body-default-bold">Card</span>
                <span className="np-text-body-default card-review2__card-thumb-sub">
                  {deliveryMethod === 'standard' ? 'Standard' : 'DHL Express'} • {cardCost} GBP
                </span>
              </div>
            </div>

            {/* Card details */}
            <div className="card-review2__section">
              <div className="card-review2__section-label np-text-body-default">Card details</div>
              <div className="card-review2__row">
                <div className="card-review2__row-icon">
                  <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
                    <rect x="1" y="1" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="1" y="4" width="16" height="2.5" fill="currentColor" />
                  </svg>
                </div>
                <div className="card-review2__row-content">
                  <span className="np-text-body-default card-review2__row-label">Name on card</span>
                  <span className="np-text-body-large">{selectedName}</span>
                </div>
                <button className="card-review2__edit" onClick={() => handleScreenChange('name-on-card')} type="button">Edit</button>
              </div>
              <div className="card-review2__row">
                <div className="card-review2__row-icon">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <rect x="2" y="2" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="7" y="2" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="12" y="2" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="2" y="7" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="7" y="7" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="12" y="7" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="2" y="12" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="7" y="12" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="12" y="12" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </div>
                <div className="card-review2__row-content">
                  <span className="np-text-body-default card-review2__row-label">PIN</span>
                  <span className="np-text-body-large">••••</span>
                </div>
                <button className="card-review2__show" onClick={() => handleScreenChange('pin')} type="button">Show</button>
              </div>
            </div>

            {/* Delivery details */}
            <div className="card-review2__section">
              <div className="card-review2__section-label np-text-body-default">Delivery details</div>
              <div className="card-review2__row">
                <div className="card-review2__row-icon">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 1C6.24 1 4 3.24 4 6C4 9.75 9 17 9 17C9 17 14 9.75 14 6C14 3.24 11.76 1 9 1ZM9 7.5C8.17 7.5 7.5 6.83 7.5 6C7.5 5.17 8.17 4.5 9 4.5C9.83 4.5 10.5 5.17 10.5 6C10.5 6.83 9.83 7.5 9 7.5Z" fill="currentColor" fillOpacity="0.5" />
                  </svg>
                </div>
                <div className="card-review2__row-content">
                  <span className="np-text-body-default card-review2__row-label">Deliver to</span>
                  {addressFull.map((line, i) => (
                    <span key={i} className="np-text-body-large" style={{ display: 'block' }}>{line}</span>
                  ))}
                </div>
                <button className="card-review2__edit" onClick={() => handleScreenChange('address')} type="button">Edit</button>
              </div>
            </div>
          </div>
        </div>
        <div className="joint-accept__footer">
          <Button v2 size="lg" priority="primary" block onClick={() => handleScreenChange('confirm')}>
            Continue
          </Button>
        </div>
      </div>
    );
  }

  // ── PIN CONFIRM ───────────────────────────────────────────────────────────
  if (screen === 'pin-confirm') {
    const handlePinConfirmPress = (digit: string) => {
      if (pinConfirm.length < 4) {
        const next = pinConfirm + digit;
        setPinConfirm(next);
        if (next.length === 4) {
          handleScreenChange('review');
        }
      }
    };
    const handlePinConfirmDelete = () => {
      setPinConfirm(prev => prev.slice(0, -1));
    };

    return (
      <div className="joint-accept joint-accept--pin">
        <FlowHeader onClose={onClose} onBack={() => handleScreenChange('pin')} />
        <div className="joint-accept__scroll joint-accept__scroll--pin">
          <h1 className="np-display np-text-display-small card-pin__title">
            Repeat PIN
          </h1>
          <PinDots count={4} filled={pinConfirm.length} />
        </div>
        <div className="card-pin__numpad-area">
          <button
            className={`card-pin__continue-btn${pinConfirm.length === 4 ? ' card-pin__continue-btn--active' : ''}`}
            disabled={pinConfirm.length < 4}
            onClick={() => handleScreenChange('review')}
            type="button"
          >
            Save
          </button>
          <Numpad onPress={handlePinConfirmPress} onDelete={handlePinConfirmDelete} />
        </div>
      </div>
    );
  }

  // ── PIN ENTRY ─────────────────────────────────────────────────────────────
  if (screen === 'pin') {
    const handlePinPress = (digit: string) => {
      if (pin.length < 4) {
        const next = pin + digit;
        setPin(next);
        if (next.length === 4) {
          handleScreenChange('pin-confirm');
        }
      }
    };
    const handlePinDelete = () => {
      setPin(prev => prev.slice(0, -1));
    };

    return (
      <div className="joint-accept joint-accept--pin">
        <FlowHeader onClose={onClose} onBack={() => handleScreenChange('name-on-card')} />
        <div className="joint-accept__scroll joint-accept__scroll--pin">
          <h1 className="np-display np-text-display-small card-pin__title">
            Set a new 4-digit PIN for the card
          </h1>
          <p className="np-text-body-default card-pin__subtitle">
            Make this hard to guess, and pick something nobody else knows.
          </p>
          <PinDots count={4} filled={pin.length} />
        </div>
        <div className="card-pin__numpad-area">
          <button
            className={`card-pin__continue-btn${pin.length === 4 ? ' card-pin__continue-btn--active' : ''}`}
            disabled={pin.length < 4}
            onClick={() => handleScreenChange('pin-confirm')}
            type="button"
          >
            Continue
          </button>
          <Numpad onPress={handlePinPress} onDelete={handlePinDelete} />
        </div>
      </div>
    );
  }

  // ── NAME ON CARD ──────────────────────────────────────────────────────────
  if (screen === 'name-on-card') {
    return (
      <div className="joint-accept">
        <FlowHeader onClose={onClose} onBack={() => handleScreenChange('delivery')} />
        <div className="joint-accept__scroll">
          <div className="card-address__body">
            <h1 className="np-display np-text-display-small card-address__title">
              Choose how the name appears on the card
            </h1>
            <div className="card-radio__list">
              <RadioRow
                label={nameFirstLast}
                checked={nameOnCard === 'first-last'}
                onClick={() => setNameOnCard('first-last')}
              />
              <RadioRow
                label={nameLastFirst}
                checked={nameOnCard === 'last-first'}
                onClick={() => setNameOnCard('last-first')}
              />
            </div>
          </div>
        </div>
        <div className="joint-accept__footer">
          <Button v2 size="lg" priority="primary" block onClick={() => handleScreenChange('pin')}>
            Continue
          </Button>
        </div>
      </div>
    );
  }

  // ── DELIVERY METHOD ───────────────────────────────────────────────────────
  if (screen === 'delivery') {
    return (
      <div className="joint-accept">
        <FlowHeader onClose={onClose} onBack={() => handleScreenChange('address')} />
        <div className="joint-accept__scroll">
          <div className="card-address__body">
            <h1 className="np-display np-text-display-small card-address__title">
              Choose your delivery method
            </h1>
            <div className="card-radio__list">
              <RadioRow
                label="Standard post (free)"
                subtitle="Estimated to arrive by 27 March"
                checked={deliveryMethod === 'standard'}
                onClick={() => setDeliveryMethod('standard')}
              />
              <RadioRow
                label="DHL Express • 12 GBP"
                subtitle="Delivery by 22 March"
                checked={deliveryMethod === 'express'}
                onClick={() => setDeliveryMethod('express')}
              />
            </div>
          </div>
        </div>
        <div className="joint-accept__footer">
          <Button v2 size="lg" priority="primary" block onClick={() => handleScreenChange('name-on-card')}>
            Continue
          </Button>
        </div>
      </div>
    );
  }

  // ── ADDRESS ───────────────────────────────────────────────────────────────
  if (screen === 'address') {
    return (
      <div className="joint-accept">
        <FlowHeader onClose={onClose} onBack={() => handleScreenChange('card-type')} />
        <div className="joint-accept__scroll">
          <div className="card-address__body">
            <h1 className="np-display np-text-display-small card-address__title">
              Where should we send you the card?
            </h1>
            <div className="card-address__fields">
              <div className="card-address__field-wrap">
                <label className="np-text-body-default card-address__label">Country</label>
                <Select
                  options={[{ value: 'GB', label: 'United Kingdom' }]}
                  selected={{ value: 'GB', label: 'United Kingdom' }}
                  onChange={() => {}}
                />
              </div>
              <div className="card-address__field-wrap">
                <label className="np-text-body-default card-address__label">Address line 1</label>
                <input
                  className="card-address__input"
                  value={address1}
                  onChange={(e) => setAddress1(e.target.value)}
                />
              </div>
              <div className="card-address__field-wrap">
                <label className="np-text-body-default card-address__label">
                  Address line 2 <span className="card-address__optional">(Optional)</span>
                </label>
                <input
                  className="card-address__input"
                  value={address2}
                  onChange={(e) => setAddress2(e.target.value)}
                />
              </div>
              <div className="card-address__field-wrap">
                <label className="np-text-body-default card-address__label">
                  Address line 3 <span className="card-address__optional">(Optional)</span>
                </label>
                <input
                  className="card-address__input"
                  value={address3}
                  onChange={(e) => setAddress3(e.target.value)}
                />
              </div>
              <div className="card-address__field-wrap">
                <label className="np-text-body-default card-address__label">City</label>
                <input
                  className="card-address__input"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className="card-address__field-wrap">
                <label className="np-text-body-default card-address__label">Postcode</label>
                <input
                  className="card-address__input"
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="joint-accept__footer">
          <Button v2 size="lg" priority="primary" block onClick={() => handleScreenChange('delivery')}>
            Continue
          </Button>
        </div>
      </div>
    );
  }

  // ── CARD TYPE ─────────────────────────────────────────────────────────────
  if (screen === 'card-type') {
    return (
      <div className="joint-accept">
        <FlowHeader onClose={onClose} onBack={() => handleScreenChange('pitch')} />
        <div className="joint-accept__scroll">
          <div className="card-choose__body">
            <h1 className="np-display np-text-display-small card-choose__title">
              Choose your debit card
            </h1>

            <div
              className="card-choose__option"
              role="button"
              tabIndex={0}
              onClick={() => { setCardType('digital'); onAccept?.('digital'); }}
            >
              <div className="card-choose__option-top">
                <div className="card-choose__option-name">DIGITAL</div>
                <div className="np-text-body-default card-choose__option-desc">
                  A card that lives online and works anywhere. Easy, secure, and always on hand.
                </div>
                <span className="card-choose__badge card-choose__badge--free">Free</span>
              </div>
              <img src={cardTapestryUrl} alt="" className="card-choose__option-img" />
              <div className="card-choose__option-footer">
                <span className="np-text-body-default-bold">Get it instantly</span>
                <span className="card-choose__option-arrow">→</span>
              </div>
            </div>

            <div
              className="card-choose__option"
              role="button"
              tabIndex={0}
              onClick={() => { setCardType('physical'); handleScreenChange('address'); }}
            >
              <div className="card-choose__option-top">
                <div className="card-choose__option-name">PHYSICAL</div>
                <div className="np-text-body-default card-choose__option-desc">
                  Spend and withdraw money around the world. In your wallet and on your side.
                </div>
                <span className="card-choose__badge card-choose__badge--price">From 7 GBP</span>
              </div>
              <img src={cardGreenUrl} alt="" className="card-choose__option-img" />
              <div className="card-choose__option-footer">
                <span className="np-text-body-default-bold">Arrives within 6 days</span>
                <span className="card-choose__option-arrow">→</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── PITCH ─────────────────────────────────────────────────────────────────
  return (
    <div className="joint-accept">
      <FlowHeader onClose={onClose} />
      <div className="joint-accept__scroll">
        {/* Hero — dark green */}
        <div className="joint-accept__hero">
          <div className="joint-accept__inviter">
            <div className="joint-accept__inviter-avatar-wrap">
              <img src={inviterAvatarUrl} alt={inviterName} className="joint-accept__inviter-avatar" />
              <span className="joint-accept__inviter-badge">
                <svg width="14" height="14" viewBox="0 0 24 22.375" fill="white">
                  <path d="M1.875 15.28 7.35 8.838h-.002L4.02 3h18.105l-7.008 19.375h-3.97L16.95 6.3H9.463l1.665 2.883-.008.08-2.56 2.979h4.188l-1.098 3.037z" />
                </svg>
              </span>
            </div>
          </div>

          <h1 className="np-display np-text-display-medium joint-accept__hero-title">
            {inviterName}<br />has invited you<br />to open a<br />joint account
          </h1>

          <div className="joint-accept__hero-cards">
            <img src={cardTapestryUrl} alt="" className="joint-pitch__card joint-pitch__card--back" />
            <img src={cardGreenUrl} alt="" className="joint-pitch__card joint-pitch__card--front" />
          </div>
        </div>

        {/* Feature cards */}
        <div className="joint-pitch__features" style={{ padding: '0 16px 120px' }}>
          <div className="joint-pitch__feature joint-pitch__feature--red">
            <h2 className="np-display np-text-display-small joint-pitch__feature-title joint-pitch__feature-title--pink">
              Shared costs, covered
            </h2>
            <p className="np-text-body-large joint-pitch__feature-body">
              Pay for life's expenses with ease, from household bills to big nights out.
            </p>
            <div className="joint-pitch__feature-mock joint-pitch__feature-mock--pill">
              <span className="joint-pitch__feature-mock-icon-wrap">
                <span className="joint-pitch__feature-mock-icon">🧾</span>
              </span>
              <span className="np-text-title-subsection">- £14.56</span>
            </div>
          </div>

          <div className="joint-pitch__feature joint-pitch__feature--dark">
            <h2 className="np-display np-text-display-small joint-pitch__feature-title joint-pitch__feature-title--cyan">
              For international duos
            </h2>
            <p className="np-text-body-large joint-pitch__feature-body">
              Send and spend money together, worldwide, and without hidden fees.
            </p>
            <div className="joint-pitch__avatars">
              <div className="joint-pitch__avatar joint-pitch__avatar--globe">🌐</div>
              <img className="joint-pitch__avatar" src={inviterAvatarUrl} alt="" />
            </div>
          </div>

          <div className="joint-pitch__feature joint-pitch__feature--green">
            <h2 className="np-display np-text-display-small joint-pitch__feature-title">
              Two cards, one account
            </h2>
            <p className="np-text-body-large joint-pitch__feature-body">
              You'll each get shiny new cards linked to the new account, and it comes with its own account details.
            </p>
            <div className="joint-pitch__feature-mock joint-pitch__feature-mock--balance">
              <span className="joint-pitch__feature-mock-plus">+</span>
              <span className="np-text-title-subsection">£60.00</span>
              <div className="joint-pitch__feature-cards-stack">
                <img src={cardTapestryUrl} alt="" className="joint-pitch__feature-card-img joint-pitch__feature-card-img--back" />
                <img src={cardGreenUrl} alt="" className="joint-pitch__feature-card-img joint-pitch__feature-card-img--front" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="joint-accept__footer joint-accept__footer--two">
        <Button v2 size="lg" priority="primary" block onClick={() => handleScreenChange('card-type')}>
          Accept and continue
        </Button>
        <Button v2 size="lg" priority="secondary" block onClick={onDecline}>
          Decline invite
        </Button>
      </div>
    </div>
  );
}
