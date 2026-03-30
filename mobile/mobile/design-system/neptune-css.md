# Neptune CSS

> Source: `@transferwise/neptune-css`
> npm: npmjs.com/package/@transferwise/neptune-css
> Docs: transferwise.github.io/neptune-web

## Setup

Import the main bundle or individual modules:

```tsx
// Full bundle (includes all utilities + component styles)
import '@transferwise/neptune-css/dist/css/neptune.css';

// Or modular imports
import '@transferwise/neptune-css/dist/css/neptune-core.css';   // Reset + base
import '@transferwise/neptune-css/dist/css/neptune-addons.css';  // Addons
```

Requires `@transferwise/neptune-tokens` for CSS custom properties.

---

## Flexbox Utilities

```html
<div class="d-flex justify-content-between align-items-center">
  <span>Left</span>
  <span>Right</span>
</div>
```

### Display

| Class | Description |
|-------|-------------|
| `d-flex` | `display: flex` |
| `d-inline-flex` | `display: inline-flex` |
| `d-inline-block` | `display: inline-block` |
| `d-inline` | `display: inline` |

### Direction

| Class | Description |
|-------|-------------|
| `flex-row` | Row direction (default) |
| `flex-column` | Column direction |
| `flex-wrap` | Allow wrapping |
| `flex-nowrap` | Prevent wrapping |

### Justify Content

| Class | Description |
|-------|-------------|
| `justify-content-start` | Align to start |
| `justify-content-center` | Center |
| `justify-content-end` | Align to end |
| `justify-content-between` | Space between |
| `justify-content-around` | Space around |

### Align Items

| Class | Description |
|-------|-------------|
| `align-items-start` | Align to top |
| `align-items-center` | Center vertically |
| `align-items-end` | Align to bottom |
| `align-items-baseline` | Align to text baseline |
| `align-items-stretch` | Stretch to fill |

### Align Self

| Class | Description |
|-------|-------------|
| `align-self-start` | Self-align to top |
| `align-self-center` | Self-center |
| `align-self-end` | Self-align to bottom |

### Order & Growth

| Class | Description |
|-------|-------------|
| `order-0` through `order-3` | Flex order |
| `flex-grow-1` | `flex-grow: 1` |

---

## Grid System

> **Note:** This prototype is mobile-only and does not use the responsive grid system. This section documents what Neptune provides for reference only.

Bootstrap-style 12-column responsive grid.

```html
<div class="container">
  <div class="row">
    <div class="col-xs-12 col-md-6 col-lg-4">Column</div>
    <div class="col-xs-12 col-md-6 col-lg-8">Column</div>
  </div>
</div>
```

### Containers

| Class | Description |
|-------|-------------|
| `container` | Fixed-width centered container |
| `container-fluid` | Full-width container |

### Columns

Pattern: `col-{breakpoint}-{1-12}`

| Breakpoint | Prefix | Min Width |
|------------|--------|-----------|
| Extra small | `col-xs-` | 0px |
| Small | `col-sm-` | 480px |
| Medium | `col-md-` | 768px |
| Large | `col-lg-` | 992px |
| Extra large | `col-xl-` | 1200px |

---

## Visibility

| Class | Description |
|-------|-------------|
| `hide` | `display: none` |
| `show` | `display: block` |
| `hidden` | `display: none !important` |
| `invisible` | `visibility: hidden` |

---

## Background Colors

Semantic background utility classes:

| Class | Token |
|-------|-------|
| `bg-default` | Default background |
| `bg-screen` | `--color-background-screen` |
| `bg-elevated` | `--color-background-elevated` |
| `bg-neutral` | `--color-background-neutral` |
| `bg-overlay` | `--color-background-overlay` |
| `bg-positive` / `bg-success` | `--color-sentiment-positive-secondary` |
| `bg-negative` / `bg-danger` | `--color-sentiment-negative-secondary` |
| `bg-warning` | `--color-sentiment-warning-secondary` |
| `bg-info` | Informational background |
| `bg-accent` | Accent background |
| `bg-primary` | Primary background |

---

## Float & Positioning

| Class | Description |
|-------|-------------|
| `pull-left` | `float: left` |
| `pull-right` | `float: right` |
| `pull-left--sm` | Float left from small breakpoint |
| `pull-right--md` | Float right from medium breakpoint |
| `center-block` | `margin: 0 auto` |
| `clearfix` | Clear floats |

---

## Transforms

| Class | Description |
|-------|-------------|
| `rotate90` | Rotate 90 degrees |
| `rotate180` | Rotate 180 degrees |
| `rotate270` | Rotate 270 degrees |
| `rotate-90` | Rotate -90 degrees |
