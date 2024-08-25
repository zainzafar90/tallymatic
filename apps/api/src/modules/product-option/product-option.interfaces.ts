import { ProductOptionStatus } from './product-option.model';

export interface IProductOption {
  id?: string;
  productId: string;
  name: string;
  description?: string;
  priceModifier: number;
  status: ProductOptionStatus;
}

export type UpdateProductOptionBody = Partial<IProductOption>;

export type NewCreatedProductOption = Omit<IProductOption, 'id'>;
