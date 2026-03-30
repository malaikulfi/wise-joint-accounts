# Flags and Art

> Source: `@wise/art` v2.27.2
> GitHub: github.com/transferwise/web-art
> Storybook (internal): urban-bassoon-5lz38ro.pages.github.io

## Flag Component

Renders country/currency flags as SVG images.

```tsx
import { Flag } from '@wise/art';

<Flag code="GB" />
<Flag code="USD" />
<Flag code="EU" size="lg" />
```

### Props

| Prop | Type | Description |
|------|------|-------------|
| `code` | `string` | ISO 3166-1 alpha-2 country code (e.g. `"GB"`, `"US"`) or ISO 4217 currency code (e.g. `"GBP"`, `"USD"`, `"EUR"`) |
| `size` | `"sm" \| "md" \| "lg"` | Flag size |

### Rendering Rules

- **Below 150px:** Simplified flag rendering (reduced detail for legibility at small sizes)
- **Above 150px:** Detailed flag rendering (full fidelity)

For very small contexts (inline text, compact lists), use the icon-based `FastFlag` fallback:

```tsx
import { FastFlag } from '@wise/art';

<FastFlag code="GB" />
```

`FastFlag` renders a lightweight icon-based representation optimized for small sizes and fast rendering. Use the standard `Flag` component for all other contexts.

### Common Codes

| Code | Description |
|------|-------------|
| `GB` / `GBP` | United Kingdom / British Pound |
| `US` / `USD` | United States / US Dollar |
| `EU` / `EUR` | European Union / Euro |
| `JP` / `JPY` | Japan / Japanese Yen |
| `AU` / `AUD` | Australia / Australian Dollar |
| `CA` / `CAD` | Canada / Canadian Dollar |
| `BR` / `BRL` | Brazil / Brazilian Real |
| `IN` / `INR` | India / Indian Rupee |

---

## Illustration Component

Renders responsive illustrations with optional lazy loading.

```tsx
import { Illustration } from '@wise/art';

<Illustration
  name="send-money"
  loading="lazy"
  alt="Send money illustration"
/>
```

### Props

| Prop | Type | Description |
|------|------|-------------|
| `name` | `string` | Illustration identifier |
| `loading` | `"lazy" \| "eager"` | Loading strategy (default: `"lazy"`) |
| `alt` | `string` | Accessible alt text |

---

## Illustration3D Component

Three.js-powered 3D illustrations. **Requires React 18.**

```tsx
import { Illustration3D } from '@wise/art';

<Illustration3D name="globe" />
```

### Props

| Prop | Type | Description |
|------|------|-------------|
| `name` | `string` | 3D illustration identifier |

> Note: `Illustration3D` bundles three.js — use sparingly to control bundle size.
