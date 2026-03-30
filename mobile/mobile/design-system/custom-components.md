# Custom Components — Home Page

Experimental and iterative components built on top of the Wise Neptune Design System.
These are not part of the core design system — they are prototypes for iteration.

See also: [Account & currency components](custom-components-account.md) · [Flows & system](custom-components-flows.md)

---

## Account Card (Multi-Currency Account)

### Description
Displays a user's multi-currency account overview including stacked card visuals, account summary, currency balances, and an account details action. Supports automatic stacking when currency amounts are too long for the 2-column layout.

### Structure
- **Card Stack** — Overlapping card images (physical/digital) with count label and Wise badge
- **Account Header** — Title ("Current account"), balance summary ("£9.95 · 7 currencies"), navigation chevron
- **Balance Grid** — 2-column grid of currency flag + formatted balance, each with navigation chevron
- **Footer** — "Account details" button (small, secondary-neutral) with bank icon

### Data

| Field | Type | Description |
|-------|------|-------------|
| title | `string` | Account name (e.g. "Current account") |
| totalAmount | `string` | Formatted total balance (e.g. "£9.95") |
| currencyCount | `number` | Number of currencies held |
| balances | `{ code: string, amount: string }[]` | Per-currency balances (`code` = ISO country code for flag) |
| hasCards | `boolean` | Whether to show card stack (default `true`) |
| cardCount | `number` | Number of cards to display in label (default `2`) |
| hideAccountDetails | `boolean` | Hide the footer button (default `false`) |
| businessCardStyle | `boolean` | Use dark green gradient card (default `false`) |

### Balance Stacking Behavior

The balance grid defaults to a **2-column layout**. When currency amounts are too long, it switches to **single-column stacked** showing max 3 currencies.

**Detection**: Canvas text measurement (`getMaxAmountWidth`) in `Inter 16px`. Threshold: **85px**.

| Layout | Condition | Max currencies shown |
|--------|-----------|---------------------|
| 2-column grid | All amounts ≤ 85px rendered width | All (typically 4) |
| 1-column stacked | Any amount > 85px rendered width | 3 (4th hidden) |

### Design System Components Used
- `ListItem` + `ListItem.AvatarView` + `ListItem.Navigation` — Balance rows and account header
- `AvatarLayout` (orientation="diagonal") — GBP row with Rewards icon when `hasStocks`
- `Flag` (`@wise/art`) — Currency flag icons (24px circular)
- `Button v2` (size="sm", priority="secondary-neutral") — Account details action

### CSS Classes
- `.mca` — Outer container (width: 346px, border-radius: 26px, padding: 8px)
- `.mca-cards__stack` — Relative container for overlapping card images (24% padding-bottom)
- `.mca-front` — Front panel with cutout arch SVG and content
- `.mca-balances` — 2-column grid for currency balance list
- `.mca-balances--stacked` — Single-column override
- `.mca-footer` — Footer with action button

### Visual Alignment Rules

The MCA card and JarCard must sit side by side in the Home carousel with pixel-perfect alignment:

- **Stack/header height:** Both `.mca-cards__stack` and `.jar-card__header` use `padding-bottom: 24%` — the ONLY height driver.
- **Cutout overlap:** `.mca-front__cutout` is positioned `top: -15px`, overlapping the card stack by 15px.
- **Cutout always renders:** On ALL MCA cards (with or without `hasCards`).
- **Footer anchoring:** `.mca-footer` uses `padding: 12px 0 0`. In fixed-height contexts use `margin-top: auto`.

### Subtitle Rule
- **1 currency** — no subtitle
- **2+ currencies** — subtitle shows total amount + "· N currencies"

---

## JarCard

### Description
Jar (savings/purpose container) account in the Home carousel. Solid color header instead of card imagery. Must align pixel-perfectly with MCA cards.

### Data

| Field | Type | Description |
|-------|------|-------------|
| name | `string` | Jar name (e.g. "Savings") |
| icon | `React.ReactNode` | Jar icon |
| color | `string` | Header background color (Neptune expressive brand) |
| totalAmount | `string` | Optional total balance |
| balances | `{ code: string, amount: string }[]` | Per-currency balances |

### Visual Alignment Rules (Critical)

- **Header height:** `padding-bottom: 24%` only (matches MCA stack). NO top padding.
- **Content overlap:** `.jar-card__front` uses `margin-top: -15px` + `padding-top: 15px`.
- **No cutout:** Straight transition line, no wallet arch.
- **No footer:** No "Account details" button.

### Jar Colors (Neptune Expressive Brand)

| Jar Icon | Color |
|----------|-------|
| Savings | `#FFEB69` (yellow) |
| Suitcase | `#FFC091` (orange) |
| Blue variant | `#A0E1E1` |
| Pink variant | `#FFD7EF` |
| Green variant | `#9FE870` |

---

## MobileNav (Bottom Tab Bar)

### Description
Bottom tab bar. 4 items: Home, Cards, Recipients, Payments.

### Items

| Label | Icon | Href |
|-------|------|------|
| Home | `House` | `/home` |
| Cards | `CardWise` | `/cards` |
| Recipients | `Recipients` | `/recipients` |
| Payments | `Payments` | `/account/payments` |

### CSS Classes
- `.mobile-nav` — Fixed bottom container
- `.mobile-nav__items` — Flex row of tabs
- `.mobile-nav-item__label` — Custom Inter 10px typography

---

## TotalBalanceHeader

### Description
Total balance with label, large amount, and bar chart icon button.

### CSS Classes
- `.total-balance-header` — Outer container (16px top padding)
- `.total-balance-header__amount` — Flex row for amount + icon button

---

## ActionButtonRow

### Description
Horizontally scrollable row of primary action buttons: Send, Add money, Request.

### CSS Classes
- `.action-button-row` — Outer wrapper
- `.action-button-row__scroll` — Flex row (8px gap) with hidden overflow scrollbar

---

## Carousel

### Description
Horizontal snap-scroll carousel with dot indicators for Home page account cards.

### Behavior
- Scroll detection via `scroll` event listener (passive)
- Cards are 338px wide with 16px gap
- `::after` pseudo-element provides right scroll padding

### CSS Classes
- `.acct-carousel` — Outer container (NOT `.carousel` — avoids DS conflicts)
- `.acct-carousel__track` — Snap-scroll flex row with hidden scrollbar
- `.acct-carousel__dots` — Dot indicator row

---

## EmptyAccountCard

### Description
Placeholder card prompting the user to open a new account.

### CSS Classes
- `.mca.mca--empty` — Flex-column card reusing account card base
- `.mca-cards__stack--empty` — Shorter header strip (12% vs 24%)
- `.empty-account-card__content` — Centered column for text and icon

---

## TaskCard

### Description
Actionable task notification with icon, title/description, and action button.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `icon` | `ReactNode` | Icon inside the avatar |
| `sentiment` | `'positive' \| 'negative' \| 'warning'?` | Optional Badge overlay |
| `title` | `string` | Task title |
| `description` | `string` | Task description |
| `actionLabel` | `string` | Button text |

### CSS Classes
- `.task-card` — Neutral-solid background card (r=16, padding 16px)
- `.task-card__wrapper` — Horizontal flex row (icon → content)
- `.task-card__content` — Flex row (text → action button)

---

## TasksStack

### Description
Animated container for multiple TaskCards. Collapsed: first task + stacked shadow + expand button. Expanded: all tasks animate in.

### CSS Classes
- `.tasks-stack` — Outer container
- `.tasks-stack__count` — Animated count label (max-width + opacity transition)
- `.tasks-stack__animated` — Height-animated container (100px collapsed, 92px per card expanded)
- `.tasks-stack__placeholder` — Stacked shadow behind first card

---

## ActivitySummary

### Description
Transaction row using DS `ListItem`. Icon, name/date, right-aligned amount, navigation chevron.

### CSS Classes
- `.transactions-list` — Parent `<ul>` with negative margin for hover edge extension

### Notes
- No custom row CSS needed — `ListItem` handles everything.
- Positive amounts use `--color-sentiment-positive` via inline style on `valueTitle`.

---

## SendAgainCard

### Description
Past recipient card with avatar, optional FastFlag badge, name/handle/amount, dismiss button, Repeat/Edit actions. Fixed width 320px.

### CSS Classes
- `.send-again-card` — Solid neutral card (r=16, 320px)
- `.send-again-card__header` — Flex row: recipient + dismiss
- `.send-again-card__actions` — Flex row, children flex equally

### Notes
- Uses `AvatarView` `badge` prop with `{ icon: <FastFlag />, type: 'action' }`.
- "Edit" button uses `secondary-neutral` priority.

---

## PromotionBanner

### Description
Pressable promotional card (max-width 380px, 385px tall) with scale animation on touch, haptic feedback on click, background image/color support, illustration slot, gradient overlay, display typography, CTA button, and dismissible close button.

### Interaction
- **Press animation** — scales down slightly on touch start, springs back on release (CSS `transform: scale()` transition).
- **Haptic feedback** — calls `triggerHaptic()` on click (see `useHaptics.ts`).
- **Dismiss** — close button removes the banner.

### CSS Classes
- `.promotion-banner` — Relative outer container (max-width 380px)
- `.promotion-banner__container` — Background image/color container (r=16, clickable, pressable)
- `.promotion-banner__gradient` — CSS Grid (385px tall, 3 rows) with dark gradient
- `.promotion-banner__illustration` — Slot for illustration placement within the banner
- `.promotion-banner__arrow` — 56px bright-green circle CTA
- `.promotion-banner__dismiss` — 32px frosted close button (blur 48px)

### Notes
- Title uses `np-display np-text-display-small` (Wise Sans display font).
- Arrow button uses `--color-interactive-accent`.
- Supports both background images and solid background colors.
- Illustration slot accepts any `@wise/art` Illustration or custom content.
