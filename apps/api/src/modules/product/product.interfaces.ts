import { ProductStatus } from './product.model';

export interface IProduct {
  id?: string;
  organizationId: string;
  storeId: string;
  name: string;
  description?: string;
  price: number;
  status: ProductStatus;
}

export type UpdateProductBody = Partial<IProduct>;

export type NewCreatedProduct = Omit<IProduct, 'id'>;
