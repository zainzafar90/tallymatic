import React, { useState } from 'react';

import { CircleMinus, CirclePlus } from 'lucide-react';
import { useFieldArray } from 'react-hook-form';
import { IProductVariant } from '@shared';

import { Button } from '@/components/ui/button';
import { Description, Field, FieldGroup, Fieldset, Label } from '@/components/ui/fieldset';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToggleState } from '@/hooks/use-toggle-state';

import { ChooseProductVariantDialog } from '../dialogs/choose-product-variant.dialog';

interface OrderItemsProps {
  form: any;
}

export const OrderItems: React.FC<OrderItemsProps> = ({ form }) => {
  const [isProductVariantDialogOpen, openProductVariantDialog, closeProductVariantDialog] = useToggleState();
  const [currentEditingItemIndex, setCurrentEditingItemIndex] = useState<number | null>(null);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
    rules: { minLength: 1 },
  });

  const addItem = () => append({ variantId: '', quantity: 1, price: 0, totalDiscount: 0 });
  const removeItem = (index: number) => fields.length > 1 && remove(index);

  const handleSelectProductVariant = (variant: IProductVariant) => {
    if (currentEditingItemIndex === null || !variant?.id) return;

    const updatedItems = [...form.getValues('items')];
    updatedItems[currentEditingItemIndex] = {
      ...updatedItems[currentEditingItemIndex],
      variantId: variant.id,
      price: parseFloat(variant.price.toString()),
    };
    form.setValue('items', updatedItems);
  };

  return (
    <FieldGroup>
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
                  <FormLabel>Product</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input {...field} placeholder="Select a product" readOnly />
                    </FormControl>
                    <Button
                      type="button"
                      onClick={() => {
                        setCurrentEditingItemIndex(index);
                        // onSelectProductVariant(index);
                        openProductVariantDialog();
                      }}
                    >
                      Select
                    </Button>
                  </div>
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

            <Fieldset className="space-y-2">
              <Label className="hidden md:inline-flex">&nbsp;</Label>
              <Button type="button" onClick={() => removeItem(index)} disabled={fields.length === 1}>
                <CircleMinus className="text-red-500 w-6 h-6" />
              </Button>
            </Fieldset>
          </div>
        </FieldGroup>
      ))}

      <ChooseProductVariantDialog
        isOpen={isProductVariantDialogOpen}
        onClose={closeProductVariantDialog}
        onSelectVariant={handleSelectProductVariant}
        selectedVariantId={
          currentEditingItemIndex !== null ? form.getValues(`items.${currentEditingItemIndex}.variantId`) : undefined
        }
      />
    </FieldGroup>
  );
};
