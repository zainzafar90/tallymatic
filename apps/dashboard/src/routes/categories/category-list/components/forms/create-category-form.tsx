import { toast } from 'sonner';
import { Status } from '@shared';

import { useCreateCategory } from '@/hooks/api/category.hooks';

import { CategoryForm, CategoryFormData } from './category-form';

export const CreateCategoryForm = (props: { onClose: () => void }) => {
  const { mutateAsync, isPending } = useCreateCategory();

  const handleSubmit = async (data: CategoryFormData) => {
    await mutateAsync(
      {
        ...data,
        status: data.status as Status,
      },
      {
        onSuccess: () => {
          toast.success('Category created', {
            description: `${data.name} was successfully created`,
            closeButton: true,
          });
        },
        onError: (e) => {
          toast.error('Failed to create category', {
            description: e.message,
            closeButton: true,
          });
        },
      }
    );
  };

  return <CategoryForm onSubmit={handleSubmit} onClose={props.onClose} isPending={isPending} />;
};
