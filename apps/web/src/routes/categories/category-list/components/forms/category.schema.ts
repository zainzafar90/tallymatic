import * as z from 'zod';
import { Status } from '@repo/shared';

export const BaseCategorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export const CreateCategorySchema = BaseCategorySchema;

export const UpdateCategorySchema = BaseCategorySchema.extend({
  status: z.enum([Status.ACTIVE, Status.INACTIVE]),
});

export type CreateCategoryFormData = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryFormData = z.infer<typeof UpdateCategorySchema>;
export type CategoryFormData = CreateCategoryFormData | UpdateCategoryFormData;
