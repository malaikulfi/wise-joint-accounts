# Design Tokens

> Source: `@transferwise/neptune-tokens` v8.20.3
> npm: npmjs.com/package/@transferwise/neptune-tokens
> GitHub: github.com/transferwise/neptune-tokens (private)
> Token source path: `tokens/`

## Usage

CSS custom properties (preferred):
```css
color: var(--color-content-primary);
padding: var(--padding-small);
font-size: var(--font-size-16);
border-radius: var(--radius-medium);
```

---

## Colors

### Base Palette

From `tokens/colors/base.json`. Each color has shades: `light`, `mid`, `dark`, and `fade` (10% opacity).

| Base | Light | Mid | Dark | Fade |
|------|-------|-----|------|------|
| `blue` | `#00b9ff` | `#00a2dd` | `#0097c7` | `#38c8ff` @ 10% |
| `green` | `#6fd698` | `#2ead4b` | `#008026` | `#36c797` @ 10% |
| `red` | `#ffa6a9` | `#e74848` | `#cf2929` | `#ff8787` @ 10% |
| `orange` | `#ffd184` | `#df8700` | `#9a6500` | `#ffac00` @ 10% |
| `smoke` | `#e2e6e8` | `#c9cbce` | `#a8aaac` | `#86a7bd` @ 10% |
| `grey` | `#829ca9` | `#768e9c` | `#5d7079` | `#829ca9` @ 10% |
| `white` | `#ffffff` | `#ebebeb` | — | `#ffffff` @ 10% |
| `black` | `#202020` | `#181818` | `#000000` | `#000000` @ 10% |

CSS variable pattern: `--color-base-{color}-{shade}`, e.g. `--color-base-blue-light`.

### Brand Colors

| Token | Hex | Description |
|-------|-----|-------------|
| `--color-base-brand-borderless` | `#44ee70` | Borderless green |
| `--color-base-brand-purple` | `#485cc7` | Brand purple |
| `--color-base-brand-amber` | `#ffb619` | Brand amber/gold |

---

### Semantic Color Tokens

Semantic tokens are theme-aware — values change per theme. Use these instead of base palette values.

#### Content

| Token | Role |
|-------|------|
| `--color-content-primary` | Primary body text |
| `--color-content-secondary` | Secondary/supporting text |
| `--color-content-tertiary` | Tertiary/muted text |
| `--color-content-link` | Link text |
| `--color-content-link-hover` | Link hover state |
| `--color-content-link-active` | Link active/pressed state |

#### Interactive

| Token | Role |
|-------|------|
| `--color-interactive-primary` | Primary interactive (buttons) |
| `--color-interactive-primary-hover` | Primary hover |
| `--color-interactive-primary-active` | Primary active/pressed |
| `--color-interactive-secondary` | Secondary interactive |
| `--color-interactive-secondary-hover` | Secondary hover |
| `--color-interactive-secondary-active` | Secondary active/pressed |
| `--color-interactive-accent` | Accent interactive |
| `--color-interactive-accent-hover` | Accent hover |
| `--color-interactive-accent-active` | Accent active/pressed |
| `--color-interactive-control` | Form controls |
| `--color-interactive-control-hover` | Control hover |
| `--color-interactive-control-active` | Control active/pressed |
| `--color-interactive-contrast` | Contrast interactive (on dark surfaces) |
| `--color-interactive-contrast-hover` | Contrast hover |
| `--color-interactive-contrast-active` | Contrast active/pressed |
| `--color-interactive-neutral` | Neutral interactive |
| `--color-interactive-neutral-hover` | Neutral hover |
| `--color-interactive-neutral-active` | Neutral active/pressed |

#### Background

| Token | Role |
|-------|------|
| `--color-background-screen` | Page/screen background |
| `--color-background-screen-hover` | Screen hover |
| `--color-background-screen-active` | Screen active/pressed |
| `--color-background-elevated` | Elevated surface (cards, modals) |
| `--color-background-neutral` | Subtle neutral background |
| `--color-background-neutral-hover` | Neutral background hover |
| `--color-background-neutral-active` | Neutral background active/pressed |
| `--color-background-overlay` | Overlay/scrim background |

#### Border

| Token | Role |
|-------|------|
| `--color-border-neutral` | Default border |
| `--color-border-overlay` | Overlay border |

#### Sentiment

| Token | Role |
|-------|------|
| `--color-sentiment-negative` | Error/destructive |
| `--color-sentiment-negative-hover` | Error hover |
| `--color-sentiment-negative-active` | Error active/pressed |
| `--color-sentiment-negative-primary` | Error primary action |
| `--color-sentiment-negative-primary-hover` | Error primary hover |
| `--color-sentiment-negative-primary-active` | Error primary active/pressed |
| `--color-sentiment-negative-secondary` | Error secondary/background |
| `--color-sentiment-negative-secondary-hover` | Error secondary hover |
| `--color-sentiment-negative-secondary-active` | Error secondary active/pressed |
| `--color-sentiment-positive` | Success |
| `--color-sentiment-positive-hover` | Success hover |
| `--color-sentiment-positive-active` | Success active/pressed |
| `--color-sentiment-positive-primary` | Success primary action |
| `--color-sentiment-positive-primary-hover` | Success primary hover |
| `--color-sentiment-positive-primary-active` | Success primary active/pressed |
| `--color-sentiment-positive-secondary` | Success secondary/background |
| `--color-sentiment-positive-secondary-hover` | Success secondary hover |
| `--color-sentiment-positive-secondary-active` | Success secondary active/pressed |
| `--color-sentiment-warning` | Warning |
| `--color-sentiment-warning-hover` | Warning hover |
| `--color-sentiment-warning-active` | Warning active/pressed |
| `--color-sentiment-warning-primary` | Warning primary action |
| `--color-sentiment-warning-secondary` | Warning secondary/background |
| `--color-sentiment-warning-content` | Warning text on warning background |

#### Base / Contrast

| Token | Role |
|-------|------|
| `--color-base-contrast` | High contrast color |
| `--color-base-light` | Theme light base |
| `--color-base-dark` | Theme dark base |
| `--color-contrast-overlay` | Contrast for overlays |
| `--color-contrast-theme` | Contrast against theme background |

---

### Expressive Colors (Personal / Business / Platform)

Shared across product themes. Used for illustrations, marketing, and expressive UI.

| Token | Hex | Usage |
|-------|-----|-------|
| `bright-green` | `#9FE870` | Primary accent, highlights |
| `forest-green` | `#163300` | Primary interactive, text |
| `bright-yellow` | `#ffeb69` | Expressive accents |
| `bright-orange` | `#FFC091` | Expressive accents |
| `bright-blue` | `#a0e1e1` | Expressive accents |
| `bright-pink` | `#FFD7EF` | Expressive accents |
| `dark-purple` | `#260A2F` | Dark expressive |
| `dark-gold` | `#3a341c` | Dark expressive |
| `dark-charcoal` | `#21231d` | Dark expressive |
| `dark-maroon` | `#320707` | Dark expressive |

---

### Theme Variants

From `tokens/colors/themes/`. Each theme file defines its own semantic token values.

| Theme | File | Product Line |
|-------|------|--------------|
| Light | `light.json` | Core (legacy) |
| Dark | `dark.json` | Core (legacy) |
| Navy | `navy.json` | Core (legacy) |
| Personal | `personal.json` | Consumer product |
| Personal (dark) | `personal--dark.json` | Consumer product |
| Personal (bright-green) | `personal--bright-green.json` | Consumer product |
| Personal (forest-green) | `personal--forest-green.json` | Consumer product |
| Business | `business.json` | Business product |
| Business (dark) | `business--dark.json` | Business product |
| Business (bright-green) | `business--bright-green.json` | Business product |
| Business (forest-green) | `business--forest-green.json` | Business product |
| Platform | `platform.json` | Platform product |
| Platform (forest-green) | `platform--forest-green.json` | Platform product |

---

## Sizes

From `tokens/sizes/base.json`.

### Numeric Sizes

| Token | Value |
|-------|-------|
| `--size-4` | 4px |
| `--size-5` | 5px |
| `--size-8` | 8px |
| `--size-10` | 10px |
| `--size-12` | 12px |
| `--size-14` | 14px |
| `--size-16` | 16px |
| `--size-24` | 24px |
| `--size-32` | 32px |
| `--size-40` | 40px |
| `--size-48` | 48px |
| `--size-52` | 52px |
| `--size-56` | 56px |
| `--size-60` | 60px |
| `--size-64` | 64px |
| `--size-72` | 72px |
| `--size-80` | 80px |
| `--size-88` | 88px |
| `--size-96` | 96px |
| `--size-104` | 104px |
| `--size-112` | 112px |
| `--size-120` | 120px |
| `--size-126` | 126px |
| `--size-128` | 128px |
| `--size-146` | 146px |
| `--size-154` | 154px |
| `--size-160` | 160px |

### Named Sizes

| Token | Resolves To |
|-------|-------------|
| `--size-x-small` | 24px (`--size-24`) |
| `--size-small` | 32px (`--size-32`) |
| `--size-medium` | 40px (`--size-40`) |
| `--size-large` | 48px (`--size-48`) |
| `--size-x-large` | 56px (`--size-56`) |
| `--size-2x-large` | 72px (`--size-72`) |

---

## Spacing

From `tokens/spaces/base.json`.

| Token | Resolves To |
|-------|-------------|
| `--space-content-horizontal` | 16px (`--size-16`) |
| `--space-small` | 16px (`--size-16`) |
| `--space-medium` | 32px (`--size-32`) |
| `--space-large` | 40px (`--size-40`) |
| `--space-x-large` | 56px (`--size-56`) |

---

## Padding

From `tokens/padding/base.json`.

| Token | Resolves To |
|-------|-------------|
| `--padding-x-small` | 8px (`--size-8`) |
| `--padding-small` | 16px (`--size-16`) |
| `--padding-medium` | 24px (`--size-24`) |
| `--padding-large` | 32px (`--size-32`) |

---

## Border Radius

From `tokens/radius/base.json`.

| Token | Value |
|-------|-------|
| `--radius-small` | 10px (`--size-10`) |
| `--radius-medium` | 16px (`--size-16`) |
| `--radius-large` | 24px (`--size-24`) |
| `--radius-full` | 9999px |

---

## Typography

From `tokens/typography/base.json`.

### Font Families

| Token | Value |
|-------|-------|
| `--font-family-regular` | `'Inter', Helvetica, Arial, sans-serif` |
| `--font-family-display` | `'Wise Sans', 'Inter', sans-serif` |

### Font Sizes

| Token | Value |
|-------|-------|
| `--font-size-12` | 12px |
| `--font-size-14` | 14px |
| `--font-size-16` | 16px (body default) |
| `--font-size-18` | 18px |
| `--font-size-20` | 20px |
| `--font-size-22` | 22px |
| `--font-size-24` | 24px |
| `--font-size-26` | 26px |
| `--font-size-28` | 28px |
| `--font-size-30` | 30px |
| `--font-size-32` | 32px |

### Font Weights

| Token | Value | Usage |
|-------|-------|-------|
| `--font-weight-light` | 300 | Light/thin text |
| `--font-weight-regular` | 400 | Default body text |
| `--font-weight-medium` | 500 | Emphasized body text |
| `--font-weight-semi-bold` | 600 | Labels, subheadings |
| `--font-weight-bold` | 700 | Headings |
| `--font-weight-black` | 900 | Display/hero text |

### Line Heights

#### Named

| Token | Value | Usage |
|-------|-------|-------|
| `--line-height-title` | 1.2 | Headings |
| `--line-height-body` | 1.5 | Body text |
| `--line-height-control` | 1.2 | Buttons, form controls |

#### Numeric (px)

| Token | Value |
|-------|-------|
| `--line-height-18` | 18px |
| `--line-height-20` | 20px |
| `--line-height-22` | 22px |
| `--line-height-24` | 24px |
| `--line-height-28` | 28px |
| `--line-height-30` | 30px |
| `--line-height-32` | 32px |
| `--line-height-34` | 34px |
| `--line-height-36` | 36px |
| `--line-height-42` | 42px |
| `--line-height-48` | 48px |

### Letter Spacing

| Token | Value |
|-------|-------|
| `--letter-spacing-xxs` | 0.005em |
| `--letter-spacing-xs` | 0.01em |
| `--letter-spacing-sm` | 0.0125em |
| `--letter-spacing-md` | 0.015em |
| `--letter-spacing-lg` | 0.02em |
| `--letter-spacing-xl` | 0.025em |
| `--letter-spacing-negative-xxs` | -0.005em |
| `--letter-spacing-negative-xs` | -0.01em |
| `--letter-spacing-negative-sm` | -0.0125em |
| `--letter-spacing-negative-md` | -0.015em |
| `--letter-spacing-negative-lg` | -0.02em |
| `--letter-spacing-negative-xl` | -0.025em |
| `--letter-spacing-negative-xxl` | -0.03em |
| `--letter-spacing-negative-xxxl` | -0.04em |
| `--letter-spacing-negative-xxxxl` | -0.05em |

---

## Typography Style Presets (Product)

Composite text styles that map each role to specific font, weight, size, line-height, and letter-spacing tokens. Use these combinations for consistent text hierarchy.

### Display (Wise Sans, Bold)

| Preset | Font | Weight | Size | Line Height | Letter Spacing |
|--------|------|--------|------|-------------|----------------|
| Display Large | `--font-family-display` | `--font-weight-bold` (700) | 96px | 85% (~82px) | 2% |
| Display Medium | `--font-family-display` | `--font-weight-bold` (700) | 64px | 85% (~54px) | 1.5% |
| Display Small | `--font-family-display` | `--font-weight-bold` (700) | 40px | 85% (~34px) | 1.5% |

> Reserve Wise Sans in product UI for success confirmations, progress indicators, and feature introductions.

### Titles (Inter, Semi Bold)

| Preset | Weight | Size | Line Height | Letter Spacing |
|--------|--------|------|-------------|----------------|
| Title Screen | `--font-weight-semi-bold` (600) | `--font-size-30` | `--line-height-34` | `--letter-spacing-negative-xl` (-0.025em) |
| Title Section | `--font-weight-semi-bold` (600) | `--font-size-26` | `--line-height-32` | `--letter-spacing-negative-md` (-0.015em) |
| Title Subsection | `--font-weight-semi-bold` (600) | `--font-size-22` | `--line-height-28` | `--letter-spacing-negative-sm` (-0.0125em) |
| Title Body | `--font-weight-semi-bold` (600) | `--font-size-18` | `--line-height-24` | `--letter-spacing-negative-xs` (-0.01em) |
| Title Group | `--font-weight-medium` (500) | `--font-size-14` | `--line-height-20` | `--letter-spacing-md` (0.015em) |

### Body (Inter, Regular / Semi Bold)

| Preset | Weight | Size | Line Height | Letter Spacing |
|--------|--------|------|-------------|----------------|
| Body Large | `--font-weight-regular` (400) | `--font-size-16` | `--line-height-24` | `--letter-spacing-negative-xxs` (-0.005em) |
| Body Large Bold | `--font-weight-semi-bold` (600) | `--font-size-16` | `--line-height-24` | `--letter-spacing-negative-xxs` (-0.005em) |
| Body Default | `--font-weight-regular` (400) | `--font-size-14` | `--line-height-22` | `--letter-spacing-xxs` (0.005em) |
| Body Default Bold | `--font-weight-semi-bold` (600) | `--font-size-14` | `--line-height-22` | `--letter-spacing-xxs` (0.005em) |

### Links (Inter, Semi Bold, Underlined)

| Preset | Weight | Size | Line Height | Letter Spacing |
|--------|--------|------|-------------|----------------|
| Link Large | `--font-weight-semi-bold` (600) | `--font-size-16` | `--line-height-24` | `--letter-spacing-xs` (0.01em) |
| Link Default | `--font-weight-semi-bold` (600) | `--font-size-14` | `--line-height-22` | `--letter-spacing-sm` (0.0125em) |

### CSS Composition Example

```css
.title-screen {
  font-family: var(--font-family-regular);
  font-weight: var(--font-weight-semi-bold);
  font-size: var(--font-size-30);
  line-height: var(--line-height-34);
  letter-spacing: -0.025em;
  color: var(--color-content-primary);
}

.body-default {
  font-family: var(--font-family-regular);
  font-weight: var(--font-weight-regular);
  font-size: var(--font-size-14);
  line-height: var(--line-height-22);
  letter-spacing: 0.005em;
  color: var(--color-content-primary);
}
```

