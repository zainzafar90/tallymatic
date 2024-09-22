import React from 'react';

import { CircleMinus, CirclePlus } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FinancialStatus, FulfillmentStatus, IOrder } from '@shared';

import { Button } from '@/components/ui/button';
import { Description, FieldGroup, Fieldset, Label } from '@/components/ui/fieldset';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

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
      customerId: '00000000-0000-4000-8000-000000000001',
      number: '',
      currency: 'USD',
      financialStatus: FinancialStatus.PENDING,
      fulfillmentStatus: FulfillmentStatus.UNFULFILLED,
      total: 0,
      subtotal: 0,
      totalTax: 0,
      totalDiscount: 0,
      items: [{ variantId: '', quantity: 1, price: 0, totalDiscount: 0 }],
    },
  });

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
                    <Input value={field.value} placeholder="Enter customer ID" readOnly />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Order Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Order #" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex gap-4 w-full flex-col md:flex-row">
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Currency</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter currency" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex gap-4 w-full flex-col md:flex-row">
            <FormField
              control={form.control}
              name="financialStatus"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Financial Status</FormLabel>
                  <Select {...field}>
                    {Object.values(FinancialStatus).map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fulfillmentStatus"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Fulfillment Status</FormLabel>
                  <Select {...field}>
                    {Object.values(FulfillmentStatus).map((status) => (
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
            <div>
              <Label>Order Items</Label>
              <Description>Add items to the order. Each item represents a product variant.</Description>
            </div>
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

          <div className="flex gap-4 w-full flex-col md:flex-row">
            <FormField
              control={form.control}
              name="total"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Total</FormLabel>
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
              name="subtotal"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Subtotal</FormLabel>
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
          </div>

          <div className="flex gap-4 w-full flex-col md:flex-row">
            <FormField
              control={form.control}
              name="totalTax"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Total Tax</FormLabel>
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
              name="totalDiscount"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Total Discount</FormLabel>
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
          </div>
        </FieldGroup>

        <div className="flex justify-end space-x-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={isPending}>
            {order ? 'Update' : 'Create'} Order
          </Button>
        </div>
      </form>
    </Form>
  );
};
