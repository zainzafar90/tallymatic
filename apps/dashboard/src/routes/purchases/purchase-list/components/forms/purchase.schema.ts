import * as z from 'zod';
import { PurchaseStatus } from '@shared';

export const PurchaseSchema = z.object({
  supplierId: z.string().uuid('Please select a supplier'),
  status: z.nativeEnum(PurchaseStatus),
  notes: z.string().optional(),
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
});

export type PurchaseFormData = z.infer<typeof PurchaseSchema>;
