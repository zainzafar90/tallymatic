import React from 'react';

import { Pencil, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { IOrder } from '@shared';

import { ActionMenu } from '@/components/common/action-menu';
import { usePrompt } from '@/components/common/use-prompt';
import { useDeleteOrder } from '@/hooks/api/order.hooks';
import { useToggleState } from '@/hooks/use-toggle-state';

import { EditOrderDialog } from '../dialogs/edit-order-dialog';

export const OrderActions: React.FC<{ order: IOrder }> = ({ order }) => {
  const { prompt, PromptDialog } = usePrompt();
  const { mutateAsync: deleteOrder } = useDeleteOrder(order.id!);
  const [editOpen, showEditModal, closeEditModal] = useToggleState();

  const handleDelete = async () => {
    const confirmed = await prompt({
      title: 'Delete Order',
      description: `Are you sure you want to delete order ${order.number}?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
    });

    if (confirmed) {
      try {
        await deleteOrder();
        toast.success('Order deleted successfully');
      } catch (error) {
        toast.error('Failed to delete order');
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
      <EditOrderDialog order={order} isOpen={editOpen} onClose={closeEditModal} />
      <PromptDialog />
    </>
  );
};
