import { Status } from '@shared';

export interface IProduct {
  id?: string;
  organizationId: string;
  storeId: string;
  name: string;
  description?: string;
  price: number;
  status: Status;
}

export type UpdateProductBody = Partial<IProduct>;

export type NewCreatedProduct = Omit<IProduct, 'id'>;
