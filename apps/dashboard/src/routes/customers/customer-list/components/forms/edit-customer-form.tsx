import { toast } from 'sonner';
import { ICustomer } from '@shared';

import { useUpdateCustomer } from '@/hooks/api/customer.hooks';

import { CustomerForm } from './customer-form';
import { CustomerFormData } from './customer.schema';

export const EditCustomerForm = (props: { customer: ICustomer; onClose: () => void }) => {
  const { mutateAsync, isPending } = useUpdateCustomer(props.customer.id!);

  const handleSubmit = async (data: CustomerFormData) => {
    await mutateAsync(data, {
      onSuccess: () => {
        toast.success('Customer updated', {
          description: `${data.name} was successfully updated`,
          closeButton: true,
        });
      },
      onError: (e) => {
        toast.error('Failed to update customer', {
          description: e.message,
          closeButton: true,
        });
      },
    });
  };

  return <CustomerForm customer={props.customer} isPending={isPending} onSubmit={handleSubmit} onClose={props.onClose} />;
};
