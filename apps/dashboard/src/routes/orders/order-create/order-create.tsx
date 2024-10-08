import { Heading } from '@/components/ui/heading';

import { CreateOrderForm } from '../order-list/components/forms/create-order-form';

export const OrderCreate = () => {
  const onClose = () => {
    console.log('onClose');
  };

  return (
    <div>
      <Heading className="mb-8">Create Order</Heading>
      <CreateOrderForm onClose={onClose} />;
    </div>
  );
};
