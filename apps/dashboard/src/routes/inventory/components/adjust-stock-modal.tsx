import React from 'react';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IProductVariant, TransactionType } from '@shared';

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
  variant: IProductVariant;
}

export const AdjustStockModal: React.FC<AdjustStockModalProps> = ({ isOpen, onClose, variant }) => {
  const form = useForm({
    resolver: zodResolver(adjustStockSchema),
    defaultValues: {
      variantId: variant?.id || '',
      quantity: parseInt(variant.stock.toString()) || 0,
      type: TransactionType.ADJUSTED,
      notes: '',
    },
  });

  const { mutateAsync, isPending } = useAdjustStock();

  const onSubmit = async (data: any) => {
    await mutateAsync({
      ...data,
      variantId: variant.id,
      notes: data.notes || undefined,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Adjust Stock for {variant.name}</DialogTitle>
      <DialogBody>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      autoFocus
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(parseInt(value) || 0);
                      }}
                    />
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
                Adjust Stock
              </Button>
            </DialogActions>
          </form>
        </Form>
      </DialogBody>
    </Dialog>
  );
};
