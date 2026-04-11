import { createContext, useContext, useState, type ReactNode } from 'react';

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
    }}>
      {children}
    </PrototypeNamesContext.Provider>
  );
}

export function usePrototypeNames() {
  return useContext(PrototypeNamesContext);
}
