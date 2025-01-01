import React from 'react';

import { Pencil, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { IOrder } from '@repo/shared';

import { ActionMenu } from '@/components/common/action-menu';
import { useDeleteDialog } from '@/components/common/use-delete-dialog';
import { useDeleteOrder } from '@/hooks/api/order.hooks';
import { useToggleState } from '@/hooks/use-toggle-state';

import { EditOrderDialog } from '../dialogs/edit-order.dialog';

export const OrderActions: React.FC<{ order: IOrder }> = ({ order }) => {
  const { openDeleteDialog, DeleteDialog } = useDeleteDialog();
  const { mutateAsync: deleteOrder } = useDeleteOrder(order.id!);
  const [editOpen, showEditModal, closeEditModal] = useToggleState();

  const handleDelete = async () => {
    const confirmed = await openDeleteDialog({
      title: 'Delete Order',
      description: `Are you sure you want to delete order ${order.orderNumber}? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      requireDeleteConfirm: true,
      deleteConfirmationText: order.orderNumber, 
    });

    if (confirmed) {
      try {
        await deleteOrder();
        toast.success('Order deleted successfully', {
          description: `The order ${order.orderNumber} has been deleted.`,
        });
      } catch (error) {
        toast.error('Failed to delete order', {
          description:'An unexpected error occurred.',
        });
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
      <DeleteDialog />
    </>
  );
};
