import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ICustomer } from '@shared';

import { Button } from '@/components/ui/button';
import { DialogActions } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { CustomerFormData, CustomerSchema } from './customer.schema';

interface CustomerFormProps {
  customer?: ICustomer;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (data: CustomerFormData) => Promise<void>;
}

export const CustomerForm = ({ customer, isPending, onSubmit, onClose }: CustomerFormProps) => {
  const form = useForm({
    resolver: zodResolver(CustomerSchema),
    defaultValues: {
      name: customer?.name || '',
      email: customer?.email || '',
      phone: customer?.phone || '',
      address: customer?.address || '',
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    await onSubmit(data);
    onClose();
    form.reset();
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter customer name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder="Enter customer email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="phone"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter customer phone" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="address"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Enter customer address" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogActions>
          <Button plain onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" color="blue" disabled={isPending}>
            {customer ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Form>
  );
};
