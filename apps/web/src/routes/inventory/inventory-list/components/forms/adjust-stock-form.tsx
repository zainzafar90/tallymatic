import React from 'react';

import { CircleFadingArrowUp, CircleMinus, CirclePlus } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IProductVariant, TransactionType } from '@repo/shared';

import { Button } from '@/components/ui/button';
import { DialogActions } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useAdjustStock } from '@/hooks/api/inventory.hooks';

import { adjustStockSchema } from './inventory.schema';

interface AdjustStockFormProps {
  onClose: () => void;
  variant: IProductVariant;
}

const quantityColorMap: Record<TransactionType, string> = {
  [TransactionType.SOLD]: 'text-red-500',
  [TransactionType.RECEIVED]: 'text-green-500',
  [TransactionType.ADJUSTED]: 'text-blue-500',
};

export const AdjustStockForm: React.FC<AdjustStockFormProps> = ({ onClose, variant }) => {
  const form = useForm({
    resolver: zodResolver(adjustStockSchema),
    defaultValues: {
      variantId: variant?.id || '',
      quantity: 0,
      type: TransactionType.ADJUSTED,
      notes: '',
    },
  });

  const { mutateAsync, isPending } = useAdjustStock();

  const quantity = useWatch({
    control: form.control,
    name: 'quantity',
  });

  const type = useWatch({
    control: form.control,
    name: 'type',
  });

  const getOperationType = (transactionType: TransactionType) => {
    return transactionType === TransactionType.SOLD ? 'subtract' : 'add';
  };

  const getOperationIcon = (type: TransactionType) => {
    switch (type) {
      case TransactionType.SOLD:
        return (
          <div className="bg-red-600 rounded-md p-2">
            <CircleMinus className="h-4 w-4 text-white" />
          </div>
        );
      case TransactionType.RECEIVED:
        return (
          <div className="bg-green-600 rounded-md p-2">
            <CirclePlus className="h-4 w-4 text-white" />
          </div>
        );
      default:
        return (
          <div className="bg-blue-600 rounded-md p-2">
            <CircleFadingArrowUp className="h-4 w-4 text-white" />
          </div>
        );
    }
  };

  const operation = getOperationType(type as TransactionType);
  const finalQuantity = operation === 'subtract' ? Number(variant.stock) - quantity : Number(variant.stock) + quantity;

  const onSubmit = async (data: any) => {
    if (finalQuantity < 0) return;

    const submissionQuantity = data.type === TransactionType.SOLD ? -Math.abs(data.quantity) : Math.abs(data.quantity);

    await mutateAsync({
      ...data,
      quantity: submissionQuantity,
      variantId: variant.id,
      notes: data.notes || undefined,
    });
    onClose();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="space-y-2">
          <div className="text-sm font-medium">Current Stock</div>
          <div className="text-lg font-semibold">{variant.stock} units</div>
        </div>

        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    {...field}
                    autoFocus
                    min="0"
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(parseInt(value) || 0);
                    }}
                  />
                  {getOperationIcon(form.watch('type'))}
                </div>
              </FormControl>
              {field.value > 0 && (
                <div className="text-sm mt-2">
                  <span className="font-medium">Final quantity will be: </span>
                  <span className={`font-bold ${finalQuantity < 0 ? 'text-red-500' : quantityColorMap[form.watch('type')]}`}>
                    {finalQuantity} units
                  </span>
                </div>
              )}
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
                <Input {...field} placeholder="Add any additional notes here..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogActions>
          <Button plain onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" color="blue" disabled={isPending || finalQuantity < 0 || form.watch('quantity') <= 0}>
            Adjust Stock
          </Button>
        </DialogActions>
      </form>
    </Form>
  );
};
