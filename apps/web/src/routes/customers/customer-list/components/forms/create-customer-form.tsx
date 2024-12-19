import { toast } from 'sonner';

import { useCreateCustomer } from '@/hooks/api/customer.hooks';

import { CustomerForm } from './customer-form';
import { CustomerFormData } from './customer.schema';

export const CreateCustomerForm = (props: { onClose: () => void }) => {
  const { mutateAsync, isPending } = useCreateCustomer();

  const handleSubmit = async (data: CustomerFormData) => {
    await mutateAsync(data, {
      onSuccess: () => {
        toast.success('Customer created', {
          description: `${data.name} was successfully created`,
          closeButton: true,
        });
      },
      onError: (e) => {
        toast.error('Failed to create customer', {
          description: e.message,
          closeButton: true,
        });
      },
    });
  };

  return <CustomerForm onSubmit={handleSubmit} onClose={props.onClose} isPending={isPending} />;
};
