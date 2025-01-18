import React, { useMemo, useState } from 'react';

import { CircleMinus, CirclePlus, Eye, EyeOff } from 'lucide-react';
import { useFieldArray, useForm, UseFormReturn, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ICustomer, IOrder, IOrderItem, OrderStatus, PaymentMethod, PaymentType } from '@repo/shared';

import {
  ChooseProductVariantDialog,
  IProductVariantWithProduct,
} from '@/components/common/dialogs/choose-product-variant.dialog';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Description, Field, FieldGroup, Fieldset, Label } from '@/components/ui/fieldset';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { paymentMethodConfig } from '@/config/payment-method.config';
import { useToggleState } from '@/hooks/use-toggle-state';

import { orderStatusConfig } from '../../config/order-status.config';
import { ChooseCustomerDialog } from '../dialogs/choose-customer.dialog';
import { CreateOrderSchema, OrderFormData, UpdateOrderSchema } from './order.schema';

interface OrderFormProps {
  order?: IOrder;
  isPending: boolean;
  onSubmit: (data: OrderFormData) => Promise<void>;
  onClose: () => void;
}

export const OrderForm: React.FC<OrderFormProps> = ({ order, isPending, onSubmit, onClose }) => {
  const form = useForm<OrderFormData>({
    resolver: zodResolver(order ? UpdateOrderSchema : CreateOrderSchema),
    defaultValues: order
      ? {
          ...order,
          closedAt: order.closedAt ? new Date(order.closedAt) : null,
        }
      : {
          customerId: '',
          status: OrderStatus.PENDING,
          taxAmount: 0,
          discountAmount: 0,
          items: [],
          paymentMethod: PaymentMethod.CASH,
          amountPaid: 0,
        },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    await onSubmit(data);
    onClose();
    form.reset();
  });

  return (
    <div className="relative">
      <Form {...form}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pb-16">
          <Card className="bg-muted/50 p-6">
            <FieldGroup>
              <div className="grid gap-0.5">
                <CardTitle className="group flex items-center gap-2 text-lg">Order Details</CardTitle>
                <CardDescription>Date: {new Date().toLocaleDateString()}</CardDescription>
              </div>

              <div className="flex gap-4 w-full flex-row">
                <CustomerSummary form={form} />

                <div className="flex gap-4 w-full flex-row">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Financial Status</FormLabel>
                        <Select {...field}>
                          {Object.entries(orderStatusConfig).map(([status, [_, text]]) => (
                            <option key={status} value={status}>
                              {text}
                            </option>
                          ))}
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Payment Method</FormLabel>
                        <Select {...field}>
                          {Object.entries(paymentMethodConfig).map(([method, [_, text, value]]) => (
                            <option key={method} value={value}>
                              {text}
                            </option>
                          ))}
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="paymentType"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Payment Type</FormLabel>
                        <Select {...field}>
                          <option value={PaymentType.CREDIT}>Credit</option>
                          <option value={PaymentType.DEBIT}>Debit</option>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </FieldGroup>
          </Card>
          <Card className="bg-muted/50 row-start-2 lg:row-start-1 lg:col-span-2 p-6">
            <OrderItems form={form} />
            <OrderSummary form={form} />
          </Card>

          <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 flex justify-end space-x-2">
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" color="blue" disabled={isPending}>
              {order ? 'Update' : 'Create'} Order
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

const OrderSummary = ({ form }: { form: UseFormReturn<OrderFormData> }) => {
  const items = useWatch({ control: form.control, name: 'items' }) as IOrderItem[];
  const discountAmount = useWatch({ control: form.control, name: 'discountAmount' });
  const taxAmount = useWatch({ control: form.control, name: 'taxAmount' });

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity - (item.totalDiscount || 0), 0),
    [items]
  );

  const total = useMemo(() => subtotal + (+taxAmount || 0) - (+discountAmount || 0), [subtotal, taxAmount, discountAmount]);

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
              name="discountAmount"
              render={({ field }) => (
                <FormItem className="w-full max-w-xs ml-auto">
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      inputMode="decimal"
                      step="0.01"
                      min={0}
                      value={field.value || '0'}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val === '0' ? '' : Number(val));
                      }}
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
              name="taxAmount"
              render={({ field }) => (
                <FormItem className="w-full max-w-xs ml-auto">
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      inputMode="decimal"
                      step="0.01"
                      min={0}
                      value={field.value || '0'}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val === '0' ? '' : Number(val));
                      }}
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
        <TableRow>
          <TableCell className="font-bold">Amount Paid</TableCell>
          <TableCell className="text-right">
            <FormField
              control={form.control}
              name="amountPaid"
              render={({ field }) => (
                <FormItem className="w-full max-w-xs ml-auto">
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      inputMode="decimal"
                      step="0.01"
                      min={0}
                      value={field.value || '0'}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val === '0' ? '' : Number(val));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-bold">Balance Due</TableCell>
          <TableCell className="text-right">Rs. {(total - (form.watch('amountPaid') || 0)).toFixed(2)}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

const CustomerSummary = ({ form }: { form: UseFormReturn<OrderFormData> }) => {
  const customer = useWatch({ name: 'customer' }) as ICustomer;
  const [selectedCustomer, setSelectedCustomer] = useState<ICustomer | null>(customer);
  const [isCustomerDialogOpen, openCustomerDialog, closeCustomerDialog] = useToggleState();

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

const OrderItems = ({ form }: { form: UseFormReturn<OrderFormData> }) => {
  const [isProductVariantDialogOpen, openProductVariantDialog, closeProductVariantDialog] = useToggleState();
  const [showPrices, setShowPrices] = useState(false);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  const watchFields = useWatch({
    control: form.control,
    name: 'items',
  });

  const handleSelectProductVariant = (variant: IProductVariantWithProduct) => {
    if (!variant?.id) return;

    append({
      variantId: variant.id,
      quantity: 1,
      price: parseFloat(variant.price.toString()),
      totalDiscount: 0,
      variant,
    });
  };

  const calculateTotal = (quantity: number, price: number) => {
    return quantity * price;
  };

  const removeItem = (index: number) => {
    remove(index);
  };

  return (
    <FieldGroup>
      <Fieldset className="flex justify-between gap-x-2">
        <Field>
          <Label>Order Items</Label>
          <Description>Add items to the order. Each item represents a product variant.</Description>
        </Field>
        <Button type="button" onClick={openProductVariantDialog}>
          <CirclePlus className="w-6 h-6" />
        </Button>
      </Fieldset>

      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Product</TableHeader>
            <TableHeader className="flex items-center gap-2 cursor-pointer" onClick={() => setShowPrices(!showPrices)}>
              Cost
              <button type="button">{showPrices ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}</button>
            </TableHeader>
            <TableHeader>Price</TableHeader>
            <TableHeader>Quantity</TableHeader>
            <TableHeader>Total</TableHeader>
            <TableHeader>Actions</TableHeader>
          </TableRow>
        </TableHead>

        <TableBody>
          {fields.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No items added yet.
              </TableCell>
            </TableRow>
          )}

          {fields.map((field, index) => (
            <TableRow key={field.id}>
              <TableCell>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{field?.variant?.product?.name}</span>
                    {field?.variant?.product?.category?.name && (
                      <span className="text-xs font-semibold text-muted-foreground bg-muted px-1 rounded-md">
                        {field?.variant?.product?.category?.name}
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">{field.variant?.name}</span>
                </div>
              </TableCell>

              <TableCell>{showPrices ? field.variant?.costPrice : '*****'}</TableCell>

              <TableCell>
                <FormField
                  control={form.control}
                  name={`items.${index}.price`}
                  render={({ field: priceField }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...priceField}
                          type="number"
                          inputMode="decimal"
                          step="0.01"
                          min={0}
                          onChange={(e) => priceField.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </TableCell>

              <TableCell>
                <FormField
                  control={form.control}
                  name={`items.${index}.quantity`}
                  render={({ field: quantityField }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...quantityField}
                          type="number"
                          inputMode="decimal"
                          step="1"
                          min={1}
                          onChange={(e) => quantityField.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </TableCell>

              <TableCell>
                {`Rs. ${calculateTotal(watchFields?.[index]?.quantity || 0, watchFields?.[index]?.price || 0).toFixed(2)}`}
              </TableCell>

              <TableCell>
                <Button type="button" plain onClick={() => removeItem(index)}>
                  <CircleMinus className="text-red-500 w-6 h-6" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ChooseProductVariantDialog
        priceField="price"
        priceLabel="Price"
        isOpen={isProductVariantDialogOpen}
        onClose={closeProductVariantDialog}
        onSelectVariant={handleSelectProductVariant}
      />
    </FieldGroup>
  );
};
