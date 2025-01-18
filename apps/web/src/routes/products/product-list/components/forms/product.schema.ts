import * as z from 'zod';
import { ProductStatus } from '@repo/shared';

export const BaseProductSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  description: z.string().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  variants: z
    .array(
      z.object({
        name: z.string().min(1, 'Name is required'),
        sku: z.string().min(1, 'SKU is required'),
        price: z.number().min(1, 'Price must be non-negative'),
        costPrice: z.number().min(1, 'Cost price must be non-negative'),
        stock: z.number().int().min(0,'Stock must be non-negative'),
      })
    )
    .min(1, 'At least one variant is required'),
});

export const CreateProductSchema = BaseProductSchema;

export const UpdateProductSchema = BaseProductSchema.extend({
  status: z.enum([ProductStatus.ACTIVE, ProductStatus.ARCHIVED, ProductStatus.DRAFT]),
});

export type CreateProductFormData = z.infer<typeof CreateProductSchema>;
export type UpdateProductFormData = z.infer<typeof UpdateProductSchema>;
export type ProductFormData = CreateProductFormData | UpdateProductFormData;
