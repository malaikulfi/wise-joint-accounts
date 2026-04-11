import { ListItem } from '@transferwise/components';
import { People, CardWise, Suitcase, FastFlag, MultiCurrency, Savings, Plane, Globe } from '@transferwise/icons';
import { useLanguage } from '../context/Language';

type SectionItem = {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  titleKey: string;
  subtitleKey?: string;
  action?: () => void;
};

type Section = {
  id: string;
  labelKey: string;
  items: SectionItem[];
};

export function GetMoreFromWise({ onClose, onOpenJointPitch, pendingInviteName, jointAccountAccepted }: { onClose: () => void; onOpenJointPitch: () => void; pendingInviteName?: string | null; jointAccountAccepted?: boolean }) {
  const { t } = useLanguage();
  const hasPendingInvite = !!pendingInviteName;

  const SECTIONS: Section[] = [
    {
      id: 'accounts',
      labelKey: 'getMore.section.accounts',
      items: [
        { icon: <People size={24} />, iconBg: '#163300', iconColor: '#9fe870', titleKey: 'getMore.joint.title', subtitleKey: (hasPendingInvite || jointAccountAccepted) ? undefined : 'getMore.joint.subtitle', action: (hasPendingInvite || jointAccountAccepted) ? undefined : onOpenJointPitch },
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

  return (
    <div className="page" style={{ paddingTop: '16px', paddingBottom: 'var(--content-pad-bottom)', paddingLeft: '0', paddingRight: '0' }}>
      <h1 className="np-text-title-screen" style={{ margin: '0 0 24px 0' }}>{t('getMore.title')}</h1>

      {SECTIONS.map((section, sectionIdx) => (
        <div key={section.id} style={{ marginBottom: sectionIdx < SECTIONS.length - 1 ? '32px' : '0' }}>
          <p className="np-text-title-group" style={{ color: 'var(--color-content-secondary)', margin: '0 0 4px' }}>
            {t(section.labelKey as any)}
          </p>
          <ul className="wds-list list-unstyled m-y-0">
            {section.items.map((item, idx) => {
              const isJoint = item.titleKey === 'getMore.joint.title';
              const isJointDisabled = isJoint && (hasPendingInvite || jointAccountAccepted);
              const jointSubtitle = isJoint && jointAccountAccepted
                ? 'You already have a joint account'
                : isJoint && hasPendingInvite
                ? 'Waiting for your invitation to be accepted'
                : undefined;
              return (
                <li key={idx} onClick={!isJointDisabled ? item.action : undefined} style={isJointDisabled ? { opacity: 0.5, pointerEvents: 'none' } : item.action ? { cursor: 'pointer' } : undefined}>
                  <ListItem
                    media={
                      <ListItem.AvatarView size={48} style={{ background: 'transparent', border: 'none' }}>
                        <div style={{ background: item.iconBg, color: item.iconColor, width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                          {item.icon}
                        </div>
                      </ListItem.AvatarView>
                    }
                    title={<span className="np-text-body-large" style={{ fontWeight: 600 }}>{t(item.titleKey as any)}</span>}
                    subtitle={jointSubtitle ?? (item.subtitleKey ? t(item.subtitleKey as any) : undefined)}
                    control={<ListItem.Navigation />}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
