import { useState } from 'react';
import { Button, SegmentedControl, ListItem } from '@transferwise/components';
import { Cross, Convert, Calendar, Bank, Documents, Document, MinusCircle } from '@transferwise/icons';
import { GlassCircle } from '../components/FlowHeader';

type Tab = 'required' | 'recommended';

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

type Props = {
  accountLabel: string;
  onClose: () => void;
};

export function CloseAccountFlow({ accountLabel, onClose }: Props) {
  const [tab, setTab] = useState<Tab>('required');
  const items = tab === 'required' ? requiredItems : recommendedItems;

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
        <Button v2 size="lg" priority="secondary-neutral" block onClick={() => {}}>
          Start account closure
        </Button>
      </div>
    </div>
  );
}
