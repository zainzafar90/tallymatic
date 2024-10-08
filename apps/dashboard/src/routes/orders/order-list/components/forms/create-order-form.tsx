import React from 'react';

import { toast } from 'sonner';
import { CreateOrderReq } from '@shared';

import { useCreateOrder } from '@/hooks/api/order.hooks';

import { OrderForm } from './order-form';
import { OrderFormData } from './order.schema';

export const CreateOrderForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { mutateAsync, isPending } = useCreateOrder();

  const handleSubmit = async (data: OrderFormData) => {
    await mutateAsync(data as CreateOrderReq, {
      onSuccess: (successData) => {
        toast.success('Order created', {
          description: `Order #${successData.id} was successfully created`,
          closeButton: true,
        });
      },
      onError: (e) => {
        toast.error('Failed to create order', {
          description: e.message,
          closeButton: true,
        });
      },
    });
  };

  return <OrderForm onSubmit={handleSubmit} onClose={onClose} isPending={isPending} />;
};
