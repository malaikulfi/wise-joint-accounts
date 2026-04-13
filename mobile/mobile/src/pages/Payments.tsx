import { useState } from 'react';
import { ListItem, Button } from '@transferwise/components';
import {
  DirectDebits, RequestReceive, BillSplit, Calendar, Reload, Plus, AutoConvert, FastFlag, Upload,
  Bills, Batch, Document, Link as LinkIcon, QrCode, ShoppingBag, People,
} from '@transferwise/icons';
import type { AccountType } from '../App';
import { useLanguage } from '../context/Language';
import { usePrototypeNames } from '../context/PrototypeNames';
import type { TranslationKey } from '../translations/en';
import { BottomSheet } from '../components/BottomSheet';

const personalDetailsCurrencies = ['EUR', 'GBP', 'USD', 'CAD', 'TRY', 'HUF'];
const businessDetailsCurrencies = ['EUR', 'GBP', 'USD', 'SGD', 'TRY', 'HUF'];
const jointDetailsCurrencies = ['GBP'];

function currencySummary(codes: string[]): string {
  if (codes.length <= 2) return codes.join(', ');
  return `${codes[0]}, ${codes[1]} and ${codes.length - 2} more`;
}

type SpotlightItem = { titleKey: TranslationKey; subtitleKey: TranslationKey; icon: React.ReactNode };

const personalSpotlightItems: SpotlightItem[] = [
  { titleKey: 'payments.scheduledTransfers', subtitleKey: 'payments.scheduledTransfersSub', icon: <Calendar size={24} /> },
  { titleKey: 'payments.directDebits', subtitleKey: 'payments.directDebitsSub', icon: <DirectDebits size={24} /> },
  { titleKey: 'payments.recurringCardPayments', subtitleKey: 'payments.recurringCardPaymentsSub', icon: <Reload size={24} /> },
  { titleKey: 'payments.paymentRequests', subtitleKey: 'payments.paymentRequestsSub', icon: <RequestReceive size={24} /> },
  { titleKey: 'payments.billSplits', subtitleKey: 'payments.billSplitsSub', icon: <BillSplit size={24} /> },
];

const businessOutgoingItems: SpotlightItem[] = [
  { titleKey: 'payments.scheduledTransfers', subtitleKey: 'payments.scheduledTransfersSub', icon: <Calendar size={24} /> },
  { titleKey: 'payments.directDebits', subtitleKey: 'payments.directDebitsSub', icon: <DirectDebits size={24} /> },
  { titleKey: 'payments.bills', subtitleKey: 'payments.billsSub', icon: <Bills size={24} /> },
  { titleKey: 'payments.recurringCardPayments', subtitleKey: 'payments.recurringCardPaymentsSub', icon: <Reload size={24} /> },
  { titleKey: 'payments.batchPayments', subtitleKey: 'payments.batchPaymentsSub', icon: <Batch size={24} /> },
];

const businessIncomingItems: SpotlightItem[] = [
  { titleKey: 'payments.invoices', subtitleKey: 'payments.invoicesSub', icon: <Document size={24} /> },
  { titleKey: 'payments.paymentLinks', subtitleKey: 'payments.paymentLinksSub', icon: <LinkIcon size={24} /> },
  { titleKey: 'payments.quickPay', subtitleKey: 'payments.quickPaySub', icon: <QrCode size={24} /> },
  { titleKey: 'payments.ecommerce', subtitleKey: 'payments.ecommerceSub', icon: <ShoppingBag size={24} /> },
];


function SpotlightGrid({ items }: { items: SpotlightItem[] }) {
  const { t } = useLanguage();
  return (
    <div className="payments-page__grid">
      {items.map((item) => (
        <ListItem
          key={item.titleKey}
          title={<span className="np-text-body-large" style={{ fontWeight: 600 }}>{t(item.titleKey)}</span>}
          subtitle={t(item.subtitleKey)}
          spotlight="inactive"
          media={
            <ListItem.AvatarView
              size={48}
              badge={{ icon: <Plus size={16} />, type: 'action' as const }}
              style={{ border: 'none', backgroundColor: 'transparent' }}
            >
              {item.icon}
            </ListItem.AvatarView>
          }
          control={<ListItem.Navigation onClick={() => {}} />}
        />
      ))}
    </div>
  );
}

export function Payments({ accountType = 'personal', onSend, onRequest, onPaymentLink, onAccountDetailsList, onAccountDetailsGroup, onScheduledTransfers, scheduledTransfersCount = 0, onDirectDebits, directDebitsCount = 0 }: { accountType?: AccountType; onSend?: () => void; onRequest?: () => void; onPaymentLink?: () => void; onAccountDetailsList?: () => void; onAccountDetailsGroup?: (currencyCodes: string[], jar?: 'joint') => void; onScheduledTransfers?: () => void; scheduledTransfersCount?: number; onDirectDebits?: () => void; directDebitsCount?: number }) {
  const { t } = useLanguage();
  const { jointAccountAccepted } = usePrototypeNames();
  const isBusiness = accountType === 'business';
  const detailsCurrencies = isBusiness ? businessDetailsCurrencies : personalDetailsCurrencies;
  const [getPaidOpen, setGetPaidOpen] = useState(false);

  return (
    <>
    <div className="payments-page">
      {/* Header */}
      <div className="payments-page__header">
        <h1 className="np-text-title-screen" style={{ margin: 0 }}>{t('payments.title')}</h1>
        <div className="payments-page__header-actions">
          <Button v2 size="md" priority="primary" onClick={onSend}>{t('common.send')}</Button>
          {isBusiness ? (
            <Button v2 size="md" priority="secondary" onClick={() => setGetPaidOpen(true)}>{t('common.getPaid')}</Button>
          ) : (
            <Button v2 size="md" priority="secondary" onClick={() => onRequest?.()}>{t('common.request')}</Button>
          )}
        </div>
      </div>

      {/* Business: Outgoing / Incoming split */}
      {isBusiness ? (
        <>
          <div className="payments-page__section">
            <h3 className="np-text-title-subsection" style={{ margin: '0 0 12px' }}>{t('payments.outgoing')}</h3>
            <SpotlightGrid items={businessOutgoingItems} />
          </div>
          <div className="payments-page__section">
            <h3 className="np-text-title-subsection" style={{ margin: '0 0 12px' }}>{t('payments.incoming')}</h3>
            <SpotlightGrid items={businessIncomingItems} />
          </div>
        </>
      ) : (
        <div className="payments-page__grid">
          {personalSpotlightItems.map((item) => {
            const isScheduled = item.titleKey === 'payments.scheduledTransfers';
            const isDirectDebit = item.titleKey === 'payments.directDebits';
            const isActive = (isScheduled && scheduledTransfersCount > 0) || (isDirectDebit && directDebitsCount > 0);
            const onClick = isScheduled ? onScheduledTransfers : isDirectDebit ? onDirectDebits : undefined;
            const subtitle = isScheduled && scheduledTransfersCount > 0
              ? `${scheduledTransfersCount} scheduled`
              : isDirectDebit && directDebitsCount > 0
                ? `${directDebitsCount} active`
                : t(item.subtitleKey);
            return (
              <ListItem
                key={item.titleKey}
                title={<span className="np-text-body-large" style={{ fontWeight: 600 }}>{t(item.titleKey)}</span>}
                subtitle={subtitle}
                spotlight={isActive ? 'active' : 'inactive'}
                media={
                  <ListItem.AvatarView
                    size={48}
                    badge={isActive ? undefined : { icon: <Plus size={16} />, type: 'action' as const }}
                    style={isActive
                      ? { backgroundColor: 'var(--color-background-neutral)', border: 'none' }
                      : { border: 'none', backgroundColor: 'transparent' }}
                  >
                    {item.icon}
                  </ListItem.AvatarView>
                }
                control={<ListItem.Navigation onClick={onClick ?? (() => {})} />}
              />
            );
          })}
        </div>
      )}

      {/* Payment Tools */}
      <div className="payments-page__section">
        <h3 className="np-text-title-subsection" style={{ margin: '0 0 12px' }}>
          {t('payments.paymentTools')}
        </h3>
        <div className="payments-page__tools-grid">
          {!isBusiness && (
            <ListItem
              title={<span className="np-text-body-large" style={{ fontWeight: 600 }}>{t('payments.yourWisetag')}</span>}
              subtitle={t('payments.wisetagSub')}
              spotlight="inactive"
              media={
                <ListItem.AvatarView
                  size={48}
                  imgSrc="https://www.tapback.co/api/avatar/connor-berry.webp"
                  badge={{ icon: <FastFlag size={16} />, type: 'action' as const }}
                />
              }
              control={<ListItem.Navigation onClick={() => {}} />}
            />
          )}
          <ListItem
            title={<span className="np-text-body-large" style={{ fontWeight: 600 }}>{t('payments.autoConversions')}</span>}
            subtitle={t('payments.autoConversionsSub')}
            spotlight="inactive"
            media={
              <ListItem.AvatarView
                size={48}
                badge={{ icon: <Plus size={16} />, type: 'action' as const }}
                style={{ border: 'none', backgroundColor: 'transparent' }}
              >
                <AutoConvert size={24} />
              </ListItem.AvatarView>
            }
            control={<ListItem.Navigation onClick={() => {}} />}
          />
          {!isBusiness && (
            <ListItem
              title={<span className="np-text-body-large" style={{ fontWeight: 600 }}>{t('payments.autoTopups')}</span>}
              subtitle={t('payments.autoTopupsSub')}
              spotlight="inactive"
              media={
                <ListItem.AvatarView
                  size={48}
                  badge={{ icon: <Plus size={16} />, type: 'action' as const }}
                  style={{ border: 'none', backgroundColor: 'transparent' }}
                >
                  <Upload size={24} />
                </ListItem.AvatarView>
              }
              control={<ListItem.Navigation onClick={() => {}} />}
            />
          )}
        </div>
      </div>

      {/* Account Details */}
      <div className="payments-page__section">
        <h3 className="np-text-title-subsection" style={{ margin: '0 0 12px' }}>{t('common.accountDetails')}</h3>
        <div className="payments-page__accounts-grid">
          <ListItem
            title={<span className="np-text-body-large" style={{ fontWeight: 600 }}>{t('home.currentAccount')}</span>}
            subtitle={currencySummary(detailsCurrencies)}
            spotlight="active"
            media={
              <ListItem.AvatarView size={48} style={{ backgroundColor: isBusiness ? '#163300' : 'var(--color-interactive-accent)', border: 'none', color: isBusiness ? '#9fe870' : 'var(--color-interactive-control)' }}>
                <FastFlag size={24} />
              </ListItem.AvatarView>
            }
            control={<ListItem.Navigation onClick={() => onAccountDetailsGroup?.(detailsCurrencies)} />}
          />
          {jointAccountAccepted && !isBusiness && (
            <ListItem
              title={<span className="np-text-body-large" style={{ fontWeight: 600 }}>Joint account</span>}
              subtitle={currencySummary(jointDetailsCurrencies)}
              spotlight="active"
              media={
                <ListItem.AvatarView size={48} style={{ backgroundColor: '#0e3d2e', border: 'none', color: '#9fe870' }}>
                  <People size={24} />
                </ListItem.AvatarView>
              }
              control={<ListItem.Navigation onClick={() => onAccountDetailsGroup?.(jointDetailsCurrencies, 'joint')} />}
            />
          )}
        </div>
      </div>

    </div>
    {isBusiness && (
      <BottomSheet
        open={getPaidOpen}
        onClose={() => setGetPaidOpen(false)}
        title={t('common.getPaid')}
        className="wise-bottom-sheet--compact-list"
      >
        <div style={{ padding: '0 16px' }}>
          <ListItem as="div" title={t('request.sharePaymentLink')} control={<ListItem.Navigation onClick={() => { setGetPaidOpen(false); setTimeout(() => onPaymentLink?.(), 350); }} />} />
          <ListItem as="div" title={t('request.createInvoice')} control={<ListItem.Navigation onClick={() => setGetPaidOpen(false)} />} />
        </div>
      </BottomSheet>
    )}
    </>
  );
}
