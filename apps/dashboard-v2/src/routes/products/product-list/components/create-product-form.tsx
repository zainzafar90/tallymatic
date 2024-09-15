import { toast } from 'sonner';
import { Status } from '@shared';

import { useCreateProduct } from '@/hooks/api/products.hooks';

import { ProductForm, ProductFormData } from './product-form';

export const CreateProductForm = (props: { onClose: () => void }) => {
  const { mutateAsync, isPending } = useCreateProduct();

  const handleSubmit = async (data: ProductFormData) => {
    await mutateAsync(
      {
        ...data,
        variants: data.variants.map((variant) => ({
          ...variant,
          status: 'active' as Status,
        })),
      },
      {
        onSuccess: () => {
          toast.success('Product created', {
            description: `${data.name} was successfully created`,
            closeButton: true,
          });
        },
        onError: (e) => {
          toast.error('Failed to create product', {
            description: e.message,
            closeButton: true,
          });
        },
      }
    );
  };

  return <ProductForm onSubmit={handleSubmit} onClose={props.onClose} isPending={isPending} />;
};
