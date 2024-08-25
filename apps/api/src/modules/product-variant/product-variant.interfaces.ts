import { ProductVariantStatus } from './product-variant.model';

export interface IProductVariant {
  id?: string;
  productId: string;
  name: string;
  sku: string;
  price: number;
  status: ProductVariantStatus;
}

export type UpdateProductVariantBody = Partial<IProductVariant>;

export type NewCreatedProductVariant = Omit<IProductVariant, 'id'>;
