import React from 'react';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TransactionType } from '@shared';

import { Button } from '@/components/ui/button';
import { Dialog, DialogActions, DialogBody, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useAdjustStock } from '@/hooks/api/inventory.hooks';

import { adjustStockSchema } from './inventory.schema';

interface AdjustStockModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdjustStockModal: React.FC<AdjustStockModalProps> = ({ isOpen, onClose }) => {
  const form = useForm({
    resolver: zodResolver(adjustStockSchema),
    defaultValues: {
      variantId: '',
      quantity: 0,
      type: TransactionType.ADJUSTED,
      notes: '',
    },
  });

  const { mutateAsync, isPending } = useAdjustStock();

  const onSubmit = async (data: any) => {
    await mutateAsync(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Adjust Stock</DialogTitle>
      <DialogBody>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="variantId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Variant</FormLabel>
                  <FormControl>
                    <Select {...field}>{/* TODO: Populate with product variants */}</Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transaction Type</FormLabel>
                  <FormControl>
                    <Select {...field}>
                      {Object.values(TransactionType).map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                Adjust
              </Button>
            </DialogActions>
          </form>
        </Form>
      </DialogBody>
    </Dialog>
  );
};
