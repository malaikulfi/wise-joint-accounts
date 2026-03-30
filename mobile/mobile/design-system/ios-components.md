# iOS Components

Custom components that replicate native iOS patterns. These sit on top of the Neptune Design System — page content still uses Neptune components, but the navigation shell and chrome use these.

## IOSTopBar

**File:** `src/components/IOSTopBar.tsx`
**CSS:** `.ios-top-bar`, `.ios-top-bar__fade`, `.ios-top-bar__bar`, `.ios-top-bar__spacer`, `.ios-top-bar__scroll-title`, `.ios-top-bar__trailing`, `.ios-top-bar__center-title`, `.ios-top-bar__detail-flag`

Fixed header bar positioned at the top of the viewport. Renders contextual leading/trailing buttons based on the current page. Sits above a gradient fade that dims content scrolling underneath.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `name` | `string` | User's display name (for avatar) |
| `initials` | `string` | Fallback initials for avatar |
| `avatarUrl` | `string?` | Profile image URL |
| `onAccountClick` | `() => void` | Navigate to Account page |
| `showBack` | `boolean` | Show back button instead of avatar |
| `onBack` | `() => void` | Back button handler |
| `hideAccountSwitcher` | `boolean` | Hide avatar on Home |
| `activeNavItem` | `string` | Current tab (Home, Cards, etc.) |
| `subPageType` | `string?` | Drill-down page type |
| `subPageCode` | `string?` | Currency code for account detail pages |
| `scrollTitle` | `string?` | Centered title shown on scroll |
| `accountType` | `'personal' \| 'business'` | Controls business-specific buttons |
| `onInsightsClick` | `() => void` | Navigate to Insights |

### Internal components

- `GlassCircle` — circle glass button (back, action icons)
- `GlassPill` — pill-shaped glass button (labels, compound icon+text)
- `BackButton` — GlassCircle with ArrowLeft icon
- `EyeShutIcon` / `EyeOpenIcon` — custom SVGs using `fill="currentColor"` for theme adaptation

---

## Liquid Glass Buttons

**CSS classes:** `.ios-glass-btn`, `.ios-glass-btn--circle`, `.ios-glass-btn--pill`, `.ios-glass-btn--capsule`, `.ios-glass-btn--accent`, `.ios-glass-btn--avatar`

Frosted glass buttons matching Apple's iOS 26 Liquid Glass design language. All variants use `useLiquidGlass` for spring-physics interaction.

### Variants

| Class | Description |
|-------|-------------|
| `--circle` | 44px round button. Back arrows, single icons. |
| `--pill` | Rounded capsule with text and/or icon. Height 44px, padding 0 12px. |
| `--capsule` | Pill with icon-only content, wider spacing (padding 0 14px, gap 14px). |
| `--accent` | Green primary fill. Uses `--color-interactive-accent` bg, `--color-interactive-control` for text/icons. |
| `--avatar` | No glass — transparent background, holds an AvatarView. |

### Inner elements

| Class | Description |
|-------|-------------|
| `.ios-glass-btn__icon` | 22x22 icon wrapper. Uses `color: inherit`. |
| `.ios-glass-btn__label` | 16px semibold text label. Uses `color: inherit`. |

### Dark mode

All glass buttons use `color: inherit` for icons and labels. The parent button sets the color:
- Regular buttons: `color: #fff` (set by dark mode `.ios-glass-btn` rule)
- Accent buttons: `color: var(--color-interactive-control)` (dark green, overrides the white)

Custom SVGs must use `fill="currentColor"` to inherit the button color in both themes.

---

## useLiquidGlass Hook

**File:** `src/hooks/useLiquidGlass.ts`

Spring-physics interaction hook for Liquid Glass buttons. Returns `{ ref, onPointerDown, onPointerMove, onPointerUp }` — attach all four to the button element.

### Behavior
- Pointer drag causes the button to follow with spring physics (translate + scale)
- Press scales up slightly (6%) with brightness increase
- Circle/pill buttons become more transparent when pressed
- Shadow softens and lifts on press
- Accent buttons only brighten (no transparency change — keeps the green solid)
- All inline styles are cleaned up when the spring settles

### Constants
| Name | Value | Description |
|------|-------|-------------|
| `SPRING` | 0.02 | Spring stiffness |
| `DAMP` | 0.88 | Velocity damping |
| `MAX_PULL` | 12px | Max drag distance |
| `STRETCH` | 0.012 | Scale multiplier per pixel of drag |

---

## useLiquidGL Hook

**File:** `src/hooks/useLiquidGL.ts`

WebGL-based liquid glass effect using the `liquidGL` library. Used for the mobile tab bar background — provides real refraction/frost/bevel/specular effects by capturing a snapshot of the page behind the element.

### Options
| Prop | Default | Description |
|------|---------|-------------|
| `refraction` | — | Refraction strength |
| `bevelDepth` | — | Bevel depth |
| `bevelWidth` | — | Bevel edge width |
| `frost` | — | Frost/blur intensity (0–1) |
| `shadow` | — | Enable drop shadow |
| `specular` | — | Enable specular highlight |

Returns a `ref` to attach to the glass element. Depends on `html2canvas` for page snapshot and `src/lib/liquidGL.js` for WebGL rendering.

---

## MobileNav

**File:** `src/components/MobileNav.tsx`
**CSS:** `.mobile-nav`, `.mobile-nav__items`, `.mobile-nav-item`, `.mobile-nav-item__link`, `.mobile-nav-item__icon`, `.mobile-nav-item__label`, `.mobile-nav__highlight`, `.mobile-nav__highlight--glass`, `.mobile-nav__glass`

Fixed bottom tab bar with 4 items: Home, Cards, Recipients, Payments. Features an animated highlight pill that slides between tabs with a multi-phase liquid glass animation.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `activeItem` | `string` | Currently active tab label |
| `onSelect` | `(label: string) => void` | Tab selection handler |

### Animation phases (tab switch)

1. **Glass up** — highlight becomes glass (white/translucent) at current position
2. **Slide** — highlight slides to new tab position, expanding wider (+16px)
3. **Arrive** — fires tab change callback
4. **Shrink** — highlight shrinks back to tab width, loses glass effect, returns to grey

### Elements

| Element | Description |
|---------|-------------|
| `.mobile-nav__glass` | WebGL liquid glass background (via `useLiquidGL`) positioned behind the nav |
| `.mobile-nav__highlight` | Sliding background pill behind the active tab |
| `.mobile-nav__highlight--glass` | Glass phase of the highlight during animation |

### Visibility

Hidden on specific pages (Transactions, Insights) via conditional rendering in `App.tsx`.

### Dark mode

| Element | Light | Dark |
|---------|-------|------|
| Nav background | `rgba(255,255,255,0.8)` | `rgba(40,40,40,0.75)` |
| Glass background | `rgba(255,255,255,0.82)` | `rgba(40,40,40,0.78)` |
| Default highlight | `rgba(0,0,0,0.06)` | `rgba(255,255,255,0.1)` |
| Glass highlight | `rgba(255,255,255,0.85)` | `rgba(255,255,255,0.15)` |

---

## FlowHeader

**File:** `src/components/FlowHeader.tsx`
**CSS:** `.flow-header`, `.flow-header__fade`, `.flow-header__bar`, `.flow-header__spacer`, `.flow-header__trailing`

Top bar for full-screen flows (Send, Request, Convert, Add Money). Same fade pattern as IOSTopBar but used inside flow overlays. Exports `GlassCircle` and `GlassPill` for reuse.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `onClose` | `() => void` | Close flow |
| `onBack` | `() => void?` | Show back button instead of close |
| `trailing` | `ReactNode?` | Trailing content (e.g., rate display) |

---

## BottomSheet

**File:** `src/components/BottomSheet.tsx`
**CSS:** `.wise-bottom-sheet`, `.wise-bottom-sheet__backdrop`, `.wise-bottom-sheet__header`, `.wise-bottom-sheet__close`, `.wise-bottom-sheet__content`

iOS-style bottom sheet with pan-to-dismiss gesture. Renders via portal to `document.body`.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `open` | `boolean` | Controls visibility |
| `onClose` | `() => void` | Dismiss handler |
| `title` | `string?` | Header title |
| `subtitle` | `string?` | Header subtitle |
| `children` | `ReactNode` | Sheet content |

### Behavior

- Slides up from bottom with spring animation
- Pan gesture on header/background dismisses if dragged > 100px
- Backdrop scrim: `rgba(0,0,0,0.4)` light, `var(--color-background-overlay)` dark
- Sheet is inset 20px from bottom with 24px border radius

---

## Account Card Carousel

**File:** `src/components/Carousel.tsx`
**CSS:** `.acct-carousel`, `.acct-carousel__track`, `.acct-carousel__nav`, `.acct-carousel__dots`

Horizontal card carousel for the Home page account cards. Uses snap scrolling with dot indicators.

### Important

Class names use `acct-carousel` (NOT `carousel`) to avoid conflicts with `@transferwise/components` built-in carousel CSS which sets `overflow-x: scroll; overflow-y: hidden` on `.carousel`.

### Mobile behavior

- Track uses the full-bleed scroll pattern (`margin: 0 -16px; padding: 0 16px`)
- Cards are 338px wide with 16px gap
- Scroll snap with dot indicators
- `::after` pseudo-element provides right scroll padding

---

## DeviceFrame

**File:** `src/DeviceFrame.tsx`

Renders the app inside a device frame when the viewport is wider than 460px. The app content loads in an iframe at `?mode=app`. On mobile (≤460px), the frame is bypassed and the app renders directly at full native size.

### Device Picker

A Neptune `SegmentedControl` fixed to the top-right corner lets users switch between three devices:

| Device | Frame | Screen | Offset | Image |
|--------|-------|--------|--------|-------|
| iPhone 17 Pro | 450×920 | 402×874 | (24, 23) | `/iphone17pro-frame.png` |
| iPhone Air | 460×960 | 420×912 | (20, 24) | `/iphoneair-frame.png` |
| iPhone 17 Pro Max | 490×1000 | 440×956 | (25, 22) | `/iphone17promax-frame.png` |

**DeviceFrame scale:** On wider viewports, devices render at **85%** scale inside the DeviceFrame to approximate real-life phone size. The iframe internal viewport is still the exact screen dimensions (no CSS scaling on the iframe content), so the app sees the true device width.

### Elements

| Element | Description |
|---------|-------------|
| `.df-wrap` | Centered container, fills viewport, adapts background to theme |
| `.df-picker` | Fixed top-right container for the SegmentedControl |
| `.df-phone` | Phone body sizer (85% scale) |
| `.df-phone__inner` | Inner container at full device size, `transform: scale(0.90)` |
| `.df-frame-img` | iPhone frame PNG overlay |
| `.df-screen-area` | Clipped screen area (55px border radius, white background) |
| `.df-status-bar` | iOS status bar with real time, cellular, wifi, battery |

### Dark mode

- Status bar time: `color: #fff`
- Status bar icons: `filter: invert(1)`
- Frame shadow adapts automatically (uses `drop-shadow`)

---

## PageTransition

**File:** `src/components/PageTransition.tsx`
**CSS:** `.page-layer`, `.page-layer--old--push`, `.page-layer--new--push`, `.page-layer--old--pop`, `.page-layer--new--pop`, `.page-layer--animate`

Manages iOS-style push/pop slide transitions between pages. Wraps page content inside `container-content`. When a navigation with direction occurs, it snapshots the old page, renders both old and new pages as absolutely-positioned layers, and animates them with CSS transitions.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `children` | `ReactNode` | Current page content |
| `direction` | `'push' \| 'pop' \| null` | Transition direction, set by navigation handlers |
| `onComplete` | `() => void` | Called when animation finishes — must reset direction to `null` |

### How to add push/pop to a new navigation

1. In the navigation handler, call `setTransitionDirection('push')` alongside the state change (React 18 batches them into one render):
   ```tsx
   const handleNavigateSomePage = () => {
     setTransitionDirection('push');
     setSubPage({ type: 'some-page' });
   };
   ```
2. In `handleSubPageBack`, set `setTransitionDirection('pop')` for the reverse:
   ```tsx
   } else if (subPage?.type === 'some-page') {
     animated = true;
     setTransitionDirection('pop');
     setSubPage(null);
   }
   ```
3. If the back handler sets `animated = true`, it skips the default `window.scrollTo(0)` at the bottom of `handleSubPageBack`.

No CSS changes needed — the transition layers inherit their padding from CSS custom properties that stay in sync automatically.

### CSS custom properties (auto-sync)

The page layers use the same CSS variables as the normal layout, so padding never drifts out of sync:

| Variable | Set on | Value |
|----------|--------|-------|
| `--content-pad-top` | `.column-layout-main` | `112px` |
| `--content-pad-bottom` | `.column-layout-main` | `80px` |
| `--content-pad-x` | `.column-layout-main` | `16px` |

`.container-content` and `.page-layer` both read these variables. Changing a value in one place updates both — no manual syncing required.

### Animation spec

| Property | Value |
|----------|-------|
| Duration | 380ms |
| Easing | `cubic-bezier(0.32, 0.72, 0, 1)` (iOS spring approximation) |
| Push old | `translateX(0)` to `translateX(-30%)`, opacity 1 to 0.5 |
| Push new | `translateX(100%)` to `translateX(0)`, opacity 0.85 to 1, left shadow + border-radius |
| Pop old | `translateX(0)` to `translateX(100%)`, opacity 1 to 0.85, border-radius appears |
| Pop new | `translateX(-30%)` to `translateX(0)`, opacity 0.5 to 1 |

### Scroll handling

- **Push:** Captures `window.scrollY`, freezes old layer with `top: -scrollY`, scrolls window to 0
- **Pop:** Restores saved scroll position after animation completes
- Old layer's scroll freeze uses inline `top` style, not CSS class

### During transition

- `.column-layout-main` gets `overflow: hidden` and `padding-left/right: 0` (layers provide their own horizontal padding)
- `.container-content` gets `position: relative` (positioning context for layers)
- Both rules use `:has(.page-layer)` and only apply when layers exist in the DOM

---

## Haptic Feedback

**File:** `src/hooks/useHaptics.ts`

Provides `triggerHaptic()` function using the `web-haptics` library. Adds tactile feedback to interactive elements throughout the app.

### Usage locations

| Component | Trigger |
|-----------|---------|
| BottomSheet | On open |
| PromotionBanner | onClick |
| Cards carousel | onClick + touchmove |
| IOSTopBar more button | onClick |

### Make WKWebView constraint

In Make's WKWebView, haptics only work from **direct user gesture handlers** (`onClick`, `touchmove`). They will not fire from async callbacks, `setTimeout`, `requestAnimationFrame`, or promise chains. Always call `triggerHaptic()` synchronously inside the gesture handler.

---

## Back-to-Top Button

**CSS class:** `.back-to-top`

Fixed-position button that appears after scrolling past a threshold. Scrolls the page back to the top on click.

### Positioning

```css
.back-to-top {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
}
```

### Behavior

- Appears when `window.scrollY > 400`
- Implemented in Transactions, CurrencyPage, and CurrentAccount pages
