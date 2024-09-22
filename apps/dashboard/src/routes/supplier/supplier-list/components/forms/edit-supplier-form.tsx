import { toast } from 'sonner';
import { ISupplier } from '@shared';

import { useUpdateSupplier } from '@/hooks/api/supplier.hooks';

import { SupplierForm } from './supplier-form';
import { SupplierFormData } from './supplier.schema';

export const EditSupplierForm = (props: { supplier: ISupplier; onClose: () => void }) => {
  const { mutateAsync, isPending } = useUpdateSupplier(props.supplier.id!);

  const handleSubmit = async (data: SupplierFormData) => {
    await mutateAsync(data, {
      onSuccess: () => {
        toast.success('Supplier updated', {
          description: `${data.companyName} was successfully updated`,
          closeButton: true,
        });
      },
      onError: (e) => {
        toast.error('Failed to update supplier', {
          description: e.message,
          closeButton: true,
        });
      },
    });
  };

  return <SupplierForm supplier={props.supplier} isPending={isPending} onSubmit={handleSubmit} onClose={props.onClose} />;
};
