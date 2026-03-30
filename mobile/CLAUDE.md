# Base Surfaces Mobile Prototype

React + TypeScript + Vite prototype of the Wise mobile app. Runs inside a DeviceFrame iframe (iPhone 17 Pro / Air / Pro Max, switchable via SegmentedControl). Covers Home, Cards, Transactions, Payments, Recipients, Team, Insights, Account, CurrentAccount, CurrencyPage for consumer and business account types.

## Rules

1. **Read before building.** Always read existing source files before modifying or creating components. Never guess at props, APIs, or patterns.
2. **Design system first.** Use `@transferwise/components` and `@transferwise/icons` for all UI. Check `mobile/design-system/components.md` before building anything custom.
3. **Use documented tokens only.** No hardcoded hex values, magic numbers, or ad-hoc CSS variables. Check `mobile/design-system/tokens.md` and `mobile/design-system/custom-tokens.md`.
4. **Check before creating.** Before building a new component or token, check `mobile/design-system/custom-components.md` and `mobile/design-system/custom-tokens.md` — it may already exist.
5. **Read design system docs on demand.** Detailed references live in `mobile/design-system/`. Read them when working on related areas — don't rely on memory.
6. **Commit message formatting.** No co-authored-by lines. Use `• ` (bullet character) for lists in commit bodies (renders in Slack notifications). Keep each bullet short and concise — no filler, just what changed.
7. **Shared data.** Balances, transactions, recipients, rates, jars, and account details live in `shared-resources/data/` at the repo root — edit data there, not locally. Only `src/data/nav.tsx` is platform-specific and stays local. Import shared data via `@shared/data/` (Vite alias).

## Quick Start

```bash
npm update       # update all packages to latest compatible versions
npm install
npm run dev      # local dev server
npm run build    # production build -> dist/
```

## Architecture

### Mobile-Only Layout

This prototype is **mobile-only** — no tablet or desktop layouts, no responsive breakpoints. `.page-layout` is constrained to `max-width: 440px` so the content always renders at mobile width regardless of viewport. On desktop, `DeviceFrame` wraps the app in an iPhone shell iframe (Pro: 402px, Air: 420px, Pro Max: 440px) at 85% scale; on narrow viewports (≤460px) the frame is bypassed and content renders directly. `column-layout-main` is the sole layout container.

```
DeviceFrame (iPhone 17 Pro/Air/Pro Max shell, loads ?mode=app in iframe)
└── column-layout-main (sole layout container)
    ├── IOSTopBar (fixed top, liquid glass buttons)
    ├── container-content (main page area, scrolls)
    │   └── PageTransition (push/pop slide animations)
    │       └── Page content
    └── MobileNav (fixed bottom tab bar, liquid glass)
```

CSS custom properties on `.column-layout-main`:
- `--content-pad-top: 112px` (IOSTopBar clearance)
- `--content-pad-bottom: 80px` (MobileNav clearance)
- `--content-pad-x: 16px` (horizontal padding)

### Navigation Chrome

- **IOSTopBar** — Fixed top bar with Liquid Glass buttons. Contextual leading (avatar/back) and trailing (earn, eye, charts) based on current page. See `mobile/design-system/ios-components.md`.
- **MobileNav** — Fixed bottom tab bar (Home, Cards, Recipients, Payments) with animated highlight pill and WebGL liquid glass background.
- **PageTransition** — iOS-style push/pop slide transitions between pages. 380ms with spring easing. See `mobile/design-system/ios-components.md` for how to add transitions to new navigations.

### Flow Overlays

All money flows (Send, Request, Convert, Add Money, Payment Link) use full-viewport overlays that slide up from the bottom. Managed in App.tsx with `flowVisible`/`flowAnimating` state and `cubic-bezier(0.32, 0.72, 0, 1)` spring easing.

### Routing

State-driven navigation with History API URL sync (no router library). **Every page must have a URL.** All URLs use 8-digit numeric IDs — no slugs, currency codes, or query params. Read `mobile/account-logic/routing.md` for the full URL reference, ID system, and instructions for adding new routes.

Key rules:
- `activeNavItem` (English label like `'Home'`) + `subPage` union type drive navigation state
- `parseUrl()` and `stateToPath()` in `App.tsx` sync URLs <-> state
- Group IDs in `GROUP_IDS` (`src/data/jar-data.tsx`), balance IDs on `CurrencyData.balanceId`
- `balanceOwnerMap` in `App.tsx` resolves any balance ID to its group automatically

### Context Providers (outermost first)

1. **`LanguageProvider`** (`src/context/Language.tsx`) — holds current language, exposes `t(key, vars?)`. Supports `{var}` interpolation and `{count, plural, one {x} other {y}}` syntax.
2. **`PrototypeNamesProvider`** (`src/context/PrototypeNames.tsx`) — holds editable consumer/business names.

### Account Types

`AccountType = 'personal' | 'business'` — toggled via PrototypeSettings or Account page. Each type has its own nav items (`personalNav` / `businessNav`), currency data, and transaction data.

### Account Type Hierarchy

There are 3 account types: **Current Account**, **Jar**, and **Group/Shared**. Each has different features (cards, account details, action buttons, more menu content). Read `mobile/account-logic/account-types.md` for the full reference and hard rules before modifying any account.

- **Current Account** — main account with cards, account details, Request button
- **Jar** — lightweight savings container (no cards, no account details, no Request). Data in `src/data/jar-data.tsx` (`JarDefinition` type). Uses `JarCard` on Home, not `MultiCurrencyAccountCard`.
- **Group/Shared** — multi-user account with cards + participants, no account details. The existing "Taxes" account (`shared-resources/data/taxes-data.tsx`) is a Group. Code uses `groupCurrencies` / `isGroup` — "Taxes" is just the display name.

### Balance rules

- **Total balance = current account + group + jar.** Use `computeTotalBalance()` from `shared-resources/data/balances.ts` — never hand-roll the sum.
- **No `formattedBalance` field.** Use `formatBalance(currency, 'symbol')` for `£948.70` or `formatBalance(currency)` for `948.70 GBP`.
- **All totals computed.** `groupTotalBalance`, `totalAccountBalance` use `.reduce()`. Never hardcode a balance total.

## i18n

- `src/translations/en.ts` — English strings, exported `as const`
- `src/translations/es.ts` — Spanish strings, typed as `Translations`
- **Translate**: UI chrome (labels, buttons, headers, descriptions, modals)
- **Don't translate**: names, currency codes, amounts, brand terms ("Wise"), Claude prompt strings

## Illustrations & Flags (`@wise/art`)

Use `@wise/art` for all illustrations and flags — they load from the Wise CDN, no local files needed.

**Flags** — use for currency/country indicators:
```tsx
import { Flag } from '@wise/art';
<Flag code="GBP" />
```

**Static illustrations** — 100+ options, use for promo banners, empty states, success screens:
```tsx
import { Illustration } from '@wise/art';
<Illustration name="confetti" size="large" />
```

**Animated 3D illustrations** — 13 options, use for celebration/success moments:
```tsx
import { Illustration3D } from '@wise/art';
<Illustration3D name="confetti" size="medium" />
```

Available 3D names: `lock`, `globe`, `confetti`, `check-mark`, `flower`, `graph`, `jars`, `magnifying-glass`, `marble`, `marble-card`, `multi-currency`, `plane`, `interest`

For the full list of static illustration names, check `node_modules/@wise/art/src/illustrations/metadata.ts`.

## Key Dependencies

- `@transferwise/components` — DS component library (Button, ListItem, SearchInput, SegmentedControl, etc.)
- `@transferwise/icons` — icon set
- `@wise/art` — flags, illustrations (static + animated 3D), loaded from Wise CDN
- `web-haptics` — haptic feedback (vibration on touch interactions)
- `agentation` — dev-only annotation toolbar
- React 18 + TypeScript + Vite

## Haptic Feedback

`triggerHaptic()` from `src/hooks/useHaptics.ts` provides vibration feedback on touch interactions via the `web-haptics` library.

**Where haptics fire:**
- **BottomSheet** — on open (inside `requestAnimationFrame` chain)
- **IOSTopBar more button** — on click (`onMore` callback in App.tsx)
- **PromotionBanner** — on click (inner container onClick)
- **Cards carousel** — on card tap (onClick) and swipe (touchmove when card changes)
- **TransferCalculator** — on currency selection

**Make compatibility:** In Make's WKWebView, `triggerHaptic()` only works from direct user gesture handlers (`onClick`, `touchmove`). It does NOT work from async callbacks (`rAF`, `useEffect`, `setTimeout`, `scroll` events). When adding new haptics, always trigger from a direct event handler.

## Figma Make (.make)

The `.make` file is generated by the converter at `/tmp/make-converter/convert.js`. Run:
```bash
node /tmp/make-converter/convert.js mobile --name "Mobile V1.0"
```

**Versioning:** Builds live in `makes/` with a version README. Versions increment as V1.0, V1.01, V1.02, etc. Only push a new version when the build is confirmed working. See `makes/README.md` for the version history and download links.

Key Make-specific behaviors:
- **Portal stripping** — `createPortal` is removed, so BottomSheet renders inline inside parent containers (not at `document.body`). CSS overrides in `MAKE_OVERRIDES` fix cascade conflicts.
- **DeviceFrame** — iframe replaced with direct `<div className="df-screen-content">{children}</div>`. The `df-screen-area` has `transform: translate3d(0,0,0)` creating a new containing block for `position: fixed`.
- **Scroll forwarding** — In frame mode, `.page-layout` scrolls (not `window`), so the converter overrides `window.scrollY` to forward `.page-layout.scrollTop`.
- **Fixed positioning** — Use CSS `left: 50%` with `translateX(-50%)` for centering, not JS `getBoundingClientRect()` (which returns viewport coords, wrong inside the transformed container).
- **Flow overlays** — `inset: 0` replaced with longhand `top: 0; left: 0; right: 0; height: 100vh` to prevent keyboard push on mobile.

## Design System Reference

Account logic docs in `shared-resources/account-logic/` — platform-agnostic business rules shared across prototypes:

| Doc | Contents |
|-----|----------|
| `account-types.md` | Account type hierarchy (Current, Jar, Group/Shared), feature matrix, action button logic, more menu logic, visual alignment rules |
| `interest-stocks.md` | Interest/stocks feature flag system (hasInterest, hasStocks, interestRate, totalReturns) |
| `routing.md` | Full URL reference, ID system (group IDs + balance IDs), and how to add new routes |

Design system docs in `mobile/design-system/` — read these when working on related areas:

| Doc | Contents |
|-----|----------|
| `tokens.md` | Neptune color, typography, spacing tokens |
| `custom-tokens.md` | Prototype-specific extended tokens |
| `components.md` | Neptune component inventory and usage patterns |
| `custom-components.md` | Home page components (MCA, JarCard, Carousel, Tasks, etc.) |
| `custom-components-account.md` | Account & currency page components (header, actions, calculator, etc.) |
| `custom-components-flows.md` | Flow overlays, i18n, ButtonCue, shimmer system, success screens |
| `ios-components.md` | iOS-specific components (IOSTopBar, MobileNav, PageTransition, BottomSheet, DeviceFrame, Liquid Glass) |
| `page-structure.md` | Mobile layout shell, navigation chrome, CSS custom properties |
| `src/flows/structure.md` | Flow overlay architecture, ButtonCue pattern, avatar styles, button state machine |
