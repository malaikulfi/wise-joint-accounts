import { Button, IconButton, AvatarView, AvatarLayout } from '@transferwise/components';
import { Bank, ChevronRight, Money } from '@transferwise/icons';
import { Flag } from '@wise/art';
import { AccountActionButtons } from './AccountActionButtons';
import { MoreMenu } from './MoreMenu';
import type { AccountType } from '../App';
import { useLanguage } from '../context/Language';
import { useShimmer } from '../context/Shimmer';
import { ShimmerAccountPageHeader } from './Shimmer';

type Props = {
  type: 'account' | 'currency' | 'taxes' | 'jar';
  currencyCode?: string;
  label: string;
  balance: string;
  accountDetails?: string;
  menuItems: { label: string; onClick?: () => void }[];
  onAccountDetailsClick?: () => void;
  onBreadcrumbClick?: () => void;
  accountType?: AccountType;
  jarColor?: string;
  jarName?: string;
  jarIcon?: React.ReactNode;
  hideGetPaid?: boolean;
  sendSecondary?: boolean;
  onAdd?: () => void;
  onConvert?: () => void;
  onSend?: () => void;
  onRequest?: () => void;
  onPaymentLink?: () => void;
};

function WiseLogoIcon() {
  return (
    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M1.875 15.28 7.35 8.838h-.002L4.02 3h18.105l-7.008 19.375h-3.97L16.95 6.3H9.463l1.665 2.883-.008.08-2.56 2.979h4.188l-1.098 3.037z" />
    </svg>
  );
}

export function AccountPageHeader({
  type,
  currencyCode,
  label,
  balance,
  accountDetails,
  menuItems,
  onAccountDetailsClick,
  onBreadcrumbClick,
  accountType = 'personal',
  jarColor,
  jarName,
  jarIcon,
  hideGetPaid: hideGetPaidProp,
  sendSecondary,
  onAdd,
  onConvert,
  onSend,
  onRequest,
  onPaymentLink,
}: Props) {
  const { t } = useLanguage();
  const { shimmerMode } = useShimmer();
  const isBusiness = accountType === 'business';
  const isGroup = type === 'taxes';
  const isJar = type === 'jar';
  const isJarCurrency = type === 'currency' && !!jarColor;
  const hideGetPaid = hideGetPaidProp ?? false;
  const wiseAvatarStyle = (isJar || isJarCurrency) && jarColor
    ? { backgroundColor: jarColor, color: '#121511' }
    : isGroup
      ? { backgroundColor: '#FFEB69', color: '#3a341c' }
      : isBusiness
        ? { backgroundColor: '#163300', color: '#9fe870' }
        : { backgroundColor: 'var(--color-interactive-accent)', color: 'var(--color-interactive-control)' };

  const avatarIcon = (isJar || isJarCurrency) && jarIcon ? jarIcon : isGroup ? <Money size={16} /> : <WiseLogoIcon />;

  if (shimmerMode) return (
    <div className="account-header">
      <ShimmerAccountPageHeader />
    </div>
  );

  return (
    <div className="account-header">
      {/* Top row: avatar + label/breadcrumb ... more menu */}
      <div className="account-header__top-row">
        <div className="account-header__identity">
          {type === 'currency' && currencyCode ? (
            <>
              <span className="account-header__avatar-desktop">
                <AvatarLayout
                  size={32}
                  avatars={[
                    { style: wiseAvatarStyle, asset: avatarIcon },
                    { asset: <Flag code={currencyCode} loading="eager" /> },
                  ]}
                />
              </span>
              <span className="account-header__avatar-mobile">
                <AvatarLayout
                  size={48}
                  avatars={[
                    { style: wiseAvatarStyle, asset: avatarIcon },
                    { asset: <Flag code={currencyCode} loading="eager" /> },
                  ]}
                />
              </span>
            </>
          ) : (
            <>
              <span className="account-header__avatar-desktop">
                <AvatarView size={32} style={wiseAvatarStyle}>
                  {avatarIcon}
                </AvatarView>
              </span>
              <span className="account-header__avatar-mobile">
                <AvatarView size={48} style={wiseAvatarStyle}>
                  {avatarIcon}
                </AvatarView>
              </span>
            </>
          )}
          {type === 'currency' ? (
            <p className="np-text-body-large account-header__breadcrumb">
              <span className="account-header__breadcrumb-link">{jarName || t('home.currentAccount')}</span>
              <span className="account-header__breadcrumb-chevron"><ChevronRight size={16} /></span>
              <span className="account-header__breadcrumb-code">{currencyCode}</span>
            </p>
          ) : (
            <p className="np-text-body-large account-header__label">{label}</p>
          )}
        </div>
        <div className="account-header__more">
          <MoreMenu items={menuItems} />
        </div>
      </div>

      {/* Bottom row: balance + details on left ... action buttons on right */}
      <div className="account-header__bottom-row">
        <div className="account-header__balance-group">
          <h1 className="account-header__balance">{balance}</h1>
          {type !== 'taxes' && type !== 'jar' && onAccountDetailsClick && (
            <div className="account-header__details">
              <Button
                v2
                size="sm"
                priority="secondary"
                addonStart={{ type: 'icon', value: <Bank size={16} /> }}
                addonEnd={{ type: 'icon', value: <ChevronRight size={16} /> }}
                onClick={onAccountDetailsClick}
              >
                {accountDetails || t('common.accountDetails')}
              </Button>
            </div>
          )}
        </div>
        <div className="account-header__actions-desktop">
          <AccountActionButtons accountType={accountType} hideGetPaid={hideGetPaid} sendSecondary={sendSecondary} onAdd={onAdd} onConvert={onConvert} onSend={onSend} onRequest={onRequest} onPaymentLink={onPaymentLink} />
        </div>
      </div>

      {/* Mobile/tablet: action buttons below, centered */}
      <div className="account-header__actions-mobile">
        <AccountActionButtons accountType={accountType} hideGetPaid={hideGetPaid} sendSecondary={sendSecondary} onAdd={onAdd} onConvert={onConvert} onSend={onSend} onRequest={onRequest} onPaymentLink={onPaymentLink} />
      </div>
    </div>
  );
}
