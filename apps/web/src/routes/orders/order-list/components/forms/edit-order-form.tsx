import React from 'react';

import { toast } from 'sonner';
import { IOrder, UpdateOrderReq } from '@repo/shared';

import { useOrder, useUpdateOrder } from '@/hooks/api/order.hooks';

import { OrderForm } from './order-form';
import { OrderFormSkeleton } from './order-form-skeleton';
import { OrderFormData } from './order.schema';

export const EditOrderForm: React.FC<{ order: IOrder; onClose: () => void }> = ({ order, onClose }) => {
  const { mutateAsync, isPending } = useUpdateOrder(order.id!);
  const { data: result, isLoading, error } = useOrder(order.id!);

  const handleSubmit = async (data: OrderFormData) => {
    await mutateAsync(data as UpdateOrderReq, {
      onSuccess: () => {
        toast.success('Order updated', {
          description: `Order was successfully updated`,
          closeButton: true,
        });
      },
      onError: (e) => {
        toast.error('Failed to updated order', {
          description: e.message,
          closeButton: true,
        });
      },
    });
  };

  if (error) {
    toast.error('Failed to fetch order', {
      description: error.message,
      closeButton: true,
    });
    onClose();
    return;
  }

  if (isLoading) {
    return <OrderFormSkeleton />;
  }

  return <OrderForm order={result} onSubmit={handleSubmit} onClose={onClose} isPending={isPending} />;
};
