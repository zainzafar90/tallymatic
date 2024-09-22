import * as z from 'zod';
import { FinancialStatus, FulfillmentStatus } from '@shared';

export const OrderSchema = z.object({
  customerId: z.string().uuid(),
  number: z.string().min(1, 'Order number is required'),
  email: z.string().email('Invalid email address'),
  currency: z.string().min(1, 'Currency is required'),
  financialStatus: z.nativeEnum(FinancialStatus),
  fulfillmentStatus: z.nativeEnum(FulfillmentStatus),
  total: z.number().min(0, 'Total must be non-negative'),
  subtotal: z.number().min(0, 'Subtotal must be non-negative'),
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
