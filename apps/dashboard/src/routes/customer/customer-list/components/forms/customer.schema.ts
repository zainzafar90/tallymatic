import * as z from 'zod';

export const CustomerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export type CustomerFormData = z.infer<typeof CustomerSchema>;
