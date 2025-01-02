import React from 'react';

import { toast } from 'sonner';
import { CreatePurchaseReq } from '@repo/shared';

import { useCreatePurchase } from '@/hooks/api/purchase.hooks';

import { PurchaseForm } from './purchase-form';
import { PurchaseFormData } from './purchase.schema';

export const CreatePurchaseForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { mutateAsync, isPending } = useCreatePurchase();

  const handleSubmit = async (data: PurchaseFormData) => {
    await mutateAsync(data as CreatePurchaseReq, {
      onSuccess: (successData) => {
        toast.success('Purchase created', {
          description: `Purchase #${successData.id} was successfully created`,
          closeButton: true,
        });
      },
      onError: (e) => {
        toast.error('Failed to create purchase', {
          description: e.message,
          closeButton: true,
        });
      },
    });
  };

  return <PurchaseForm onSubmit={handleSubmit} onClose={onClose} isPending={isPending} />;
};
