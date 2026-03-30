import { createContext, useContext, useState, type ReactNode } from 'react';

type ShimmerContextValue = {
  shimmerMode: boolean;
  setShimmerMode: (on: boolean) => void;
};

const ShimmerContext = createContext<ShimmerContextValue>({ shimmerMode: false, setShimmerMode: () => {} });

export function ShimmerProvider({ children }: { children: ReactNode }) {
  const [shimmerMode, setShimmerMode] = useState(false);
  return (
    <ShimmerContext.Provider value={{ shimmerMode, setShimmerMode }}>
      {children}
    </ShimmerContext.Provider>
  );
}

export function useShimmer() {
  return useContext(ShimmerContext);
}
