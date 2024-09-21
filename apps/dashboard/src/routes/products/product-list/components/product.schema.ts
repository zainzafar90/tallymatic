import * as z from 'zod';
import { ProductStatus } from '@shared';

export const ProductSchema = z.object({
  name: z.string().min(3, 'Name is required'),
  description: z.string().optional(),
  status: z.enum([ProductStatus.ACTIVE, ProductStatus.ARCHIVED, ProductStatus.DRAFT]),
  categoryId: z.string().optional(),
  variants: z
    .array(
      z.object({
        name: z.string().min(1, 'Name is required'),
        sku: z.string().min(1, 'SKU is required'),
        price: z.number().min(0, 'Price must be non-negative'),
        costPrice: z.number().min(0, 'Cost price must be non-negative'),
        stock: z.number().int().min(0, 'Stock must be non-negative'),
      })
    )
    .min(1, 'At least one variant is required'),
});
