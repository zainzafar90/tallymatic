import React from 'react';

import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FinancialStatus, FulfillmentStatus, IOrder } from '@shared';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

import { OrderFormData, OrderSchema } from './order.schema';

interface OrderFormProps {
  order?: IOrder;
  isPending: boolean;
  onSubmit: (data: OrderFormData) => Promise<void>;
  onClose: () => void;
}

export const OrderForm: React.FC<OrderFormProps> = ({ order, onSubmit, onClose }) => {
  const form = useForm<OrderFormData>({
    resolver: zodResolver(OrderSchema),
    defaultValues: order || {
      items: [{ variantId: '', quantity: 1, price: 0, totalDiscount: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
    rules: {
      minLength: 1,
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    await onSubmit(data);
    onClose();
    form.reset();
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="customerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer ID</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        {/* Add other fields similarly */}
        <FormField
          control={form.control}
          name="financialStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Financial Status</FormLabel>
              <Select {...field}>
                {Object.values(FinancialStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </Select>
            </FormItem>
          )}
        />
        {/* Add other fields and the items array */}
        <div>
          {fields.map((field, index) => (
            <div key={field.id} className="flex space-x-2">
              {/* Add form fields for each item */}
              <Button type="button" onClick={() => remove(index)}>
                Remove
              </Button>
            </div>
          ))}
          <Button type="button" onClick={() => append({ variantId: '', quantity: 1, price: 0, totalDiscount: 0 })}>
            Add
          </Button>
        </div>
        <div className="flex justify-end space-x-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
};
