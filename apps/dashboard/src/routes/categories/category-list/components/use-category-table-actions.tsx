import { Pencil, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { ICategory } from '@shared';

import { ActionMenu } from '@/components/common/action-menu';
import { usePrompt } from '@/components/common/use-prompt';
import { useDeleteCategory } from '@/hooks/api/category.hooks';
import { useToggleState } from '@/hooks/use-toggle-state';

import { EditCategoryDialog } from './edit-category.dialog';

export const CategoryActions = ({ category }: { category: ICategory }) => {
  const { prompt, PromptDialog } = usePrompt();
  const { mutateAsync } = useDeleteCategory(category.id);
  const [editOpen, showEditModal, closeEditModal] = useToggleState();

  const handleDelete = async () => {
    const confirmed = await prompt({
      title: 'Are you sure?',
      description: `You are about to delete the category ${category.name}. This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      destructive: true,
    });

    if (!confirmed) {
      return;
    }

    await mutateAsync(undefined, {
      onSuccess: () => {
        toast.success('Category deleted', {
          description: `${category.name} was successfully deleted`,
        });
      },
      onError: (e) => {
        toast.error('Failed to delete category', {
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
      <EditCategoryDialog category={category} isOpen={editOpen} onClose={closeEditModal} />
    </div>
  );
};
