import { Pencil, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { ICustomer } from '@shared';

import { ActionMenu } from '@/components/common/action-menu';
import { usePrompt } from '@/components/common/use-prompt';
import { useDeleteCustomer } from '@/hooks/api/customer.hooks';
import { useToggleState } from '@/hooks/use-toggle-state';

import { EditCustomerDialog } from '../dialog/edit-customer.dialog';

export const CustomerActions = ({ customer }: { customer: ICustomer }) => {
  const { prompt, PromptDialog } = usePrompt();
  const { mutateAsync } = useDeleteCustomer(customer.id!);
  const [editOpen, showEditModal, closeEditModal] = useToggleState();

  const handleDelete = async () => {
    const confirmed = await prompt({
      title: 'Are you sure?',
      description: `You are about to delete the customer ${customer.name}. This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      destructive: true,
    });

    if (!confirmed) {
      return;
    }

    await mutateAsync(undefined, {
      onSuccess: () => {
        toast.success('Customer deleted', {
          description: `${customer.name} was successfully deleted`,
        });
      },
      onError: (e) => {
        toast.error('Failed to delete customer', {
          description: e.message,
          closeButton: true,
        });
      },
    });
  };

  const handleEdit = () => {
    showEditModal();
  };

  return (
    <div className="text-right">
      <ActionMenu
        actions={[
          {
            icon: <Pencil className="w-4 h-4" />,
            label: 'Edit',
            onClick: handleEdit,
          },
          {
            icon: <Trash className="w-4 h-4" />,
            label: 'Delete',
            onClick: handleDelete,
          },
        ]}
      />

      <PromptDialog />
      <EditCustomerDialog customer={customer} isOpen={editOpen} onClose={closeEditModal} />
    </div>
  );
};
