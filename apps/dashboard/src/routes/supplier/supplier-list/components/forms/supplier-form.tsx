import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ISupplier } from '@shared';

import { Button } from '@/components/ui/button';
import { DialogActions } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { SupplierFormData, SupplierSchema } from './supplier.schema';

interface SupplierFormProps {
  supplier?: ISupplier;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (data: SupplierFormData) => Promise<void>;
}

export const SupplierForm = ({ supplier, isPending, onSubmit, onClose }: SupplierFormProps) => {
  const form = useForm({
    resolver: zodResolver(SupplierSchema),
    defaultValues: {
      companyName: supplier?.companyName || '',
      contactName: supplier?.contactName || '',
      email: supplier?.email || '',
      phone: supplier?.phone || '',
      address: supplier?.address || '',
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    await onSubmit(data);
    onClose();
    form.reset();
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <FormField
          name="companyName"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter supplier company name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="contactName"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter contact name" />
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
                <Input {...field} type="email" placeholder="Enter supplier email" />
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
                <Input {...field} placeholder="Enter supplier phone" />
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
                <Textarea {...field} placeholder="Enter supplier address" />
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
            {supplier ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Form>
  );
};
