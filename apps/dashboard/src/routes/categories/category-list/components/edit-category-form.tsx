import { toast } from 'sonner';
import { ICategory, Status } from '@shared';

import { useUpdateCategory } from '@/hooks/api/category.hooks';

import { CategoryForm, CategoryFormData } from './category-form';

export const EditCategoryForm = (props: { category: ICategory; onClose: () => void }) => {
  const { mutateAsync, isPending } = useUpdateCategory(props.category.id);

  const handleSubmit = async (data: CategoryFormData) => {
    await mutateAsync(
      {
        id: props.category.id,
        ...data,
        status: data.status as Status,
      },
      {
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
      }
    );
  };

  return <CategoryForm category={props.category} onSubmit={handleSubmit} onClose={props.onClose} isPending={isPending} />;
};
