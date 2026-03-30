# Icons

> Source: `@transferwise/icons` v4.1.0
> GitHub: github.com/transferwise/icons
> Browser: transferwise.github.io/icons

## Usage

```tsx
import { Bank } from '@transferwise/icons';

<Bank size={24} />
```

### Naming Convention

PascalCase, no "Icon" suffix in the import (use alias if needed):

```tsx
import { Bank as BankIcon } from '@transferwise/icons';
import { Send, AlertCircle, ChevronRight } from '@transferwise/icons';
```

### Sizes

| Size prop | Pixels | Usage |
|-----------|--------|-------|
| `16` (default) | 16px | Inline with text, compact UI |
| `24` | 24px | Standard icon buttons, list items |
| `32` | 32px | Prominent standalone icons |

```tsx
<Bank size={16} />  // default
<Bank size={24} />
<Bank size={32} />
```

### Variants

- **Outline** (default): standard line icons
- **Filled**: solid fill variant, available for select icons

### Styling

Icons inherit `currentColor` so they match surrounding text color:

```tsx
<span style={{ color: 'var(--color-interactive-accent)' }}>
  <Bank size={24} />
</span>
```

### Common Icons

| Icon | Import | Typical Usage |
|------|--------|---------------|
| `Send` | `import { Send } from '@transferwise/icons'` | Transfers, send money |
| `Bank` | `import { Bank } from '@transferwise/icons'` | Bank accounts |
| `Card` | `import { Card } from '@transferwise/icons'` | Card/payment |
| `Globe` | `import { Globe } from '@transferwise/icons'` | International/currency |
| `AlertCircle` | `import { AlertCircle } from '@transferwise/icons'` | Warnings |
| `CheckCircle` | `import { CheckCircle } from '@transferwise/icons'` | Success |
| `ChevronRight` | `import { ChevronRight } from '@transferwise/icons'` | Navigation |
| `ChevronDown` | `import { ChevronDown } from '@transferwise/icons'` | Dropdowns |
| `Close` | `import { Close } from '@transferwise/icons'` | Dismiss/close |
| `Search` | `import { Search } from '@transferwise/icons'` | Search |
| `Plus` | `import { Plus } from '@transferwise/icons'` | Add |
| `Settings` | `import { Settings } from '@transferwise/icons'` | Settings |
| `Profile` | `import { Profile } from '@transferwise/icons'` | User/profile |
| `Edit` | `import { Edit } from '@transferwise/icons'` | Edit action |
| `Copy` | `import { Copy } from '@transferwise/icons'` | Copy to clipboard |
| `Download` | `import { Download } from '@transferwise/icons'` | Download |

Browse the full set at: transferwise.github.io/icons

---

### Editorial Sizes

For larger display contexts beyond standard UI, use custom `size` values:

| Size | Pixels | Usage |
|------|--------|-------|
| `48` | 48px | Feature highlights, empty states |
| `64` | 64px | Section headers, feature cards |
| `96` | 96px | Hero sections, onboarding flows |

```tsx
<Send size={64} />  // feature card
<Globe size={96} /> // onboarding hero
```

---

### Color Variants

Icons inherit `currentColor`. Apply semantic color tokens for different contexts:

| Context | Token | When to Use |
|---------|-------|-------------|
| Interactive | `--color-interactive-primary` (Forest Green) | Actionable icons (buttons, tappable elements) |
| Informational | `--color-content-primary` | Non-interactive display icons |
| Secondary | `--color-content-secondary` | Supporting/muted icons |
| Highlight | `--color-interactive-accent` (Bright Green) | Selected or active state icons |
| Negative | `--color-sentiment-negative` | Error or destructive action icons |
| Positive | `--color-sentiment-positive` | Success state icons |

```tsx
// Interactive icon
<span style={{ color: 'var(--color-interactive-primary)' }}>
  <Send size={24} />
</span>

// Highlighted/active icon
<span style={{ color: 'var(--color-interactive-accent)' }}>
  <CheckCircle size={24} />
</span>
```

---

### Key Feature Icons

The 6 core product action icons used across Wise:

| Action | Import | Usage |
|--------|--------|-------|
| Send | `import { Send } from '@transferwise/icons'` | Send money / transfers |
| Receive | `import { Receive } from '@transferwise/icons'` | Receive money / requests |
| Convert | `import { Convert } from '@transferwise/icons'` | Currency conversion |
| Spend | `import { Card } from '@transferwise/icons'` | Card spending |
| Keep | `import { Bank } from '@transferwise/icons'` | Hold balances |
| Invest | `import { TrendUp } from '@transferwise/icons'` | Investment / assets |

```tsx
import { Send, Receive, Convert, Card, Bank, TrendUp } from '@transferwise/icons';
```
