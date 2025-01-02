import { ResourceListResponse } from '../api/api-operations';
import { IProduct } from './product';

type BaseProductVariant = {
  id: string;
  name: string;
  sku: string;
  price: number;
  costPrice: number;
  stock: number;
  lowStockThreshold?: number;
  reorderPoint?: number;
  reorderQuantity?: number;
};

/* ----------------------------
 * LIST VIEW TYPES
 * ---------------------------- */
export interface IProductVariant extends BaseProductVariant {
  createdAt: Date;
}

export type ProductVariantListResponse = ResourceListResponse<IProductVariant>;
export type ProductVariantResponse = IProductVariant;

export type InventoryLevelsResponse = ResourceListResponse<IProductVariant>;
export type LowStockAlertsResponse = ResourceListResponse<IProductVariant>;

/* -----------------------------
 * CREATE/UPDATE OPERATION TYPES
 * ----------------------------- */
export interface CreateProductVariantReq {
  name: string;
  sku: string;
  price: number;
  costPrice: number;
  stock: number;
}
