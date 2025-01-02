import { ResourceListResponse } from '../api/api-operations';
import { ProductStatus } from '../enums.types';
import { IProductVariant } from '../interfaces/resources';
import { ICategory } from './category';

type BaseProduct = {
  id: string;
  name: string;
  description?: string;
  status: ProductStatus;
};

/* ----------------------------
 * LIST VIEW TYPES
 * ---------------------------- */
export interface IProduct extends BaseProduct {
  variants: IProductVariant[];
  categoryId?: string;
  createdAt: Date;
}

export type ProductListResponse = ResourceListResponse<IProduct & { category: ICategory }>;
export type ProductResponse = IProduct & { category: ICategory };

/* -----------------------------
 * CREATE/UPDATE OPERATION TYPES
 * ----------------------------- */
export interface CreateProductReq {
  name: string;
  description?: string;
  categoryId?: string;
  variants: IProductVariant[];
}

export interface UpdateProductReq extends Partial<CreateProductReq> {
  status?: ProductStatus;
}
