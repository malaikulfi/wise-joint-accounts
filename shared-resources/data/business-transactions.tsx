import { Send, Receive, Convert, Plus } from '@transferwise/icons';
import type { Transaction, TxTranslator } from './transactions';

const LOGO_DEV_TOKEN = 'pk_CkDnlfI6QH-YA3A_mVN8gA';
const logoUrl = (domain: string) =>
  `https://img.logo.dev/${domain}?token=${LOGO_DEV_TOKEN}&size=128&format=png`;

const defaultLabels: TxTranslator = {
  sent: 'Sent',
  sentByYou: 'Sent by you',
  added: 'Added',
  addedByYou: 'Added by you',
  moved: 'Moved',
  movedByYou: 'Moved by you',
  spentByYou: 'Spent by you',
};

export function buildBusinessTransactions(consumerName: string, labels: TxTranslator = defaultLabels): Transaction[] {
  return [
  // Today (27 Mar) — GBP: -375.00
  { name: 'Sarah Chen', subtitle: labels.sentByYou, amount: '375.00 GBP', isPositive: false, icon: <Send size={24} />, date: 'Today', currency: 'GBP' },

  // Yesterday (26 Mar) — GBP: -2,400.00 | USD: -15.00
  { name: 'HMRC', subtitle: labels.sentByYou, amount: '2,400.00 GBP', isPositive: false, icon: <Send size={24} />, date: 'Yesterday', currency: 'GBP' },
  { name: 'Anthropic', subtitle: labels.spentByYou, amount: '15.00 USD', isPositive: false, imgSrc: logoUrl('anthropic.com'), date: 'Yesterday', currency: 'USD' },

  // 25 Mar — GBP: -8.40 | EUR: -89.00 | USD: -342.80
  { name: 'Pret A Manger', subtitle: labels.spentByYou, amount: '8.40 GBP', isPositive: false, imgSrc: logoUrl('pret.com'), date: '25 March', currency: 'GBP' },
  { name: 'Stripe', subtitle: labels.spentByYou, amount: '89.00 EUR', isPositive: false, imgSrc: logoUrl('stripe.com'), date: '25 March', currency: 'EUR' },
  { name: 'AWS', subtitle: labels.spentByYou, amount: '342.80 USD', isPositive: false, imgSrc: logoUrl('aws.amazon.com'), date: '25 March', currency: 'USD' },

  // 24 Mar — GBP: +2,800.00 | USD: -54.99
  { name: 'Acme Corp', amount: '+ 2,800.00 GBP', isPositive: true, icon: <Receive size={24} />, date: '24 March', currency: 'GBP' },
  { name: 'Adobe', subtitle: labels.spentByYou, amount: '54.99 USD', isPositive: false, imgSrc: logoUrl('adobe.com'), date: '24 March', currency: 'USD' },

  // 23 Mar — GBP: -120.00 -1,800.00 | EUR: -67.00
  { name: 'Sarah Chen', subtitle: labels.sentByYou, amount: '1,800.00 GBP', isPositive: false, icon: <Send size={24} />, date: '23 March', currency: 'GBP' },
  { name: 'Royal Mail', subtitle: labels.sentByYou, amount: '120.00 GBP', isPositive: false, icon: <Send size={24} />, date: '23 March', currency: 'GBP' },
  { name: 'MOO Print', subtitle: labels.sentByYou, amount: '67.00 EUR', isPositive: false, icon: <Send size={24} />, date: '23 March', currency: 'EUR' },

  // 22 Mar — GBP: -1,450.00 | USD: -12.50
  { name: 'Landmark Properties', subtitle: labels.sentByYou, amount: '1,450.00 GBP', isPositive: false, icon: <Send size={24} />, date: '22 March', currency: 'GBP' },
  { name: 'Slack', subtitle: labels.spentByYou, amount: '12.50 USD', isPositive: false, imgSrc: logoUrl('slack.com'), date: '22 March', currency: 'USD' },

  // 21 Mar — GBP: -15.60 | EUR: +280.00
  { name: 'Deliveroo', subtitle: labels.spentByYou, amount: '15.60 GBP', isPositive: false, imgSrc: logoUrl('deliveroo.co.uk'), date: '21 March', currency: 'GBP' },
  { name: 'Studio Bianchi', amount: '+ 280.00 EUR', isPositive: true, icon: <Receive size={24} />, date: '21 March', currency: 'EUR' },

  // 20 Mar — GBP: +1,200.00 | USD: -8.00 | SGD: +520.00 -45.00
  { name: 'Apex Ventures', amount: '+ 1,200.00 GBP', isPositive: true, icon: <Receive size={24} />, date: '20 March', currency: 'GBP' },
  { name: 'Notion', subtitle: labels.spentByYou, amount: '8.00 USD', isPositive: false, imgSrc: logoUrl('notion.so'), date: '20 March', currency: 'USD' },
  { name: 'TechStart Singapore', amount: '+ 520.00 SGD', isPositive: true, icon: <Receive size={24} />, date: '20 March', currency: 'SGD' },
  { name: 'SingPost', subtitle: labels.sentByYou, amount: '45.00 SGD', isPositive: false, icon: <Send size={24} />, date: '20 March', currency: 'SGD' },

  // 19 Mar — GBP: +3,200.00 | USD: -15.00
  { name: 'Acme Corp', amount: '+ 3,200.00 GBP', isPositive: true, icon: <Receive size={24} />, date: '19 March', currency: 'GBP' },
  { name: 'Anthropic', subtitle: labels.spentByYou, amount: '15.00 USD', isPositive: false, imgSrc: logoUrl('anthropic.com'), date: '19 March', currency: 'USD' },

  // 18 Mar — EUR: -89.00 | USD: -156.80
  { name: 'Stripe', subtitle: labels.spentByYou, amount: '89.00 EUR', isPositive: false, imgSrc: logoUrl('stripe.com'), date: '18 March', currency: 'EUR' },
  { name: 'AWS', subtitle: labels.spentByYou, amount: '156.80 USD', isPositive: false, imgSrc: logoUrl('aws.amazon.com'), date: '18 March', currency: 'USD' },

  // 17 Mar — GBP: +1,800.00 | USD: -8.00
  { name: 'Bright Ideas Agency', amount: '+ 1,800.00 GBP', isPositive: true, icon: <Receive size={24} />, date: '17 March', currency: 'GBP' },
  { name: 'Figma', subtitle: labels.spentByYou, amount: '12.00 USD', isPositive: false, imgSrc: logoUrl('figma.com'), date: '17 March', currency: 'USD' },

  // 16 Mar — GBP: -12.40 | SGD: +520.00
  { name: 'Deliveroo', subtitle: labels.spentByYou, amount: '12.40 GBP', isPositive: false, imgSrc: logoUrl('deliveroo.co.uk'), date: '16 March', currency: 'GBP' },
  { name: 'TechStart Singapore', amount: '+ 520.00 SGD', isPositive: true, icon: <Receive size={24} />, date: '16 March', currency: 'SGD' },

  // 15 Mar — USD: -54.99 | EUR: -145.00
  { name: 'Adobe', subtitle: labels.spentByYou, amount: '54.99 USD', isPositive: false, imgSrc: logoUrl('adobe.com'), date: '15 March', currency: 'USD' },
  { name: 'MOO Print', subtitle: labels.sentByYou, amount: '145.00 EUR', isPositive: false, icon: <Send size={24} />, date: '15 March', currency: 'EUR' },

  // 14 Mar — GBP: +2,500.00 | USD: -6.50
  { name: 'Meridian Studios', amount: '+ 2,500.00 GBP', isPositive: true, icon: <Receive size={24} />, date: '14 March', currency: 'GBP' },
  { name: 'Uber', subtitle: labels.spentByYou, amount: '6.50 USD', isPositive: false, imgSrc: logoUrl('uber.com'), date: '14 March', currency: 'USD' },

  // 13 Mar — GBP: -95.00 | USD: -12.50
  { name: 'Royal Mail', subtitle: labels.sentByYou, amount: '95.00 GBP', isPositive: false, icon: <Send size={24} />, date: '13 March', currency: 'GBP' },
  { name: 'Loom', subtitle: labels.spentByYou, amount: '12.50 USD', isPositive: false, imgSrc: logoUrl('loom.com'), date: '13 March', currency: 'USD' },

  // 12 Mar — GBP: +1,100.00 | USD: -18.99
  { name: 'Horizon Digital', amount: '+ 1,100.00 GBP', isPositive: true, icon: <Receive size={24} />, date: '12 March', currency: 'GBP' },
  { name: 'Canva', subtitle: labels.spentByYou, amount: '18.99 USD', isPositive: false, imgSrc: logoUrl('canva.com'), date: '12 March', currency: 'USD' },

  // 11 Mar — GBP: +1,500.00 | USD: -15.00
  { name: 'Apex Ventures', amount: '+ 1,500.00 GBP', isPositive: true, icon: <Receive size={24} />, date: '11 March', currency: 'GBP' },
  { name: 'Monotype', subtitle: labels.spentByYou, amount: '14.83 USD', isPositive: false, imgSrc: logoUrl('monotype.com'), date: '11 March', currency: 'USD' },

  // 10 Mar — USD: -13.80 | GBP: -875.00
  { name: 'Getty Images', subtitle: labels.spentByYou, amount: '13.80 USD', isPositive: false, imgSrc: logoUrl('gettyimages.com'), date: '10 March', currency: 'USD' },
  { name: 'Landmark Properties', subtitle: labels.sentByYou, amount: '875.00 GBP', isPositive: false, icon: <Send size={24} />, date: '10 March', currency: 'GBP' },

  // 9 Mar — USD: -21.00 | SGD: -89.00
  { name: 'Pantone', subtitle: labels.spentByYou, amount: '21.37 USD', isPositive: false, imgSrc: logoUrl('pantone.com'), date: '9 March', currency: 'USD' },
  { name: 'Muji', subtitle: labels.spentByYou, amount: '89.00 SGD', isPositive: false, imgSrc: logoUrl('muji.com'), date: '9 March', currency: 'SGD' },

  // 8 Mar — GBP: +1,200.00 -300.00(->EUR) | EUR: +351.00
  { name: 'Bright Ideas Agency', amount: '+ 1,200.00 GBP', isPositive: true, icon: <Receive size={24} />, date: '8 March', currency: 'GBP' },
  { name: 'To EUR', subtitle: labels.movedByYou, amount: '300.00 GBP', amountSub: '351.00 EUR', isPositive: false, icon: <Convert size={24} />, date: '8 March', currency: 'GBP', conversion: { fromCurrency: 'GBP', toCurrency: 'EUR', fromAmount: '300.00 GBP', toAmount: '351.00 EUR' } },

  // 7 Mar — GBP: -2,400.00 | USD: -142.50 | SGD: +450.00
  { name: 'HMRC', subtitle: labels.sentByYou, amount: '2,400.00 GBP', isPositive: false, icon: <Send size={24} />, date: '7 March', currency: 'GBP' },
  { name: 'GitHub', subtitle: labels.spentByYou, amount: '21.00 USD', isPositive: false, imgSrc: logoUrl('github.com'), date: '7 March', currency: 'USD' },
  { name: 'TechStart Singapore', amount: '+ 450.00 SGD', isPositive: true, icon: <Receive size={24} />, date: '7 March', currency: 'SGD' },

  // 6 Mar — USD: -18.99 | GBP: -6.80
  { name: 'Miro', subtitle: labels.spentByYou, amount: '16.00 USD', isPositive: false, imgSrc: logoUrl('miro.com'), date: '6 March', currency: 'USD' },
  { name: 'Pret A Manger', subtitle: labels.spentByYou, amount: '6.80 GBP', isPositive: false, imgSrc: logoUrl('pret.com'), date: '6 March', currency: 'GBP' },

  // 5 Mar — GBP: +2,200.00 | USD: -12.50
  { name: 'Acme Corp', amount: '+ 2,200.00 GBP', isPositive: true, icon: <Receive size={24} />, date: '5 March', currency: 'GBP' },
  { name: '1Password', subtitle: labels.spentByYou, amount: '7.99 USD', isPositive: false, imgSrc: logoUrl('1password.com'), date: '5 March', currency: 'USD' },

  // 4 Mar — EUR: +320.00 | USD: -8.20
  { name: 'Studio Bianchi', amount: '+ 320.00 EUR', isPositive: true, icon: <Receive size={24} />, date: '4 March', currency: 'EUR' },
  { name: 'Uber', subtitle: labels.spentByYou, amount: '8.20 USD', isPositive: false, imgSrc: logoUrl('uber.com'), date: '4 March', currency: 'USD' },

  // 3 Mar — GBP: -120.00 -200.00(->SGD) | SGD: +340.00
  { name: 'Royal Mail', subtitle: labels.sentByYou, amount: '120.00 GBP', isPositive: false, icon: <Send size={24} />, date: '3 March', currency: 'GBP' },
  { name: 'To SGD', subtitle: labels.movedByYou, amount: '200.00 GBP', amountSub: '340.00 SGD', isPositive: false, icon: <Convert size={24} />, date: '3 March', currency: 'GBP', conversion: { fromCurrency: 'GBP', toCurrency: 'SGD', fromAmount: '200.00 GBP', toAmount: '340.00 SGD' } },

  // 2 Mar — USD: -8.00 | SGD: -45.00
  { name: 'Framer', subtitle: labels.spentByYou, amount: '15.00 USD', isPositive: false, imgSrc: logoUrl('framer.com'), date: '2 March', currency: 'USD' },
  { name: 'SingPost', subtitle: labels.sentByYou, amount: '45.00 SGD', isPositive: false, icon: <Send size={24} />, date: '2 March', currency: 'SGD' },

  // 1 Mar — GBP: +1,200.00 | EUR: -67.00
  { name: 'Meridian Studios', amount: '+ 1,200.00 GBP', isPositive: true, icon: <Receive size={24} />, date: '1 March', currency: 'GBP' },
  { name: 'Stripe', subtitle: labels.spentByYou, amount: '67.00 EUR', isPositive: false, imgSrc: logoUrl('stripe.com'), date: '1 March', currency: 'EUR' },

  // 28 Feb — USD: -29.00 | GBP: -85.60
  { name: 'Cloudflare', subtitle: labels.spentByYou, amount: '25.00 USD', isPositive: false, imgSrc: logoUrl('cloudflare.com'), date: '28 February', currency: 'USD' },
  { name: 'Amazon Web Services', subtitle: labels.spentByYou, amount: '85.60 GBP', isPositive: false, imgSrc: logoUrl('aws.amazon.com'), date: '28 February', currency: 'GBP' },

  // 27 Feb — GBP: +900.00 | USD: -29.00
  { name: 'Horizon Digital', amount: '+ 900.00 GBP', isPositive: true, icon: <Receive size={24} />, date: '27 February', currency: 'GBP' },
  { name: 'Shutterstock', subtitle: labels.spentByYou, amount: '29.00 USD', isPositive: false, imgSrc: logoUrl('shutterstock.com'), date: '27 February', currency: 'USD' },

  // 26 Feb — USD: -8.00 | GBP: -178.00 | EUR: -125.00
  { name: 'Linear', subtitle: labels.spentByYou, amount: '8.00 USD', isPositive: false, imgSrc: logoUrl('linear.app'), date: '26 February', currency: 'USD' },
  { name: 'Printful', subtitle: labels.sentByYou, amount: '178.00 GBP', isPositive: false, icon: <Send size={24} />, date: '26 February', currency: 'GBP' },
  { name: 'MOO Print', subtitle: labels.sentByYou, amount: '125.00 EUR', isPositive: false, icon: <Send size={24} />, date: '26 February', currency: 'EUR' },

  // 25 Feb — GBP: +1,350.00 | EUR: -89.00
  { name: 'Horizon Digital', amount: '+ 1,350.00 GBP', isPositive: true, icon: <Receive size={24} />, date: '25 February', currency: 'GBP' },
  { name: 'Stripe', subtitle: labels.spentByYou, amount: '89.00 EUR', isPositive: false, imgSrc: logoUrl('stripe.com'), date: '25 February', currency: 'EUR' },

  // 24 Feb — USD: -22.00 | SGD: +680.00
  { name: 'Mailchimp', subtitle: labels.spentByYou, amount: '22.14 USD', isPositive: false, imgSrc: logoUrl('mailchimp.com'), date: '24 February', currency: 'USD' },
  { name: 'AsiaConnect Pte', amount: '+ 680.00 SGD', isPositive: true, icon: <Receive size={24} />, date: '24 February', currency: 'SGD' },

  // 23 Feb — GBP: -245.00 | EUR: +950.00
  { name: 'Royal Mail', subtitle: labels.sentByYou, amount: '245.00 GBP', isPositive: false, icon: <Send size={24} />, date: '23 February', currency: 'GBP' },
  { name: 'Studio Bianchi', amount: '+ 950.00 EUR', isPositive: true, icon: <Receive size={24} />, date: '23 February', currency: 'EUR' },

  // 22 Feb — GBP: +4,200.00 | USD: -8.45
  { name: 'Acme Corp', amount: '+ 4,200.00 GBP', isPositive: true, icon: <Receive size={24} />, date: '22 February', currency: 'GBP' },
  { name: 'Pret A Manger', subtitle: labels.spentByYou, amount: '8.45 USD', isPositive: false, imgSrc: logoUrl('pret.com'), date: '22 February', currency: 'USD' },

  // 21 Feb — GBP: +2,800.00 -1,200.00 | USD: -54.99
  { name: 'Meridian Studios', amount: '+ 2,800.00 GBP', isPositive: true, icon: <Receive size={24} />, date: '21 February', currency: 'GBP' },
  { name: 'Squarespace', subtitle: labels.spentByYou, amount: '33.00 USD', isPositive: false, imgSrc: logoUrl('squarespace.com'), date: '21 February', currency: 'USD' },
  { name: 'Sarah Chen', subtitle: labels.sentByYou, amount: '1,200.00 GBP', isPositive: false, icon: <Send size={24} />, date: '21 February', currency: 'GBP' },

  // 19 Feb — USD: -29.00 -8.00 | EUR: -186.40
  { name: 'Airtable', subtitle: labels.spentByYou, amount: '24.00 USD', isPositive: false, imgSrc: logoUrl('airtable.com'), date: '19 February', currency: 'USD' },
  { name: 'Superhuman', subtitle: labels.spentByYou, amount: '30.00 USD', isPositive: false, imgSrc: logoUrl('superhuman.com'), date: '19 February', currency: 'USD' },
  { name: 'MOO Print', subtitle: labels.sentByYou, amount: '186.40 EUR', isPositive: false, icon: <Send size={24} />, date: '19 February', currency: 'EUR' },

  // 17 Feb — GBP: -280.00(->SGD) | SGD: +475.16 +1,850.00
  { name: 'To SGD', subtitle: labels.movedByYou, amount: '280.00 GBP', amountSub: '475.16 SGD', isPositive: false, icon: <Convert size={24} />, date: '17 February', currency: 'GBP', conversion: { fromCurrency: 'GBP', toCurrency: 'SGD', fromAmount: '280.00 GBP', toAmount: '475.16 SGD' } },
  { name: 'TechStart Singapore', amount: '+ 1,850.00 SGD', isPositive: true, icon: <Receive size={24} />, date: '17 February', currency: 'SGD' },

  // 15 Feb — USD: -20.00 -12.50 | GBP: +1,600.00
  { name: 'Vercel', subtitle: labels.spentByYou, amount: '20.00 USD', isPositive: false, imgSrc: logoUrl('vercel.com'), date: '15 February', currency: 'USD' },
  { name: 'Grammarly', subtitle: labels.spentByYou, amount: '12.50 USD', isPositive: false, imgSrc: logoUrl('grammarly.com'), date: '15 February', currency: 'USD' },
  { name: 'Bright Ideas Agency', amount: '+ 1,600.00 GBP', isPositive: true, icon: <Receive size={24} />, date: '15 February', currency: 'GBP' },

  // 14 Feb — GBP: -1,500.00(->USD) | USD: +1,912.50 | EUR: -650.00
  { name: 'To USD', subtitle: labels.movedByYou, amount: '1,500.00 GBP', amountSub: '1,912.50 USD', isPositive: false, icon: <Convert size={24} />, date: '14 February', currency: 'GBP', conversion: { fromCurrency: 'GBP', toCurrency: 'USD', fromAmount: '1,500.00 GBP', toAmount: '1,912.50 USD' } },
  { name: 'Marco Rossi', subtitle: labels.sentByYou, amount: '650.00 EUR', isPositive: false, icon: <Send size={24} />, date: '14 February', currency: 'EUR' },

  // 12 Feb — USD: -8.00 -29.00 | GBP: -34.20
  { name: 'Webflow', subtitle: labels.spentByYou, amount: '29.00 USD', isPositive: false, imgSrc: logoUrl('webflow.com'), date: '12 February', currency: 'USD' },
  { name: 'Tesco', subtitle: labels.spentByYou, amount: '34.20 GBP', isPositive: false, imgSrc: logoUrl('tesco.com'), date: '12 February', currency: 'GBP' },
  { name: 'Dropbox', subtitle: labels.spentByYou, amount: '24.00 USD', isPositive: false, imgSrc: logoUrl('dropbox.com'), date: '12 February', currency: 'USD' },

  // 10 Feb — GBP: +5,000.00 -342.80
  { name: consumerName, subtitle: labels.addedByYou, amount: '+ 5,000.00 GBP', isPositive: true, icon: <Plus size={24} />, date: '10 February', currency: 'GBP' },
  { name: 'Printful', subtitle: labels.sentByYou, amount: '342.80 GBP', isPositive: false, icon: <Send size={24} />, date: '10 February', currency: 'GBP' },

  // 8 Feb — GBP: -1,840.00
  { name: 'HMRC', subtitle: labels.sentByYou, amount: '1,840.00 GBP', isPositive: false, icon: <Send size={24} />, date: '8 February', currency: 'GBP' },

  // 5 Feb — GBP: +3,500.00
  { name: 'Acme Corp', amount: '+ 3,500.00 GBP', isPositive: true, icon: <Receive size={24} />, date: '5 February', currency: 'GBP' },
  ];
}

export const businessTransactions: Transaction[] = buildBusinessTransactions('Connor Berry');
