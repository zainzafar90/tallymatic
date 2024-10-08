import { CreateOrderForm } from '../order-list/components/forms/create-order-form';

export const OrderCreate = () => {
  const onClose = () => {
    console.log('onClose');
  };

  return <CreateOrderForm onClose={onClose} />;
};
