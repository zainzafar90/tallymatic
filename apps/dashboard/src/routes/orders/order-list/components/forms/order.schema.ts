import * as z from 'zod';
import { OrderStatus } from '@shared';

export const OrderSchema = z.object({
  customerId: z.string().uuid('Please select a customer'),
  currency: z.string().min(1, 'Currency is required'),
  status: z.nativeEnum(OrderStatus),
  totalTax: z.union([z.string(), z.number()]).transform(val => Number(val || 0)),
  totalDiscount: z.union([z.string(), z.number()]).transform(val => Number(val || 0)),
  items: z
    .array(
      z.object({
        variantId: z.string().uuid('Please select a product'),
        quantity: z.union([z.string(), z.number()]).transform(val => Number(val || 0)).pipe(z.number().int().min(1, 'Quantity must be at least 1')),
        price: z.union([z.string(), z.number()]).transform(val => Number(val || 0)).pipe(z.number().min(0, 'Price must be non-negative')),
        totalDiscount: z.union([z.string(), z.number()]).transform(val => Number(val || 0)).pipe(z.number().min(0, 'Total discount must be non-negative')),
      })
    )
    .min(1, 'At least one item is required'),
});

export type OrderFormData = z.infer<typeof OrderSchema>;
