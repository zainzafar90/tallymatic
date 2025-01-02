import { toast } from 'sonner';
import { IProduct, IProductVariant, Status } from '@repo/shared';

import { useUpdateProduct } from '@/hooks/api/products.hooks';

import { ProductForm } from './product-form';
import { ProductFormData } from './product.schema';

export const EditProductForm = (props: { product: IProduct; onClose: () => void }) => {
  const { mutateAsync, isPending } = useUpdateProduct(props.product.id);

  const handleSubmit = async (data: ProductFormData) => {
    await mutateAsync(
      {
        ...data,
        categoryId: data.categoryId ? data.categoryId : undefined,
        variants: data.variants as IProductVariant[],
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
