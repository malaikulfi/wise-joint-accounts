# Custom Components — Account & Currency Pages

Components used on CurrentAccount, CurrencyPage, and shared across account-level views.

See also: [Home page components](custom-components.md) · [Flows & system](custom-components-flows.md)

---

## TransferCalculator

### Description
Interactive transfer calculator with a 25-day rate chart (Recharts), currency input group with dropdown selectors, fee details with info modal, send button, and a rate alert ListItem. Chart and inputs stack vertically.

### Structure
- **Calculator card** — Solid neutral container (r=16, padding 24px, no border)
  - **Rate heading** — "1 USD = 0.7434 GBP" (`np-text-title-subsection`)
  - **Body** — Flex column
    - **Chart section** — `ResponsiveContainer` + `LineChart` with gradient hover split, custom XAxis ticks
    - **Inputs column** — `CurrencyInputGroup` + fee details + Send button
- **Rate alert** — `ListItem` with bell icon and navigation chevron (below calculator card)
- **Fee modal** — `Modal` with bullet list explaining fee factors

### Key Behaviors
- **Rate generation** — Brownian motion random walk with seeded PRNG per currency pair. Uses `usdBaseRates` lookup (24 currencies) with per-currency volatility profiles (e.g. ARS/TRY high volatility, AED/SGD stable).
- **Hover line split** — SVG `<linearGradient>` splits the line at the hover point: solid color before, neutral after.
- **Currency conversion** — `target = (source - fee) * rate`. Fee is fixed at 7.23 in source currency.
- **Chart animation** — `isAnimationActive={true}` with `animationDuration={600}` and `animationEasing="ease-out"`.
- **Custom XAxis ticks** — Dynamic date labels: first tick shows one-month-ago date, last tick shows "Today". Uses `x == null` guard (not `!x`) because first tick has `x=0`.
- **Theme-aware line color** — CSS variable `--transfer-chart-line-color` maps to `--color-content-primary` in light mode and `--color-interactive-primary` in dark mode.

### Design System Components Used
- `Button v2`, `IconButton`, `ListItem` + `ListItem.AvatarView` + `ListItem.Navigation`, `Modal`
- `NotificationActive`, `QuestionMarkCircle` (`@transferwise/icons`)
- `LineChart`, `Line`, `CartesianGrid`, `XAxis`, `YAxis`, `ResponsiveContainer`, `Tooltip` (`recharts`)

### CSS Classes
- `.transfer-calculator` — Solid neutral card (r=16, padding 24px, no border)
- `.transfer-calculator__body` — Flex column
- `.transfer-calculator__chart-section` — Chart container
- `.transfer-calculator__inputs-col` — Inputs column
- `.transfer-calculator__details` — Bordered pill container for fee + arrival info
- `.transfer-calculator__info-btn` — Inline wrapper for fee info IconButton
- `.transfer-calculator__rate-alert` — Rate alert ListItem below card

---

## CurrencyInputGroup

### Description
Paired currency input fields with a swap button and currency selector dropdown.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `sourceAmount` | `string` | Source input value |
| `sourceCurrency` | `string` | Source currency code |
| `targetAmount` | `string` | Target input value |
| `targetCurrency` | `string` | Target currency code |
| `onSourceAmountChange` | `(val: string) => void?` | Source input change handler |
| `onTargetAmountChange` | `(val: string) => void?` | Target input change handler |
| `onSourceCurrencyChange` | `(code: string) => void?` | Source currency selection handler |
| `onTargetCurrencyChange` | `(code: string) => void?` | Target currency selection handler |
| `onSwap` | `() => void?` | Swap currencies handler |

### CSS Classes
- `.currency-input-group` — Flex column container with `position: relative`
- `.currency-input` — Borderless input row (r=16, screen background)
- `.currency-input__amount` — Styled text input (18px bold, 56px height)
- `.currency-input__selector-btn` — Currency picker button with flag + code + chevron
- `.currency-input-group__swap-btn` — 32px circle (#EDEFEC light / #2B2D29 dark)

### Notes
- Inputs have **no border** — they use screen background on a neutral-solid card.
- Swap button uses `SwitchVertical` icon with custom hex backgrounds.
- Dropdown renders at `.currency-input-group` level to avoid `overflow: hidden` clipping.

---

## CurrencySheet

### Description
Full-screen sheet overlay for selecting a currency. Searchable list with "Recent currencies" and "All currencies" sections. 24 currencies with flag + code + name rows. Implemented as `CurrencySheet.tsx` (not a dropdown).

### Notes
- Uses a full-screen sheet overlay pattern rather than a positioned dropdown.
- Auto-focuses the search input on mount.

---

## PageFooter

### Description
Page-level footer with shield icon, protection message, and "Learn more" button.

### CSS Classes
- `.page-footer` — Centered container with top padding
- `.page-footer__title` — Flex row centering shield icon + title
- `.page-footer__description` — Secondary color, max-width 400px

---

## AccountActionButtons

### Description
Row of 4 `CircularButton`s for primary account actions: Add, Convert, Send, Request. Used within `AccountPageHeader`.

### CSS Classes
- `.account-action-buttons` — Flex row, `justify-content: space-between`, each button `flex: 1`
- `.account-action-buttons .np-circular-btn` — Fixed at 100px width

---

## AccountPageHeader

### Description
Shared header for CurrentAccount and CurrencyPage. Contains Wise logo avatar (or logo + flag `AvatarLayout` for currency), breadcrumb navigation, balance display, account details button, action buttons, and a `MoreMenu`.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `type` | `'account' \| 'currency'` | Determines avatar and label style |
| `currencyCode` | `string?` | ISO currency code for flag (currency type only) |
| `label` | `string` | Account label (account type only) |
| `balance` | `string` | Formatted balance string |
| `menuItems` | `{ label: string; onClick?: () => void }[]` | Items for MoreMenu |
| `onAccountDetailsClick` | `() => void?` | Account details button handler |

### Structure
- **Top row** — Avatar + label/breadcrumb (left), MoreMenu (right)
- **Bottom row** — Balance (`h1`, 40px) + "Account details" `Button`
- **Actions** — `AccountActionButtons` centered below balance

### CSS Classes
- `.account-header` — Outer container, `padding-bottom: 32px`
- `.account-header__top-row` — Flex row: identity left, more menu right
- `.account-header__identity` — Flex row: avatar + label/breadcrumb, `gap: 16px`
- `.account-header__balance` — 40px bold heading, -0.5px letter-spacing
- `.account-header__actions-mobile` — Action buttons below balance

---

## MoreMenu

### Description
Kebab "···" `IconButton` trigger that opens a `<BottomSheet>` overlay with a list of actions. Each action renders as a `ListItem` with `AvatarView` for icons (from `@transferwise/components`).

### Props

| Prop | Type | Description |
|------|------|-------------|
| `externalOpen` | `boolean` | Controls whether the BottomSheet is visible |
| `onExternalClose` | `() => void` | Called when the sheet is dismissed |
| `menuItems` | `{ label: string; onClick?: () => void }[]` | Items rendered as ListItem entries |

### Notes
- On mobile, the trigger scales to 40px with 24px icon via CSS overrides.
- Uses `<BottomSheet>` (not a dropdown panel) — the sheet slides up from the bottom with the standard BottomSheet dismiss behavior (pan-to-close, backdrop tap).

---

## RecentContactCard

### Description
Contact card with a scaled 72px `AvatarView`, optional badge, name, and subtitle. Used in Recipients page and Send/Request flows.

### CSS Classes
- `.recent-contact-card` — Fixed 120x172px button, centered flex column
- `.recent-contact-card__avatar-wrapper` — `scale(1.222)` makes 72px avatar appear ~88px

### Notes
- The `scale(1.222)` requires counter-scaling badge vars and badge icon (`scale(0.716)`) so they render at correct sizes.

---

## ~~ThemeToggle~~ (Deprecated)

**This component no longer exists.** Theme toggling is handled elsewhere. This section is retained for historical reference only.

---

## InterestRateCard

### Description
Two-column card showing a currency's variable interest rate and returns amount. Displayed on CurrencyPage for currencies with `hasStocks || hasInterest`.

### Structure
- **Rate Cell** — Variable rate percentage with "Variable rate" label
- **Divider** — 1px vertical line
- **Returns Cell** — Returns amount with chevron, clickable, sentiment-colored

### CSS Classes
- `.interest-rate-card` — Flex container, 1px neutral border, 16px radius
- `.interest-rate-card__cell` — Flex column, centered. Rate cell flex: 45%, returns cell flex: 55%
- `.interest-rate-card__cell--clickable` — Hover shows neutral bg
- `.interest-rate-card__divider` — 1px vertical separator, 8px inset

### Notes
- Defined inline in `CurrencyPage.tsx` — not a separate exported component.
- Shows when `currency.hasStocks || currency.hasInterest` AND `accountType === 'personal'`.
- Returns amount computed from "Wise Interest" transactions in the data.
