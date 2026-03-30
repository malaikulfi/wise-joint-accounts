import { useState, useRef, useMemo, useCallback } from 'react';
import { FlowNavigation, Logo, Button, ListItem, InputGroup, Input, Size, Modal, AvatarView } from '@transferwise/components';
import { Search, CrossCircleFill, Link, QrCode } from '@transferwise/icons';
import { Illustration } from '@wise/art';
import { jointAccountContacts, recipients, getAvatarSrc, type Recipient } from '../data/recipients';

type Sheet =
  | { type: 'share-link' }
  | { type: 'qr-code' }
  | { type: 'contact'; recipient: Recipient };

type Step = 'select' | 'success';

type Props = {
  onClose: () => void;
  onInviteSent?: (name: string) => void;
  avatarUrl: string;
  initials: string;
};

const INVITE_URL = 'wise.com/join/joint';

export function JointAccountInviteFlow({ onClose, onInviteSent, avatarUrl, initials }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sheet, setSheet] = useState<Sheet | null>(null);
  const [step, setStep] = useState<Step>('select');
  const [selectedRecipientName, setSelectedRecipientName] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const isSearching = searchQuery.trim().length > 0;

  const wiseRecipients = useMemo(() =>
    recipients.filter((r) => r.hasFastFlag && r.avatarType !== 'logo'),
    [],
  );

  const allContacts = useMemo(() => {
    const jointIds = new Set(jointAccountContacts.map((c) => c.id));
    return [
      ...jointAccountContacts,
      ...wiseRecipients.filter((r) => !jointIds.has(r.id)),
    ];
  }, [wiseRecipients]);

  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) return allContacts;
    const q = searchQuery.toLowerCase();
    return allContacts.filter(
      (r) => r.name.toLowerCase().includes(q) || r.subtitle.toLowerCase().includes(q),
    );
  }, [searchQuery, allContacts]);

  const handleClearSearch = () => {
    setSearchQuery('');
    searchRef.current?.focus();
  };

  const handleShareLink = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: 'Open a joint account with me on Wise',
        text: 'Set up a joint account with me on Wise.',
        url: `https://${INVITE_URL}`,
      }).catch(() => {});
    } else {
      setSheet({ type: 'share-link' });
    }
  };

  const handleConfirmInvite = useCallback(() => {
    if (sheet?.type === 'contact') {
      const name = sheet.recipient.name;
      setSelectedRecipientName(name);
      setSheet(null);
      setStep('success');
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 600);
      onInviteSent?.(name);
    }
  }, [sheet, onInviteSent]);

  const avatar = avatarUrl
    ? <AvatarView size={48} imgSrc={avatarUrl} />
    : <AvatarView size={48}>{initials}</AvatarView>;

  const steps = [
    { label: 'Recipient' },
    { label: 'Invite' },
  ];

  const trackClass = [
    'joint-invite-flow__track',
    step === 'success' && 'joint-invite-flow__track--step-success',
    isAnimating && 'joint-invite-flow__track--animating',
  ].filter(Boolean).join(' ');

  return (
    <div className={`joint-invite-flow${step === 'success' ? ' np-theme-personal--forest-green' : ''}`}>
      <FlowNavigation
        activeStep={step === 'success' ? 1 : 0}
        steps={steps}
        onClose={onClose}
        avatar={avatar}
        logo={<Logo />}
      />

      <div className={trackClass}>
        {/* Panel 1: Select who to invite */}
        <div className="joint-invite-flow__panel">
          <div className="joint-invite-flow__body">
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <h1 className="send-flow__title np-display np-text-display-small" style={{ marginBottom: 8 }}>
                Invite someone to open a joint account
              </h1>
              <p className="np-text-body-large" style={{ margin: 0, color: 'var(--color-content-secondary)' }}>
                If they don't have Wise yet, invite them to sign up with a link or QR code.
              </p>
            </div>

            {/* Anyone section */}
            <div style={{ marginBottom: 28 }}>
              <p className="np-text-title-group" style={{ margin: '0 0 8px', color: 'var(--color-content-secondary)' }}>Anyone</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li onClick={handleShareLink} style={{ cursor: 'pointer' }}>
                  <ListItem
                    media={
                      <ListItem.AvatarView size={48} style={{ background: 'var(--color-background-neutral)', border: 'none', color: 'var(--color-content-primary)' }}>
                        <Link size={24} />
                      </ListItem.AvatarView>
                    }
                    title={<span className="np-text-body-large" style={{ fontWeight: 600 }}>Share a link</span>}
                    subtitle="Share a payment link"
                    control={<ListItem.Navigation />}
                  />
                </li>
                <li onClick={() => setSheet({ type: 'qr-code' })} style={{ cursor: 'pointer' }}>
                  <ListItem
                    media={
                      <ListItem.AvatarView size={48} style={{ background: 'var(--color-background-neutral)', border: 'none', color: 'var(--color-content-primary)' }}>
                        <QrCode size={24} />
                      </ListItem.AvatarView>
                    }
                    title={<span className="np-text-body-large" style={{ fontWeight: 600 }}>Get a QR code</span>}
                    subtitle="Share your Wisetag"
                    control={<ListItem.Navigation />}
                  />
                </li>
              </ul>
            </div>

            {/* Wise contacts section */}
            <p className="np-text-title-group" style={{ margin: '0 0 12px', color: 'var(--color-content-secondary)' }}>Wise contacts</p>
            <div style={{ marginBottom: 12 }}>
              <InputGroup
                addonStart={{ content: <Search size={24} />, initialContentWidth: 24 }}
                addonEnd={isSearching ? {
                  content: (
                    <button type="button" className="recipients-page__search-clear" onClick={handleClearSearch} aria-label="Clear search">
                      <CrossCircleFill size={16} />
                    </button>
                  ),
                  initialContentWidth: 16,
                  interactive: true,
                } : undefined}
              >
                <Input
                  ref={searchRef}
                  role="searchbox"
                  inputMode="search"
                  shape="pill"
                  size={Size.MEDIUM}
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                />
              </InputGroup>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {filteredContacts.map((r) => {
                const imgSrc = getAvatarSrc(r);
                const avatarMedia = imgSrc ? (
                  <ListItem.AvatarView size={48} imgSrc={imgSrc} profileName={r.name} />
                ) : (
                  <ListItem.AvatarView size={48} style={{ backgroundColor: 'var(--color-background-neutral)', border: 'none' }}>
                    {r.initials}
                  </ListItem.AvatarView>
                );
                return (
                  <li key={r.id} style={{ cursor: 'pointer' }} onClick={() => setSheet({ type: 'contact', recipient: r })}>
                    <ListItem
                      media={avatarMedia}
                      title={<span className="np-text-body-large" style={{ fontWeight: 600 }}>{r.name}</span>}
                      subtitle={r.subtitle}
                      control={<ListItem.Navigation />}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Panel 2: Success */}
        <div className="joint-invite-flow__panel joint-invite-flow__panel--success">
          <div className="joint-invite-success__body">
            <Illustration name="confetti" size="medium" />
            <h1 className="np-display np-text-display-medium joint-invite-success__title">
              Your invite<br />SENT
            </h1>
            <p className="np-text-body-large joint-invite-success__subtitle">
              We'll let you know when {selectedRecipientName} accepts. The invite expires in 30 days.
            </p>
            <div className="joint-invite-success__ok">
              <Button v2 size="lg" priority="primary" block onClick={onClose}>
                OK
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Share link modal */}
      <Modal
        open={sheet?.type === 'share-link'}
        onClose={() => setSheet(null)}
        title="Share a link"
        body={
          <div>
            <p className="np-text-body-large" style={{ margin: '0 0 16px', color: 'var(--color-content-secondary)' }}>
              Send this link to invite someone to open a joint account with you on Wise.
            </p>
            <div className="joint-invite-sheet__link-row">
              <span className="np-text-body-default joint-invite-sheet__link-url">{INVITE_URL}</span>
              <Button v2 size="sm" priority="secondary" onClick={() => navigator.clipboard?.writeText(`https://${INVITE_URL}`)}>
                Copy
              </Button>
            </div>
          </div>
        }
      />

      {/* QR code modal */}
      <Modal
        open={sheet?.type === 'qr-code'}
        onClose={() => setSheet(null)}
        title="Scan to share"
        body={
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <p className="np-text-body-large joint-invite-sheet__qr-label" style={{ textAlign: 'left', margin: 0, alignSelf: 'stretch' }}>
              Ask the other person to scan this QR code with their device.
            </p>
            <div className="joint-invite-sheet__qr">
              <QrCodeSvg />
            </div>
            <Button v2 size="lg" priority="primary" block onClick={() => setSheet(null)}>
              Done
            </Button>
          </div>
        }
      />

      {/* Contact confirmation modal */}
      {sheet?.type === 'contact' && (
        <Modal
          open
          onClose={() => setSheet(null)}
          body={
            <div style={{ textAlign: 'center' }}>
              <div className="joint-invite-sheet__contact-avatar">
                {(() => {
                  const imgSrc = getAvatarSrc(sheet.recipient);
                  return imgSrc
                    ? <img src={imgSrc} alt={sheet.recipient.name} className="joint-invite-sheet__avatar-img" />
                    : <div className="joint-invite-sheet__avatar-initials">{sheet.recipient.initials}</div>;
                })()}
              </div>
              <h2 className="np-display np-text-display-small joint-invite-sheet__contact-title">
                You're inviting {sheet.recipient.name}
              </h2>
              <p className="np-text-body-large joint-invite-sheet__warning">
                Make sure you know and trust them — they'll have equal access to any money in the joint account.
              </p>
              <Button v2 size="lg" priority="primary" block onClick={handleConfirmInvite}>
                Confirm
              </Button>
            </div>
          }
        />
      )}
    </div>
  );
}

const cardTapestryUrl = new URL('../assets/card-tapestry.jpg', import.meta.url).href;

function QrCodeSvg() {
  return (
    <svg width="220" height="220" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      <rect width="220" height="220" fill="white" />
      <rect x="10" y="10" width="60" height="60" rx="6" fill="currentColor" />
      <rect x="19" y="19" width="42" height="42" rx="3" fill="white" />
      <rect x="27" y="27" width="26" height="26" rx="2" fill="currentColor" />
      <rect x="150" y="10" width="60" height="60" rx="6" fill="currentColor" />
      <rect x="159" y="19" width="42" height="42" rx="3" fill="white" />
      <rect x="167" y="27" width="26" height="26" rx="2" fill="currentColor" />
      <rect x="10" y="150" width="60" height="60" rx="6" fill="currentColor" />
      <rect x="19" y="159" width="42" height="42" rx="3" fill="white" />
      <rect x="27" y="167" width="26" height="26" rx="2" fill="currentColor" />
      <rect x="80" y="10" width="9" height="9" fill="currentColor" /><rect x="93" y="10" width="9" height="9" fill="currentColor" /><rect x="106" y="10" width="9" height="9" fill="currentColor" /><rect x="119" y="10" width="9" height="9" fill="currentColor" /><rect x="132" y="10" width="9" height="9" fill="currentColor" />
      <rect x="80" y="23" width="9" height="9" fill="currentColor" /><rect x="106" y="23" width="9" height="9" fill="currentColor" /><rect x="132" y="23" width="9" height="9" fill="currentColor" />
      <rect x="93" y="36" width="9" height="9" fill="currentColor" /><rect x="119" y="36" width="9" height="9" fill="currentColor" />
      <rect x="80" y="49" width="9" height="9" fill="currentColor" /><rect x="106" y="49" width="9" height="9" fill="currentColor" /><rect x="132" y="49" width="9" height="9" fill="currentColor" />
      <rect x="93" y="62" width="9" height="9" fill="currentColor" /><rect x="119" y="62" width="9" height="9" fill="currentColor" />
      <rect x="10" y="80" width="9" height="9" fill="currentColor" /><rect x="23" y="80" width="9" height="9" fill="currentColor" /><rect x="49" y="80" width="9" height="9" fill="currentColor" /><rect x="62" y="80" width="9" height="9" fill="currentColor" />
      <rect x="10" y="93" width="9" height="9" fill="currentColor" /><rect x="36" y="93" width="9" height="9" fill="currentColor" /><rect x="62" y="93" width="9" height="9" fill="currentColor" />
      <rect x="23" y="106" width="9" height="9" fill="currentColor" /><rect x="49" y="106" width="9" height="9" fill="currentColor" />
      <rect x="10" y="119" width="9" height="9" fill="currentColor" /><rect x="36" y="119" width="9" height="9" fill="currentColor" /><rect x="62" y="119" width="9" height="9" fill="currentColor" />
      <rect x="23" y="132" width="9" height="9" fill="currentColor" /><rect x="49" y="132" width="9" height="9" fill="currentColor" />
      <rect x="150" y="80" width="9" height="9" fill="currentColor" /><rect x="163" y="80" width="9" height="9" fill="currentColor" /><rect x="189" y="80" width="9" height="9" fill="currentColor" /><rect x="202" y="80" width="9" height="9" fill="currentColor" />
      <rect x="150" y="93" width="9" height="9" fill="currentColor" /><rect x="176" y="93" width="9" height="9" fill="currentColor" /><rect x="202" y="93" width="9" height="9" fill="currentColor" />
      <rect x="163" y="106" width="9" height="9" fill="currentColor" /><rect x="189" y="106" width="9" height="9" fill="currentColor" />
      <rect x="150" y="119" width="9" height="9" fill="currentColor" /><rect x="176" y="119" width="9" height="9" fill="currentColor" /><rect x="202" y="119" width="9" height="9" fill="currentColor" />
      <rect x="163" y="132" width="9" height="9" fill="currentColor" /><rect x="189" y="132" width="9" height="9" fill="currentColor" />
      <rect x="80" y="150" width="9" height="9" fill="currentColor" /><rect x="106" y="150" width="9" height="9" fill="currentColor" /><rect x="132" y="150" width="9" height="9" fill="currentColor" />
      <rect x="93" y="163" width="9" height="9" fill="currentColor" /><rect x="119" y="163" width="9" height="9" fill="currentColor" />
      <rect x="80" y="176" width="9" height="9" fill="currentColor" /><rect x="106" y="176" width="9" height="9" fill="currentColor" /><rect x="132" y="176" width="9" height="9" fill="currentColor" />
      <rect x="93" y="189" width="9" height="9" fill="currentColor" /><rect x="119" y="189" width="9" height="9" fill="currentColor" />
      <rect x="80" y="202" width="9" height="9" fill="currentColor" /><rect x="106" y="202" width="9" height="9" fill="currentColor" />
      <clipPath id="qr-logo-clip">
        <circle cx="110" cy="110" r="32" />
      </clipPath>
      <circle cx="110" cy="110" r="37" fill="white" />
      <image href={cardTapestryUrl} x="78" y="78" width="64" height="64" clipPath="url(#qr-logo-clip)" preserveAspectRatio="xMidYMid slice" />
      <g transform="translate(110,110) scale(1.2) translate(-12,-11)" fill="white">
        <path d="M1.875 15.28 7.35 8.838h-.002L4.02 3h18.105l-7.008 19.375h-3.97L16.95 6.3H9.463l1.665 2.883-.008.08-2.56 2.979h4.188l-1.098 3.037z" />
      </g>
    </svg>
  );
}
