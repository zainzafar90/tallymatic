import React from 'react';

import { toast } from 'sonner';
import { IOrder } from '@shared';

import { useUpdateOrder } from '@/hooks/api/order.hooks';

import { OrderForm } from './order-form';
import { OrderFormData } from './order.schema';

export const EditOrderForm: React.FC<{ order: IOrder; onClose: () => void }> = ({ order, onClose }) => {
  const { mutateAsync, isPending } = useUpdateOrder(order.id!);

  const handleSubmit = async (data: OrderFormData) => {
    await mutateAsync(
      {
        ...data,
      },
      {
        onSuccess: () => {
          toast.success('Order updated', {
            description: `Order #${data.number} was successfully updated`,
            closeButton: true,
          });
        },
        onError: (e) => {
          toast.error('Failed to updated order', {
            description: e.message,
            closeButton: true,
          });
        },
      }
    );
  };

  return <OrderForm order={order} onSubmit={handleSubmit} onClose={onClose} isPending={isPending} />;
};
