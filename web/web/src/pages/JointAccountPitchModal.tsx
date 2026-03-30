import { Button, Modal } from '@transferwise/components';
import { People, Globe } from '@transferwise/icons';

const cardGreenUrl = new URL('../assets/card-green.jpg', import.meta.url).href;
const cardTapestryUrl = new URL('../assets/card-tapestry.jpg', import.meta.url).href;

export function JointAccountPitchModal({ onClose, onGetStarted }: { onClose: () => void; onGetStarted: () => void }) {
  return (
    <Modal
      open
      onClose={onClose}
      className="joint-pitch-modal"
      body={
        <div>
          {/* Hero */}
          <div className="joint-pitch__hero" style={{ borderRadius: 16, minHeight: 320 }}>
            <div className="joint-pitch__hero-copy">
              <h2 className="np-display np-text-display-medium joint-pitch__hero-title" style={{ fontSize: 'clamp(28px, 6vw, 36px)' }}>
                A joint account for global life
              </h2>
              <p className="np-text-body-large joint-pitch__hero-subtitle">
                An account for two, for one big wide world. Open in minutes.
              </p>
              <div className="joint-pitch__members-badge">
                <People size={16} />
                <span className="np-text-body-default-bold">2 members</span>
              </div>
            </div>
            <div className="joint-pitch__hero-cards">
              <img src={cardTapestryUrl} alt="" className="joint-pitch__card joint-pitch__card--back" />
              <img src={cardGreenUrl} alt="" className="joint-pitch__card joint-pitch__card--front" />
            </div>
          </div>

          {/* Feature cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
            <div className="joint-pitch__feature joint-pitch__feature--red">
              <h3 className="np-display np-text-display-small joint-pitch__feature-title" style={{ fontSize: 'clamp(22px, 5vw, 28px)' }}>
                Shared costs, covered
              </h3>
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
              <h3 className="np-display np-text-display-small joint-pitch__feature-title joint-pitch__feature-title--cyan" style={{ fontSize: 'clamp(22px, 5vw, 28px)' }}>
                For international duos
              </h3>
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
              <h3 className="np-display np-text-display-small joint-pitch__feature-title" style={{ fontSize: 'clamp(22px, 5vw, 28px)' }}>
                Two cards, one account
              </h3>
              <p className="np-text-body-large joint-pitch__feature-body">
                You'll each get shiny new cards linked to the new account, and it comes with its own account details.
              </p>
              <div className="joint-pitch__feature-mock joint-pitch__feature-mock--balance">
                <span className="joint-pitch__feature-mock-plus">+</span>
                <span className="np-text-title-subsection" style={{ color: 'white' }}>£60.00</span>
                <div className="joint-pitch__feature-cards-stack">
                  <img src={cardTapestryUrl} alt="" className="joint-pitch__feature-card-img joint-pitch__feature-card-img--back" />
                  <img src={cardGreenUrl} alt="" className="joint-pitch__feature-card-img joint-pitch__feature-card-img--front" />
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="joint-pitch-modal__footer">
            <Button v2 size="lg" priority="primary" block onClick={onGetStarted} style={{ background: '#9fe870', color: '#121511', borderColor: '#9fe870', borderRadius: 40, fontWeight: 700 }}>
              Get started
            </Button>
          </div>
        </div>
      }
    />
  );
}
