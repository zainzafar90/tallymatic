import { toast } from 'sonner';
import { IProduct, Status } from '@shared';

import { useUpdateProduct } from '@/hooks/api/products.hooks';

import { ProductForm, ProductFormData } from './product-form';

export const EditProductForm = (props: { product: IProduct; onClose: () => void }) => {
  const { mutateAsync, isPending } = useUpdateProduct(props.product.id);

  const handleSubmit = async (data: ProductFormData) => {
    await mutateAsync(
      {
        id: props.product.id,
        ...data,
        variants: data.variants.map((variant) => ({
          ...variant,
          status: 'active' as Status,
        })),
      },
      {
        onSuccess: () => {
          toast.success('Product updated', {
            description: `${data.name} was successfully updated`,
            closeButton: true,
          });
        },
        onError: (e) => {
          toast.error('Failed to update product', {
            description: e.message,
            closeButton: true,
          });
        },
      }
    );
  };

  return <ProductForm product={props.product} isPending={isPending} onSubmit={handleSubmit} onClose={props.onClose} />;
};
