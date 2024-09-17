import * as z from 'zod';
import { Status } from '@shared';

export const CategorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  status: z.enum([Status.ACTIVE, Status.INACTIVE]),
});
