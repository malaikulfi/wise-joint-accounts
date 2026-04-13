import { ListItem } from '@transferwise/components';
import { Plus } from '@transferwise/icons';
import { Flag } from '@wise/art';
import { useLanguage } from '../context/Language';
import type { AccountType } from '../App';
import type { TranslationKey } from '../translations/en';

type ReceivableCurrency = {
  code: string;
  nameKey: TranslationKey;
  subtitle: string | null;
  subtitleKey?: TranslationKey;
};

const personalReceivableCurrencies: ReceivableCurrency[] = [
  { code: 'EUR', nameKey: 'accountDetailsList.euro', subtitle: 'BE68 9670 3781 7624' },
  { code: 'GBP', nameKey: 'accountDetailsList.britishPound', subtitle: '23-08-01 \u00B7 73868918' },
  { code: 'USD', nameKey: 'accountDetailsList.usDollar', subtitle: '8311094826' },
  { code: 'CAD', nameKey: 'accountDetailsList.canadianDollar', subtitle: '200110083474' },
  { code: 'TRY', nameKey: 'accountDetailsList.turkishLira', subtitle: null, subtitleKey: 'accountDetailsList.swiftOnly' },
  { code: 'HUF', nameKey: 'accountDetailsList.hungarianForint', subtitle: '12600016-19774787-72217791' },
];

const businessReceivableCurrencies: ReceivableCurrency[] = [
  { code: 'EUR', nameKey: 'accountDetailsList.euro', subtitle: 'BE42 9670 5519 3847' },
  { code: 'GBP', nameKey: 'accountDetailsList.britishPound', subtitle: '23-08-01 \u00B7 81204736' },
  { code: 'USD', nameKey: 'accountDetailsList.usDollar', subtitle: '9402718365' },
  { code: 'SGD', nameKey: 'accountDetailsList.singaporeDollar', subtitle: '2048193756' },
  { code: 'TRY', nameKey: 'accountDetailsList.turkishLira', subtitle: null, subtitleKey: 'accountDetailsList.swiftOnly' },
  { code: 'HUF', nameKey: 'accountDetailsList.hungarianForint', subtitle: '12600016-19774787-72217791' },
];

const jointReceivableCurrencies: ReceivableCurrency[] = [
  { code: 'GBP', nameKey: 'accountDetailsList.britishPound', subtitle: '23-08-01 \u00B7 60781767' },
  { code: 'EUR', nameKey: 'accountDetailsList.euro', subtitle: 'BE06 9679 7426 3922' },
];

type Props = {
  accountType?: AccountType;
  jar?: 'joint';
  onSelectCurrency: (code: string) => void;
  accountCurrencyCodes?: string[];
};

export function AccountDetailsList({ accountType = 'personal', jar, onSelectCurrency, accountCurrencyCodes }: Props) {
  const { t } = useLanguage();
  const allCurrencies = jar === 'joint'
    ? jointReceivableCurrencies
    : accountType === 'business' ? businessReceivableCurrencies : personalReceivableCurrencies;
  const currencies = accountCurrencyCodes
    ? allCurrencies.filter((c) => accountCurrencyCodes.includes(c.code))
    : allCurrencies;

  return (
    <div className="account-details-list">
      <h1 className="np-text-title-screen" style={{ margin: '0 0 8px' }}>
        {t('accountDetailsList.title')}
      </h1>
      <p className="np-text-body-large" style={{ margin: '0 0 32px', color: 'var(--color-content-secondary)' }}>
        {t('accountDetailsList.subtitle')}{' '}
        <a href="#" className="np-text-link-default" onClick={(e) => e.preventDefault()}>
          {t('common.learnMore')}.
        </a>
      </p>

      <div className="account-details-list__items">
        {currencies.map((currency) => (
          <ListItem
            key={currency.code}
            title={<span className="np-text-body-large" style={{ fontWeight: 600 }}>{t(currency.nameKey)}</span>}
            subtitle={currency.subtitleKey ? t(currency.subtitleKey) : currency.subtitle}
            media={
              <ListItem.AvatarView size={48}>
                <Flag code={currency.code} />
              </ListItem.AvatarView>
            }
            control={<ListItem.Navigation onClick={() => onSelectCurrency(currency.code)} />}
          />
        ))}

        <ListItem
          title={<span className="np-text-body-large" style={{ fontWeight: 600 }}>{t('accountDetailsList.receiveOther')}</span>}
          media={
            <ListItem.AvatarView size={48} style={{ backgroundColor: 'transparent' }}>
              <Plus size={24} />
            </ListItem.AvatarView>
          }
          control={<ListItem.Navigation onClick={() => {}} />}
        />
      </div>
    </div>
  );
}
