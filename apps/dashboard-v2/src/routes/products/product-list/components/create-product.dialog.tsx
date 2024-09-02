import React, { useState } from 'react';

import { CircleMinus, CirclePlus, X } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { IProductVariant, Status } from '@shared';

import { Button } from '@/components/ui/button';
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Description, FieldGroup, Fieldset, Label } from '@/components/ui/fieldset';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useCreateProduct } from '@/hooks/api/products';

import { ProductSchema } from './create-product.schema';

type ProductFormValues = z.infer<typeof ProductSchema>;

const generateSKU = (productName: string, existingSKU: string) => {
  const prefix = productName.slice(0, 3).toUpperCase();
  const existingParts = existingSKU.split('-');
  const randomPart = existingParts[1] || Math.floor(1000 + Math.random() * 9000).toString();
  const indexPart = existingParts[2] || '1';

  if (!prefix) {
    return `SKU-${randomPart}-${indexPart}`;
  }

  return `${prefix}-${randomPart}-${indexPart}`;
};

export function CreateProductDialog({
  amount,
  ...props
}: { amount: string } & React.ComponentPropsWithoutRef<typeof Button>) {
  const [isOpen, setIsOpen] = useState(false);
  const { mutateAsync, isPending } = useCreateProduct();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: '',
      description: '',
      status: 'active',
      categoryId: '',
      variants: [
        {
          name: 'Default',
          sku: generateSKU('SKU', `SKU-${Math.floor(1000 + Math.random() * 9000)}-1`),
          price: 0,
          costPrice: 0,
          stock: 0,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'variants',
    rules: { minLength: 1 },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync({
      name: data.name,
      description: data.description,
      status: data.status as Status,
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
    });
    setIsOpen(false);
    form.reset();
  });

  const updateSKUs = (productName: string) => {
    const updatedVariants = form.getValues('variants').map((variant) => ({
      ...variant,
      sku: generateSKU(productName, variant.sku),
    }));
    form.setValue('variants', updatedVariants);
  };

  // Function to add a new variant with auto-generated SKU
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
    <>
      <Button className="-my-0.5" color="blue" onClick={() => setIsOpen(true)}>
        {props.children}
      </Button>
      <Dialog open={isOpen} onClose={setIsOpen} size="4xl">
        <DialogTitle>Create Product</DialogTitle>
        <DialogDescription>Fill in the details below to create a new product.</DialogDescription>
        <DialogBody>
          <Form {...form}>
            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => {
                    return (
                      <FormItem>
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

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Select {...field}>
                            <option value="" disabled>
                              Select a category&hellip;
                            </option>
                            <option value="electronics">Electronics</option>
                            <option value="apparel">Apparel</option>
                            <option value="home_goods">Home Goods</option>
                            <option value="other">Other</option>
                          </Select>
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
                      <div className="flex items-center gap-2">
                        <FormField
                          control={form.control}
                          name={`variants.${index}.sku`}
                          render={({ field }) => {
                            return (
                              <FormItem className="w-full">
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
                          <Label>&nbsp;</Label>
                          <Button plain onClick={() => removeVariant(index)} disabled={fields.length === 1}>
                            <CircleMinus className="w-6 h-6 text-red-500" />
                          </Button>
                        </Fieldset>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-x-4 w-full flex-1"></div>
                  </FieldGroup>
                ))}
              </FieldGroup>
              <DialogActions>
                <Button plain onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" color="blue" disabled={isPending}>
                  Create
                </Button>
              </DialogActions>
            </form>
          </Form>
        </DialogBody>
      </Dialog>
    </>
  );
}
