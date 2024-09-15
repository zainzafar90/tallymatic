import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IProduct, Status } from '@shared';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { ProductSchema } from './product.schema';

interface ProductEditViewProps {
  product: IProduct;
  onBack: () => void;
  onSave: (updatedProduct: IProduct) => void;
}

export const ProductEditView: React.FC<ProductEditViewProps> = ({ product, onBack, onSave }) => {
  const form = useForm({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: product.name,
      description: product.description,
      status: product.status,
      categoryId: product.categoryId,
      variants: product.variants.map((variant) => ({
        name: variant.name,
        sku: variant.sku,
        price: variant.price,
        costPrice: variant.costPrice,
        stock: variant.stock,
      })),
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    const updatedProduct: IProduct = {
      ...product,
      ...data,
      variants: data.variants.map((variant) => ({
        ...variant,
        status: Status.ACTIVE, // Use the correct enum value
      })),
    };
    onSave(updatedProduct);
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Add more fields for editing variants, category, etc. */}
        <div className="flex justify-between">
          <Button type="button" onClick={onBack}>
            Back
          </Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Form>
  );
};
