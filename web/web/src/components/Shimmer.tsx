/**
 * Shimmer skeleton primitives and composites.
 *
 * All elements use the `.shimmer-el` base class which provides:
 *   - neutral background
 *   - overflow: hidden + position: relative
 *   - ::after pseudo with translating white-highlight gradient (1.6s ease-in-out infinite)
 *
 * Composites mirror the layout of real components so they can be swapped in as loading placeholders.
 */

/* ======== Primitives ======== */

export function ShimmerCircle({ size = 48 }: { size?: number }) {
  return <div className="shimmer-el" style={{ width: size, height: size, borderRadius: '50%', flexShrink: 0 }} />;
}

export function ShimmerBar({ width = 120, height = 12 }: { width?: number | string; height?: number }) {
  return <div className="shimmer-el" style={{ width, height, borderRadius: height / 2, flexShrink: 0 }} />;
}

export function ShimmerRect({ width = '100%', height = 48, borderRadius = 12 }: { width?: number | string; height?: number; borderRadius?: number }) {
  return <div className="shimmer-el" style={{ width, height, borderRadius, flexShrink: 0 }} />;
}

/* ======== DS Component Composites ======== */

/** ListItem: 48px circle + title bar + subtitle bar + optional value + navigation chevron area */
export function ShimmerListItem({ hasValue = false, hasNavigation = true }: { hasValue?: boolean; hasNavigation?: boolean } = {}) {
  return (
    <div className="shimmer-list-item">
      <ShimmerCircle size={48} />
      <div className="shimmer-list-item__body">
        <ShimmerBar width={96} height={12} />
        <ShimmerBar width={148} height={10} />
      </div>
      {hasValue && (
        <div className="shimmer-list-item__value">
          <ShimmerBar width={64} height={12} />
          <ShimmerBar width={48} height={10} />
        </div>
      )}
      {hasNavigation && <ShimmerBar width={16} height={16} />}
    </div>
  );
}

/** ListItem with value+navigation — ActivitySummary / transaction row */
export function ShimmerActivitySummary() {
  return <ShimmerListItem hasValue hasNavigation />;
}

/** Button (md size) */
export function ShimmerButton({ width = 88, height = 40 }: { width?: number; height?: number } = {}) {
  return <ShimmerRect width={width} height={height} borderRadius={20} />;
}

/** CircularButton: circle + label bar below */
export function ShimmerCircularButton() {
  return (
    <div className="shimmer-circular-button">
      <ShimmerCircle size={48} />
      <ShimmerBar width={40} height={10} />
    </div>
  );
}

/** SearchInput */
export function ShimmerSearchInput() {
  return <ShimmerRect width="100%" height={48} borderRadius={12} />;
}

/** ExpressiveMoneyInput: label bar + large amount bar + currency pill */
export function ShimmerMoneyInput() {
  return (
    <div className="shimmer-money-input">
      <ShimmerBar width={120} height={14} />
      <div className="shimmer-money-input__row">
        <ShimmerBar width={180} height={32} />
        <ShimmerRect width={100} height={40} borderRadius={20} />
      </div>
    </div>
  );
}

/** Chips row */
export function ShimmerChips({ count = 3 }: { count?: number } = {}) {
  return (
    <div className="shimmer-chips">
      {Array.from({ length: count }, (_, i) => (
        <ShimmerRect key={i} width={64 + i * 12} height={32} borderRadius={16} />
      ))}
    </div>
  );
}

/** SegmentedControl */
export function ShimmerSegmentedControl({ segments = 3 }: { segments?: number } = {}) {
  return (
    <div className="shimmer-segmented-control">
      {Array.from({ length: segments }, (_, i) => (
        <ShimmerRect key={i} width={`${100 / segments}%`} height={36} borderRadius={8} />
      ))}
    </div>
  );
}

/** Tabs row */
export function ShimmerTabs({ count = 3 }: { count?: number } = {}) {
  return (
    <div className="shimmer-tabs">
      {Array.from({ length: count }, (_, i) => (
        <ShimmerBar key={i} width={64 + i * 8} height={14} />
      ))}
    </div>
  );
}

/** Table row: 4 cells */
export function ShimmerTableRow() {
  return (
    <div className="shimmer-table-row">
      <ShimmerBar width={72} height={12} />
      <div className="shimmer-table-row__detail">
        <ShimmerCircle size={32} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <ShimmerBar width={120} height={12} />
          <ShimmerBar width={80} height={10} />
        </div>
      </div>
      <ShimmerBar width={24} height={12} />
      <ShimmerBar width={72} height={12} />
    </div>
  );
}

/** IconButton */
export function ShimmerIconButton({ size = 32 }: { size?: number } = {}) {
  return <ShimmerCircle size={size} />;
}

/** Badge: avatar circle + small badge circle */
export function ShimmerBadge({ size = 48 }: { size?: number } = {}) {
  return (
    <div className="shimmer-badge" style={{ width: size, height: size }}>
      <ShimmerCircle size={size} />
      <div className="shimmer-badge__pip" style={{ width: size * 0.375, height: size * 0.375 }} />
    </div>
  );
}

/* ======== Custom Component Composites ======== */

/** TotalBalanceHeader: label bar + large amount bar + icon button */
export function ShimmerTotalBalanceHeader() {
  return (
    <div className="shimmer-total-balance-header">
      <ShimmerBar width={96} height={14} />
      <div className="shimmer-total-balance-header__row">
        <ShimmerBar width={180} height={24} />
        <ShimmerCircle size={32} />
      </div>
    </div>
  );
}

/** ActionButtonRow: row of pill buttons */
export function ShimmerActionButtonRow() {
  return (
    <div className="shimmer-action-button-row">
      <ShimmerButton width={72} height={40} />
      <ShimmerButton width={104} height={40} />
      <ShimmerButton width={88} height={40} />
    </div>
  );
}

/** AccountActionButtons: row of circular buttons with labels */
export function ShimmerAccountActionButtons({ count = 4 }: { count?: number } = {}) {
  return (
    <div className="shimmer-account-action-buttons">
      {Array.from({ length: count }, (_, i) => (
        <ShimmerCircularButton key={i} />
      ))}
    </div>
  );
}

/** MultiCurrencyAccountCard: card stack + header + balance grid + footer */
export function ShimmerAccountCard() {
  return (
    <div className="shimmer-account-card">
      <ShimmerRect width="100%" height={86} borderRadius={16} />
      <div className="shimmer-account-card__front">
        <div className="shimmer-list-item" style={{ padding: '8px 0' }}>
          <ShimmerBar width={120} height={14} />
          <div style={{ flex: 1 }} />
          <ShimmerBar width={16} height={16} />
        </div>
        <div className="shimmer-account-card__balances">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="shimmer-list-item" style={{ padding: '6px 0' }}>
              <ShimmerCircle size={24} />
              <ShimmerBar width={72 + i * 8} height={12} />
              <div style={{ flex: 1 }} />
              <ShimmerBar width={16} height={16} />
            </div>
          ))}
        </div>
        <div style={{ paddingTop: 12 }}>
          <ShimmerButton width={140} height={32} />
        </div>
      </div>
    </div>
  );
}

/** TaskCard: badge avatar + title + description + action button */
export function ShimmerTaskCard() {
  return (
    <div className="shimmer-task-card">
      <ShimmerBadge size={48} />
      <div className="shimmer-task-card__content">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <ShimmerBar width={140} height={14} />
          <ShimmerBar width={200} height={10} />
        </div>
        <ShimmerButton width={72} height={32} />
      </div>
    </div>
  );
}

/** SendAgainCard: avatar + name/handle/amount + dismiss + buttons */
export function ShimmerSendAgainCard() {
  return (
    <div className="shimmer-send-again-card">
      <div className="shimmer-send-again-card__header">
        <ShimmerCircle size={56} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
          <ShimmerBar width={80} height={12} />
          <ShimmerBar width={100} height={10} />
          <ShimmerBar width={64} height={10} />
        </div>
        <ShimmerCircle size={32} />
      </div>
      <div className="shimmer-send-again-card__actions">
        <ShimmerButton width={64} height={32} />
        <ShimmerButton width={56} height={32} />
      </div>
    </div>
  );
}

/** RecentContactCard: 72px circle + name bar */
export function ShimmerRecentContactCard() {
  return (
    <div className="shimmer-recent-contact">
      <ShimmerCircle size={72} />
      <ShimmerBar width={56} height={12} />
    </div>
  );
}

/** PromotionBanner: tall rectangle with inner content */
export function ShimmerPromotionBanner() {
  return <ShimmerRect width="100%" height={200} borderRadius={16} />;
}

/** AccountPageHeader: avatar + breadcrumb + balance + buttons */
export function ShimmerAccountPageHeader() {
  return (
    <div className="shimmer-account-page-header">
      <div className="shimmer-account-page-header__top">
        <ShimmerCircle size={32} />
        <ShimmerBar width={160} height={14} />
      </div>
      <div className="shimmer-account-page-header__bottom">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <ShimmerBar width={200} height={28} />
          <ShimmerButton width={160} height={32} />
        </div>
        <ShimmerAccountActionButtons count={4} />
      </div>
    </div>
  );
}

/** TransferCalculator: rate title + chart area + inputs + details + button */
export function ShimmerTransferCalculator() {
  return (
    <div className="shimmer-transfer-calculator">
      <ShimmerBar width={240} height={20} />
      <div className="shimmer-transfer-calculator__body">
        <ShimmerRect width="100%" height={220} borderRadius={8} />
        <div className="shimmer-transfer-calculator__inputs">
          <ShimmerRect width="100%" height={72} borderRadius={12} />
          <ShimmerRect width="100%" height={72} borderRadius={12} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '8px 0' }}>
            <ShimmerBar width={200} height={12} />
            <ShimmerBar width={160} height={12} />
          </div>
          <ShimmerRect width="100%" height={48} borderRadius={24} />
        </div>
      </div>
    </div>
  );
}

/** CurrencyInputGroup: source input + swap + target input */
export function ShimmerCurrencyInputGroup() {
  return (
    <div className="shimmer-currency-input-group">
      <ShimmerRect width="100%" height={56} borderRadius={12} />
      <div style={{ display: 'flex', justifyContent: 'center', margin: '-8px 0' }}>
        <ShimmerCircle size={32} />
      </div>
      <ShimmerRect width="100%" height={56} borderRadius={12} />
    </div>
  );
}

/** CurrencyDropdown: search + sections with rows */
export function ShimmerCurrencyDropdown() {
  return (
    <div className="shimmer-currency-dropdown">
      <ShimmerRect width="100%" height={44} borderRadius={12} />
      <ShimmerBar width={120} height={12} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="shimmer-list-item" style={{ padding: '8px 0' }}>
            <ShimmerCircle size={24} />
            <ShimmerBar width={40} height={12} />
            <ShimmerBar width={100 + i * 16} height={12} />
          </div>
        ))}
      </div>
    </div>
  );
}

/** MoreMenu: icon button */
export function ShimmerMoreMenu() {
  return <ShimmerIconButton size={32} />;
}

/** Generic section header: date label */
export function ShimmerSectionHeader() {
  return (
    <div style={{ padding: '16px 0 8px' }}>
      <ShimmerBar width={100} height={12} />
    </div>
  );
}

/** Full transaction list: header + N activity summaries */
export function ShimmerTransactionList({ count = 5 }: { count?: number } = {}) {
  return (
    <div className="shimmer-transaction-list">
      <ShimmerSectionHeader />
      {Array.from({ length: count }, (_, i) => (
        <ShimmerActivitySummary key={i} />
      ))}
    </div>
  );
}

/** Carousel of account cards */
export function ShimmerCarousel({ count = 2 }: { count?: number } = {}) {
  return (
    <div className="shimmer-carousel">
      {Array.from({ length: count }, (_, i) => (
        <ShimmerAccountCard key={i} />
      ))}
    </div>
  );
}

/** Row of recent contact cards */
export function ShimmerRecentContacts({ count = 5 }: { count?: number } = {}) {
  return (
    <div className="shimmer-recent-contacts">
      {Array.from({ length: count }, (_, i) => (
        <ShimmerRecentContactCard key={i} />
      ))}
    </div>
  );
}

/** Menu list (Account page style): N list items without value */
export function ShimmerMenuList({ count = 6 }: { count?: number } = {}) {
  return (
    <div className="shimmer-menu-list">
      {Array.from({ length: count }, (_, i) => (
        <ShimmerListItem key={i} />
      ))}
    </div>
  );
}

/** EmptyAccountCard: grey top area + centered title/description/circle button */
export function ShimmerEmptyAccountCard() {
  return (
    <div className="shimmer-account-card" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', paddingBottom: '20%' }}>
        <div className="shimmer-el" style={{ position: 'absolute', top: -8, left: -8, right: -8, height: 'calc(100% + 8px)', borderRadius: '20px 20px 0 0' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px 16px 24px', flex: 1 }}>
        <ShimmerBar width={180} height={16} />
        <div style={{ marginTop: 8 }}><ShimmerBar width={240} height={12} /></div>
        <div style={{ marginTop: 16 }}><ShimmerCircle size={56} /></div>
      </div>
    </div>
  );
}

/** AccountDetailsList: title + subtitle + currency list items */
export function ShimmerAccountDetailsList() {
  return (
    <div style={{ maxWidth: 680, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <ShimmerBar width={200} height={24} />
      <ShimmerBar width={320} height={14} />
      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column' }}>
        {Array.from({ length: 6 }, (_, i) => (
          <ShimmerListItem key={i} />
        ))}
      </div>
    </div>
  );
}

/** AccountDetailsCard: grey rounded container with label/value/copy rows */
export function ShimmerAccountDetailsCard({ rows = 5 }: { rows?: number } = {}) {
  return (
    <div style={{ background: 'var(--color-background-neutral)', borderRadius: 24, padding: '8px 4px' }}>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 20px' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <ShimmerBar width={60 + i * 15} height={14} />
            <ShimmerBar width={100 + i * 25} height={16} />
            {i >= 2 && <ShimmerBar width={140 + i * 10} height={11} />}
          </div>
          <ShimmerCircle size={24} />
        </div>
      ))}
    </div>
  );
}

/** QuickFacts: chip tabs + fact card */
export function ShimmerQuickFacts() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <ShimmerBar width={100} height={18} />
      <div style={{ display: 'flex', gap: 8 }}>
        <ShimmerRect width={64} height={32} borderRadius={16} />
        <ShimmerRect width={72} height={32} borderRadius={16} />
        <ShimmerRect width={64} height={32} borderRadius={16} />
      </div>
      <ShimmerBar width={200} height={12} />
      <ShimmerRect width="100%" height={120} borderRadius={16} />
    </div>
  );
}

/** AvailabilityCards: positive/negative status cards */
export function ShimmerAvailabilityCards({ count = 2 }: { count?: number } = {}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {Array.from({ length: count }, (_, i) => (
        <ShimmerRect key={i} width="100%" height={64} borderRadius={16} />
      ))}
    </div>
  );
}
