import { createContext, useContext, useState, type ReactNode } from 'react';
import { Plus, Convert, Send } from '@transferwise/icons';
import type { Transaction } from '@shared/data/transactions';

export type ScheduledTransferItem = {
  id: string;
  recipientName: string;
  amount: number;
  currency: string;
  repeats: 'never' | 'weekly' | 'monthly';
  nextDate: Date;
};

export type DirectDebitItem = {
  id: string;
  merchantName: string;
  amount: number;
  currency: string;
  reference: string;
  nextDate: Date;
  logoSrc?: string;
};

// ─── Joint account defaults ────────────────────────────────────────────────
const logo = (d: string) =>
  `https://img.logo.dev/${d}?token=pk_CkDnlfI6QH-YA3A_mVN8gA&size=128&format=png`;

const DEFAULT_JOINT_PARTNER = 'Sky Dog';

const DEFAULT_JOINT_TRANSACTIONS: Transaction[] = [
  { name: 'From GBP', subtitle: `Added by ${DEFAULT_JOINT_PARTNER}`, amount: '+800.00 GBP', isPositive: true, icon: <Plus size={24} />, date: 'Today', currency: 'GBP' },
  { name: 'From GBP', subtitle: 'Moved by you', amount: '+1,200.00 GBP', isPositive: true, icon: <Convert size={24} />, date: '11 Apr', currency: 'GBP' },
  { name: 'Waitrose', subtitle: `Spent by ${DEFAULT_JOINT_PARTNER}`, amount: '-67.43 GBP', isPositive: false, imgSrc: logo('waitrose.com'), date: '9 Apr', currency: 'GBP' },
  { name: 'Amazon', subtitle: 'Spent by you', amount: '-45.99 GBP', isPositive: false, imgSrc: logo('amazon.co.uk'), date: '8 Apr', currency: 'GBP' },
  { name: 'Oliver Bennett', subtitle: 'Sent by you', amount: '-1,200.00 GBP', isPositive: false, icon: <Send size={24} />, date: '1 Apr', currency: 'GBP' },
];

const DEFAULT_JOINT_BALANCE = 2000;
// ──────────────────────────────────────────────────────────────────────────

interface PrototypeNamesContextValue {
  consumerName: string;
  setConsumerName: (name: string) => void;
  businessName: string;
  setBusinessName: (name: string) => void;
  consumerHomeCurrency: string;
  setConsumerHomeCurrency: (code: string) => void;
  businessHomeCurrency: string;
  setBusinessHomeCurrency: (code: string) => void;
  // Joint account prototype state
  hasIncomingInvite: boolean;
  setHasIncomingInvite: (val: boolean) => void;
  pendingJointInviteName: string | null;
  setPendingJointInviteName: (name: string | null) => void;
  jointAccountAccepted: boolean;
  setJointAccountAccepted: (val: boolean) => void;
  jointCardType: 'digital' | 'physical' | null;
  setJointCardType: (val: 'digital' | 'physical' | null) => void;
  // Scheduled transfers
  scheduledTransfers: ScheduledTransferItem[];
  setScheduledTransfers: (items: ScheduledTransferItem[] | ((prev: ScheduledTransferItem[]) => ScheduledTransferItem[])) => void;
  // Joint account direct debits
  directDebits: DirectDebitItem[];
  setDirectDebits: (items: DirectDebitItem[] | ((prev: DirectDebitItem[]) => DirectDebitItem[])) => void;
  // Joint account balance
  jointBalanceAdjustment: number;
  setJointBalanceAdjustment: (val: number | ((prev: number) => number)) => void;
  // Joint account partner & transactions
  jointPartnerName: string | null;
  setJointPartnerName: (name: string | null) => void;
  jointTransactions: Transaction[];
  setJointTransactions: (items: Transaction[] | ((prev: Transaction[]) => Transaction[])) => void;
}

const PrototypeNamesContext = createContext<PrototypeNamesContextValue>({
  consumerName: 'Gandhali Mane',
  setConsumerName: () => {},
  businessName: 'Berry Design',
  setBusinessName: () => {},
  consumerHomeCurrency: 'GBP',
  setConsumerHomeCurrency: () => {},
  businessHomeCurrency: 'GBP',
  setBusinessHomeCurrency: () => {},
  hasIncomingInvite: false,
  setHasIncomingInvite: () => {},
  pendingJointInviteName: null,
  setPendingJointInviteName: () => {},
  jointAccountAccepted: false,
  setJointAccountAccepted: () => {},
  jointCardType: 'physical',
  setJointCardType: () => {},
  scheduledTransfers: [],
  setScheduledTransfers: () => {},
  directDebits: [],
  setDirectDebits: () => {},
  jointBalanceAdjustment: DEFAULT_JOINT_BALANCE,
  setJointBalanceAdjustment: () => {},
  jointPartnerName: DEFAULT_JOINT_PARTNER,
  setJointPartnerName: () => {},
  jointTransactions: DEFAULT_JOINT_TRANSACTIONS,
  setJointTransactions: () => {},
});

export function PrototypeNamesProvider({ children }: { children: ReactNode }) {
  const [consumerName, setConsumerName] = useState('Gandhali Mane');
  const [businessName, setBusinessName] = useState('Berry Design');
  const [consumerHomeCurrency, setConsumerHomeCurrency] = useState('GBP');
  const [businessHomeCurrency, setBusinessHomeCurrency] = useState('GBP');
  const [hasIncomingInvite, setHasIncomingInvite] = useState(false);
  const [pendingJointInviteName, setPendingJointInviteName] = useState<string | null>(null);
  const [jointAccountAccepted, setJointAccountAccepted] = useState(false);
  const [jointCardType, setJointCardType] = useState<'digital' | 'physical' | null>('physical');
  const [scheduledTransfers, setScheduledTransfers] = useState<ScheduledTransferItem[]>([]);
  const [directDebits, setDirectDebits] = useState<DirectDebitItem[]>([]);
  const [jointBalanceAdjustment, setJointBalanceAdjustment] = useState(DEFAULT_JOINT_BALANCE);
  const [jointPartnerName, setJointPartnerName] = useState<string | null>(DEFAULT_JOINT_PARTNER);
  const [jointTransactions, setJointTransactions] = useState<Transaction[]>(DEFAULT_JOINT_TRANSACTIONS);

  return (
    <PrototypeNamesContext.Provider value={{
      consumerName, setConsumerName,
      businessName, setBusinessName,
      consumerHomeCurrency, setConsumerHomeCurrency,
      businessHomeCurrency, setBusinessHomeCurrency,
      hasIncomingInvite, setHasIncomingInvite,
      pendingJointInviteName, setPendingJointInviteName,
      jointAccountAccepted, setJointAccountAccepted,
      jointCardType, setJointCardType,
      scheduledTransfers, setScheduledTransfers,
      directDebits, setDirectDebits,
      jointBalanceAdjustment, setJointBalanceAdjustment,
      jointPartnerName, setJointPartnerName,
      jointTransactions, setJointTransactions,
    }}>
      {children}
    </PrototypeNamesContext.Provider>
  );
}

export function usePrototypeNames() {
  return useContext(PrototypeNamesContext);
}
