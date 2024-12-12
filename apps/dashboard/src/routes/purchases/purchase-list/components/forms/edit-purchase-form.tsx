import React from 'react';

import { toast } from 'sonner';
import { IPurchase } from '@shared';

import { useUpdatePurchase } from '@/hooks/api/purchase.hooks';

import { PurchaseForm } from './purchase-form';
import { PurchaseFormData } from './purchase.schema';

export const EditPurchaseForm: React.FC<{ purchase: IPurchase; onClose: () => void }> = ({ purchase, onClose }) => {
  const { mutateAsync, isPending } = useUpdatePurchase(purchase.id!);

  const handleSubmit = async (data: PurchaseFormData) => {
    await mutateAsync(data, {
      onSuccess: () => {
        toast.success('Purchase updated', {
          description: 'Purchase was successfully updated',
          closeButton: true,
        });
      },
      onError: (e) => {
        toast.error('Failed to update purchase', {
          description: e.message,
          closeButton: true,
        });
      },
    });
  };

  return <PurchaseForm purchase={purchase} onSubmit={handleSubmit} onClose={onClose} isPending={isPending} />;
};
