import * as z from 'zod';

export const SupplierSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  contactName: z.string().optional(),
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export type SupplierFormData = z.infer<typeof SupplierSchema>;
