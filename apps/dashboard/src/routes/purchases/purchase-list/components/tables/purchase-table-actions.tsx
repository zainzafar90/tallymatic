import React from 'react';

import { Pencil, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { IPurchase } from '@shared';

import { ActionMenu } from '@/components/common/action-menu';
import { usePrompt } from '@/components/common/use-prompt';
import { useDeletePurchase } from '@/hooks/api/purchase.hooks';
import { useToggleState } from '@/hooks/use-toggle-state';

import { EditPurchaseDialog } from '../dialogs/edit-purchase.dialog';

export const PurchaseActions: React.FC<{ purchase: IPurchase }> = ({ purchase }) => {
  const { prompt, PromptDialog } = usePrompt();
  const { mutateAsync: deletePurchase } = useDeletePurchase(purchase.id!);
  const [editOpen, showEditModal, closeEditModal] = useToggleState();

  const handleDelete = async () => {
    const confirmed = await prompt({
      title: 'Delete Purchase',
      description: `Are you sure you want to delete purchase ${purchase.orderNumber}?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
    });

    if (confirmed) {
      try {
        await deletePurchase();
        toast.success('Purchase deleted successfully');
      } catch (error) {
        toast.error('Failed to delete purchase');
      }
    }
  };

  return (
    <>
      <ActionMenu
        actions={[
          { icon: <Pencil className="w-4 h-4" />, label: 'Edit', onClick: showEditModal },
          { icon: <Trash className="w-4 h-4" />, label: 'Delete', onClick: handleDelete },
        ]}
      />
      <EditPurchaseDialog purchase={purchase} isOpen={editOpen} onClose={closeEditModal} />
      <PromptDialog />
    </>
  );
};
