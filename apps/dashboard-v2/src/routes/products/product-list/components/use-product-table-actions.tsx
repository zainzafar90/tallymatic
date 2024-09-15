import { Pencil, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { IProduct } from '@shared';

import { ActionMenu } from '@/components/common/action-menu';
import { usePrompt } from '@/components/common/use-prompt';
import { useDeleteProduct } from '@/hooks/api/products.hooks';
import { useToggleState } from '@/hooks/use-toggle-state';

import { EditProductDialog } from './edit-product.dialog';

export const ProductActions = ({ product }: { product: IProduct }) => {
  const { prompt, PromptDialog } = usePrompt();
  const { mutateAsync } = useDeleteProduct(product.id);
  const [editOpen, showEditModal, closeEditModal] = useToggleState();

  const handleDelete = async () => {
    const confirmed = await prompt({
      title: 'Are you sure?',
      description: `You are about to delete the product ${product.name}. This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      destructive: true,
    });

    if (!confirmed) {
      return;
    }

    await mutateAsync(undefined, {
      onSuccess: () => {
        toast.success('Product deleted', {
          description: `${product.name} was successfully deleted`,
        });
      },
      onError: (e) => {
        toast.error('Failed to delete product', {
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
      <EditProductDialog product={product} isOpen={editOpen} onClose={closeEditModal} />
    </div>
  );
};
