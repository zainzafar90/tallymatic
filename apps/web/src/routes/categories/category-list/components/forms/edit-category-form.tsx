import { toast } from 'sonner';
import { ICategory, Status } from '@repo/shared';

import { useUpdateCategory } from '@/hooks/api/category.hooks';

import { CategoryForm } from './category-form';
import { CategoryFormData } from './category.schema';

export const EditCategoryForm = (props: { category: ICategory; onClose: () => void }) => {
  const { mutateAsync, isPending } = useUpdateCategory(props.category.id);

  const handleSubmit = async (data: CategoryFormData) => {
    await mutateAsync(data, {
      onSuccess: () => {
        toast.success('Category updated', {
          description: `${data.name} was successfully updated`,
          closeButton: true,
        });
        props.onClose();
      },
      onError: (e) => {
        toast.error('Failed to update category', {
          description: e.message,
          closeButton: true,
        });
      },
    });
  };

  return <CategoryForm category={props.category} onSubmit={handleSubmit} onClose={props.onClose} isPending={isPending} />;
};
