import { useState, useEffect, useRef, useCallback } from 'react';
import { SelectInput, SelectInputOptionContent, SegmentedControl, Field, Input, ListItem, Button, useSnackbar } from '@transferwise/components';
import { Cross, Sun, Moon, Calendar, Send, Plus, Convert } from '@transferwise/icons';
import { BottomSheet } from './BottomSheet';

const PROMPT_NEW_FLOW = `Build a new interactive flow for this Wise app prototype.

Before writing any code, read these docs:
- **CLAUDE.md** — project rules, architecture, conventions
- **\`src/flows/structure.md\`** — flow overlay architecture, header/body/button patterns, props, state machine
- **\`mobile/design-system/components.md\`** — Neptune component inventory
- **\`mobile/design-system/custom-components-flows.md\`** — flow overlays, ButtonCue, shimmer, success screens
- **\`mobile/design-system/ios-components.md\`** — iOS components (BottomSheet, PageTransition, Liquid Glass)

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
- Run \`npx tsc --noEmit\` after, test both themes`;

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
- **\`mobile/design-system/custom-components.md\`** — MultiCurrencyAccountCard, JarCard component docs
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
- [ ] Rate card appears on personal currency page above tabs
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
const PROMPT_PROJECT_CONTEXT = `You are working on a high-fidelity interactive prototype of the Wise mobile app. This is NOT a production app — all data is hardcoded, no API calls, no backend. It runs inside a DeviceFrame iframe (iPhone 17 Pro / Air / Pro Max).

## Before doing anything

**Read these docs first** — they are the authoritative reference:

1. **CLAUDE.md** (project root) — rules, architecture, routing, context providers, account types, i18n, assets, dependencies
2. **\`mobile/design-system/\`** — read the relevant doc when working on related areas:
   - \`components.md\` — Neptune component inventory (\`@transferwise/components\`)
   - \`custom-components.md\` — Home page components (MCA, JarCard, Carousel, Tasks, etc.)
   - \`custom-components-account.md\` — Account & currency page components
   - \`custom-components-flows.md\` — Flow overlays, ButtonCue, shimmer, success screens
   - \`ios-components.md\` — iOS-specific components (IOSTopBar, MobileNav, PageTransition, BottomSheet, DeviceFrame, Liquid Glass)
   - \`tokens.md\` — colour, typography, spacing tokens
   - \`custom-tokens.md\` — prototype-specific extended tokens
   - \`page-structure.md\` — mobile layout shell, CSS custom properties
3. **\`shared-resources/account-logic/\`** — account types, interest/stocks rules
4. **\`src/flows/structure.md\`** — flow overlay architecture (if building flows)

## Key rules (summary — details in the docs)

- **Design system first.** Always use \`@transferwise/components\` and \`@transferwise/icons\`. Never build custom equivalents.
- **Documented tokens only.** No hardcoded hex values — use DS colour tokens and typography classes.
- **Read before building.** Always read existing source files before modifying or creating components.
- **Check before creating.** A component or token may already exist — check the design system docs.
- **Shared data.** All data files live in \`shared-resources/data/\` — edit data there, not locally. Import via \`@shared/data/\`.
- **Translations** — all UI text through \`t()\`, keys in all 4 files (en, es, de, fr). Don't translate names, amounts, brand terms.
- **\`@wise/art\`** for illustrations (100+ static, 13 animated 3D). \`Flag\` component for currency flags.
- **Mobile layout** — single-column inside DeviceFrame. IOSTopBar (fixed top), MobileNav (fixed bottom), PageTransition for push/pop animations.
- Run \`npx tsc --noEmit\` after changes. Test both themes.`;

import { useTheme } from '@wise/components-theming';
import { usePrototypeNames } from '../context/PrototypeNames';
import { useLanguage, type Language } from '../context/Language';
import { People } from '@transferwise/icons';
import { currencyMeta } from '@shared/data/currency-rates';
import { Flag } from '@wise/art';
import { useLiquidGlass } from '../hooks/useLiquidGlass';

export function PrototypeSettings() {
  const { isScreenModeDark, setScreenMode } = useTheme();
  const createSnackbar = useSnackbar();
  const { consumerName, setConsumerName, businessName, setBusinessName, consumerHomeCurrency, setConsumerHomeCurrency, businessHomeCurrency, setBusinessHomeCurrency, hasIncomingInvite, setHasIncomingInvite, pendingJointInviteName, setPendingJointInviteName, jointAccountAccepted, setJointAccountAccepted, jointCardType, setJointCardType, scheduledTransfers, setScheduledTransfers, setJointBalanceAdjustment, setJointPartnerName, setJointTransactions } = usePrototypeNames();
  const { language, setLanguage, t } = useLanguage();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetAnimating, setSheetAnimating] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Drag-to-dismiss state
  const [dragY, setDragY] = useState(0);
  const dragState = useRef({ startY: 0, down: false, active: false });

  const openSheet = useCallback(() => {
    setSheetOpen(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setSheetAnimating(true));
    });
  }, []);

  const closeSheet = useCallback(() => {
    setSheetAnimating(false);
    setTimeout(() => {
      setSheetOpen(false);
      setDragY(0);
    }, 500);
  }, []);

  // Drag-to-dismiss — from header bar, with pointer capture to track outside moves
  const handleSheetPointerDown = useCallback((e: React.PointerEvent) => {
    dragState.current = { startY: e.clientY, down: true, active: false };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handleSheetPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragState.current.down) return;
    const dy = e.clientY - dragState.current.startY;
    if (!dragState.current.active && dy > 10) {
      dragState.current.active = true;
    }
    if (dragState.current.active && dy > 0) {
      setDragY(dy);
    }
  }, []);

  const handleSheetPointerUp = useCallback((e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    if (dragState.current.active) {
      if (dragY > 120) {
        closeSheet();
      } else {
        setDragY(0);
      }
    }
    dragState.current = { startY: 0, down: false, active: false };
  }, [dragY, closeSheet]);

  // Listen for open-settings message from DeviceFrame
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'open-settings') {
        openSheet();
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [openSheet]);

  const currentValue = isScreenModeDark ? 'dark' : 'light';
  const [accountType, setAccountType] = useState('consumer');
  const [showAppearanceSheet, setShowAppearanceSheet] = useState(false);
  const [showLanguageSheet, setShowLanguageSheet] = useState(false);
  const [showCurrencySheet, setShowCurrencySheet] = useState(false);

  const copyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    createSnackbar({ text: 'Prompt copied.' });
  };

  const glass = useLiquidGlass<HTMLButtonElement>();
  const [titleVisible, setTitleVisible] = useState(true);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sheetOpen || !headingRef.current || !bodyRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setTitleVisible(entry.isIntersecting),
      { root: bodyRef.current, threshold: 0 }
    );
    observer.observe(headingRef.current);
    return () => observer.disconnect();
  }, [sheetOpen]);

  if (!sheetOpen) return null;

  return (
    <>
      <div
        className={`fs-sheet__backdrop${sheetAnimating ? ' fs-sheet__backdrop--visible' : ''}`}
        onClick={closeSheet}
      />
      <div
        ref={sheetRef}
        className={`fs-sheet${sheetAnimating ? ' fs-sheet--open' : ''}`}
        style={dragY > 0 ? { transform: `translateY(${dragY}px)`, transition: 'none' } : undefined}
      >
        <header className="fs-sheet__header">
          <div
            className="fs-sheet__header-bar"
            onPointerDown={handleSheetPointerDown}
            onPointerMove={handleSheetPointerMove}
            onPointerUp={handleSheetPointerUp}
            onPointerCancel={handleSheetPointerUp}
          >
            <button
              ref={glass.ref}
              className="ios-glass-btn ios-glass-btn--circle"
              onClick={closeSheet}
              onPointerDown={(e) => { e.stopPropagation(); glass.onPointerDown(e); }}
              onPointerMove={glass.onPointerMove}
              onPointerUp={glass.onPointerUp}
              onPointerCancel={glass.onPointerUp}
              aria-label="Close"
            >
              <span className="ios-glass-btn__icon">
                <Cross size={24} />
              </span>
            </button>
            <span className={`fs-sheet__inline-title${titleVisible ? '' : ' fs-sheet__inline-title--visible'}`}>
              {t('settings.title')}
            </span>
            <div style={{ width: 32 }} />
          </div>
        </header>

        <div ref={bodyRef} className="fs-sheet__body">
            <h1 ref={headingRef} className="np-text-title-screen" style={{ margin: '12px 0 24px' }}>{t('settings.title')}</h1>

            {/* Visual */}
            <div className="fs-sheet__section">
              <h3 className="np-text-title-body" style={{ margin: '0 0 16px' }}>{t('settings.visual')}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label className="np-text-title-group" style={{ display: 'block', marginBottom: 8 }}>
                    {t('settings.appearance')}
                  </label>
                  {/* Intercept clicks to open BottomSheet instead of native dropdown */}
                  <div className="wise-sheet-select-wrap" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowAppearanceSheet(true); }}>
                    <SelectInput
                      size="md"
                      placeholder="Choose theme..."
                      value={currentValue}
                      onChange={() => {}}
                      items={[
                        { type: 'option', value: 'light' },
                        { type: 'option', value: 'dark' },
                      ]}
                      renderValue={(val) => (
                        <SelectInputOptionContent title={val === 'light' ? t('settings.light') : t('settings.dark')} />
                      )}
                    />
                  </div>
                  <BottomSheet
                    open={showAppearanceSheet}
                    onClose={() => setShowAppearanceSheet(false)}
                    title={t('settings.appearance')}
                  >
                    <div style={{ padding: '0 16px' }}>
                      {(['light', 'dark'] as const).map((val) => (
                        <ListItem
                          key={val}
                          title={val === 'light' ? t('settings.light') : t('settings.dark')}
                          media={
                            <ListItem.AvatarView size={40}>
                              {val === 'light' ? <Sun size={24} /> : <Moon size={24} />}
                            </ListItem.AvatarView>
                          }
                          control={
                            <ListItem.Radio
                              name="appearance"
                              value={val}
                              checked={currentValue === val}
                              onChange={() => { setScreenMode(val); setShowAppearanceSheet(false); }}
                            />
                          }
                        />
                      ))}
                    </div>
                  </BottomSheet>
                </div>
                <div>
                  <label className="np-text-title-group" style={{ display: 'block', marginBottom: 8 }}>
                    {t('settings.language')}
                  </label>
                  <div className="wise-sheet-select-wrap" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowLanguageSheet(true); }}>
                    <SelectInput
                      size="md"
                      placeholder="Choose language..."
                      value={language}
                      onChange={() => {}}
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
                  <BottomSheet
                    open={showLanguageSheet}
                    onClose={() => setShowLanguageSheet(false)}
                    title={t('settings.language')}
                  >
                    <div style={{ padding: '0 16px' }}>
                      {([
                        { code: 'en' as Language, label: 'English', flag: 'gb' },
                        { code: 'es' as Language, label: 'Español', flag: 'es' },
                        { code: 'de' as Language, label: 'Deutsch', flag: 'de' },
                        { code: 'fr' as Language, label: 'Français', flag: 'fr' },
                      ]).map((lang) => (
                        <ListItem
                          key={lang.code}
                          title={lang.label}
                          media={
                            <ListItem.AvatarView size={40}>
                              <Flag code={lang.flag} intrinsicSize={24} />
                            </ListItem.AvatarView>
                          }
                          control={
                            <ListItem.Radio
                              name="language"
                              value={lang.code}
                              checked={language === lang.code}
                              onChange={() => { setLanguage(lang.code); setShowLanguageSheet(false); }}
                            />
                          }
                        />
                      ))}
                    </div>
                  </BottomSheet>
                </div>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-neutral)', margin: '24px 0' }} />

            {/* Accounts */}
            <div className="fs-sheet__section">
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
              <div style={{ marginTop: 16 }}>
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
                <div className="wise-sheet-select-wrap" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowCurrencySheet(true); }}>
                  <SelectInput
                    size="md"
                    placeholder="Choose currency..."
                    value={accountType === 'consumer' ? consumerHomeCurrency : businessHomeCurrency}
                    onChange={() => {}}
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
                <BottomSheet
                  open={showCurrencySheet}
                  onClose={() => setShowCurrencySheet(false)}
                  title={t('settings.homeCurrency')}
                >
                  <div style={{ padding: '0 16px' }}>
                    {Object.entries(currencyMeta).map(([code, meta]) => (
                      <ListItem
                        key={code}
                        title={meta.name}
                        subtitle={meta.code}
                        media={
                          <ListItem.AvatarView size={40}>
                            <Flag code={meta.code} intrinsicSize={24} />
                          </ListItem.AvatarView>
                        }
                        control={
                          <ListItem.Radio
                            name="home-currency"
                            value={code}
                            checked={(accountType === 'consumer' ? consumerHomeCurrency : businessHomeCurrency) === code}
                            onChange={() => {
                              if (accountType === 'consumer') setConsumerHomeCurrency(code);
                              else setBusinessHomeCurrency(code);
                              setShowCurrencySheet(false);
                            }}
                          />
                        }
                      />
                    ))}
                  </div>
                </BottomSheet>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-neutral)', margin: '24px 0' }} />

            {/* Joint account scenarios */}
            <div className="fs-sheet__section">
              <h3 className="np-text-title-body" style={{ margin: '0 0 4px' }}>{t('settings.jointAccount')}</h3>
              <p className="np-text-body-default" style={{ margin: '0 0 16px', color: 'var(--color-content-secondary)' }}>
                {hasIncomingInvite
                  ? 'Active: incoming invite from Sky Dog'
                  : pendingJointInviteName
                  ? `Active: invite pending (${pendingJointInviteName})`
                  : jointAccountAccepted
                  ? `Active: joint account set up (${jointCardType ?? 'physical'} card)`
                  : 'No scenario active'}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <ListItem
                  media={<ListItem.AvatarView size={40} style={{ background: '#163300', border: 'none', color: '#9fe870' }}><People size={24} /></ListItem.AvatarView>}
                  title={<span className="np-text-body-default" style={{ fontWeight: 600 }}>{t('settings.jointScenario1a')}</span>}
                  subtitle={t('settings.jointScenario1aSub')}
                  control={
                    <Button v2 priority="secondary-neutral" size="sm" onClick={() => {
                      setHasIncomingInvite(false);
                      setPendingJointInviteName(null);
                      setJointAccountAccepted(false);
                      setJointCardType(null);
                    }}>Set</Button>
                  }
                />
                <ListItem
                  media={<ListItem.AvatarView size={40} style={{ background: '#163300', border: 'none', color: '#9fe870' }}><People size={24} /></ListItem.AvatarView>}
                  title={<span className="np-text-body-default" style={{ fontWeight: 600 }}>{t('settings.jointScenario1b')}</span>}
                  subtitle={t('settings.jointScenario1bSub')}
                  control={
                    <Button v2 priority="secondary-neutral" size="sm" onClick={() => {
                      setHasIncomingInvite(true);
                      setPendingJointInviteName(null);
                      setJointAccountAccepted(false);
                      setJointCardType(null);
                    }}>Set</Button>
                  }
                />
                <ListItem
                  media={<ListItem.AvatarView size={40} style={{ background: '#163300', border: 'none', color: '#9fe870' }}><People size={24} /></ListItem.AvatarView>}
                  title={<span className="np-text-body-default" style={{ fontWeight: 600 }}>{t('settings.jointScenarioPending')}</span>}
                  subtitle={t('settings.jointScenarioPendingSub')}
                  control={
                    <Button v2 priority="secondary-neutral" size="sm" onClick={() => {
                      setHasIncomingInvite(false);
                      setPendingJointInviteName('Sky Dog');
                      setJointAccountAccepted(false);
                      setJointCardType(null);
                    }}>Set</Button>
                  }
                />
                <ListItem
                  media={<ListItem.AvatarView size={40} style={{ background: '#163300', border: 'none', color: '#9fe870' }}><People size={24} /></ListItem.AvatarView>}
                  title={<span className="np-text-body-default" style={{ fontWeight: 600 }}>{t('settings.jointScenarioAcceptedPhysical')}</span>}
                  subtitle={t('settings.jointScenarioAcceptedPhysicalSub')}
                  control={
                    <Button v2 priority="secondary-neutral" size="sm" onClick={() => {
                      setHasIncomingInvite(false);
                      setPendingJointInviteName(null);
                      setJointAccountAccepted(true);
                      setJointCardType('physical');
                    }}>Set</Button>
                  }
                />
                <ListItem
                  media={<ListItem.AvatarView size={40} style={{ background: '#163300', border: 'none', color: '#9fe870' }}><People size={24} /></ListItem.AvatarView>}
                  title={<span className="np-text-body-default" style={{ fontWeight: 600 }}>{t('settings.jointScenarioAcceptedDigital')}</span>}
                  subtitle={t('settings.jointScenarioAcceptedDigitalSub')}
                  control={
                    <Button v2 priority="secondary-neutral" size="sm" onClick={() => {
                      setHasIncomingInvite(false);
                      setPendingJointInviteName(null);
                      setJointAccountAccepted(true);
                      setJointCardType('digital');
                    }}>Set</Button>
                  }
                />
              </div>
              <div style={{ marginTop: 12 }}>
                <Button v2 size="sm" priority="secondary" sentiment="negative" block onClick={() => {
                  setHasIncomingInvite(false);
                  setPendingJointInviteName(null);
                  setJointAccountAccepted(false);
                  setJointCardType(null);
                }}>{t('settings.jointReset')}</Button>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-neutral)', margin: '24px 0' }} />

            {/* Scheduled Transfers */}
            <div className="fs-sheet__section">
              <h3 className="np-text-title-body" style={{ margin: '0 0 4px' }}>Scheduled transfers</h3>
              <p className="np-text-body-default" style={{ margin: '0 0 16px', color: 'var(--color-content-secondary)' }}>
                {scheduledTransfers.length === 0
                  ? 'No scenario active'
                  : `Active: ${scheduledTransfers.length} scheduled transfer${scheduledTransfers.length === 1 ? '' : 's'}`}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <ListItem
                  media={<ListItem.AvatarView size={40} style={{ background: '#163300', border: 'none', color: '#9fe870' }}><Calendar size={24} /></ListItem.AvatarView>}
                  title={<span className="np-text-body-default" style={{ fontWeight: 600 }}>Monthly rent</span>}
                  subtitle="Recurring £1,200 rent payment to landlord"
                  control={
                    <Button v2 priority="secondary-neutral" size="sm" onClick={() => {
                      setScheduledTransfers([
                        { id: 'rent-1', recipientName: 'Oliver Bennett', amount: 1200, currency: 'GBP', repeats: 'monthly', nextDate: new Date(2026, 3, 30) },
                      ]);
                      setHasIncomingInvite(false);
                      setPendingJointInviteName(null);
                      setJointAccountAccepted(true);
                      setJointCardType('physical');
                      setJointBalanceAdjustment(2000);
                      const partner = 'Sky Dog';
                      setJointPartnerName(partner);
                      const logo = (d: string) => `https://img.logo.dev/${d}?token=pk_CkDnlfI6QH-YA3A_mVN8gA&size=128&format=png`;
                      setJointTransactions([
                        { name: 'From GBP', subtitle: `Added by ${partner}`, amount: '+800.00 GBP', isPositive: true, icon: <Plus size={24} />, date: 'Today', currency: 'GBP' },
                        { name: 'From GBP', subtitle: 'Moved by you', amount: '+1,200.00 GBP', isPositive: true, icon: <Convert size={24} />, date: '11 Apr', currency: 'GBP' },
                        { name: 'Waitrose', subtitle: `Spent by ${partner}`, amount: '-67.43 GBP', isPositive: false, imgSrc: logo('waitrose.com'), date: '9 Apr', currency: 'GBP' },
                        { name: 'Amazon', subtitle: 'Spent by you', amount: '-45.99 GBP', isPositive: false, imgSrc: logo('amazon.co.uk'), date: '8 Apr', currency: 'GBP' },
                        { name: 'Oliver Bennett', subtitle: 'Sent by you', amount: '-1,200.00 GBP', isPositive: false, icon: <Send size={24} />, date: '1 Apr', currency: 'GBP' },
                      ]);
                    }}>Set</Button>
                  }
                />
              </div>
              <div style={{ marginTop: 12 }}>
                <Button v2 size="sm" priority="secondary" sentiment="negative" block onClick={() => setScheduledTransfers([])}>Reset</Button>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-neutral)', margin: '24px 0' }} />

            {/* Prompts */}
            <div className="fs-sheet__section">
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
        </div>
    </>
  );
}
