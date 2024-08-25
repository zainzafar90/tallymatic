import { Status } from '@shared';

export interface IProductVariant {
  id?: string;
  name: string;
  sku: string;
  price: number;
  status: Status;
}

export type UpdateProductVariantBody = Partial<IProductVariant>;

export type NewCreatedProductVariant = Omit<IProductVariant, 'id'>;
