import { Button } from '@transferwise/components';
import { People, Receipt, Globe } from '@transferwise/icons';
import { useLanguage } from '../context/Language';
import cardGreenImg from '../assets/card-green.jpg';
import cardTapestryImg from '../assets/card-tapestry.jpg';

export function JointAccountPitch({ onClose: _onClose, onGetStarted }: { onClose?: () => void; onGetStarted: () => void }) {
  const { t } = useLanguage();

  return (
    <div className="joint-pitch">
      <div className="joint-pitch__inner">
      {/* Hero */}
      <div className="joint-pitch__hero">
        <div className="joint-pitch__hero-copy">
          <h1 className="np-display np-text-display-medium joint-pitch__hero-title">
            A joint account for global life
          </h1>
          <p className="np-text-body-large joint-pitch__hero-subtitle">
            An account for two, for one big wide world. Open in minutes.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="joint-pitch__members-badge">
              <People size={16} />
              <span className="np-text-body-default-bold">2 members</span>
            </div>
          </div>
        </div>

        <div className="joint-pitch__hero-cards">
          <img src={cardTapestryImg} alt="" className="joint-pitch__card joint-pitch__card--back" />
          <img src={cardGreenImg} alt="" className="joint-pitch__card joint-pitch__card--front" />
        </div>
      </div>

      {/* Feature cards */}
      <div className="joint-pitch__features">
        <div className="joint-pitch__feature joint-pitch__feature--red">
          <h2 className="np-display np-text-display-small joint-pitch__feature-title">
            Shared costs, covered
          </h2>
          <p className="np-text-body-large joint-pitch__feature-body">
            Pay for life's expenses with ease, from household bills to big nights out.
          </p>
          <div className="joint-pitch__feature-mock joint-pitch__feature-mock--pill">
            <span className="joint-pitch__feature-mock-icon-wrap" style={{ backgroundColor: '#ffd6e0', color: '#000000', fontSize: '20px' }}>
              🧾
            </span>
            <span className="np-text-title-subsection" style={{ color: '#121511' }}>- £14.56</span>
          </div>
        </div>

        <div className="joint-pitch__feature joint-pitch__feature--dark">
          <h2 className="np-display np-text-display-small joint-pitch__feature-title joint-pitch__feature-title--cyan">
            For international duos
          </h2>
          <p className="np-text-body-large joint-pitch__feature-body">
            Send and spend money together, worldwide, without hidden fees.
          </p>
          <div className="joint-pitch__avatars">
            <div className="joint-pitch__avatar joint-pitch__avatar--globe" style={{ color: 'white' }}>
              <Globe size={24} />
            </div>
            <img className="joint-pitch__avatar" src="https://www.tapback.co/api/avatar/sky-dog.webp" alt="" />
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
            <span className="np-text-title-subsection" style={{ color: 'white' }}>£60.00</span>
            <div className="joint-pitch__feature-cards-stack">
              <img src={cardTapestryImg} alt="" className="joint-pitch__feature-card-img joint-pitch__feature-card-img--back" />
              <img src={cardGreenImg} alt="" className="joint-pitch__feature-card-img joint-pitch__feature-card-img--front" />
            </div>
          </div>
        </div>
      </div>

      </div>{/* end joint-pitch__inner */}

      {/* Sticky footer */}
      <div className="joint-pitch__footer">
        <p className="np-text-body-default" style={{ textAlign: 'center', color: 'var(--color-content-secondary)', margin: '0 0 20px' }}>
          By continuing, you agree to the{' '}
          <a href="#" className="np-text-link-default" onClick={(e) => e.preventDefault()} style={{ color: '#9fe870' }}>
            joint account terms and conditions
          </a>
        </p>
        <Button v2 size="lg" priority="primary" block onClick={onGetStarted}>
          Agree and continue
        </Button>
      </div>
    </div>
  );
}
