import * as z from 'zod';
import { IProductVariant, OrderStatus } from '@repo/shared';

export const OrderSchema = z.object({
  customerId: z.string().uuid('Please select a customer'),
  currency: z.string().min(1, 'Currency is required'),
  status: z.nativeEnum(OrderStatus),
  taxAmount: z.union([z.string(), z.number()]).transform((val) => Number(val || 0)),
  discountAmount: z.union([z.string(), z.number()]).transform((val) => Number(val || 0)),
  items: z
    .array(
      z
        .object({
          variantId: z.string().uuid('Please select a product'),
          quantity: z
            .union([z.string(), z.number()])
            .transform((val) => Number(val || 0))
            .pipe(z.number().int().min(1, 'Quantity must be at least 1')),
          price: z
            .union([z.string(), z.number()])
            .transform((val) => Number(val || 0))
            .pipe(z.number().min(0, 'Price must be non-negative')),
          totalDiscount: z
            .union([z.string(), z.number()])
            .transform((val) => Number(val || 0))
            .pipe(z.number().min(0, 'Total discount must be non-negative')),
          /*
          should contain a number of other feilds in varient as well
          but as these are just to show the data on the form and not 
          being returned to the server, I am adding as optional and any type. 
          */
          variant: z.any().optional(),
          customer: z
            .object({
              id: z.string().optional(),
              name: z.string().min(1, 'Name is required'),
              email: z.string().email('Invalid email'),
              phone: z.string().optional(),
              address: z.string().optional(),
            })
            .optional(),
        })
        .transform(({ variant, ...rest }) => rest)
    )
    .min(1, 'At least one item is required'),
});

// Infer the base schema type
type BaseOrderFormData = z.infer<typeof OrderSchema>;

// Extend with additional fields like 'variant',
// again these things are just for visualizations
// and are not being sent to the server
export type OrderFormData = BaseOrderFormData & {
  items: (BaseOrderFormData['items'][number] & {
    variant?: IProductVariant;
  })[];
};
