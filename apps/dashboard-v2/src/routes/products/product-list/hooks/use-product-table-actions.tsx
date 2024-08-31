import { MoreHorizontal, Pencil, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { IProduct } from '@shared';

import { usePrompt } from '@/components/common/use-prompt';
import { Dropdown, DropdownButton, DropdownItem, DropdownLabel, DropdownMenu } from '@/components/ui/dropdown';
import { useDeleteProduct } from '@/hooks/api/products';

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
      <Dropdown>
        <DropdownButton outline aria-label="More Options" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-6 w-6" />
        </DropdownButton>
        <DropdownMenu anchor="top end">
          <DropdownItem href={`/products/${product.id}/edit`}>
            <DropdownLabel className="flex items-center gap-2">
              <Pencil className="w-4 h-4" />
              Edit
            </DropdownLabel>
          </DropdownItem>
          <DropdownItem onClick={handleDelete}>
            <DropdownLabel className="flex items-center gap-2">
              <Trash className="w-4 h-4" />
              Delete
            </DropdownLabel>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <PromptDialog />
    </div>
  );
};
