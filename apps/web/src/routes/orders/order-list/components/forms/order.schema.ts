import * as z from 'zod';
import { OrderStatus, PaymentMethod, PaymentType } from '@repo/shared';

import { IProductVariantWithProduct } from '@/components/common/dialogs/choose-product-variant.dialog';

export const BaseOrderSchema = z.object({
  customerId: z.string().uuid('Please select a customer'),
  status: z.nativeEnum(OrderStatus),
  taxAmount: z.union([z.string(), z.number()]).transform((val) => Number(val || 0)),
  discountAmount: z.union([z.string(), z.number()]).transform((val) => Number(val || 0)),
  items: z
    .array(
      z.object({
        variantId: z.string().uuid('Please select a product'),
        quantity: z
          .union([z.string(), z.number()])
          .transform((val) => Number(val || 0))
          .pipe(z.number().int().min(1, 'Quantity must be at least 1')),
        price: z
          .union([z.string(), z.number()])
          .transform((val) => Number(val || 0))
          .pipe(z.number().min(0, 'Price must be non-negative')),
        totalDiscount: z
          .union([z.string(), z.number()])
          .transform((val) => Number(val || 0))
          .pipe(z.number().min(0, 'Total discount must be non-negative')),
      })
    )
    .min(1, 'At least one item is required'),
  paymentMethod: z
    .nativeEnum(PaymentMethod, {
      errorMap: () => ({
        message: 'Please select a valid payment method',
      }),
    })
    .default(PaymentMethod.CASH)
    .optional(),
  paymentType: z
    .nativeEnum(PaymentType, {
      errorMap: () => ({
        message: 'Please select payment type',
      }),
    })
    .default(PaymentType.CREDIT)
    .optional(),
  amountPaid: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val || 0))
    .pipe(z.number().min(0, 'Amount paid must be non-negative')),
});

export const CreateOrderSchema = BaseOrderSchema;
export const UpdateOrderSchema = BaseOrderSchema.extend({
  closedAt: z
    .union([z.string(), z.date(), z.null()])
    .transform((val) => (val ? new Date(val) : null))
    .optional()
    .nullable(),
});

export type CreateOrderFormData = z.infer<typeof CreateOrderSchema>;
export type UpdateOrderFormData = z.infer<typeof UpdateOrderSchema>;

// Extend with additional fields like 'variant', 'product'
// again these things are just for visualizations
// and are not being sent to the server
export type OrderFormData = (CreateOrderFormData | UpdateOrderFormData) & {
  items: (CreateOrderFormData['items'][number] & {
    variant?: IProductVariantWithProduct;
  })[];
};
