import * as z from 'zod';
import { TransactionType } from '@repo/shared';

export const adjustStockSchema = z.object({
  variantId: z.string().uuid(),
  quantity: z.number().int(),
  type: z.nativeEnum(TransactionType),
  notes: z.string().optional(),
});
