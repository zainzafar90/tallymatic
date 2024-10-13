import { useEffect, useState } from 'react';

import { useWatch } from 'react-hook-form';
import { IOrderItem } from '@shared';

import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface OrderSummaryProps {
  form: any;
}

export const OrderSummary = ({ form }: OrderSummaryProps) => {
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
