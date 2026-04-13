import { useState } from 'react';
import { Button, SegmentedControl, ListItem } from '@transferwise/components';
import { Cross, Convert, Calendar, Bank, Documents, Document, MinusCircle, People, FastFlag } from '@transferwise/icons';
import { GlassCircle } from '../components/FlowHeader';
import { usePrototypeNames } from '../context/PrototypeNames';
import type { AccountType } from '../App';

type Tab = 'required' | 'recommended';
type Step = 'checklist' | 'confirm';

type ChecklistItem = {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
};

const requiredItems: ChecklistItem[] = [
  {
    icon: <Convert size={24} />,
    title: 'Switch all money to cash',
    subtitle: 'Convert any investments or assets to available balance',
  },
  {
    icon: <Calendar size={24} />,
    title: 'Complete or cancel pending transactions',
    subtitle: 'Resolve all open transfers, direct debits and scheduled payments',
  },
  {
    icon: <MinusCircle size={24} />,
    title: 'Pay any negative balances',
    subtitle: 'Clear all debts or overdrawn balances on your account',
  },
  {
    icon: <Bank size={24} />,
    title: 'Empty your account',
    subtitle: 'Transfer all remaining funds to another account',
  },
];

const recommendedItems: ChecklistItem[] = [
  {
    icon: <Documents size={24} />,
    title: 'Download statements and reports',
    subtitle: 'Keep records of your account history for your files',
  },
  {
    icon: <Document size={24} />,
    title: 'Download receipts',
    subtitle: 'Save copies of all your payment receipts before closing',
  },
];

const personalConsequences = [
  'Your Wise cards will be permanently deactivated',
  'The account details for receiving money will be permanently deactivated',
  'Any payment request links will stop working',
  'All scheduled transfers and direct debits will be cancelled',
];

const jointConsequences = [
  ...personalConsequences,
  "Any joint members will lose access (we'll email them to let them know)",
];

type Props = {
  accountLabel: string;
  accountType: AccountType;
  balance?: number;
  onClose: () => void;
};

function AccountRow({ label, subtitle, avatarUrl, icon, iconStyle }: { label: string; subtitle: string; avatarUrl?: string; icon?: React.ReactNode; iconStyle?: React.CSSProperties }) {
  return (
    <div className="caf-other-account">
      {avatarUrl ? (
        <img src={avatarUrl} className="caf-other-account__avatar" alt={label} />
      ) : (
        <div className="caf-other-account__icon" style={iconStyle}>
          {icon}
        </div>
      )}
      <div className="caf-other-account__text">
        <p className="caf-other-account__name">{label}</p>
        <p className="caf-other-account__sub">{subtitle}</p>
      </div>
    </div>
  );
}

export function CloseAccountFlow({ accountLabel, accountType, balance, onClose }: Props) {
  const [tab, setTab] = useState<Tab>('required');
  const [step, setStep] = useState<Step>('checklist');
  const { consumerName, businessName, jointAccountAccepted } = usePrototypeNames();

  const isJoint = accountLabel === 'Joint account';
  const isBusiness = accountType === 'business';
  const isBalanceZero = balance === undefined || balance <= 0;
  const items = tab === 'required' ? requiredItems : recommendedItems;
  const consequences = isJoint ? jointConsequences : personalConsequences;

  type OtherAccount = { label: string; subtitle: string; avatarUrl?: string; icon?: React.ReactNode; iconStyle?: React.CSSProperties };

  // Other accounts shown on confirm screen
  const otherAccounts: OtherAccount[] = [];
  if (isJoint) {
    otherAccounts.push({
      label: consumerName,
      subtitle: 'Personal account',
      avatarUrl: 'https://www.tapback.co/api/avatar/connor-berry.webp',
    });
    otherAccounts.push({ label: businessName, subtitle: 'Business account', avatarUrl: '/berry-design-logo.png' });
  } else {
    if (jointAccountAccepted && !isBusiness) {
      otherAccounts.push({
        label: 'Joint account',
        subtitle: 'Personal account',
        icon: <People size={20} />,
        iconStyle: { backgroundColor: '#0e3d2e', color: '#9fe870' },
      });
    }
    otherAccounts.push({ label: businessName, subtitle: 'Business account', avatarUrl: '/berry-design-logo.png' });
  }

  if (step === 'confirm') {
    return (
      <div className="caf-confirm">
        {/* Header */}
        <div className="caf-confirm__header">
          <GlassCircle onClick={onClose} ariaLabel="Close">
            <span className="ios-glass-btn__icon"><Cross size={24} /></span>
          </GlassCircle>
        </div>

        {/* Body */}
        <div className="caf-confirm__body">
          <h1 className="caf-confirm__title">What happens when you close your account</h1>

          {/* Account card + consequences */}
          <div className="caf-confirm__card">
            <div className="caf-confirm__card-account">
              <div
                className="caf-confirm__card-icon"
                style={isJoint
                  ? { backgroundColor: '#0e3d2e', color: '#9fe870' }
                  : isBusiness
                    ? { backgroundColor: '#163300', color: '#9fe870' }
                    : { backgroundColor: 'var(--color-interactive-accent)', color: 'var(--color-interactive-control)' }}
              >
                {isJoint ? <People size={24} /> : <FastFlag size={24} />}
              </div>
              <div>
                <p className="caf-confirm__card-name">{accountLabel}</p>
                <p className="caf-confirm__card-sub">{isBusiness ? 'Business account' : 'Personal account'}</p>
              </div>
            </div>
            <div className="caf-confirm__card-divider" />
            <ul className="caf-confirm__card-list">
              {consequences.map((text, i) => (
                <li key={i} className="caf-confirm__card-item">{text}</li>
              ))}
            </ul>
          </div>

          {/* Other accounts */}
          <h2 className="caf-confirm__other-title">You'll still be able to access other accounts.</h2>
          <p className="caf-confirm__other-label">All other accounts</p>
          <div className="caf-confirm__other-list">
            {otherAccounts.map((acct, i) => (
              <AccountRow
                key={i}
                label={acct.label}
                subtitle={acct.subtitle}
                avatarUrl={acct.avatarUrl}
                icon={acct.icon}
                iconStyle={acct.iconStyle}
              />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="caf-confirm__footer">
          <button className="caf-confirm__cta" onClick={() => {}}>
            Close account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="close-account-flow">
      {/* Header bar */}
      <div className="close-account-flow__header">
        <GlassCircle onClick={onClose} ariaLabel="Close">
          <span className="ios-glass-btn__icon"><Cross size={24} /></span>
        </GlassCircle>
      </div>

      {/* Scrollable body */}
      <div className="close-account-flow__body">
        <p className="close-account-flow__account-label">{accountLabel}</p>
        <h1 className="close-account-flow__title">Before you close your account</h1>

        <div className="close-account-flow__tabs">
          <SegmentedControl
            name="close-account-tabs"
            mode="input"
            segments={[
              { id: 'required', value: 'required', label: 'Required' },
              { id: 'recommended', value: 'recommended', label: 'Recommended' },
            ]}
            value={tab}
            onChange={(val) => setTab(val as Tab)}
          />
        </div>

        <div className="close-account-flow__items">
          {items.map((item, i) => (
            <ListItem
              key={i}
              title={<span className="np-text-body-large" style={{ fontWeight: 600 }}>{item.title}</span>}
              subtitle={item.subtitle}
              media={
                <ListItem.AvatarView size={48} style={{ backgroundColor: 'var(--color-background-neutral)', border: 'none' }}>
                  {item.icon}
                </ListItem.AvatarView>
              }
              control={<ListItem.Navigation onClick={() => {}} />}
            />
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="close-account-flow__footer">
        <Button v2 size="lg" priority={isBalanceZero ? 'primary' : 'secondary-neutral'} block onClick={() => isBalanceZero && setStep('confirm')} disabled={!isBalanceZero}>
          Start account closure
        </Button>
        {!isBalanceZero && (
          <p className="close-account-flow__hint">Empty your account balance to continue</p>
        )}
      </div>
    </div>
  );
}
