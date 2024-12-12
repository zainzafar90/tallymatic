import React, { useMemo, useState } from 'react';

import { CircleMinus, CirclePlus } from 'lucide-react';
import { useFieldArray, useForm, UseFormReturn, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IProductVariant, IPurchase, ISupplier, PurchaseStatus } from '@shared';

import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Description, Field, FieldGroup, Fieldset, Label } from '@/components/ui/fieldset';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToggleState } from '@/hooks/use-toggle-state';

import { purchaseStatusConfig } from '../../config/purchase-status.config';
import { ChooseProductVariantDialog } from '../dialogs/choose-product-variant.dialog';
import { ChooseSupplierDialog } from '../dialogs/choose-supplier.dialog';
import { PurchaseFormData, PurchaseSchema } from './purchase.schema';

interface PurchaseFormProps {
  purchase?: IPurchase;
  isPending: boolean;
  onSubmit: (data: PurchaseFormData) => Promise<void>;
  onClose: () => void;
}

export const PurchaseForm: React.FC<PurchaseFormProps> = ({ purchase, isPending, onSubmit, onClose }) => {
  const form = useForm<PurchaseFormData>({
    resolver: zodResolver(PurchaseSchema),
    defaultValues: purchase || {
      supplierId: '',
      status: PurchaseStatus.DRAFT,
      notes: '',
      items: [],
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    await onSubmit({
      ...data,
    });
    onClose();
    form.reset();
  });

  return (
    <div className="">
      <Form {...form}>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <Card className="bg-muted/50 xl:col-span-2 p-6">
            <PurchaseItems form={form} />

            <PurchaseSummary form={form} />

            <div className="flex justify-end space-x-2 mt-4">
              <Button onClick={onClose}>Cancel</Button>
              <Button type="submit" color="blue" disabled={isPending}>
                {purchase ? 'Update' : 'Create'} Purchase
              </Button>
            </div>
          </Card>
          <Card className="bg-muted/50 xl:col-span-1 p-6">
            <FieldGroup>
              <div className="grid gap-0.5">
                <CardTitle className="group flex items-center gap-2 text-lg">Purchase Details</CardTitle>
                <CardDescription>Date: {new Date().toLocaleDateString()}</CardDescription>
              </div>

              <SupplierSummary form={form} />

              <div className="flex gap-4 w-full flex-col md:flex-row">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Status</FormLabel>
                      <Select {...field}>
                        {Object.entries(purchaseStatusConfig).map(([status, [_, text]]) => (
                          <option key={status} value={status}>
                            {text}
                          </option>
                        ))}
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Add notes..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FieldGroup>
          </Card>
        </form>
      </Form>
    </div>
  );
};

const PurchaseSummary = ({ form }: { form: UseFormReturn<PurchaseFormData> }) => {
  const items = useWatch({ control: form.control, name: 'items' });

  const total = useMemo(() => {
    const calculatedTotal = items.reduce((sum, item) => {
      const quantity = Number(item.quantity) || 0;
      const unitCost = Number(item.unitCost) || 0;
      return sum + quantity * unitCost;
    }, 0);

    return calculatedTotal;
  }, [items]);

  return (
    <Table className="mt-8">
      <TableBody>
        <TableRow>
          <TableCell className="font-bold">Total Amount</TableCell>
          <TableCell className="text-right">Rs. {total.toFixed(2)}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

const SupplierSummary = ({ form }: { form: UseFormReturn<PurchaseFormData> }) => {
  const [isSupplierDialogOpen, openSupplierDialog, closeSupplierDialog] = useToggleState();
  const [selectedSupplier, setSelectedSupplier] = useState<ISupplier | null>(null);

  const handleSelectSupplier = (supplier: ISupplier) => {
    if (!supplier?.id) return;

    setSelectedSupplier(supplier);
    form.setValue('supplierId', supplier.id);
    form.clearErrors('supplierId');
  };

  return (
    <div className="flex gap-4 w-full flex-col md:flex-row">
      <FormField
        control={form.control}
        name="supplierId"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>Supplier</FormLabel>
            <div className="flex gap-2">
              <FormControl>
                <Input
                  value={selectedSupplier ? selectedSupplier.companyName : ''}
                  placeholder="Select a supplier"
                  readOnly
                />
              </FormControl>
              <Button type="button" onClick={openSupplierDialog}>
                Browse
              </Button>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <ChooseSupplierDialog
        isOpen={isSupplierDialogOpen}
        onClose={closeSupplierDialog}
        onSelectSupplier={handleSelectSupplier}
        selectedSupplierId={selectedSupplier?.id}
      />
    </div>
  );
};

const PurchaseItems = ({ form }: { form: UseFormReturn<PurchaseFormData> }) => {
  const [isProductVariantDialogOpen, openProductVariantDialog, closeProductVariantDialog] = useToggleState();
  const [selectedVariants, setSelectedVariants] = useState<IProductVariant[]>([]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  const handleSelectProductVariant = (variant: IProductVariant) => {
    if (!variant?.id) return;

    const quantity = 1;
    const unitCost = parseFloat(variant.costPrice.toString());

    append({
      variantId: variant.id,
      quantity,
      unitCost,
    });
    setSelectedVariants([...selectedVariants, variant]);
  };

  const removeItem = (index: number) => {
    remove(index);
    setSelectedVariants(selectedVariants.filter((_, i) => i !== index));
  };

  const calculateItemTotal = (quantity: number, unitCost: number) => {
    return (Number(quantity) || 0) * (Number(unitCost) || 0);
  };

  return (
    <FieldGroup>
      <Fieldset className="flex justify-between gap-x-2">
        <Field>
          <Label>Purchase Items</Label>
          <Description>Add items to the purchase. Each item represents a product variant.</Description>
        </Field>
        <Button type="button" onClick={openProductVariantDialog}>
          <CirclePlus className="w-6 h-6" />
        </Button>
      </Fieldset>

      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Product</TableHeader>
            <TableHeader>Quantity</TableHeader>
            <TableHeader>Unit Cost</TableHeader>
            <TableHeader>Total</TableHeader>
            <TableHeader>Actions</TableHeader>
          </TableRow>
        </TableHead>

        <TableBody>
          {fields.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No items added yet.
              </TableCell>
            </TableRow>
          )}

          {fields.map((field, index) => (
            <TableRow key={field.id}>
              <TableCell>{selectedVariants[index]?.name}</TableCell>
              <TableCell>
                <FormField
                  control={form.control}
                  name={`items.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          inputMode="numeric"
                          min={1}
                          onChange={(e) => {
                            const quantity = parseInt(e.target.value, 10);
                            field.onChange(quantity);
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </TableCell>
              <TableCell>
                <FormField
                  control={form.control}
                  name={`items.${index}.unitCost`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          inputMode="decimal"
                          step="0.01"
                          min={0}
                          onChange={(e) => {
                            const unitCost = parseFloat(e.target.value);
                            field.onChange(unitCost);
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </TableCell>
              <TableCell>
                {calculateItemTotal(
                  form.getValues(`items.${index}.quantity`),
                  form.getValues(`items.${index}.unitCost`)
                ).toFixed(2)}
              </TableCell>
              <TableCell className="text-right">
                {calculateItemTotal(
                  form.getValues(`items.${index}.quantity`),
                  form.getValues(`items.${index}.unitCost`)
                ).toFixed(2)}
              </TableCell>
              <TableCell>
                <Button type="button" onClick={() => removeItem(index)}>
                  <CircleMinus className="text-red-500 w-6 h-6" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ChooseProductVariantDialog
        isOpen={isProductVariantDialogOpen}
        onClose={closeProductVariantDialog}
        onSelectVariant={handleSelectProductVariant}
      />
    </FieldGroup>
  );
};
