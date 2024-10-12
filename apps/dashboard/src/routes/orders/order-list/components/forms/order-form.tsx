import React, { useEffect, useState } from 'react';

import { CircleMinus, CirclePlus } from 'lucide-react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IOrder, OrderStatus } from '@shared';
import { keepPreviousData } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Description, Field, FieldGroup, Fieldset, Label } from '@/components/ui/fieldset';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCustomers } from '@/hooks/api/customer.hooks';

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

  const {
    results = [],
    isLoading,
    isError,
    error,
    count = 0,
  } = useCustomers(
    {
      name: 'Emma',
    },
    {
      placeholderData: keepPreviousData,
    }
  );

  console.log(results);

  const form = useForm<OrderFormData>({
    resolver: zodResolver(OrderSchema),
    defaultValues: order || {
      customerId: '00000000-0000-4000-8000-000000000001',
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

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FieldGroup>
          <div className="flex gap-4 w-full flex-col md:flex-row">
            <FormField
              control={form.control}
              name="customerId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Customer ID</FormLabel>
                  <FormControl>
                    <Input value={field.value} placeholder="Enter customer ID" readOnly autoFocus />
                  </FormControl>
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
                    {Object.values(OrderStatus).map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
                      <FormLabel>Variant ID</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter variant ID" />
                      </FormControl>
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

          <Table bleed className="mt-8 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)] table-fixed">
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

        <div className="flex justify-end space-x-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" color="blue" disabled={isPending}>
            {order ? 'Update' : 'Create'} Order
          </Button>
        </div>
      </form>
    </Form>
  );
};
