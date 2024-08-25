import { Status } from '@shared';

export interface IProductOption {
  id?: string;
  name: string;
  description?: string;
  priceModifier: number;
  status: Status;
}

export type UpdateProductOptionBody = Partial<IProductOption>;

export type NewCreatedProductOption = Omit<IProductOption, 'id'>;
