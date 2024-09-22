import { Pencil, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { ISupplier } from '@shared';

import { ActionMenu } from '@/components/common/action-menu';
import { usePrompt } from '@/components/common/use-prompt';
import { useDeleteSupplier } from '@/hooks/api/supplier.hooks';
import { useToggleState } from '@/hooks/use-toggle-state';

import { EditSupplierDialog } from '../dialogs/edit-supplier.dialog';

export const SupplierActions = ({ supplier }: { supplier: ISupplier }) => {
  const { prompt, PromptDialog } = usePrompt();
  const { mutateAsync } = useDeleteSupplier(supplier.id!);
  const [editOpen, showEditModal, closeEditModal] = useToggleState();

  const handleDelete = async () => {
    const confirmed = await prompt({
      title: 'Are you sure?',
      description: `You are about to delete the supplier ${supplier.companyName}. This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      destructive: true,
    });

    if (!confirmed) {
      return;
    }

    await mutateAsync(undefined, {
      onSuccess: () => {
        toast.success('Supplier deleted', {
          description: `${supplier.companyName} was successfully deleted`,
        });
      },
      onError: (e) => {
        toast.error('Failed to delete supplier', {
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
      <EditSupplierDialog supplier={supplier} isOpen={editOpen} onClose={closeEditModal} />
    </div>
  );
};
