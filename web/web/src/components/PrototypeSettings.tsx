import { useState, useEffect, useRef, useCallback } from 'react';
import { Drawer, SelectInput, SelectInputOptionContent, SegmentedControl, Field, Input, ListItem, Button, useSnackbar } from '@transferwise/components';
import { Slider } from '@transferwise/icons';

const PROMPT_NEW_FLOW = `Build a new interactive flow for this Wise app prototype.

Before writing any code, read these docs:
- **CLAUDE.md** — project rules, architecture, conventions
- **\`src/flows/structure.md\`** — flow overlay architecture, header/body/button patterns, props, state machine
- **\`web/design-system/components.md\`** — Neptune component inventory
- **\`web/design-system/custom-components.md\`** — existing custom components (check what's already built)

Then ask the user the following questions **one at a time**, waiting for each answer:

### Step 1: Account type
Which account type should this flow be built for?
- **Consumer/Personal**, **Business**, or **Both**

### Step 2: Entry point
Where does this flow start? Ask for the **page** and the **specific element** that triggers it.

If the user is unsure, read the relevant page component to list available entry points (action buttons, menu items, list items).

### Step 3: Design references
Ask the user to provide any of:
- **Figma URL** — use the Figma MCP tool (\`get_design_context\`) to extract design + code hints
- **Screenshots** — photos from the live Wise app or reference
- **Source code** — production components or file references
- **Written spec** — description of each step, inputs, states

Tell the user: "The more reference material you provide, the more accurate the result. Figma designs are especially useful — I can read them directly."

### Step 4: Flow details
Confirm your understanding by listing: entry point, each screen/step, data collected at each step, loading/error/empty states, and exit/completion behaviour. Ask the user to confirm before building.

## Implementation

Follow all rules from CLAUDE.md and the flow structure doc (\`src/flows/structure.md\`). Key points:
- Create the flow as a single component in \`src/flows/\` managing its own step state
- Wire the entry point via \`activeFlow\` state in App.tsx
- Use \`@transferwise/components\`, \`@transferwise/icons\`, DS typography classes, DS colour tokens — never build custom equivalents
- Use \`@wise/art\` for illustrations, \`@wise/art\` \`Flag\` component for currency flags
- All UI text through \`t()\`, keys in all 4 translation files (en, es, de, fr)
- Styles in \`src/styles.css\` using BEM: \`.<flow-name>__<element>\`
- Run \`npx tsc --noEmit\` after, test both themes and all breakpoints`;

const PROMPT_SWITCH_ACCOUNT = `Switch the prototype to start from the Business account instead of Consumer/Personal.

There are two places to update:

1. **src/App.tsx** — find the accountType state initialisation:
   \`const [accountType, setAccountType] = useState<AccountType>('personal');\`
   Change \`'personal'\` to \`'business'\`.

2. **src/components/PrototypeSettings.tsx** — find the segmented control state:
   \`const [accountType, setAccountType] = useState('consumer');\`
   Change \`'consumer'\` to \`'business'\`.

Do not change any other behaviour, navigation items, theme, or component logic. Only change the default initial values so the prototype loads in business mode.`;

const PROMPT_NEW_ACCOUNT = `Add a new account to the prototype.

Before writing code, read these docs:
- **\`shared-resources/account-logic/account-types.md\`** — full account type reference, feature matrix, hard rules, visual rules
- **\`web/design-system/custom-components.md\`** — MultiCurrencyAccountCard, JarCard component docs
- **CLAUDE.md** — architecture, data file locations

Then ask the user the following questions:

1. **Which account type?** — Current Account, Jar, or Group/Shared? (Read account-types.md for what each supports)
2. **Consumer or Business?**
3. **What should it be called?** — e.g. "Savings", "Travel", "Marketing"
4. **Which icon and colour?** (Jars only — others use Wise logo). Offer Neptune expressive brand colours: Yellow \`#FFEB69\`, Orange \`#FFC091\`, Blue \`#A0E1E1\`, Pink \`#FFD7EF\`, Green \`#9FE870\`. Icon from \`@transferwise/icons\`.
5. **Which currencies and starting balances?**
6. **Pre-populated transactions or empty?**
7. **Should it have cards?** (Current Account or Group/Shared only — Jars NEVER have cards)
8. **Team member connected?** (Group/Shared only)

---

Once confirmed, implement following account-types.md rules strictly. Read the existing code before building:

### Data layer
- **Jars:** Add a \`JarDefinition\` to \`shared-resources/data/jar-data.tsx\`, add to \`getJar()\`, add translation keys to all 4 language files
- **Current Account / Group:** Create currency data file in \`shared-resources/data/\`, optionally create transactions file

### Home page
- Read \`src/pages/Home.tsx\` to see how existing accounts are wired
- Jars use \`<JarCard>\`, others use \`<MultiCurrencyAccountCard>\` — follow existing patterns
- Update total balance calculation to include the new account

### Account + Currency subpages
- Read \`src/pages/CurrentAccount.tsx\` and \`src/pages/CurrencyPage.tsx\` — both already handle \`jarConfig\` for jars
- Follow the feature matrix from account-types.md (account details, cards, Request button, more menu items)

### Navigation
- Jar routing already exists via SubPage type — just add to \`getJar()\` and the carousel
- Current Account / Group: add new SubPage entries + navigation callbacks in App.tsx

### Insights
- Include new account currencies in total balance and spending calculations

**Note:** Data files in \`shared-resources/data/\` are shared between the web and mobile prototypes. Changes here will affect both apps.

Do not change any existing account data, transactions, or balances.`;

const PROMPT_UPDATE_TRANSACTIONS = `Add new transactions to ALL accounts across ALL currencies, bringing the history up to today's date. Then update every balance so all numbers add up.

Check what today's date is before starting.

## Step 1: Discover the current state

**Read these files first** — do NOT assume what exists:
- \`shared-resources/data/currencies.ts\` — personal currencies (codes, balances, \`hasInterest\`/\`hasStocks\` flags)
- \`shared-resources/data/business-currencies.ts\` — business currencies
- \`shared-resources/data/transactions.tsx\` — personal transactions (note most recent dates)
- \`shared-resources/data/business-transactions.tsx\` — business transactions
- \`shared-resources/data/taxes-data.tsx\` — taxes group
- \`shared-resources/data/jar-data.tsx\` — jar accounts (each has own \`currencies\` and \`transactions\` arrays)

### Re-dating existing transactions

Before adding new ones:
1. Work out what calendar date the existing "Today" and "Yesterday" refer to (look at surrounding dated transactions for context)
2. Replace those literal strings with their actual \`'DD Month'\` date
3. Add new transactions at the top using "Today" and "Yesterday" relative to the **current** date

## Step 2: Add transactions

**Read the existing transaction files thoroughly** to match the exact patterns — types, fields, icons, subtitles, logo helper, amount formatting. Follow every convention you see in the existing data.

Key rules:
- Transactions use a \`labels\` parameter for translated subtitles — use \`labels.sent\`, \`labels.added\`, \`labels.moved\`, etc.
- Conversions need a \`conversion\` object with \`fromCurrency\`, \`toCurrency\`, \`fromAmount\`, \`toAmount\`
- Wise Interest: only on personal currencies with \`hasInterest: true\`, never on business
- Positive amounts: prefix \`'+ '\`. Negative amounts: no prefix (UI handles it via \`isPositive: false\`)
- Reverse chronological order, grouped by date with comments

### Realism rules
- **Vary merchants.** Never repeat the same brand more than twice across all transactions for a currency. Use a wide mix of real-world brands per currency (e.g. USD: Amazon, Target, Whole Foods, Uber, DoorDash, Nike, Spotify, Apple, Costco, Walgreens, etc.).
- **Vary amounts.** Avoid patterns where all amounts end in .99, .49, .00, or .50. Mix realistic endings like .17, .63, .42, .08, .74. Subscriptions can use standard pricing but card purchases should look organic.
- **Mix transaction types.** Don't make every transaction a card spend. Include a healthy mix of: card purchases (\`imgSrc\`), person-to-person sends (\`icon: Send\`), received money (\`icon: Receive\`), conversions (\`icon: Convert\`), and top-ups (\`icon: Plus\`). Jars should include "From [CURRENCY]" internal moves.
- **Logos use logo.dev.** Card purchase merchants use \`logoUrl('domain.com')\` — pick domains that have good logos on logo.dev (major brands, not obscure ones).

## Step 3: Verify balances

Balances auto-compute via \`computeCurrencyBalance(code, txList)\` — no manual recalculation needed. After adding transactions, verify the computed balances look reasonable. If a balance goes negative, adjust the first "Add" (consumer) or "Receive" (business) transaction amount. Update \`totalReturns\` on currencies with interest.

## Validation checklist
- [ ] No currency balance is negative (adjust first transaction if so)
- [ ] Conversions: source loses \`fromAmount\`, destination gains \`toAmount\`
- [ ] \`formatBalance()\` output matches \`balance\` (comma thousands, 2 decimals)
- [ ] Strict reverse chronological order
- [ ] "Today"/"Yesterday" correct for current date
- [ ] Wise Interest only on personal \`hasInterest\` currencies

**Note:** Data files in \`shared-resources/data/\` are shared between the web and mobile prototypes. Changes here will affect both apps.

Do not change any component code, styling, or page structure. Only update data files.`;

const PROMPT_SET_ASSETS = `Enable interest or stocks on a currency in this Wise prototype.

Before making changes, read:
- **\`shared-resources/account-logic/interest-stocks.md\`** — rules, flags, affected components
- **\`shared-resources/data/currencies.ts\`** and **\`shared-resources/data/business-currencies.ts\`** — current currency objects

Then ask the user:

1. **Which account?** — Personal or Business? (Note: the rate card, available balance line, and diagonal avatar only render on personal — \`showRateCard\` requires \`accountType === 'personal'\`. Business currencies can have the data flags but the UI won't display them.)
2. **Which currency?** — Currency code to enable (e.g. USD, EUR, CAD, SGD)
3. **Interest, stocks, or both?** — \`hasInterest\` (rate card, interest disclaimer) / \`hasStocks\` (diagonal avatar, available balance line) / both
4. **What interest rate?** — String like \`'4.25%'\`
5. **Total returns?** — String like \`'+1.23 USD'\` for Insights page

---

## Implementation

Update the currency object in the data file with \`hasStocks\`, \`hasInterest\`, \`interestRate\`, \`totalReturns\`. Read the existing currency objects to match the exact field structure.

All UI changes are automatic — no component code changes needed. Read interest-stocks.md for what each flag triggers.

If the currency earns interest, optionally add **Wise Interest** transactions to the transaction data file (read existing transactions to match the exact pattern). Small amounts (0.01–0.05), every few days, personal only.

**Jar note:** Interest/stocks can be set on jar currencies, but the InterestListItem shows as "inactive" for jars (intentional — \`isJar\` flag suppresses active state).

## Validation
- [ ] Currency object has the flags set correctly
- [ ] Rate card appears on personal currency page (mobile: above tabs, desktop: sidebar)
- [ ] Diagonal avatar shows on Home card for \`hasStocks\` currencies
- [ ] Wise Interest transactions only on personal \`hasInterest\` currencies

**Note:** Data files in \`shared-resources/data/\` are shared between the web and mobile prototypes. Changes here will affect both apps.

Do not change any component code or styling. Only update the currency data object and optionally add transactions.`;

const PROMPT_CHANGE_AMOUNTS = `Change the currencies and balances in this Wise prototype, then regenerate all transaction data to match.

Before making changes, ask the user:

### Step 1: Which profile?
Consumer/Personal, Business, or Both?

### Step 2: Show current state
Read the actual data files and list what currently exists:
- \`shared-resources/data/currencies.ts\` — personal currencies
- \`shared-resources/data/business-currencies.ts\` — business currencies
- \`shared-resources/data/taxes-data.tsx\` — taxes group (business)
- \`shared-resources/data/jar-data.tsx\` — jar accounts

Present each account's currencies with code, balance, and interest/stocks flags. Always read the files fresh.

### Step 3: Display currency
Ask about two separate settings:
1. **Account display currency** — first currency in the array, shown as account total on cards and CurrentAccount header
2. **Home total balance currency** — the home/locale currency for TotalBalanceHeader (can differ from account currency). This is set in PrototypeSettings via the home currency selector per profile.

### Step 4: Desired currencies and amounts
For each currency: code, desired balance, whether to keep/change interest/stocks flags. They can keep, remove, or add currencies.

### Step 5: Confirm
Show a before/after table, then implement.

---

## Implementation

### 1. Update currency data files
Read existing currency objects to match the exact field structure (\`code\`, \`name\`, \`symbol\`, \`balance\`, \`accountDetails\`, interest/stocks fields). Display formatting uses \`formatBalance()\`. Totals are computed automatically via \`.reduce()\`.

If changing account display currency, reorder the array so the new main currency is **first**, then read \`CurrentAccount.tsx\` and \`Home.tsx\` to update any hardcoded currency code/symbol references.

### 2. Regenerate transactions
**Read the existing transaction files thoroughly** to match every pattern. Completely rewrite the transaction arrays — balances auto-compute from \`computeCurrencyBalance(code, txList)\`, so the first transaction for each currency must be an "Add" (consumer, \`icon: Plus\`) or "Receive" (business, \`icon: Receive\`) that establishes the target balance. Follow the same transaction types, icons, subtitles, logo helper, date formats, and amount formatting as existing data. Apply the realism rules from the "Update transactions" prompt: vary merchants (no brand more than twice per currency), vary amount endings (not all .99/.00), mix transaction types (card spends, sends, receives, converts, top-ups).

### 3. Update sub-accounts
Ask if taxes group and jar accounts should also be updated.

### 4. Validation
- [ ] Each currency balance computes to the requested amount (check via \`computeCurrencyBalance\`)
- [ ] Conversions balanced on both sides
- [ ] Reverse chronological order, "Today"/"Yesterday" correct
- [ ] Wise Interest only on personal \`hasInterest\` currencies
- [ ] \`npx tsc --noEmit\` passes

**Note:** Data files in \`shared-resources/data/\` are shared between the web and mobile prototypes. Changes here will affect both apps.

Surfaces (Home, CurrentAccount, CurrencyPage, Insights, Transactions) pull from data files and update automatically. Do not change component code or styling.`;
const PROMPT_PROJECT_CONTEXT = `You are working on a high-fidelity interactive prototype of the Wise app. This is NOT a production app — all data is hardcoded, no API calls, no backend.

## Before doing anything

**Read these docs first** — they are the authoritative reference:

1. **CLAUDE.md** (project root) — rules, architecture, routing, context providers, account types, i18n, assets, dependencies
2. **\`web/design-system/\`** — read the relevant doc when working on related areas:
   - \`components.md\` — Neptune component inventory (\`@transferwise/components\`)
   - \`custom-components.md\` — custom components built for this prototype
   - \`tokens.md\` — colour, typography, spacing tokens
   - \`custom-tokens.md\` — prototype-specific extended tokens
   - \`neptune-css.md\` — CSS utility classes
   - \`page-structure.md\` — layout shell, responsive breakpoints
   - \`icons.md\` — \`@transferwise/icons\` usage
   - \`flags-and-art.md\` — flags and \`@wise/art\` illustrations
3. **\`shared-resources/account-logic/\`** — account types, interest/stocks rules
4. **\`src/flows/structure.md\`** — flow overlay architecture (if building flows)

## Key rules (summary — details in the docs)

- **Design system first.** Always use \`@transferwise/components\` and \`@transferwise/icons\`. Never build custom equivalents.
- **Documented tokens only.** No hardcoded hex values — use DS colour tokens and typography classes.
- **Read before building.** Always read existing source files before modifying or creating components.
- **Check before creating.** A component or token may already exist — check the design system docs.
- **Shared data.** All data files live in \`shared-resources/data/\` — edit data there, not in \`src/data/\` (which contains thin re-exports). Import via \`@shared/data/\`.
- **Translations** — all UI text through \`t()\`, keys in all 4 files (en, es, de, fr). Don't translate names, amounts, brand terms.
- **\`@wise/art\`** for illustrations (100+ static, 13 animated 3D). Local \`Flag\` component for currency flags.
- Run \`npx tsc --noEmit\` after changes. Test both themes and all breakpoints.`;

import { useTheme } from '@wise/components-theming';
import { usePrototypeNames } from '../context/PrototypeNames';
import { useLanguage, type Language } from '../context/Language';
import { currencyMeta } from '../data/currency-rates';
import { Flag } from '@wise/art';

export function PrototypeSettings() {
  const { isScreenModeDark, setScreenMode } = useTheme();
  const createSnackbar = useSnackbar();
  const { consumerName, setConsumerName, businessName, setBusinessName, consumerHomeCurrency, setConsumerHomeCurrency, businessHomeCurrency, setBusinessHomeCurrency } = usePrototypeNames();
  const { language, setLanguage, t } = useLanguage();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [animClass, setAnimClass] = useState('prototype-fab--hidden');
  const [isDragging, setIsDragging] = useState(false);

  // Drag state
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [positioned, setPositioned] = useState(false);
  const dragRef = useRef({
    offsetX: 0,
    offsetY: 0,
    startX: 0,
    startY: 0,
    moved: false,
  });
  const fabRef = useRef<HTMLButtonElement>(null);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    dragRef.current = {
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
      startX: e.clientX,
      startY: e.clientY,
      moved: false,
    };
    setIsDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    const d = dragRef.current;

    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      d.moved = true;
    }

    if (!positioned) setPositioned(true);
    setPos({
      x: e.clientX - d.offsetX,
      y: e.clientY - d.offsetY,
    });
  }, [isDragging, positioned]);

  const handlePointerUp = useCallback(() => {
    const wasDrag = dragRef.current.moved;
    setIsDragging(false);

    if (!wasDrag) {
      setDrawerOpen(true);
    }
  }, []);

  // Ctrl+H to hide/show
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        setVisible((v) => {
          if (v) {
            setAnimClass('prototype-fab--hiding');
            setTimeout(() => setAnimClass('prototype-fab--hidden'), 200);
          } else {
            setPositioned(false);
            setAnimClass('prototype-fab--showing');
            setTimeout(() => setAnimClass(''), 400);
          }
          return !v;
        });
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const fabStyle: React.CSSProperties = positioned
    ? { left: pos.x, top: pos.y, bottom: 'auto', right: 'auto' }
    : {};

  const currentValue = isScreenModeDark ? 'dark' : 'light';
  const [accountType, setAccountType] = useState('consumer');

  const copyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    createSnackbar({ text: 'Prompt copied.' } as any);
  };

  return (
    <>
      <button
        ref={fabRef}
        className={`prototype-fab${isDragging ? ' prototype-fab--dragging' : ''}${animClass ? ` ${animClass}` : ''}`}
        style={fabStyle}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        aria-label={t('settings.title')}
      >
        <Slider size={16} />
      </button>

      <Drawer
        open={drawerOpen}
        headerTitle={t('settings.title')}
        position="right"
        onClose={() => setDrawerOpen(false)}
      >
        <div style={{ overflowY: 'auto', flex: 1 }}>
        <p className="np-text-body" style={{ margin: '0 0 24px', color: 'var(--color-content-secondary)' }}>
          {t('settings.hideHint')}
        </p>
        <div style={{ padding: '24px 0' }}>
          <h3 className="np-text-title-body" style={{ margin: '0 0 16px' }}>{t('settings.visual')}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label className="np-text-title-group" style={{ display: 'block', marginBottom: 8 }}>
                {t('settings.appearance')}
              </label>
              <SelectInput
                size="md"
                placeholder="Choose theme..."
                value={currentValue}
                onChange={(val) => {
                  if (val === 'light' || val === 'dark') {
                    setScreenMode(val);
                  }
                }}
                items={[
                  { type: 'option', value: 'light' },
                  { type: 'option', value: 'dark' },
                ]}
                renderValue={(val) => (
                  <SelectInputOptionContent title={val === 'light' ? t('settings.light') : t('settings.dark')} />
                )}
              />
            </div>
            <div>
              <label className="np-text-title-group" style={{ display: 'block', marginBottom: 8 }}>
                {t('settings.language')}
              </label>
              <SelectInput
                size="md"
                placeholder="Choose language..."
                value={language}
                onChange={(val) => setLanguage(val as Language)}
                items={[
                  { type: 'option', value: 'en' },
                  { type: 'option', value: 'es' },
                  { type: 'option', value: 'de' },
                  { type: 'option', value: 'fr' },
                ]}
                renderValue={(val) => (
                  <SelectInputOptionContent title={
                    { en: 'English', es: 'Español', de: 'Deutsch', fr: 'Français' }[val] ?? val
                  } />
                )}
              />
            </div>
          </div>
        </div>
        <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-neutral)', margin: 0 }} />
        <div style={{ padding: '24px 0' }}>
          <h3 className="np-text-title-body" style={{ margin: '0 0 16px' }}>{t('settings.accounts')}</h3>
          <SegmentedControl
            name="account-type"
            value={accountType}
            mode="input"
            segments={[
              { id: 'consumer', label: t('settings.consumer'), value: 'consumer' },
              { id: 'business', label: t('settings.business'), value: 'business' },
            ]}
            onChange={setAccountType}
          />
          <div style={{ marginTop: 16, marginBottom: 0 }}>
            {accountType === 'consumer' ? (
              <Field label={t('settings.name')}>
                <Input
                  value={consumerName}
                  onChange={(e) => setConsumerName(e.target.value)}
                />
              </Field>
            ) : (
              <Field label={t('settings.name')}>
                <Input
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </Field>
            )}
          </div>
          <div style={{ marginTop: 8 }}>
            <label className="np-text-title-group" style={{ display: 'block', marginBottom: 8 }}>
              {t('settings.homeCurrency')}
            </label>
            <SelectInput
              size="md"
              placeholder="Choose currency..."
              value={accountType === 'consumer' ? consumerHomeCurrency : businessHomeCurrency}
              onChange={(val) => accountType === 'consumer' ? setConsumerHomeCurrency(val as string) : setBusinessHomeCurrency(val as string)}
              items={Object.keys(currencyMeta).map((code) => ({
                type: 'option' as const,
                value: code,
              }))}
              renderValue={(val) => {
                const meta = currencyMeta[val];
                if (!meta) return <SelectInputOptionContent title={val} />;
                return (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Flag code={meta.code} intrinsicSize={20} />
                    <span>{meta.name} · {meta.code}</span>
                  </span>
                );
              }}
            />
          </div>
        </div>
        <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-neutral)', margin: 0 }} />
        <div style={{ padding: '24px 0' }}>
          <h3 className="np-text-title-body" style={{ margin: '0 0 4px' }}>{t('settings.prompts')}</h3>
          <p className="np-text-body-default" style={{ margin: '0 0 16px', color: 'var(--color-content-secondary)' }}>{t('settings.promptsSub')}</p>
          <div>
            <ListItem
              title={t('settings.projectContext')}
              subtitle={t('settings.projectContextSub')}
              media={<ListItem.AvatarView size={40}><img src="/Claude.png" alt="Claude" style={{ width: 40, height: 40, borderRadius: '50%' }} /></ListItem.AvatarView>}
              control={<Button v2 priority="secondary-neutral" size="sm" onClick={() => copyPrompt(PROMPT_PROJECT_CONTEXT)}>Copy</Button>}
            />
            <ListItem
              title={t('settings.newFlow')}
              subtitle={t('settings.newFlowSub')}
              media={<ListItem.AvatarView size={40}><img src="/Claude.png" alt="Claude" style={{ width: 40, height: 40, borderRadius: '50%' }} /></ListItem.AvatarView>}
              control={<Button v2 priority="secondary-neutral" size="sm" onClick={() => copyPrompt(PROMPT_NEW_FLOW)}>Copy</Button>}
            />
            <ListItem
              title={t('settings.switchProfile')}
              subtitle={t('settings.switchProfileSub')}
              media={<ListItem.AvatarView size={40}><img src="/Claude.png" alt="Claude" style={{ width: 40, height: 40, borderRadius: '50%' }} /></ListItem.AvatarView>}
              control={<Button v2 priority="secondary-neutral" size="sm" onClick={() => copyPrompt(PROMPT_SWITCH_ACCOUNT)}>Copy</Button>}
            />
            <ListItem
              title={t('settings.newAccount')}
              subtitle={t('settings.newAccountSub')}
              media={<ListItem.AvatarView size={40}><img src="/Claude.png" alt="Claude" style={{ width: 40, height: 40, borderRadius: '50%' }} /></ListItem.AvatarView>}
              control={<Button v2 priority="secondary-neutral" size="sm" onClick={() => copyPrompt(PROMPT_NEW_ACCOUNT)}>Copy</Button>}
            />
            <ListItem
              title={t('settings.updateTransactions')}
              subtitle={t('settings.updateTransactionsSub')}
              media={<ListItem.AvatarView size={40}><img src="/Claude.png" alt="Claude" style={{ width: 40, height: 40, borderRadius: '50%' }} /></ListItem.AvatarView>}
              control={<Button v2 priority="secondary-neutral" size="sm" onClick={() => copyPrompt(PROMPT_UPDATE_TRANSACTIONS)}>Copy</Button>}
            />
            <ListItem
              title={t('settings.setAssets')}
              subtitle={t('settings.setAssetsSub')}
              media={<ListItem.AvatarView size={40}><img src="/Claude.png" alt="Claude" style={{ width: 40, height: 40, borderRadius: '50%' }} /></ListItem.AvatarView>}
              control={<Button v2 priority="secondary-neutral" size="sm" onClick={() => copyPrompt(PROMPT_SET_ASSETS)}>Copy</Button>}
            />
            <ListItem
              title={t('settings.changeAmounts')}
              subtitle={t('settings.changeAmountsSub')}
              media={<ListItem.AvatarView size={40}><img src="/Claude.png" alt="Claude" style={{ width: 40, height: 40, borderRadius: '50%' }} /></ListItem.AvatarView>}
              control={<Button v2 priority="secondary-neutral" size="sm" onClick={() => copyPrompt(PROMPT_CHANGE_AMOUNTS)}>Copy</Button>}
            />
          </div>
        </div>
        </div>
      </Drawer>
    </>
  );
}
