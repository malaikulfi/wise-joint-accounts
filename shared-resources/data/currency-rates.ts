// Approximate current rates against USD for all Wise-supported currencies
export const usdBaseRates: Record<string, number> = {
  AED: 3.6725,
  ARS: 1065.0,
  AUD: 1.5720,
  BDT: 121.50,
  BRL: 5.0650,
  CAD: 1.3580,
  CHF: 0.8845,
  CNY: 7.2450,
  EUR: 0.9216,
  GBP: 0.7434,
  HUF: 376.50,
  IDR: 15825.0,
  INR: 83.450,
  JPY: 150.25,
  MXN: 17.150,
  NGN: 1550.0,
  PHP: 56.250,
  PLN: 3.9750,
  SEK: 10.520,
  SGD: 1.3420,
  THB: 35.450,
  TRY: 30.850,
  USD: 1.0,
  ZAR: 18.250,
};

// Currency metadata for display purposes
export const currencyMeta: Record<string, { code: string; name: string; symbol: string; flag: string }> = {
  AED: { code: 'AED', name: 'UAE dirham', symbol: 'د.إ', flag: '🇦🇪' },
  ARS: { code: 'ARS', name: 'Argentine peso', symbol: '$', flag: '🇦🇷' },
  AUD: { code: 'AUD', name: 'Australian dollar', symbol: 'A$', flag: '🇦🇺' },
  BDT: { code: 'BDT', name: 'Bangladeshi taka', symbol: '৳', flag: '🇧🇩' },
  BRL: { code: 'BRL', name: 'Brazilian real', symbol: 'R$', flag: '🇧🇷' },
  CAD: { code: 'CAD', name: 'Canadian dollar', symbol: 'C$', flag: '🇨🇦' },
  CHF: { code: 'CHF', name: 'Swiss franc', symbol: 'CHF', flag: '🇨🇭' },
  CNY: { code: 'CNY', name: 'Chinese yuan', symbol: '¥', flag: '🇨🇳' },
  EUR: { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  GBP: { code: 'GBP', name: 'British pound', symbol: '£', flag: '🇬🇧' },
  HUF: { code: 'HUF', name: 'Hungarian forint', symbol: 'Ft', flag: '🇭🇺' },
  IDR: { code: 'IDR', name: 'Indonesian rupiah', symbol: 'Rp', flag: '🇮🇩' },
  INR: { code: 'INR', name: 'Indian rupee', symbol: '₹', flag: '🇮🇳' },
  JPY: { code: 'JPY', name: 'Japanese yen', symbol: '¥', flag: '🇯🇵' },
  MXN: { code: 'MXN', name: 'Mexican peso', symbol: '$', flag: '🇲🇽' },
  NGN: { code: 'NGN', name: 'Nigerian naira', symbol: '₦', flag: '🇳🇬' },
  PHP: { code: 'PHP', name: 'Philippine peso', symbol: '₱', flag: '🇵🇭' },
  PLN: { code: 'PLN', name: 'Polish zloty', symbol: 'zł', flag: '🇵🇱' },
  SEK: { code: 'SEK', name: 'Swedish krona', symbol: 'kr', flag: '🇸🇪' },
  SGD: { code: 'SGD', name: 'Singapore dollar', symbol: 'S$', flag: '🇸🇬' },
  THB: { code: 'THB', name: 'Thai baht', symbol: '฿', flag: '🇹🇭' },
  TRY: { code: 'TRY', name: 'Turkish lira', symbol: '₺', flag: '🇹🇷' },
  USD: { code: 'USD', name: 'US dollar', symbol: '$', flag: '🇺🇸' },
  ZAR: { code: 'ZAR', name: 'South African rand', symbol: 'R', flag: '🇿🇦' },
};

/**
 * Convert an amount from one currency to another using USD-based cross rates.
 * Pass a `rates` map (e.g. from useLiveRates()) for live data, or omit to use hardcoded fallbacks.
 * Formula: amount * (toRate / fromRate)
 */
export function convertToHomeCurrency(amount: number, fromCode: string, toCode: string, rates: Record<string, number> = usdBaseRates): number {
  if (fromCode === toCode) return amount;
  const fromRate = rates[fromCode];
  const toRate = rates[toCode];
  if (!fromRate || !toRate) return amount;
  return amount * (toRate / fromRate);
}

/**
 * Get the symbol for a currency code.
 */
export function getCurrencySymbol(code: string): string {
  return currencyMeta[code]?.symbol ?? code;
}
