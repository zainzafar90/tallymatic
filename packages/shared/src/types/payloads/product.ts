import { ResourceListResponse } from '../api/api-operations';
import { ProductStatus } from '../enums.types';
import { ICategory } from './category';
import { IProductVariant } from './product-variant';

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
  productCompany:string;
  categoryId?: string;
  createdAt: Date;
}

export interface IProductWithCategory extends IProduct {
  category: ICategory;
}

export type ProductListResponse = ResourceListResponse<IProductWithCategory>;
export type ProductResponse = IProductWithCategory;

/* -----------------------------
 * CREATE/UPDATE OPERATION TYPES
 * ----------------------------- */
export interface CreateProductReq {
  name: string;
  description?: string;
  productCompany?: string;
  categoryId?: string;
  variants: IProductVariant[];
}

export interface UpdateProductReq extends Partial<CreateProductReq> {
  status?: ProductStatus;
  productCompany?: string;
}
