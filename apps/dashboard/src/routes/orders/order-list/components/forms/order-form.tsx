import React, { useEffect, useState } from 'react';

import { CircleMinus, CirclePlus } from 'lucide-react';
import { useFieldArray, useForm, UseFormReturn, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ICustomer, IOrder, IOrderItem, IProductVariant, OrderStatus } from '@shared';

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
  const form = useForm<OrderFormData>({
    resolver: zodResolver(OrderSchema),
    defaultValues: order || {
      customerId: '',
      currency: 'PKR',
      status: OrderStatus.PENDING,
      totalTax: 0,
      totalDiscount: 0,
      items: [],
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    await onSubmit(data);
    onClose();
    form.reset();
  });

  return (
    <div className="">
      <Form {...form}>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <Card className="bg-muted/50 xl:col-span-2 p-6">
            <OrderItems form={form} />

            <OrderSummary form={form} />

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
                <CardTitle className="group flex items-center gap-2 text-lg">Order Details</CardTitle>
                <CardDescription>Date: {new Date().toLocaleDateString()}</CardDescription>
              </div>

              <CustomerSummary form={form} />

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
    </div>
  );
};

const OrderSummary = ({ form }: { form: UseFormReturn<OrderFormData> }) => {
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);

  const items = useWatch({ control: form.control, name: 'items' }) as IOrderItem[];
  const totalDiscount = useWatch({ control: form.control, name: 'totalDiscount' });
  const totalTax = useWatch({ control: form.control, name: 'totalTax' });

  useEffect(() => {
    const subtotalValue = items.reduce((sum, item) => sum + item.price * item.quantity - (item.totalDiscount || 0), 0);
    const totalValue = subtotalValue + (totalTax || 0) - (totalDiscount || 0);
    setSubtotal(subtotalValue);
    setTotal(totalValue);
  }, [items, totalDiscount, totalTax]);

  return (
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
                      onChange={(e) => field.onChange(parseFloat(e.target.value || '0'))}
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
                      onChange={(e) => field.onChange(parseFloat(e.target.value || '0'))}
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
  );
};

const CustomerSummary = ({ form }: { form: UseFormReturn<OrderFormData> }) => {
  const [isCustomerDialogOpen, openCustomerDialog, closeCustomerDialog] = useToggleState();
  const [selectedCustomer, setSelectedCustomer] = useState<ICustomer | null>(null);

  const handleSelectCustomer = (customer: ICustomer) => {
    if (!customer?.id) return;

    setSelectedCustomer(customer);
    form.setValue('customerId', customer.id);
    form.clearErrors('customerId');
  };

  return (
    <div className="flex gap-4 w-full flex-col md:flex-row">
      <FormField
        control={form.control}
        name="customerId"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>Customer</FormLabel>
            <div className="flex gap-2">
              <FormControl>
                <Input value={selectedCustomer ? selectedCustomer.name : ''} placeholder="Select a customer" readOnly />
              </FormControl>
              <Button type="button" onClick={openCustomerDialog}>
                Browse
              </Button>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <ChooseCustomerDialog
        isOpen={isCustomerDialogOpen}
        onClose={closeCustomerDialog}
        onSelectCustomer={handleSelectCustomer}
        selectedCustomerId={selectedCustomer?.id}
      />
    </div>
  );
};

const OrderItems = ({ form }: { form: UseFormReturn<OrderFormData> }) => {
  const [isProductVariantDialogOpen, openProductVariantDialog, closeProductVariantDialog] = useToggleState();
  const [selectedVariants, setSelectedVariants] = useState<IProductVariant[]>([]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  const handleSelectProductVariant = (variant: IProductVariant) => {
    if (!variant?.id) return;

    append({
      variantId: variant.id,
      quantity: 1,
      price: parseFloat(variant.price.toString()),
      totalDiscount: 0,
    });
    setSelectedVariants([...selectedVariants, variant]);
  };

  const removeItem = (index: number) => {
    remove(index);
    setSelectedVariants(selectedVariants.filter((_, i) => i !== index));
  };

  return (
    <FieldGroup>
      <Fieldset className="flex justify-between gap-x-2">
        <Field>
          <Label>Order Items</Label>
          <Description>Add items to the order. Each item represents a product variant.</Description>
        </Field>
        <Button type="button" onClick={openProductVariantDialog}>
          <CirclePlus className="w-6 h-6" />
        </Button>
      </Fieldset>

      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Product</TableHeader>
            <TableHeader>Quantity</TableHeader>
            <TableHeader>Price</TableHeader>
            <TableHeader>Actions</TableHeader>
          </TableRow>
        </TableHead>

        <TableBody>
          {fields.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No items added yet.
              </TableCell>
            </TableRow>
          )}

          {fields.map((field, index) => (
            <TableRow key={field.id}>
              <TableCell>{selectedVariants[index]?.name}</TableCell>
              <TableCell>
                <FormField
                  control={form.control}
                  name={`items.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          inputMode="numeric"
                          min={1}
                          onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </TableCell>
              <TableCell>
                <FormField
                  control={form.control}
                  name={`items.${index}.price`}
                  render={({ field }) => (
                    <FormItem>
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
                    </FormItem>
                  )}
                />
              </TableCell>
              <TableCell>
                <Button type="button" onClick={() => removeItem(index)}>
                  <CircleMinus className="text-red-500 w-6 h-6" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ChooseProductVariantDialog
        isOpen={isProductVariantDialogOpen}
        onClose={closeProductVariantDialog}
        onSelectVariant={handleSelectProductVariant}
      />
    </FieldGroup>
  );
};
