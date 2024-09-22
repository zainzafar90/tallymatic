import { toast } from 'sonner';

import { useCreateSupplier } from '@/hooks/api/supplier.hooks';

import { SupplierForm } from './supplier-form';
import { SupplierFormData } from './supplier.schema';

export const CreateSupplierForm = (props: { onClose: () => void }) => {
  const { mutateAsync, isPending } = useCreateSupplier();

  const handleSubmit = async (data: SupplierFormData) => {
    await mutateAsync(data, {
      onSuccess: () => {
        toast.success('Supplier created', {
          description: `${data.companyName} was successfully created`,
          closeButton: true,
        });
      },
      onError: (e) => {
        toast.error('Failed to create supplier', {
          description: e.message,
          closeButton: true,
        });
      },
    });
  };

  return <SupplierForm onSubmit={handleSubmit} onClose={props.onClose} isPending={isPending} />;
};
