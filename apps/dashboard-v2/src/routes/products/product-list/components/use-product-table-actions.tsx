import { Pencil, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { IProduct } from '@shared';

import { ActionMenu } from '@/components/common/action-menu';
import { usePrompt } from '@/components/common/use-prompt';
import { useDeleteProduct } from '@/hooks/api/products.hooks';

export const ProductActions = ({ product }: { product: IProduct }) => {
  const { prompt, PromptDialog } = usePrompt();
  const { mutateAsync } = useDeleteProduct(product.id!);

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
          closeButton: true,
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

  return (
    <div className="text-right">
      <ActionMenu
        actions={[
          {
            icon: <Pencil className="w-4 h-4" />,
            label: 'Edit',
            to: `/products/${product.id}/edit`,
          },
          {
            icon: <Trash className="w-4 h-4" />,
            label: 'Delete',
            onClick: handleDelete,
          },
        ]}
      />

      <PromptDialog />
    </div>
  );
};
