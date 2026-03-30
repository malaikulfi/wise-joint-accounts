import { useState } from 'react';
import { ListItem } from '@transferwise/components';
import { People, CardWise, Suitcase, FastFlag, MultiCurrency, Savings, Plane, Globe } from '@transferwise/icons';
import { useLanguage } from '../context/Language';
import { JointAccountPitchModal } from './JointAccountPitchModal';

type SectionItem = {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  titleKey: string;
  subtitleKey?: string;
  action?: string;
};

type Section = {
  id: string;
  labelKey: string;
  items: SectionItem[];
};

const SECTIONS: Section[] = [
  {
    id: 'accounts',
    labelKey: 'getMore.section.accounts',
    items: [
      { icon: <People size={24} />, iconBg: '#163300', iconColor: '#9fe870', titleKey: 'getMore.joint.title', subtitleKey: 'getMore.joint.subtitle', action: 'joint-pitch' },
      { icon: <CardWise size={24} />, iconBg: '#163300', iconColor: '#9fe870', titleKey: 'getMore.card617.title', subtitleKey: 'getMore.card617.subtitle' },
      { icon: <Suitcase size={24} />, iconBg: '#163300', iconColor: '#9fe870', titleKey: 'getMore.business.title', subtitleKey: 'getMore.business.subtitle' },
    ],
  },
  {
    id: 'currency',
    labelKey: 'getMore.section.currency',
    items: [
      { icon: <FastFlag size={24} />, iconBg: '#3a3200', iconColor: '#c8b84a', titleKey: 'getMore.currentAccount.title' },
      { icon: <Savings size={24} />, iconBg: '#3a3200', iconColor: '#c8b84a', titleKey: 'getMore.savings.title' },
    ],
  },
  {
    id: 'grow',
    labelKey: 'getMore.section.grow',
    items: [
      { icon: <MultiCurrency size={24} />, iconBg: '#163300', iconColor: '#9fe870', titleKey: 'getMore.grow.title', subtitleKey: 'getMore.grow.subtitle' },
    ],
  },
  {
    id: 'save',
    labelKey: 'getMore.section.save',
    items: [
      { icon: <Savings size={24} />, iconBg: '#2d1a5c', iconColor: '#b99cff', titleKey: 'getMore.saveGoal.title', subtitleKey: 'getMore.saveGoal.subtitle' },
    ],
  },
  {
    id: 'travel',
    labelKey: 'getMore.section.travel',
    items: [
      { icon: <Plane size={24} />, iconBg: '#3a0a00', iconColor: '#ff7a6b', titleKey: 'getMore.lounge.title', subtitleKey: 'getMore.lounge.subtitle' },
      { icon: <Globe size={24} />, iconBg: '#3a0a00', iconColor: '#ff7a6b', titleKey: 'getMore.esim.title', subtitleKey: 'getMore.esim.subtitle' },
    ],
  },
];

export function GetMoreFromWise({ onClose, onJointAccountInvite, pendingInviteName }: { onClose: () => void; onJointAccountInvite: () => void; pendingInviteName?: string | null }) {
  const { t } = useLanguage();
  const [showJointPitch, setShowJointPitch] = useState(false);
  const hasPendingInvite = !!pendingInviteName;

  return (
    <div className="get-more-from-wise">
      <h1 className="np-text-title-screen" style={{ margin: '0 0 24px' }}>{t('getMore.title')}</h1>

        {SECTIONS.map((section) => (
          <div key={section.id} className="get-more-from-wise__section">
            <p className="np-text-title-group" style={{ color: 'var(--color-content-secondary)', margin: '0 0 4px' }}>
              {t(section.labelKey as any)}
            </p>
            <ul className="wds-list list-unstyled m-y-0 get-more-from-wise__list">
              {section.items.map((item) => {
                const isJoint = item.action === 'joint-pitch';
                const disabled = isJoint && hasPendingInvite;
                return (
                  <li key={item.titleKey} className={item.action && !disabled ? 'get-more-from-wise__item--tappable' : undefined} onClick={item.action && !disabled ? () => setShowJointPitch(true) : undefined} style={disabled ? { opacity: 0.5, pointerEvents: 'none' } : undefined}>
                  <ListItem
                    media={
                      <ListItem.AvatarView>
                        <div style={{ background: item.iconBg, color: item.iconColor, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                          {item.icon}
                        </div>
                      </ListItem.AvatarView>
                    }
                    title={t(item.titleKey as any)}
                    subtitle={disabled ? 'Waiting for your invitation to be accepted' : (item.subtitleKey ? t(item.subtitleKey as any) : undefined)}
                    control={<ListItem.Navigation />}
                  />
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

      {showJointPitch && (
        <JointAccountPitchModal onClose={() => setShowJointPitch(false)} onGetStarted={onJointAccountInvite} />
      )}
    </div>
  );
}
