import * as z from 'zod';
import { PaymentMethod, PaymentType, PurchaseStatus } from '@repo/shared';

import { IProductVariantWithProduct } from '@/components/common/dialogs/choose-product-variant.dialog';

export const PurchaseSchema = z.object({
  supplierId: z.string().uuid('Please select a supplier'),
  status: z.nativeEnum(PurchaseStatus).default(PurchaseStatus.DRAFT),
  notes: z.string().optional(),
  expectedArrivalDate: z
    .union([z.string(), z.date()])
    .transform((val) => (val ? new Date(val) : undefined))
    .optional(),
  items: z
    .array(
      z.object({
        variantId: z.string().uuid('Please select a product'),
        quantity: z
          .union([z.string(), z.number()])
          .transform((val) => Number(val || 0))
          .pipe(z.number().int().min(1, 'Quantity must be at least 1')),
        unitCost: z
          .union([z.string(), z.number()])
          .transform((val) => Number(val || 0))
          .pipe(z.number().min(0, 'Unit cost must be non-negative')),
      })
    )
    .min(1, 'At least one item is required'),
  totalQuantity: z.number().min(0).optional(),
  receivedQuantity: z.number().min(0).optional(),
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
    .default(PaymentType.DEBIT)
    .optional(),
  amountPaid: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val || 0))
    .pipe(z.number().min(0, 'Amount paid must be non-negative')),
});

export const CreatePurchaseSchema = PurchaseSchema;
export const UpdatePurchaseSchema = CreatePurchaseSchema;

export type CreatePurchaseFormData = z.infer<typeof CreatePurchaseSchema>;
export type UpdatePurchaseFormData = z.infer<typeof UpdatePurchaseSchema>;

// Extend with additional fields like 'variant', 'product'
// again these things are just for visualizations
// and are not being sent to the server
export type PurchaseFormData = (CreatePurchaseFormData | UpdatePurchaseFormData) & {
  items: (CreatePurchaseFormData['items'][number] & {
    variant?: IProductVariantWithProduct;
  })[];
};
