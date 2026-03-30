<img width="80" height="80" alt="Icon" src="https://github.com/user-attachments/assets/9f43052e-cb33-4061-a1c6-8c718f79e684" />

# Mobile Make Builds

Figma Make builds of the Base Surfaces Mobile prototype. Open `.make` files in [Figma](https://www.figma.com) to run the interactive prototype on any device.

**Figma project:** [Base Surfaces — Make Builds](https://www.figma.com/files/826948582432925732/project/579451617?fuid=1009076293124464990)

## Versions

| Version | Date | Download |
|---------|------|----------|
| V1.0 | 2026-03-30 | [Mobile V1.0.make](Mobile%20V1.0.make) |

<details>
<summary><strong>V1.0</strong> — Initial build with bug fixes</summary>

- Full mobile prototype: Home, Cards, Transactions, Payments, Recipients, Insights, Account
- Consumer and business account types with current accounts, jars, and group accounts
- Send, Request, Convert, Add Money, Payment Link flows
- iOS-style navigation (PageTransition, IOSTopBar with liquid glass, MobileNav tab bar)
- BottomSheet overlays with haptic feedback
- Transaction filter chips with multi-select toggle
- Back-to-top button on transaction lists
- Shimmer loading states
- i18n (English + Spanish)
- Dark mode support
- DeviceFrame with iPhone 17 Pro/Air/Pro Max shells

**Bug fixes:**
• Fixed Taxes GBP routing to navigate directly from Home
• Fixed Transfer Calculator same-currency filtering
• Fixed Learn More button styling
• Fixed account details navigation from Home
• Fixed Send flow currency selection from Transfer Calculator
• Fixed chips multi-select toggle behavior
• Fixed flow overlay viewport coverage in browser mode
• Make-specific: Suppressed hover states on cards and list items
• Make-specific: Preserved active/pressed states on interactive elements

**Known limitations:**
• Native keyboard may not appear on money inputs in Make (PWA limitation)
• Graph haptics not available in Make (SVG interaction limitation)

</details>
