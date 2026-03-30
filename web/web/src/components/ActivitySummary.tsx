import { type ReactNode } from 'react';
import { ListItem } from '@transferwise/components';
import { useShimmer } from '../context/Shimmer';
import { ShimmerActivitySummary } from './Shimmer';

type Props = {
  icon?: ReactNode;
  imgSrc?: string;
  name: string;
  subtitle?: string;
  amount: string;
  amountSub?: string;
  isPositive?: boolean;
};

export function ActivitySummary({ icon, imgSrc, name, subtitle, amount, amountSub, isPositive }: Props) {
  const { shimmerMode } = useShimmer();

  if (shimmerMode) return <ShimmerActivitySummary />;

  return (
    <ListItem
      title={name}
      subtitle={subtitle}
      media={
        imgSrc ? (
          <ListItem.AvatarView size={48} imgSrc={imgSrc} style={{ border: 'none' }} />
        ) : (
          <ListItem.AvatarView size={48} style={{ backgroundColor: 'var(--color-background-neutral)', border: 'none' }}>
            {icon}
          </ListItem.AvatarView>
        )
      }
      valueTitle={
        isPositive ? (
          <span style={{ color: 'var(--color-sentiment-positive)' }}>{amount}</span>
        ) : (
          amount
        )
      }
      valueSubtitle={amountSub}
      control={<ListItem.Navigation onClick={() => {}} />}
    />
  );
}
