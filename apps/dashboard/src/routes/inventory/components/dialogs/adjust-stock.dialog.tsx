import React from 'react';

import { IProductVariant } from '@shared';

import { Dialog, DialogBody, DialogTitle } from '@/components/ui/dialog';

import { AdjustStockForm } from '../forms/adjust-stock-form';

interface AdjustStockDialogProps {
  isOpen: boolean;
  onClose: () => void;
  variant: IProductVariant;
}

export const AdjustStockDialog: React.FC<AdjustStockDialogProps> = ({ isOpen, onClose, variant }) => {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Adjust Stock for {variant.name}</DialogTitle>
      <DialogBody>
        <AdjustStockForm variant={variant} onClose={onClose} />
      </DialogBody>
    </Dialog>
  );
};
