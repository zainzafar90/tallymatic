import { CircleMinus, CirclePlus } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { IProduct, IProductVariant, Status } from '@shared';

import { Button } from '@/components/ui/button';
import { DialogActions } from '@/components/ui/dialog';
import { Description, FieldGroup, Fieldset, Label } from '@/components/ui/fieldset';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useCategories } from '@/hooks/api/category.hooks';
import { useUpdateProduct } from '@/hooks/api/products.hooks';
import { parseFloat } from '@/utils/number-utils';
import { generateSKU } from '@/utils/product.utils';

import { ProductSchema } from './create-product.schema';

export const EditProductForm = (props: { product: IProduct; onClose: () => void }) => {
  const { mutateAsync, isPending } = useUpdateProduct(props.product.id);
  const { results: categories, isLoading: isCategoriesLoading } = useCategories();

  const form = useForm({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: props.product.name,
      description: props.product.description,
      status: props.product.status,
      categoryId: props.product.categoryId,
      variants: props.product.variants.map((variant) => ({
        name: variant.name,
        sku: variant.sku,
        price: parseFloat(variant.price),
        costPrice: parseFloat(variant.costPrice),
        stock: variant.stock,
      })),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'variants',
    rules: { minLength: 1 },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(
      {
        id: props.product.id,
        name: data.name,
        description: data.description,
        status: data.status as Status,
        categoryId: data.categoryId ? data.categoryId : undefined,
        variants: data.variants.map(
          (variant) =>
            ({
              name: variant.name,
              sku: variant.sku,
              price: variant.price,
              costPrice: variant.costPrice,
              stock: variant.stock,
              status: 'active',
            } as IProductVariant)
        ),
      },
      {
        onSuccess: () => {
          toast.success('Product updated', {
            description: `${data.name} was successfully updated`,
            closeButton: true,
          });
        },
        onError: (e) => {
          toast.error('Failed to updated product', {
            description: e.message,
            closeButton: true,
          });
        },
      }
    );
    props.onClose();
    form.reset();
  });

  const updateSKUs = (productName: string) => {
    const updatedVariants = form.getValues('variants').map((variant) => ({
      ...variant,
      sku: generateSKU(productName, variant.sku),
    }));
    form.setValue('variants', updatedVariants);
  };

  const addVariant = () => {
    const productName = form.getValues('name');
    const newSKU = generateSKU(productName, `SKU-${Math.floor(1000 + Math.random() * 9000)}-${fields.length + 1}`);
    append({ name: 'Default', sku: newSKU, price: 0, costPrice: 0, stock: 0 });
  };

  const removeVariant = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <div className="flex gap-4 w-full flex-col md:flex-row">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem className="w-full">
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter product name"
                        autoFocus
                        onChange={(e) => {
                          field.onChange(e);
                          updateSKUs(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => {
                return (
                  <FormItem className="w-full">
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select {...field} disabled={isCategoriesLoading}>
                        <option value="" disabled>
                          Select a category&hellip;
                        </option>
                        {categories?.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                  </FormItem>
                );
              }}
            />
          </div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter product description" />
                  </FormControl>
                </FormItem>
              );
            }}
          />

          <Fieldset className="flex justify-between gap-x-2">
            <div>
              <Label>Variants</Label>
              <Description>
                Add variants for different options like size, color, etc. Each variant can have its own price, cost
              </Description>
            </div>
            <Button color="dark/zinc" onClick={addVariant}>
              <CirclePlus className="w-6 h-6" />
            </Button>
          </Fieldset>

          {fields.map((field, index) => (
            <FieldGroup className="w-full space-y-2" key={field.id}>
              <div className="flex gap-4 w-full flex-col md:flex-row">
                <FormField
                  control={form.control}
                  name={`variants.${index}.costPrice`}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Cost Price</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            inputMode="decimal"
                            type="number"
                            placeholder="$0.00"
                            value={typeof field.value === 'string' ? field.value : field.value.toString()}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(parseFloat(value) || 0);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name={`variants.${index}.price`}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Sale Price</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            inputMode="decimal"
                            type="number"
                            placeholder="$0.00"
                            value={typeof field.value === 'string' ? field.value : field.value.toString()}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(parseFloat(value) || 0);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name={`variants.${index}.stock`}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Stock</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            inputMode="decimal"
                            type="number"
                            placeholder="0"
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(parseFloat(value) || 0);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name={`variants.${index}.sku`}
                  render={({ field }) => {
                    return (
                      <FormItem className="w-full md:w-1/4">
                        <FormLabel>SKU</FormLabel>
                        <FormControl>
                          <Input {...field} readOnly placeholder="Auto-generated SKU" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <Fieldset className="space-y-2">
                  <Label className="hidden md:inline-flex">&nbsp;</Label>
                  <Button plain onClick={() => removeVariant(index)} disabled={fields.length === 1} className="">
                    <CircleMinus className="hidden md:inline-flex text-red-500 w-6 h-6" />
                    <span className="inline-flex md:hidden text-red-500 text-sm">Remove Variant</span>
                  </Button>
                </Fieldset>
              </div>
              <div className="flex flex-col sm:flex-row gap-x-4 w-full flex-1"></div>
            </FieldGroup>
          ))}
        </FieldGroup>
        <DialogActions>
          <Button plain onClick={props.onClose}>
            Cancel
          </Button>
          <Button type="submit" color="blue" disabled={isPending}>
            Update
          </Button>
        </DialogActions>
      </form>
    </Form>
  );
};
