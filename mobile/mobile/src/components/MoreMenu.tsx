import { useState, useEffect, type ReactNode } from 'react';
import { ListItem } from '@transferwise/components';
import { BottomSheet } from './BottomSheet';
import { useLanguage } from '../context/Language';

type MenuItem = {
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
};

type Props = {
  items: MenuItem[];
  externalOpen?: boolean;
  onExternalClose?: () => void;
};

export function MoreMenu({ items, externalOpen, onExternalClose }: Props) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (externalOpen) setOpen(true);
  }, [externalOpen]);

  const handleClose = () => {
    setOpen(false);
    onExternalClose?.();
  };

  return (
    <BottomSheet
      open={open}
      onClose={handleClose}
      title={t('common.more')}
    >
      <div style={{ padding: '0 16px' }}>
        {items.map((item, i) => (
          <ListItem
            key={i}
            as="div"
            title={item.label}
            media={item.icon ? (
              <ListItem.AvatarView size={48}>
                {item.icon}
              </ListItem.AvatarView>
            ) : undefined}
            control={<ListItem.Navigation onClick={() => { item.onClick?.(); handleClose(); }} />}
          />
        ))}
      </div>
    </BottomSheet>
  );
}
