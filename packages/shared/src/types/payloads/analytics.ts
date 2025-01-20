import { ResourceListResponse } from '../api/api-operations';

export interface SalesTrendData {
  date: string;
  sales: number;
}

export interface TopSellingProduct {
  id: string;
  name: string;
  totalQuantity: number;
  totalRevenue: number;
  sku: string | null;
}

export interface LowStockAlert {
  id: string;
  name: string;
  sku: string | null;
  stock: number;
  lowStockThreshold: number;
  productName: string;
  productId: string;
}

export type LowStockAlertsResponse = ResourceListResponse<LowStockAlert>;
export type SalesTrendResponse = ResourceListResponse<SalesTrendData>;
export type TopSellingProductsResponse = ResourceListResponse<TopSellingProduct>;
