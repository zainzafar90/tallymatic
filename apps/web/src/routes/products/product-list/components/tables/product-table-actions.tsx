import React from 'react';

import { Pencil, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { IProduct } from '@repo/shared';

import { ActionMenu } from '@/components/common/action-menu';
import { useDeleteDialog } from '@/components/common/use-delete-dialog';
import { useDeleteProduct } from '@/hooks/api/products.hooks';
import { useToggleState } from '@/hooks/use-toggle-state';

import { EditProductDialog } from '../dialogs/edit-product.dialog';

export const ProductActions: React.FC<{ product: IProduct }> = ({ product }) => {
  const { openDeleteDialog, DeleteDialog } = useDeleteDialog();
  const { mutateAsync: deleteProduct } = useDeleteProduct(product.id);
  const [editOpen, showEditModal, closeEditModal] = useToggleState();

  const handleDelete = async () => {
    const confirmed = await openDeleteDialog({
      title: 'Delete Product',
      description: `Are you sure you want to delete the product "${product.name}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      requireDeleteConfirm: true,
      deleteConfirmationText: product.name, 
    });

    if (confirmed) {
      try {
        await deleteProduct();
        toast.success('Product deleted successfully', {
          description: `The product "${product.name}" has been deleted.`,
        });
      } catch (error) {
        toast.error('Failed to delete product', {
          description: 'An unexpected error occurred.',
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
      <EditProductDialog product={product} isOpen={editOpen} onClose={closeEditModal} />
      <DeleteDialog />
    </>
  );
};
