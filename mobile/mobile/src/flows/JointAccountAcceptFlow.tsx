import { useState } from 'react';
import { Button, Select } from '@transferwise/components';
import { Illustration } from '@wise/art';
import { FlowHeader } from '../components/FlowHeader';
import type { AccountType } from '../App';

const cardGreenUrl = new URL('../assets/card-green.jpg', import.meta.url).href;
const cardTapestryUrl = new URL('../assets/card-tapestry.jpg', import.meta.url).href;

type Screen = 'pitch' | 'card-type' | 'address' | 'review' | 'success';

type Props = {
  inviterName: string;
  inviterAvatarUrl: string;
  onClose: () => void;
  onAccept?: (cardType: 'digital' | 'physical') => void;
  onDecline?: () => void;
  onStepChange?: (step: string) => void;
  accountType: AccountType;
};

export function JointAccountAcceptFlow({ inviterName, inviterAvatarUrl, onClose, onAccept, onDecline, onStepChange }: Props) {
  const [screen, setScreen] = useState<Screen>('pitch');
  const [cardType, setCardType] = useState<'digital' | 'physical' | null>(null);
  const [address1, setAddress1] = useState('123 Big House');
  const [city, setCity] = useState('London');
  const [postcode, setPostcode] = useState('N1 8TQ');

  const handleScreenChange = (newScreen: Screen) => {
    setScreen(newScreen);
    onStepChange?.(newScreen);
  };

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

  if (screen === 'review') {
    const addressFull = [address1, city, postcode, 'United Kingdom'].filter(Boolean).join(', ');

    return (
      <div className="joint-accept">
        <FlowHeader onClose={onClose} onBack={() => handleScreenChange('address')} />
        <div className="joint-accept__scroll">
          <div className="card-address__body">
            <h1 className="np-display np-text-display-small card-address__title">
              Review your order
            </h1>

            <div className="card-review__section">
              <div className="card-review__section-title np-text-title-subsection">Card details</div>
              <div className="card-review__row">
                <div>
                  <div className="np-text-body-default card-review__label">Card type</div>
                  <div className="np-text-body-large-bold">{cardType === 'digital' ? 'Digital' : 'Physical'}</div>
                </div>
                <button className="card-review__edit np-text-body-default" onClick={() => handleScreenChange('card-type')}>Edit</button>
              </div>
            </div>

            {cardType === 'physical' && (
              <div className="card-review__section">
                <div className="card-review__section-title np-text-title-subsection">Delivery details</div>
                <div className="card-review__row">
                  <div>
                    <div className="np-text-body-default card-review__label">Deliver to</div>
                    <div className="np-text-body-large-bold">{addressFull}</div>
                  </div>
                  <button className="card-review__edit np-text-body-default" onClick={() => handleScreenChange('address')}>Edit</button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="joint-accept__footer">
          <Button v2 size="lg" priority="primary" block onClick={() => handleScreenChange('success')}>
            Confirm order
          </Button>
        </div>
      </div>
    );
  }

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
          <Button v2 size="lg" priority="primary" block onClick={() => handleScreenChange('review')}>
            Continue
          </Button>
        </div>
      </div>
    );
  }

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

            <div
              className="card-choose__option"
              role="button"
              tabIndex={0}
              onClick={() => { setCardType('physical'); handleScreenChange('address'); }}
            >
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
