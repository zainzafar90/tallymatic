import * as z from 'zod';

export const ProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  status: z.enum(['active', 'inactive']),
  categoryId: z.string().min(1, 'Category is required'),
  variants: z.array(
    z.object({
      sku: z.string().min(1, 'SKU is required'),
      price: z.number().min(0, 'Price must be non-negative'),
      costPrice: z.number().min(0, 'Cost price must be non-negative'),
      stock: z.number().int().min(0, 'Stock must be non-negative'),
    })
  ),
});
