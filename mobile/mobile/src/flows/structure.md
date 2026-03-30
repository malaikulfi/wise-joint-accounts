# Flow Structure Rules

Patterns established by the Add Money flow. All future flows must follow these conventions.

## Overlay Architecture

```css
position: fixed;
inset: 0;
z-index: 100;
background: var(--color-background-screen);
display: flex;
flex-direction: column;
overflow-y: auto;
```

Replaces the entire page layout when active.

## ActiveFlow State (App.tsx)

- `activeFlow` is a union type in `App.tsx` — `null` when no flow is open.
- When set, App renders the flow component instead of the page layout.
- Close callback sets `activeFlow = null`, returning to the previous page/subPage (which remain in state).

## Header

- **With steps**: Use `FlowNavigation` from `@transferwise/components` (e.g. Add Money has Amount → Verification → Payment).
- **Without steps**: Use `OverlayHeader` from `@transferwise/components` (e.g. Convert has logo + avatar + close only).
- Close button must be centred: `display: flex; align-items: center; justify-content: center`.

## Avatar

- 48px `AvatarView`.
- **Personal**: uses `imgSrc` (photo).
- **Business**: `{ backgroundColor: '#163300', color: '#9fe870' }` with initials.

## Account Avatar Styles (`AccountStyle`)

Currency selectors use an `AccountStyle` prop to render the correct icon and color for any account type. Defined in `App.tsx` and threaded through `ActiveFlow` → flow component props.

```ts
type AccountStyle = { color: string; textColor: string; iconName: string };
```

**Style constants** (defined in `AppInner`):

| Account | `color` | `textColor` | `iconName` |
|---------|---------|-------------|------------|
| Personal | `var(--color-interactive-accent)` | `var(--color-interactive-control)` | `Wise` |
| Business | `#163300` | `#9fe870` | `Wise` |
| Taxes (Group) | `#FFEB69` | `#3a341c` | `Money` |
| Jar | jar's own color | `#121511` | jar's own icon (e.g. `Savings`, `Suitcase`) |

Flows resolve the icon via `resolveIcon(iconName)` which maps `'Savings'` → `<Savings>`, `'Suitcase'` → `<Suitcase>`, `'Money'` → `<Money>`, default → `<WiseLogoIcon>`.

**ConvertFlow** also accepts `toAccountStyle` for cross-account conversions (e.g. jar → current account).

## Body Column

Mobile-only layout — full width with horizontal padding:

```css
max-width: none;
width: 100%;
margin: 0 auto;
padding: 132px 16px 48px;
flex: 1;
```

## Currency Selector

DS `Button` (md, secondary-neutral) with:
- `addonStart`: double avatar `[accountIcon, currencyFlag]`
- `addonEnd`: `ChevronDown` icon
- Rendered via `ExpressiveMoneyInput.currencySelector.customRender`
- No dropdown menu (non-functional selector)

## ButtonCue

Shared component at `src/components/ButtonCue.tsx`. Wraps the primary action button.

- Surface grows from bottom (24px radius, 5px inset).
- Hint text uses `--color-content-primary`.
- Appears after 500ms delay on mount.
- Hides during loading state.
- Re-shows when button returns to disabled.

## Button State Machine

```
disabled → loading (2s) → active
active → loading (2s) → disabled → cue re-appears
```

Loading state uses `mix-blend-mode: luminosity; opacity: 0.45`.

## Props Pattern

Flows receive:
```ts
{
  onClose: () => void;
  accountType: AccountType;
  avatarUrl: string;
  initials: string;
  accountStyle: AccountStyle;  // drives currency selector icon + color
  // ...flow-specific props (currencies, labels)
}
```

## Translations

All UI text uses `t()` keys from the Language context. Every flow needs keys in all supported languages (en/es/de/fr).

## Focus Behaviour

Delay focus on the primary input by 400ms so the user sees the inactive→active animation.
