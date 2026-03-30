# Custom Tokens

All custom color values, CSS variables, and non-DS typography used across prototypes.
These extend the Neptune Design System for cases where core tokens don't provide what's needed.

---

## Custom CSS Variables (light/dark)

Tokens defined in `:root` and overridden per dark theme. `--color-background-neutral` is semi-transparent, so these provide solid hex equivalents computed against each theme's screen color.

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--color-background-neutral-solid` | `#EDF0EA` | `#2A2C29` | TaskCard bg, solid neutral surfaces |
| `--color-background-neutral-solid-secondary` | `#E2E2E1` | `#424441` | TasksStack placeholder |
| `--color-mca-background` | `#F3F4F3` | `#2A2C29` | MCA card and cutout SVG fill |
| `--color-forest-green` | `#163300` | `#163300` | Insights interest avatar bg, business nav bg, FastFlag badge |
| `--color-sage-green` | `#CBD9C3` | `#CBD9C3` | Insights stocks avatar bg, interest avatar icon color |
| `--transfer-chart-line-color` | `var(--color-content-primary)` | `var(--color-interactive-primary)` | Chart line stroke |

```css
:root {
  --color-background-neutral-solid: #EDF0EA;
  --color-background-neutral-solid-secondary: #E2E2E1;
  --color-mca-background: #F3F4F3;
  --color-forest-green: #163300;
  --color-sage-green: #CBD9C3;
}

html.np-theme-personal--dark,
html.np-theme-dark {
  --color-background-neutral-solid: #2A2C29;
  --color-background-neutral-solid-secondary: #424441;
  --color-mca-background: #2A2C29;
  --color-forest-green: #163300;
  --color-sage-green: #CBD9C3;
}

.transfer-calculator {
  --transfer-chart-line-color: var(--color-content-primary);
}

html[class*="dark"] .transfer-calculator {
  --transfer-chart-line-color: var(--color-interactive-primary);
}
```

### Derivation

- Light neutral: `rgba(22,51,0,0.08)` on `#FFFFFF` screen = `#EDF0EA`
- Dark neutral: `rgba(255,255,255,0.10)` on `#121511` screen = `#2A2C29`
- MCA light: `#F3F4F3` (hardcoded, not derived from a DS token)

---

## Hardcoded Colors

Colors used inline or in CSS that are not DS tokens and not defined as custom variables.

| Light | Dark | Usage |
|-------|------|-------|
| `rgb(232, 235, 231)` | `rgb(35, 38, 32)` | Empty account card header (`.mca-cards__empty-card`) |
| `#9FE870` | `#9FE870` | Wise logo fill (dark sidebar), bright green accent (camera badge, plus badge, promotion arrow) |
| `#EDEFEC` | `#2B2D29` | Swap button bg (`.currency-input-group__swap-btn`) |
| `#E2E4E0` | `#363832` | Swap button hover bg |
| `rgba(219, 224, 217, 0.7)` | same | Banner dismiss button (`.promotion-banner__dismiss`) |
| `#163300` | `#163300` | Forest green (FastFlag badge, card link, promotion arrow text, insights interest avatar, business account avatar) |
| `#FFEB69` | `#FFEB69` | Taxes jar account avatar background |
| `#3a341c` | `#3a341c` | Taxes jar account avatar icon color |
| `rgba(0, 0, 0, 0.6)` | same | SidebarOverlay scrim (`.sidebar-overlay__scrim`) |
| `#CBD9C3` | `#CBD9C3` | Insights interest avatar icon color, stocks avatar bg |
| `#9ae86a` | `#9ae86a` | Physical card thumbnail bg (`.card-thumbnail--physical`) |
| `#9fe870` | `#9fe870` | Interest/stocks active list item avatar bg (currency page InterestListItem) |

---

## Flow-Specific Overrides

### Flow Loading Button

Buttons in loading state across all flows use:
```css
mix-blend-mode: luminosity;
opacity: 0.45;
cursor: not-allowed;
```

### ButtonCue Disabled Override

Overrides the DS primary button disabled style within `.button-cue`:
```css
background-color: var(--color-background-neutral);
color: var(--color-content-secondary);
border-color: transparent;
pointer-events: none;
```

---

## Custom Typography

Non-DS typography values used in custom components.

| Property | Value | Context |
|----------|-------|---------|
| Font family | `'Inter', sans-serif` | MobileNav tab labels (`.mobile-nav-item__label`) |
| Font size | `10px` | MobileNav tab labels |
| Letter spacing | `0.2px` | MobileNav tab labels |
| Font family | `'Wise Sans', sans-serif` | Account page name (`.account-page__name`) |
| Font size | `38px` | Account page name |
| Letter spacing | `0.5px` | Account page name |
| Font size | `40px` | Account header balance (`.account-header__balance`) |
| Letter spacing | `-0.5px` | Account header balance |
| Font size | `18px` | InterestRateCard value (`.interest-rate-card__value`) |
| Font weight | `600` | InterestRateCard value |
| Letter spacing | `-0.01em` | InterestRateCard value |
| Font size | `12px` | Caption text (`.np-text-caption`, `.np-text-caption-bold`, `.np-text-link-caption`) |
| Line height | `16px` | Caption text |
| Font weight | `400` / `600` / `600` | Caption / Caption bold / Link caption |

---

## Business Theme

Colors specific to business account presentation. These are not DS tokens — they're hardcoded for business-specific UI.

| Value | Usage |
|-------|-------|
| `#163300` | Business nav sidebar bg, forest green brand color |
| `#CBD9C3` | Business nav icon color, stocks avatar bg |
