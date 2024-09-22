import { BarChart2 } from 'lucide-react';
import { IProductVariant } from '@shared';

import { ActionMenu } from '@/components/common/action-menu';
import { useToggleState } from '@/hooks/use-toggle-state';

import { AdjustStockModal } from './adjust-stock-modal';

export const InventoryActions = ({ variant }: { variant: IProductVariant }) => {
  const [adjustStockOpen, showAdjustStockModal, closeAdjustStockModal] = useToggleState();

  const handleAdjustStock = () => {
    showAdjustStockModal();
  };

  return (
    <div className="text-right">
      <ActionMenu
        actions={[
          {
            icon: <BarChart2 className="w-4 h-4" />,
            label: 'Adjust Stock',
            onClick: handleAdjustStock,
          },
        ]}
      />

      <AdjustStockModal isOpen={adjustStockOpen} onClose={closeAdjustStockModal} variant={variant} />
    </div>
  );
};
