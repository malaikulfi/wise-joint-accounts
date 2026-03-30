import { useState } from 'react';
import { Button, IconButton, Select } from '@transferwise/components';
import { Cross, ArrowLeft } from '@transferwise/icons';
import { Illustration } from '@wise/art';

const cardGreenUrl = new URL('../assets/card-green.jpg', import.meta.url).href;
const cardTapestryUrl = new URL('../assets/card-tapestry.jpg', import.meta.url).href;

type Screen = 'pitch' | 'card-type' | 'address' | 'delivery' | 'card-name' | 'pin' | 'pin-repeat' | 'review' | 'confirm' | 'success';

type Props = {
  inviterName: string;
  inviterAvatarUrl: string;
  screen: Screen;
  onScreenChange: (s: Screen) => void;
  onClose: () => void;
  onAccept: (cardType: 'digital' | 'physical') => void;
  onDecline: () => void;
};

export function JointAccountAcceptFlow({ inviterName, inviterAvatarUrl, screen, onScreenChange, onClose, onAccept, onDecline }: Props) {
  const [delivery, setDelivery] = useState<'standard' | 'dhl'>('standard');
  const [cardName, setCardName] = useState<'first-last' | 'last-first'>('first-last');
  const [pin, setPin] = useState('');
  const [pinRepeat, setPinRepeat] = useState('');

  const [address1, setAddress1] = useState('123 Big House');
  const [address2, setAddress2] = useState('');
  const [address3, setAddress3] = useState('');
  const [city, setCity] = useState('London');
  const [postcode, setPostcode] = useState('N1 8TQ');

  if (screen === 'address') {
    return (
      <div className="joint-accept">
        <div className="joint-accept__scroll">
          <div className="joint-accept__back">
            <IconButton aria-label="Go back" priority="tertiary" onClick={() => onScreenChange('card-type')}>
              <ArrowLeft size={24} />
            </IconButton>
          </div>
          <div className="card-address__body">
            <h1 className="np-display np-text-display-small card-address__title">
              Where should we send you the card?
            </h1>
            <div className="card-address__fields">
              <div className="card-address__field-wrap">
                <label className="np-text-body-default card-address__label">Country</label>
                <Select
                  options={[{ value: 'GB', label: 'United Kingdom' }, { value: 'US', label: 'United States' }, { value: 'DE', label: 'Germany' }]}
                  selected={{ value: 'GB', label: 'United Kingdom' }}
                  onChange={() => {}}
                />
              </div>
              {[
                { label: 'Address line 1', value: address1, set: setAddress1 },
                { label: 'Address line 2', value: address2, set: setAddress2 },
                { label: 'Address line 3', value: address3, set: setAddress3 },
                { label: 'City', value: city, set: setCity },
                { label: 'Postcode', value: postcode, set: setPostcode },
              ].map(({ label, value, set }) => (
                <div key={label} className="card-address__field-wrap">
                  <label className="np-text-body-default card-address__label">{label}</label>
                  <input
                    className="card-address__input"
                    value={value}
                    onChange={(e) => set(e.target.value)}
                    placeholder=""
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="joint-accept__footer">
          <Button v2 size="lg" priority="primary" block onClick={() => onScreenChange('delivery')}>
            Continue
          </Button>
        </div>
      </div>
    );
  }

  if (screen === 'delivery') {
    return (
      <div className="joint-accept">
        <div className="joint-accept__scroll">
          <div className="joint-accept__back">
            <IconButton aria-label="Go back" priority="tertiary" onClick={() => onScreenChange('address')}>
              <ArrowLeft size={24} />
            </IconButton>
          </div>
          <div className="card-address__body">
            <h1 className="np-display np-text-display-small card-address__title">
              Choose your delivery method
            </h1>
            <div className="card-delivery__options">
              <div
                className={`card-delivery__option${delivery === 'standard' ? ' card-delivery__option--selected' : ''}`}
                role="button"
                tabIndex={0}
                onClick={() => setDelivery('standard')}
                onKeyDown={(e) => e.key === 'Enter' && setDelivery('standard')}
              >
                <div className="card-delivery__option-radio">
                  <div className="card-delivery__radio-dot" />
                </div>
                <div className="card-delivery__option-content">
                  <div className="np-text-body-large-bold">Standard post</div>
                  <div className="np-text-body-default card-delivery__option-sub">Free</div>
                  <div className="np-text-body-default card-delivery__option-eta">Estimated to arrive by 27 March</div>
                </div>
              </div>
              <div
                className={`card-delivery__option${delivery === 'dhl' ? ' card-delivery__option--selected' : ''}`}
                role="button"
                tabIndex={0}
                onClick={() => setDelivery('dhl')}
                onKeyDown={(e) => e.key === 'Enter' && setDelivery('dhl')}
              >
                <div className="card-delivery__option-radio">
                  <div className="card-delivery__radio-dot" />
                </div>
                <div className="card-delivery__option-content">
                  <div className="np-text-body-large-bold">DHL Express</div>
                  <div className="np-text-body-default card-delivery__option-sub">12 GBP</div>
                  <div className="np-text-body-default card-delivery__option-eta">Delivery by 22 March</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="joint-accept__footer">
          <Button v2 size="lg" priority="primary" block onClick={() => onScreenChange('card-name')}>
            Continue
          </Button>
        </div>
      </div>
    );
  }

  if (screen === 'card-name') {
    return (
      <div className="joint-accept">
        <div className="joint-accept__scroll">
          <div className="joint-accept__back">
            <IconButton aria-label="Go back" priority="tertiary" onClick={() => onScreenChange('delivery')}>
              <ArrowLeft size={24} />
            </IconButton>
          </div>
          <div className="card-address__body">
            <h1 className="np-display np-text-display-small card-address__title">
              Choose how the name appears on the card
            </h1>
            <div className="card-delivery__options">
              <div
                className={`card-delivery__option${cardName === 'first-last' ? ' card-delivery__option--selected' : ''}`}
                role="button"
                tabIndex={0}
                onClick={() => setCardName('first-last')}
                onKeyDown={(e) => e.key === 'Enter' && setCardName('first-last')}
              >
                <div className="card-delivery__option-radio">
                  <div className="card-delivery__radio-dot" />
                </div>
                <div className="card-delivery__option-content">
                  <div className="np-text-body-large-bold">Cat Stevens</div>
                </div>
              </div>
              <div
                className={`card-delivery__option${cardName === 'last-first' ? ' card-delivery__option--selected' : ''}`}
                role="button"
                tabIndex={0}
                onClick={() => setCardName('last-first')}
                onKeyDown={(e) => e.key === 'Enter' && setCardName('last-first')}
              >
                <div className="card-delivery__option-radio">
                  <div className="card-delivery__radio-dot" />
                </div>
                <div className="card-delivery__option-content">
                  <div className="np-text-body-large-bold">Stevens Cat</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="joint-accept__footer">
          <Button v2 size="lg" priority="primary" block onClick={() => onScreenChange('pin')}>
            Continue
          </Button>
        </div>
      </div>
    );
  }

  const numpadDigits = [
    { digit: '1', sub: '' }, { digit: '2', sub: 'ABC' }, { digit: '3', sub: 'DEF' },
    { digit: '4', sub: 'GHI' }, { digit: '5', sub: 'JKL' }, { digit: '6', sub: 'MNO' },
    { digit: '7', sub: 'PQRS' }, { digit: '8', sub: 'TUV' }, { digit: '9', sub: 'WXYZ' },
  ];

  const renderNumpad = (value: string, onAdd: (d: string) => void, onDel: () => void) => (
    <div className="pin-screen__numpad">
      <div className="pin-screen__numpad-grid">
        {numpadDigits.map(({ digit, sub }) => (
          <button key={digit} className="pin-screen__key" onClick={() => onAdd(digit)}>
            <span className="pin-screen__key-digit">{digit}</span>
            {sub && <span className="pin-screen__key-sub">{sub}</span>}
          </button>
        ))}
        <div />
        <button className="pin-screen__key" onClick={() => onAdd('0')}>
          <span className="pin-screen__key-digit">0</span>
        </button>
        <button className="pin-screen__key pin-screen__key--delete" onClick={onDel}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M21 7H10L3 12l7 5h11V7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15 10l-4 4M11 10l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  );

  if (screen === 'pin') {
    const handleDigit = (d: string) => { if (pin.length < 4) setPin((p) => p + d); };
    const handleDelete = () => setPin((p) => p.slice(0, -1));

    return (
      <div className="joint-accept">
        <div className="joint-accept__scroll pin-screen">
          <div className="joint-accept__back">
            <IconButton aria-label="Go back" priority="tertiary" onClick={() => onScreenChange('card-name')}>
              <ArrowLeft size={24} />
            </IconButton>
          </div>
          <div className="pin-screen__header">
            <h1 className="np-display np-text-display-small pin-screen__title">
              Set a new 4-digit PIN for the card
            </h1>
            <p className="np-text-body-default pin-screen__subtitle">
              Make this hard to guess, and pick something nobody else knows.
            </p>
            <div className="pin-screen__dots">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className={`pin-screen__dot${i < pin.length ? ' pin-screen__dot--filled' : ''}`} />
              ))}
            </div>
          </div>
          {renderNumpad(pin, handleDigit, handleDelete)}
        </div>
        <div className="joint-accept__footer">
          <Button v2 size="lg" priority="primary" block disabled={pin.length < 4} onClick={() => { setPinRepeat(''); onScreenChange('pin-repeat'); }}>
            Continue
          </Button>
        </div>
      </div>
    );
  }

  if (screen === 'pin-repeat') {
    const pinMismatch = pinRepeat.length === 4 && pinRepeat !== pin;
    const handleDigit = (d: string) => { if (pinRepeat.length < 4) setPinRepeat((p) => p + d); };
    const handleDelete = () => setPinRepeat((p) => p.slice(0, -1));

    return (
      <div className="joint-accept">
        <div className="joint-accept__scroll pin-screen">
          <div className="joint-accept__back">
            <IconButton aria-label="Go back" priority="tertiary" onClick={() => onScreenChange('pin')}>
              <ArrowLeft size={24} />
            </IconButton>
          </div>
          <div className="pin-screen__header">
            <h1 className="np-display np-text-display-small pin-screen__title">
              Repeat PIN
            </h1>
            <p className="np-text-body-default pin-screen__subtitle">
              Enter your PIN again to confirm.
            </p>
            <div className="pin-screen__dots">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className={`pin-screen__dot${i < pinRepeat.length ? ' pin-screen__dot--filled' : ''}${pinMismatch ? ' pin-screen__dot--error' : ''}`} />
              ))}
            </div>
            {pinMismatch && (
              <p className="np-text-body-default pin-screen__error">PINs don't match. Try again.</p>
            )}
          </div>
          {renderNumpad(pinRepeat, handleDigit, handleDelete)}
        </div>
        <div className="joint-accept__footer">
          <Button v2 size="lg" priority="primary" block disabled={pinRepeat.length < 4 || pinMismatch} onClick={() => onScreenChange('review')}>
            Save
          </Button>
        </div>
      </div>
    );
  }

  if (screen === 'review') {
    const cardNameDisplay = cardName === 'first-last' ? 'Cat Stevens' : 'Stevens Cat';
    const deliveryLabel = delivery === 'standard' ? 'Standard post • Free' : 'DHL Express • 12 GBP';
    const deliveryEta = delivery === 'standard' ? 'Estimated delivery: 27 March' : 'Estimated delivery: 22 March';
    const addressFull = [address1, address2, address3, city, postcode, 'United Kingdom'].filter(Boolean).join(', ');

    return (
      <div className="joint-accept">
        <div className="joint-accept__scroll">
          <div className="joint-accept__back">
            <IconButton aria-label="Go back" priority="tertiary" onClick={() => onScreenChange('pin-repeat')}>
              <ArrowLeft size={24} />
            </IconButton>
          </div>
          <div className="card-address__body">
            <h1 className="np-display np-text-display-small card-address__title">
              Review your order
            </h1>

            <div className="card-review__section">
              <div className="card-review__section-title np-text-title-subsection">Card details</div>
              <div className="card-review__row">
                <div>
                  <div className="np-text-body-default card-review__label">Name on card</div>
                  <div className="np-text-body-large-bold">{cardNameDisplay}</div>
                </div>
                <button className="card-review__edit np-text-body-default" onClick={() => onScreenChange('card-name')}>Edit</button>
              </div>
              <div className="card-review__row card-review__row--pin">
                <div>
                  <div className="np-text-body-default card-review__label">PIN</div>
                  <div className="np-text-body-large-bold card-review__pin">••••</div>
                </div>
                <button className="card-review__edit np-text-body-default" onClick={() => onScreenChange('pin')}>Edit</button>
              </div>
            </div>

            <div className="card-review__section">
              <div className="card-review__section-title np-text-title-subsection">Delivery details</div>
              <div className="card-review__row">
                <div>
                  <div className="np-text-body-default card-review__label">Deliver to</div>
                  <div className="np-text-body-large-bold">{addressFull}</div>
                </div>
                <button className="card-review__edit np-text-body-default" onClick={() => onScreenChange('address')}>Edit</button>
              </div>
              <div className="card-review__row">
                <div>
                  <div className="np-text-body-default card-review__label">Delivery type</div>
                  <div className="np-text-body-large-bold">{deliveryLabel}</div>
                  <div className="np-text-body-default card-review__eta">{deliveryEta}</div>
                </div>
                <button className="card-review__edit np-text-body-default" onClick={() => onScreenChange('delivery')}>Edit</button>
              </div>
            </div>
          </div>
        </div>
        <div className="joint-accept__footer">
          <Button v2 size="lg" priority="primary" block onClick={() => onScreenChange('confirm')}>
            Continue
          </Button>
        </div>
      </div>
    );
  }

  if (screen === 'confirm') {
    const cardFee = delivery === 'dhl' ? 12 : 0;
    const totalFee = cardFee;
    const etaDate = delivery === 'standard' ? '27 March' : '22 March';

    return (
      <div className="joint-accept">
        <div className="joint-accept__scroll">
          <div className="joint-accept__back">
            <IconButton aria-label="Go back" priority="tertiary" onClick={() => onScreenChange('review')}>
              <ArrowLeft size={24} />
            </IconButton>
          </div>
          <div className="card-address__body">
            <h1 className="np-display np-text-display-small card-address__title">
              Confirm your order
            </h1>
            <p className="np-text-body-default card-confirm__subtitle">
              It should be with you by {etaDate}.
            </p>

            {/* Your order */}
            <div className="card-confirm__section">
              <div className="card-confirm__section-header">
                <span className="np-text-title-subsection">Your order</span>
                <button className="card-review__edit np-text-body-default" onClick={() => onScreenChange('card-type')}>Change</button>
              </div>
              <div className="card-confirm__order-row">
                <div className="card-confirm__card-icon">
                  <img src={cardTapestryUrl} alt="" className="card-confirm__card-img" />
                </div>
                <div className="card-confirm__order-info">
                  <div className="np-text-body-large-bold">Cat's card</div>
                  <div className="np-text-body-default card-review__label">Physical debit card</div>
                </div>
              </div>
            </div>

            {/* Price breakdown */}
            <div className="card-confirm__section">
              <div className="np-text-title-subsection card-confirm__breakdown-title">Price breakdown</div>
              <div className="card-confirm__breakdown-row">
                <span className="np-text-body-default">Card order</span>
                <span className="np-text-body-default">Free</span>
              </div>
              <div className="card-confirm__breakdown-row">
                <span className="np-text-body-default">Delivery</span>
                <span className="np-text-body-default">{cardFee === 0 ? 'Free' : `${cardFee} GBP`}</span>
              </div>
              <div className="card-confirm__breakdown-row card-confirm__breakdown-row--total">
                <span className="np-text-body-large-bold">Total</span>
                <span className="np-text-body-large-bold">{totalFee === 0 ? '0 GBP' : `${totalFee} GBP`}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="joint-accept__footer card-confirm__footer">
          <button className="card-confirm__apple-pay" onClick={() => onScreenChange('success')}>
            <svg viewBox="0 0 50 20" width="50" height="20" fill="white" aria-hidden="true">
              <path d="M9.1 3.7c-.5.6-1.3 1-2 1-.1-.8.3-1.6.8-2.1.5-.6 1.4-1 2-.1.1.8-.2 1.6-.8 2.2zm.8 1.2c-1.1-.1-2.1.6-2.6.6-.5 0-1.3-.6-2.2-.6C3.8 5 2.6 5.8 2 7c-1.2 2-.3 5 .8 6.6.6.8 1.3 1.7 2.2 1.7.9 0 1.2-.6 2.3-.6s1.4.6 2.3.6c.9 0 1.6-.9 2.2-1.7.4-.6.6-1.2.7-1.5-1.8-.7-2.1-3.3-.3-4.3-.7-.8-1.7-1-2.3-.9zM20 5.3h-1.6l-1 3.1h-.1L16.2 5.3H14.6l2.2 6.3-.1.4c-.2.7-.7.9-1.4.9h-.5v1.3h.6c1.4 0 2.1-.5 2.7-2.1L20 5.3zm4.6 5c0 1.1-.7 1.8-1.7 1.8-1 0-1.6-.7-1.6-1.8V5.3h-1.4v5c0 1.8 1.1 3 2.7 3s2.7-1.2 2.7-3v-5H24.6v5zm6.3-5.1c-1.7 0-2.9 1.2-2.9 3.1 0 1.8 1.2 3 2.9 3 1 0 1.8-.5 2.2-1.2h.1v1.1h1.3V5.3H33.1v1.1H33c-.4-.7-1.2-1.2-2.1-1.2zm.3 1.2c1 0 1.8.8 1.8 1.9s-.8 1.9-1.8 1.9c-1 0-1.8-.8-1.8-1.9s.8-1.9 1.8-1.9zm7.4-1.2c-1.7 0-2.8 1.1-2.8 2.7 0 1.1.6 1.9 1.7 2.2l1.4.4c.7.2 1 .5 1 1 0 .6-.6 1-1.5 1-1 0-1.6-.4-1.7-1.1h-1.4c.1 1.5 1.3 2.4 3.1 2.4 1.9 0 3.1-1 3.1-2.6 0-1.1-.7-1.9-1.9-2.2l-1.3-.4c-.7-.2-1-.5-1-1 0-.6.5-1 1.4-1 .8 0 1.4.4 1.5 1h1.4c-.2-1.4-1.3-2.4-3-2.4z"/>
            </svg>
            <span className="np-text-body-large-bold">Pay</span>
          </button>
          <Button v2 size="lg" priority="secondary" block onClick={() => onScreenChange('success')}>
            Confirm order
          </Button>
        </div>
      </div>
    );
  }

  if (screen === 'success') {
    return (
      <div className="joint-accept">
        <div className="joint-accept__scroll card-success">
          <div className="card-success__skip">
            <Button v2 size="sm" priority="tertiary" onClick={() => onAccept('physical')}>Skip</Button>
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
          <Button v2 size="lg" priority="primary" block onClick={() => onAccept('physical')}>
            Add money
          </Button>
        </div>
      </div>
    );
  }

  if (screen === 'card-type') {
    return (
      <div className="joint-accept">
        <div className="joint-accept__scroll">
          <div className="joint-accept__back">
            <IconButton aria-label="Go back" priority="tertiary" onClick={() => onScreenChange('pitch')}>
              <ArrowLeft size={24} />
            </IconButton>
          </div>

          <div className="card-choose__body">
            <h1 className="np-display np-text-display-small card-choose__title">
              Choose your debit card
            </h1>

            <div className="card-choose__option" role="button" tabIndex={0} onClick={() => onAccept('digital')} onKeyDown={(e) => e.key === 'Enter' && onAccept('digital')}>
              <div className="card-choose__option-content">
                <div className="np-text-body-large-bold card-choose__option-name">Digital</div>
                <div className="np-text-body-default card-choose__option-desc">
                  A card that lives online and works anywhere. Easy, secure, and always on hand.
                </div>
                <div className="card-choose__option-meta">
                  <span className="card-choose__badge card-choose__badge--free">Free</span>
                  <span className="np-text-body-default card-choose__option-delivery">Get it instantly</span>
                </div>
              </div>
              <img src={cardGreenUrl} alt="" className="card-choose__option-img" />
            </div>

            <div className="card-choose__option" role="button" tabIndex={0} onClick={() => onScreenChange('address')} onKeyDown={(e) => e.key === 'Enter' && onScreenChange('address')}>
              <div className="card-choose__option-content">
                <div className="np-text-body-large-bold card-choose__option-name">Physical</div>
                <div className="np-text-body-default card-choose__option-desc">
                  Spend and withdraw money around the world. In your wallet and on your side.
                </div>
                <div className="card-choose__option-meta">
                  <span className="np-text-body-default card-choose__option-price">From 2.50 GBP</span>
                  <span className="np-text-body-default card-choose__option-delivery">Arrives within 6 days</span>
                </div>
              </div>
              <img src={cardTapestryUrl} alt="" className="card-choose__option-img" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Pitch screen
  return (
    <div className="joint-accept">
      <div className="joint-accept__scroll">
        {/* Hero — dark green */}
        <div className="joint-accept__hero">
          <div className="joint-accept__close">
            <IconButton aria-label="Close" priority="tertiary" onClick={onClose}>
              <Cross size={16} />
            </IconButton>
          </div>

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
              <img className="joint-pitch__avatar" src="/sky-dog.jpg" alt="" />
              <img className="joint-pitch__avatar" src="https://www.tapback.co/api/avatar/christie-davis.webp" alt="" />
              <img className="joint-pitch__avatar" src="https://www.tapback.co/api/avatar/sarah-chen.webp" alt="" />
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
        <Button v2 size="lg" priority="primary" block onClick={() => onScreenChange('card-type')}>
          Accept and continue
        </Button>
        <Button v2 size="lg" priority="secondary" block onClick={onDecline}>
          Decline invite
        </Button>
      </div>
    </div>
  );
}
