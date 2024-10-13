import { useState } from 'react';

import { UseFormReturn } from 'react-hook-form';
import { ICustomer } from '@shared';

import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToggleState } from '@/hooks/use-toggle-state';

import { ChooseCustomerDialog } from '../dialogs/choose-customer.dialog';
import { OrderFormData } from './order.schema';

interface OrderSummaryProps {
  form: UseFormReturn<OrderFormData>;
}

export const CustomerSummary = ({ form }: OrderSummaryProps) => {
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
