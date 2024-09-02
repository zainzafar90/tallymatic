import React, { useState } from 'react';

import { CircleMinus, CirclePlus, X } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Description, FieldGroup, Fieldset, Label } from '@/components/ui/fieldset';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

import { ProductSchema } from './create-product.schema';

type ProductFormValues = z.infer<typeof ProductSchema>;

const generateSKU = (productName: string, variantIndex: number) => {
  const prefix = productName.slice(0, 3).toUpperCase();
  const randomNum = Math.floor(1000 + Math.random() * 9000);

  if (!prefix) {
    return `SKU-${randomNum}-${variantIndex + 1}`;
  }

  return `${prefix}-${randomNum}-${variantIndex + 1}`;
};

export function CreateProductDialog({
  amount,
  ...props
}: { amount: string } & React.ComponentPropsWithoutRef<typeof Button>) {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: '',
      description: '',
      status: 'active',
      categoryId: '',
      variants: [{ sku: 'SKU-0000-1', price: 0, costPrice: 0, stock: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'variants',
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    // Handle form submission
    console.log(data);
    setIsOpen(false);
  });

  // Function to add a new variant with auto-generated SKU
  const addVariant = () => {
    const productName = form.getValues('name');
    const newSKU = generateSKU(productName, fields.length);
    append({ sku: newSKU, price: 0, costPrice: 0, stock: 0 });
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
                          <Input {...field} placeholder="Enter product name" autoFocus />
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

                <Fieldset className="flex justify-between">
                  <div>
                    <Label>Variants</Label>
                    <Description>
                      Add variants for different options like size, color, etc. Each variant can have its own price, cost
                    </Description>
                  </div>
                  <Button color="zinc" onClick={addVariant}>
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
                      <FormField
                        control={form.control}
                        name={`variants.${index}.sku`}
                        render={({ field }) => {
                          return (
                            <FormItem>
                              <FormLabel>SKU</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Auto-generated SKU" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />

                      <Fieldset className="space-y-2">
                        <Label>&nbsp;</Label>
                        <Button plain onClick={() => remove(index)}>
                          <CircleMinus className="w-6 h-6 text-red-500" />
                        </Button>
                      </Fieldset>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-x-4 w-full flex-1"></div>
                  </FieldGroup>
                ))}
              </FieldGroup>
              <DialogActions>
                <Button plain onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" color="blue">
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
