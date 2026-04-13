import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Transaction } from '@shared/data/transactions';

export type ScheduledTransferItem = {
  id: string;
  recipientName: string;
  amount: number;
  currency: string;
  repeats: 'never' | 'weekly' | 'monthly';
  nextDate: Date;
};

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
  jointCardType: null,
  setJointCardType: () => {},
  scheduledTransfers: [],
  setScheduledTransfers: () => {},
  jointBalanceAdjustment: 0,
  setJointBalanceAdjustment: () => {},
  jointPartnerName: null,
  setJointPartnerName: () => {},
  jointTransactions: [],
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
  const [jointCardType, setJointCardType] = useState<'digital' | 'physical' | null>(null);
  const [scheduledTransfers, setScheduledTransfers] = useState<ScheduledTransferItem[]>([]);
  const [jointBalanceAdjustment, setJointBalanceAdjustment] = useState(0);
  const [jointPartnerName, setJointPartnerName] = useState<string | null>(null);
  const [jointTransactions, setJointTransactions] = useState<Transaction[]>([]);

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
