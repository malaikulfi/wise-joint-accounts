# Web Components

> Source: `@transferwise/components` v46.128.2
> npm: npmjs.com/package/@transferwise/components
> GitHub: github.com/transferwise/neptune-web/tree/main/packages/components

## Setup Requirement

All components must be wrapped in `<Provider>`:

```tsx
import { Provider } from '@transferwise/components';
import en from '@transferwise/components/build/i18n/en.json';

<Provider i18n={{ locale: 'en-UK', messages: en }}>
  {/* your app */}
</Provider>
```

TypeScript declarations are included.

---

## Component Inventory

### Buttons

**Button**
```tsx
import { Button } from '@transferwise/components';

<Button priority="primary" size="md" onClick={handleClick}>
  Send money
</Button>
```

| Prop | Values |
|------|--------|
| `priority` | `"primary"` \| `"secondary"` \| `"tertiary"` \| `"link"` |
| `size` | `"sm"` \| `"md"` \| `"lg"` |
| `disabled` | `boolean` |
| `loading` | `boolean` |
| `block` | `boolean` (full-width) |
| `htmlType` | `"button"` \| `"submit"` \| `"reset"` |
| `icon` | `ReactNode` (leading icon) |

**IconButton**
```tsx
import { IconButton } from '@transferwise/components';
import { Send } from '@transferwise/icons';

<IconButton aria-label="Send money" onClick={handleClick}>
  <Send size={24} />
</IconButton>
```

| Prop | Values |
|------|--------|
| `size` | `16` \| `24` \| `32` \| `40` \| `48` \| `56` \| `72` |
| `priority` | `"primary"` \| `"secondary"` \| `"tertiary"` \| `"minimal"` |
| `type` | `"default"` \| `"negative"` |
| `disabled` | `boolean` |
| `href` | `string` (renders as anchor) |
| `aria-label` | `string` (required for accessibility) |

**CircularButton**
```tsx
import { CircularButton } from '@transferwise/components';
import { Send } from '@transferwise/icons';

<CircularButton icon={<Send size={24} />} onClick={handleClick}>
  Send
</CircularButton>
```

| Prop | Values |
|------|--------|
| `children` | `string` (button label) |
| `icon` | `ReactElement` (required) |
| `priority` | `"primary"` \| `"secondary"` |
| `type` | `"default"` \| `"negative"` |
| `disabled` | `boolean` |

---

### Form / Input

**TextInput**
```tsx
import { TextInput } from '@transferwise/components';

<TextInput
  label="Email address"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  placeholder="you@example.com"
/>
```

| Prop | Type | Description |
|------|------|-------------|
| `label` | `string` | Input label |
| `value` | `string` | Controlled value |
| `onChange` | `function` | Change handler |
| `placeholder` | `string` | Placeholder text |
| `error` | `string` | Error message |
| `disabled` | `boolean` | Disabled state |
| `size` | `"sm" \| "md" \| "lg"` | Input size |

**MoneyInput**
```tsx
import { MoneyInput } from '@transferwise/components';

<MoneyInput
  amount={1000}
  onAmountChange={(value) => setAmount(value)}
  currencies={[
    { value: 'GBP', label: 'GBP', currency: 'GBP', searchable: 'British Pound' },
    { value: 'EUR', label: 'EUR', currency: 'EUR', searchable: 'Euro' },
  ]}
  selectedCurrency={{ value: 'GBP', label: 'GBP', currency: 'GBP' }}
  onCurrencyChange={handleCurrencyChange}
/>
```

| Prop | Type | Description |
|------|------|-------------|
| `amount` | `number \| null` | Monetary value |
| `onAmountChange` | `(value: number \| null) => void` | Amount change handler |
| `currencies` | `CurrencyItem[]` | Available currencies |
| `selectedCurrency` | `CurrencyOptionItem` | Currently selected currency |
| `onCurrencyChange` | `(value: CurrencyOptionItem) => void` | Currency change handler |
| `size` | `"sm"` \| `"md"` \| `"lg"` | Input size |
| `placeholder` | `number` | Placeholder amount |
| `searchPlaceholder` | `string` | Currency search placeholder |
| `addon` | `ReactNode` | Custom addon element |

**SearchInput**
```tsx
import { SearchInput } from '@transferwise/components';

<SearchInput
  placeholder="Search recipients"
  value={query}
  onChange={(e) => setQuery(e.target.value)}
  size="md"
/>
```

| Prop | Type | Description |
|------|------|-------------|
| `value` | `string` | Controlled value |
| `onChange` | `function` | Change handler |
| `placeholder` | `string` | Placeholder text |
| `size` | `"sm"` \| `"md"` | Input size |
| `shape` | `"rectangle"` \| `"pill"` | Input shape |

> Forwards all standard `<input>` props via `React.ComponentPropsWithRef<'input'>`.

**TextArea**
```tsx
import { TextArea } from '@transferwise/components';

<TextArea
  value={note}
  onChange={(e) => setNote(e.target.value)}
  placeholder="Add a reference note"
  rows={4}
/>
```

| Prop | Type | Description |
|------|------|-------------|
| `value` | `string` | Controlled value |
| `onChange` | `function` | Change handler |
| `placeholder` | `string` | Placeholder text |
| `rows` | `number` | Visible row count |
| `aria-invalid` | `boolean` | Error state |

> Forwards all standard `<textarea>` props via `React.ComponentPropsWithRef<'textarea'>`.

**Checkbox**
```tsx
import { Checkbox } from '@transferwise/components';

<Checkbox label="I agree" checked={checked} onChange={setChecked} />
```

**Radio**
```tsx
import { Radio } from '@transferwise/components';

<Radio label="Option A" checked={selected === 'a'} onChange={() => setSelected('a')} />
```

**Select / Dropdown**
```tsx
import { Select } from '@transferwise/components';

<Select
  label="Country"
  options={[
    { value: 'GB', label: 'United Kingdom' },
    { value: 'US', label: 'United States' },
  ]}
  selected={{ value: 'GB', label: 'United Kingdom' }}
  onChange={handleChange}
/>
```

**DateInput**
```tsx
import { DateInput } from '@transferwise/components';

<DateInput value={date} onChange={setDate} label="Date of birth" />
```

| Prop | Type | Description |
|------|------|-------------|
| `value` | `Date \| string` | Date value |
| `onChange` | `(value: string \| null) => void` | Change handler |
| `size` | `"sm"` \| `"md"` \| `"lg"` | Input size |
| `disabled` | `boolean` | Disabled state |
| `monthFormat` | `string` | Month display format |
| `mode` | `string` | Input mode |
| `dayLabel` | `string` | Day field label |
| `monthLabel` | `string` | Month field label |
| `yearLabel` | `string` | Year field label |

**DateLookup (Date Picker)**
```tsx
import { DateLookup } from '@transferwise/components';

<DateLookup
  value={selectedDate}
  onChange={setSelectedDate}
  label="Transfer date"
  min={new Date()}
  placeholder="Select a date"
/>
```

| Prop | Type | Description |
|------|------|-------------|
| `value` | `Date \| null` | Selected date |
| `onChange` | `(date: Date \| null) => void` | Change handler |
| `label` | `string` | Input label |
| `placeholder` | `string` | Placeholder text |
| `min` | `Date \| null` | Earliest selectable date |
| `max` | `Date \| null` | Latest selectable date |
| `size` | `"sm"` \| `"md"` \| `"lg"` | Input size |
| `disabled` | `boolean` | Disabled state |
| `clearable` | `boolean` | Show clear button |

**Upload**
```tsx
import { Upload } from '@transferwise/components';

<Upload size="lg" usAccept="image/*" maxSize={5000000} usLabel="Upload document" onStart={fn} onSuccess={fn} onFailure={fn} />
```

**UploadInput**
```tsx
import { UploadInput } from '@transferwise/components';

<UploadInput multiple fileTypes={['image/*', 'application/pdf']} sizeLimit={10000000} maxFiles={3} description="Upload up to 3 files" onUploadFile={async (formData) => ({ id: '1', url: '' })} />
```

---

### Selection

**Switch**
```tsx
import { Switch } from '@transferwise/components';

<Switch
  checked={enabled}
  onClick={() => setEnabled(!enabled)}
  aria-label="Enable notifications"
/>
```

| Prop | Type | Description |
|------|------|-------------|
| `checked` | `boolean` | Toggle state |
| `onClick` | `(event?) => void` | Click handler |
| `disabled` | `boolean` | Disabled state |
| `aria-label` | `string` | Accessible label |
| `aria-labelledby` | `string` | ID of labelling element |
| `id` | `string` | Element ID |

---

### Navigation

**Tabs**
```tsx
import { Tabs, Tab } from '@transferwise/components';

<Tabs selected={selectedTab} onTabSelect={setSelectedTab}>
  <Tab title="Overview" />
  <Tab title="Activity" />
  <Tab title="Settings" />
</Tabs>
```

**SegmentedControl**
```tsx
import { SegmentedControl } from '@transferwise/components';

<SegmentedControl
  options={[
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
  ]}
  selected="week"
  onChange={handleChange}
/>
```

**NavigationOption**
```tsx
import { NavigationOption } from '@transferwise/components';

<NavigationOption
  title="Bank transfer"
  content="Free, 1-2 business days"
  icon={<Bank size={24} />}
  onClick={handleClick}
/>
```

---

### List Items

**ListItem**

A flexible component for building list-based UIs. Each ListItem accepts content props and a control sub-component that determines its interaction type.

```tsx
import { ListItem } from '@transferwise/components';
import { ChevronRight } from '@transferwise/icons';

<ListItem
  title="Bank transfer"
  subtitle="Free, 1-2 business days"
  media={<Avatar type="icon" size="md"><Bank size={24} /></Avatar>}
>
  <ListItem.Navigation onClick={handleClick} />
</ListItem>
```

| Prop | Type | Description |
|------|------|-------------|
| `title` | `ReactNode` | Primary text (required) |
| `subtitle` | `ReactNode` | Secondary text |
| `additionalInfo` | `ReactNode` | Extra detail line |
| `valueTitle` | `ReactNode` | Right-aligned primary value |
| `valueSubtitle` | `ReactNode` | Right-aligned secondary value |
| `media` | `ReactNode` | Leading visual (Avatar, Flag, Icon) |
| `control` | `ReactNode` | Interactive control slot |
| `prompt` | `ReactNode` | Inline prompt content |
| `disabled` | `boolean` | Disabled state |
| `spotlight` | `"active"` \| `"inactive"` | Highlight state |
| `inverted` | `boolean` | Inverted color scheme |
| `as` | `"li"` \| `"div"` | Wrapper element |

**ListItem Variants (control sub-components):**

```tsx
// Navigation — navigates to another view
<ListItem title="Account settings">
  <ListItem.Navigation onClick={handleClick} />
</ListItem>

// Checkbox — multi-select
<ListItem title="Email notifications">
  <ListItem.Checkbox checked={checked} onChange={setChecked} />
</ListItem>

// Radio — single-select
<ListItem title="Bank transfer">
  <ListItem.Radio checked={selected === 'bank'} onChange={handleChange} name="method" />
</ListItem>

// Switch — toggle on/off
<ListItem title="Dark mode">
  <ListItem.Switch checked={darkMode} onClick={toggleDarkMode} />
</ListItem>

// Button — triggers an action
<ListItem title="Download statement">
  <ListItem.Button onClick={handleDownload}>Download</ListItem.Button>
</ListItem>

// IconButton — compact action
<ListItem title="Account number" valueTitle="12345678">
  <ListItem.IconButton aria-label="Copy" onClick={handleCopy}>
    <Copy size={24} />
  </ListItem.IconButton>
</ListItem>
```

> Do not mix different control types within the same list. Do not mix fully interactive and partially interactive items together.

**ListItem `spotlight` prop:**
The `spotlight` prop accepts `"active"` or `"inactive"`. Use `"inactive"` for a dashed border animation highlighting an action the user needs to take. Use `"active"` for highlighting a completed or selected action. Only works with interactive variants (Navigation, Radio, Checkbox, Switch, Button, IconButton controls).

---

### Feedback

**Alert**
```tsx
import { Alert } from '@transferwise/components';

<Alert type="positive" message="Transfer complete!" />
<Alert type="negative" message="Something went wrong." />
<Alert type="warning" message="Check your details." />
<Alert type="neutral" message="Your transfer is being processed." />
```

| Prop | Values |
|------|--------|
| `type` | `"positive"` \| `"negative"` \| `"warning"` \| `"neutral"` |
| `message` | `string` |
| `action` | `{ text: string, onClick: function }` |

**Snackbar** (via SnackbarProvider + useSnackbar hook)
```tsx
import { SnackbarProvider, useSnackbar } from '@transferwise/components';

// Wrap app in <SnackbarProvider>
// In components:
const createSnackbar = useSnackbar();
createSnackbar({ text: 'Copied!', timeout: 3000, timestamp: Date.now() });
// With action:
createSnackbar({ text: 'Deleted', timeout: 5000, timestamp: Date.now(), action: { label: 'Undo', onClick: handleUndo } });
```

**CriticalCommsBanner**
```tsx
import { CriticalCommsBanner } from '@transferwise/components';

<CriticalCommsBanner
  title="Service disruption"
  subtitle="Transfers to EUR may be delayed."
  action={{ label: 'Learn more', href: '/status' }}
/>
```
```

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Banner heading (required) |
| `subtitle` | `string` | Supporting detail |
| `action` | `{ label: string, href?: string, onClick?: () => void }` | Call to action |

**Nudge**
```tsx
import { Nudge } from '@transferwise/components';

<Nudge
  title="Enable two-factor authentication"
  mediaName="LOCK"
  action={{ text: 'Enable now', onClick: handleEnable }}
  onDismiss={handleDismiss}
/>
```

| Prop | Type | Description |
|------|------|-------------|
| `title` | `ReactNode` | Nudge message (required) |
| `mediaName` | `string` | Illustration: `"GLOBE"` \| `"LOCK"` \| `"WALLET"` \| `"GEAR"` \| `"ENVELOPE"` |
| `action` | `{ text: string, onClick: function }` | Primary action |
| `href` | `string` | Navigation link |
| `onClick` | `function` | Click handler |
| `onDismiss` | `() => void` | Dismiss handler |
| `id` | `string` | Required if `persistDismissal` is `true` |
| `persistDismissal` | `boolean` | Remember dismissal state |

> Max 1 nudge per screen. Place at screen/section top.

**InlinePrompt**
```tsx
import { InlinePrompt } from '@transferwise/components';

<InlinePrompt sentiment="positive" media={<CheckCircle size={24} />}>
  Your identity has been verified.
</InlinePrompt>
```

| Prop | Type | Description |
|------|------|-------------|
| `children` | `ReactNode` | Prompt content (required) |
| `sentiment` | `"positive"` \| `"negative"` \| `"neutral"` \| `"warning"` \| `"proposition"` | Visual style |
| `media` | `ReactNode` | Leading icon |
| `mediaLabel` | `string` | Accessible label for media |
| `loading` | `boolean` | Show loading state |
| `muted` | `boolean` | Subdued visual style |
| `width` | `"auto"` \| `"full"` | Width behavior |

---

### Containers

**Card**
```tsx
import { Card } from '@transferwise/components';

<Card>
  <Card.Content>
    <h3>Your balance</h3>
    <p>$1,234.56</p>
  </Card.Content>
</Card>
```

**Modal**
```tsx
import { Modal } from '@transferwise/components';

<Modal open={isOpen} onClose={() => setIsOpen(false)} title="Confirm transfer">
  <Modal.Body>Are you sure?</Modal.Body>
  <Modal.Footer>
    <Button priority="primary" onClick={handleConfirm}>Confirm</Button>
  </Modal.Footer>
</Modal>
```

**BottomSheet**
```tsx
import { BottomSheet } from '@transferwise/components';

<BottomSheet open={isOpen} onClose={handleClose} title="Select currency">
  {/* content */}
</BottomSheet>
```

**Popover**
```tsx
import { Popover } from '@transferwise/components';

<Popover content="More info here" preferredPlacement="top">
  <Button priority="tertiary">Info</Button>
</Popover>
```

**Accordion**
```tsx
import { Accordion } from '@transferwise/components';

<Accordion title="How long does it take?">
  <p>Usually 1-2 business days.</p>
</Accordion>
```

---

### Display

**Avatar**
```tsx
import { Avatar } from '@transferwise/components';

<Avatar type="initials" size="md">CB</Avatar>
<Avatar type="thumbnail" size="lg" src="/photo.jpg" />
```

| Prop | Values |
|------|--------|
| `type` | `"initials"` \| `"thumbnail"` \| `"icon"` |
| `size` | `"sm"` \| `"md"` \| `"lg"` \| `"xl"` |

**Chip**
```tsx
import { Chip } from '@transferwise/components';

<Chip label="Completed" type="positive" />
<Chip label="Pending" type="warning" />
<Chip label="Failed" type="negative" />
<Chip label="Processing" type="neutral" />
```

**Badge**
```tsx
import { Badge } from '@transferwise/components';

<Badge count={3} />
```

**ProgressBar**
```tsx
import { ProgressBar } from '@transferwise/components';

<ProgressBar percentage={75} />
```

**Summary**
```tsx
import { Summary } from '@transferwise/components';

<Summary
  title="Identity verified"
  description="We've confirmed your identity."
  icon={<CheckCircle size={24} />}
  status="done"
/>
<Summary
  title="Add your bank details"
  description="We need your account information."
  status="pending"
  action={{ text: 'Add details', onClick: handleAdd }}
/>
<Summary title="Transfer funds" status="notDone" />
```

| Prop | Type | Description |
|------|------|-------------|
| `title` | `ReactNode` | Summary title (required) |
| `description` | `ReactNode` | Supporting text |
| `icon` | `ReactNode` | Leading icon |
| `status` | `"done"` \| `"pending"` \| `"notDone"` | Step status indicator |
| `action` | `{ text: string, onClick: function }` | Action link |
| `info` | `{ content: ReactNode, title?: ReactNode, 'aria-label': string }` | Info popover |

> Max 6 items per summary list. Used for transfer review/confirmation screens.

**PromoCard**
```tsx
import { PromoCard } from '@transferwise/components';

<PromoCard
  title="Invite friends, earn rewards"
  description="Share your referral link and get £50 for each friend who transfers."
  imageSource="/promo-invite.png"
  imageAlt="Invite friends illustration"
  onClick={handlePromo}
/>
```

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Card title (required) |
| `description` | `string` | Card description (required) |
| `imageSource` | `string` | Promo image URL |
| `imageAlt` | `string` | Image alt text |
| `indicatorLabel` | `string` | Badge/indicator text |
| `onClick` | `() => void` | Click handler |
| `isDisabled` | `boolean` | Disabled state |
| `headingLevel` | `"h3"` \| `"h4"` \| `"h5"` \| `"h6"` | Heading level (default: `"h3"`) |

**Table**
```tsx
import { Table } from '@transferwise/components';

<Table data={{
  headers: [{ header: 'Name' }, { header: 'Amount' }, { header: 'Status' }],
  rows: [
    { id: 1, cells: [
      { cell: { type: 'leading', primaryText: 'Alice', avatar: { profileName: 'Alice', profileType: 'initials' } } },
      { cell: { type: 'currency', primaryCurrency: { amount: 500, currency: 'GBP' } } },
      { cell: { type: 'status', sentiment: 'positive', primaryText: 'Done' } },
    ] },
  ],
  onRowClick: (row) => {},
}} />
```

| Prop | Type | Description |
|------|------|-------------|
| `data` | `{ headers, rows, onRowClick }` | Table data configuration |
| `loading` | `boolean` | Loading state |
| `fullWidth` | `boolean` | Full-width layout (default: `true`) |
| `error` | `{ message: string, action?: { text: string, onClick: function } }` | Error state |

Cell types: `"leading"` (avatar + text), `"text"`, `"currency"` (Money formatting), `"status"` (StatusIcon + text), `"media"` (image + text).

**DefinitionList**
```tsx
import { DefinitionList } from '@transferwise/components';

<DefinitionList
  items={[
    { title: 'From', value: 'GBP 1,000.00' },
    { title: 'To', value: 'EUR 1,152.30' },
    { title: 'Fee', value: 'GBP 4.56' },
  ]}
/>
```

---

### Layout / Structure

**Divider**
```tsx
import { Divider } from '@transferwise/components';

<Divider level="section" />
<Divider level="subsection" />
<Divider level="content" />
```

| Prop | Type | Description |
|------|------|-------------|
| `level` | `"section"` \| `"subsection"` \| `"content"` | Divider hierarchy (default: `"section"`) |

> **Section** — full-width, separates unrelated content. **Subsection** — separates related content with additional hierarchy. **Content** — breaks down information within a single block.

**FlowNavigation**
```tsx
import { FlowNavigation } from '@transferwise/components';

<FlowNavigation
  steps={['Amount', 'Recipient', 'Review', 'Pay']}
  activeStep={1}
/>
```

**Drawer**
```tsx
import { Drawer } from '@transferwise/components';

<Drawer open={isOpen} headerTitle="Title" position="right" onClose={handleClose} footerContent={<Button>Done</Button>}>
  {/* content */}
</Drawer>
```

| Prop | Type | Description |
|------|------|-------------|
| `open` | `boolean` | Whether the drawer is visible |
| `headerTitle` | `ReactNode` | Title displayed in the drawer header |
| `position` | `"left"` \| `"right"` \| `"bottom"` | Slide-in direction (default: `"right"`) |
| `onClose` | `function` | Close handler |
| `footerContent` | `ReactNode` | Content rendered in the drawer footer |
| `children` | `ReactNode` | Drawer body content |
| `className` | `string` | Additional CSS class |

**Loader**
```tsx
import { Loader } from '@transferwise/components';

<Loader size="sm" />
```

| Prop | Type | Description |
|------|------|-------------|
| `size` | `"sm"` \| `"md"` | Loader size |
| `displayInstantly` | `boolean` | Skip entrance delay |

**Tooltip**
```tsx
import { Tooltip } from '@transferwise/components';

<Tooltip label="Exchange rate includes our fee">
  <span>Mid-market rate</span>
</Tooltip>
```

---

## Import Pattern

Always import from the top-level package:

```tsx
import { Button, TextInput, Card, Avatar } from '@transferwise/components';
```

Never import from internal paths like `@transferwise/components/build/...` (except for i18n messages).

