import * as z from 'zod';
import { Status } from '@repo/shared';

const BaseCustomerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const CreateCustomerSchema = BaseCustomerSchema;

export const UpdateCustomerSchema = BaseCustomerSchema.extend({
  status: z.enum([Status.ACTIVE, Status.INACTIVE]).optional(),
});

export type CreateCustomerFormData = z.infer<typeof CreateCustomerSchema>;
export type UpdateCustomerFormData = z.infer<typeof UpdateCustomerSchema>;
export type CustomerFormData = CreateCustomerFormData | UpdateCustomerFormData;
