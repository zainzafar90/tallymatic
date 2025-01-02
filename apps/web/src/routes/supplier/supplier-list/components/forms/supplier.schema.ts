import * as z from 'zod';
import { Status } from '@repo/shared';

export const BaseSupplierSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  contactName: z.string().optional(),
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const CreateSupplierSchema = BaseSupplierSchema;

export const UpdateSupplierSchema = BaseSupplierSchema.extend({
  status: z.enum([Status.ACTIVE, Status.INACTIVE]).optional(),
});

export type CreateSupplierFormData = z.infer<typeof CreateSupplierSchema>;
export type UpdateSupplierFormData = z.infer<typeof UpdateSupplierSchema>;
export type SupplierFormData = CreateSupplierFormData | UpdateSupplierFormData;
