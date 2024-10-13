import React, { useEffect, useState } from 'react';

import { CircleMinus, CirclePlus } from 'lucide-react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { ClipboardDocumentIcon } from '@heroicons/react/16/solid';
import { zodResolver } from '@hookform/resolvers/zod';
import { ICustomer, IOrder, IProductVariant, OrderStatus } from '@shared';

import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Description, Field, FieldGroup, Fieldset, Label } from '@/components/ui/fieldset';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToggleState } from '@/hooks/use-toggle-state';

import { orderStatusConfig } from '../../config/order-status.config';
import { ChooseCustomerDialog } from '../dialogs/choose-customer.dialog';
import { ChooseProductVariantDialog } from '../dialogs/choose-product-variant.dialog';
import { OrderFormData, OrderSchema } from './order.schema';

interface OrderFormProps {
  order?: IOrder;
  isPending: boolean;
  onSubmit: (data: OrderFormData) => Promise<void>;
  onClose: () => void;
}

export const OrderForm: React.FC<OrderFormProps> = ({ order, isPending, onSubmit, onClose }) => {
  const [total, setTotal] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [isCustomerDialogOpen, openCustomerDialog, closeCustomerDialog] = useToggleState();
  const [selectedCustomer, setSelectedCustomer] = useState<ICustomer | null>(null);
  const [isProductVariantDialogOpen, setIsProductVariantDialogOpen] = useState(false);
  const [currentEditingItemIndex, setCurrentEditingItemIndex] = useState<number | null>(null);

  const form = useForm<OrderFormData>({
    resolver: zodResolver(OrderSchema),
    defaultValues: order || {
      customerId: '',
      currency: 'PKR',
      status: OrderStatus.PENDING,
      totalTax: 0,
      totalDiscount: 0,
      items: [{ variantId: '', quantity: 1, price: 0, totalDiscount: 0 }],
    },
  });

  const items = useWatch({ control: form.control, name: 'items' });
  const totalDiscount = useWatch({ control: form.control, name: 'totalDiscount' });
  const totalTax = useWatch({ control: form.control, name: 'totalTax' });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
    rules: { minLength: 1 },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    await onSubmit(data);
    onClose();
    form.reset();
    setSelectedCustomer(null);
    setCurrentEditingItemIndex(null);
    setTotal(0);
    setSubtotal(0);
  });

  const addItem = () => {
    append({ variantId: '', quantity: 1, price: 0, totalDiscount: 0 });
  };

  const removeItem = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  useEffect(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity - item.totalDiscount, 0);
    const total = subtotal + totalTax - totalDiscount;

    setSubtotal(subtotal);
    setTotal(total);
  }, [items, totalDiscount, totalTax, form]);

  const handleSelectCustomer = (customer: ICustomer) => {
    if (!customer?.id) return;

    setSelectedCustomer(customer);
    form.setValue('customerId', customer.id);
  };

  const handleSelectProductVariant = (variant: IProductVariant) => {
    if (currentEditingItemIndex === null || !variant?.id) return;

    const updatedItems = [...form.getValues('items')];
    updatedItems[currentEditingItemIndex] = {
      ...updatedItems[currentEditingItemIndex],
      variantId: variant.id,
      price: variant.price,
    };
    form.setValue('items', updatedItems);
  };

  return (
    <div className="">
      <Form {...form}>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <Card className="bg-muted/50 xl:col-span-2 p-6">
            <FieldGroup>
              <Fieldset className="flex justify-between gap-x-2">
                <Field>
                  <Label>Order Items</Label>
                  <Description>Add items to the order. Each item represents a product variant.</Description>
                </Field>
                <Button type="button" onClick={addItem}>
                  <CirclePlus className="w-6 h-6" />
                </Button>
              </Fieldset>

              {fields.map((field, index) => (
                <FieldGroup className="w-full space-y-2" key={field.id}>
                  <div className="flex gap-4 w-full flex-col md:flex-row">
                    <FormField
                      control={form.control}
                      name={`items.${index}.variantId`}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Product</FormLabel>
                          <div className="flex gap-2">
                            <FormControl>
                              <Input {...field} placeholder="Select a product" readOnly />
                            </FormControl>
                            <Button
                              type="button"
                              onClick={() => {
                                setCurrentEditingItemIndex(index);
                                setIsProductVariantDialogOpen(true);
                              }}
                            >
                              Select
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`items.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              inputMode="numeric"
                              min={1}
                              onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`items.${index}.price`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              inputMode="decimal"
                              step="0.01"
                              min={0}
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`items.${index}.totalDiscount`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discount</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              inputMode="decimal"
                              step="0.01"
                              min={0}
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Fieldset className="space-y-2">
                      <Label className="hidden md:inline-flex">&nbsp;</Label>
                      <Button type="button" onClick={() => removeItem(index)} disabled={fields.length === 1}>
                        <CircleMinus className="text-red-500 w-6 h-6" />
                      </Button>
                    </Fieldset>
                  </div>
                </FieldGroup>
              ))}

              <div className="flex gap-4 w-full flex-col md:flex-row"></div>

              <Table className="mt-8 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)] table-fixed">
                <TableHead>
                  <TableRow>
                    <TableHeader>&nbsp;</TableHeader>
                    <TableHeader>&nbsp;</TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-bold ">Discount</TableCell>

                    <TableCell className="text-right">
                      <FormField
                        control={form.control}
                        name="totalDiscount"
                        render={({ field }) => (
                          <FormItem className="w-full max-w-xs ml-auto">
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                inputMode="decimal"
                                step="0.01"
                                min={0}
                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-bold">Tax</TableCell>
                    <TableCell className="text-right">
                      <FormField
                        control={form.control}
                        name="totalTax"
                        render={({ field }) => (
                          <FormItem className="w-full max-w-xs ml-auto">
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                inputMode="decimal"
                                step="0.01"
                                min={0}
                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-bold">Subtotal</TableCell>
                    <TableCell className="text-right">Rs. {subtotal.toFixed(2)} </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-bold">Total</TableCell>
                    <TableCell className="text-right">Rs. {total.toFixed(2)} </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </FieldGroup>

            <div className="flex justify-end space-x-2 mt-4">
              <Button onClick={onClose}>Cancel</Button>
              <Button type="submit" color="blue" disabled={isPending}>
                {order ? 'Update' : 'Create'} Order
              </Button>
            </div>
          </Card>
          <Card className="bg-muted/50 xl:col-span-1 p-6">
            <FieldGroup>
              <div className="grid gap-0.5">
                <CardTitle className="group flex items-center gap-2 text-lg">
                  Order Oe31b70H
                  <Button outline className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100">
                    <ClipboardDocumentIcon className="h-3 w-3" />
                    <span className="sr-only">Copy Order ID</span>
                  </Button>
                </CardTitle>
                <CardDescription>Date: November 23, 2023</CardDescription>
              </div>
              <div className="flex gap-4 w-full flex-col md:flex-row">
                <FormField
                  control={form.control}
                  name="customerId"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Customer</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input
                            value={selectedCustomer ? selectedCustomer.name : ''}
                            placeholder="Select a customer"
                            readOnly
                          />
                        </FormControl>
                        <Button type="button" onClick={() => openCustomerDialog()}>
                          Select
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-4 w-full flex-col md:flex-row">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Financial Status</FormLabel>
                      <Select {...field}>
                        {Object.entries(orderStatusConfig).map(([status, [_, text]]) => (
                          <option key={status} value={status}>
                            {text}
                          </option>
                        ))}
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </FieldGroup>
          </Card>
        </form>
      </Form>

      <ChooseCustomerDialog
        isOpen={isCustomerDialogOpen}
        onClose={() => closeCustomerDialog()}
        onSelectCustomer={handleSelectCustomer}
        selectedCustomerId={selectedCustomer?.id}
      />

      <ChooseProductVariantDialog
        isOpen={isProductVariantDialogOpen}
        onClose={() => setIsProductVariantDialogOpen(false)}
        onSelectVariant={handleSelectProductVariant}
        selectedVariantId={
          currentEditingItemIndex !== null ? form.getValues(`items.${currentEditingItemIndex}.variantId`) : undefined
        }
      />
    </div>
  );
};
