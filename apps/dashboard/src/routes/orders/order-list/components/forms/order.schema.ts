import * as z from 'zod';
import { FinancialStatus, FulfillmentStatus } from '@shared';

export const OrderSchema = z.object({
  customerId: z.string().uuid(),
  currency: z.string().min(1, 'Currency is required'),
  financialStatus: z.nativeEnum(FinancialStatus),
  fulfillmentStatus: z.nativeEnum(FulfillmentStatus),
  totalTax: z.number().min(0, 'Total tax must be non-negative'),
  totalDiscount: z.number().min(0, 'Total discount must be non-negative'),
  items: z
    .array(
      z.object({
        variantId: z.string().uuid(),
        quantity: z.number().int().min(1, 'Quantity must be at least 1'),
        price: z.number().min(0, 'Price must be non-negative'),
        totalDiscount: z.number().min(0, 'Total discount must be non-negative'),
      })
    )
    .min(1, 'At least one item is required'),
});

export type OrderFormData = z.infer<typeof OrderSchema>;
