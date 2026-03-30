import type { CurrencyData } from './currencies';
import { currencies } from './currencies';
import { businessCurrencies } from './business-currencies';
import { groupCurrencies } from './taxes-data';
import { savingsJar, suppliesJar } from './jar-data';
import { convertToHomeCurrency, usdBaseRates } from './currency-rates';

type AccountType = 'personal' | 'business';

/**
 * Single source of truth for total balance across all accounts.
 * Includes: current account currencies + taxes (business) + active jar.
 * Every page that shows "total balance" must use this — never hand-roll the sum.
 */
export function computeTotalBalance(accountType: AccountType, homeCurrency: string, rates = usdBaseRates): number {
  const activeCurrencies = accountType === 'business' ? businessCurrencies : currencies;
  const groupBalance = accountType === 'business'
    ? groupCurrencies.reduce((sum, c) => sum + convertToHomeCurrency(c.balance, c.code, homeCurrency, rates), 0)
    : 0;
  const jar = accountType === 'business' ? suppliesJar : savingsJar;
  const jarBalance = jar.currencies.reduce((sum, c) => sum + convertToHomeCurrency(c.balance, c.code, homeCurrency, rates), 0);
  const currenciesBalance = activeCurrencies.reduce((sum, c) => sum + convertToHomeCurrency(c.balance, c.code, homeCurrency, rates), 0);

  return currenciesBalance + groupBalance + jarBalance;
}

/**
 * Format a currency balance for display.
 * 'symbol' → £948.70 (for card totals, balance rows)
 * 'code'   → 948.70 GBP (for available balance, currency page headers)
 */
export function formatBalance(currency: CurrencyData, style: 'symbol' | 'code' = 'code'): string {
  const formatted = currency.balance.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return style === 'symbol' ? `${currency.symbol}${formatted}` : `${formatted} ${currency.code}`;
}
