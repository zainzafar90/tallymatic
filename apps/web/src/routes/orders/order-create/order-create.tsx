import { Heading } from '@/components/ui/heading';

import { CreateOrderForm } from '../order-list/components/forms/create-order-form';

export const OrderCreate = () => {
  const onClose = () => {
    console.log('onClose');
  };

  return (
    <div>
      <CreateOrderForm onClose={onClose} />
    </div>
  );
};
