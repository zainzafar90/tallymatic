import { ResourceListResponse, ResourceResponse } from '../api/api-operations';

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

export interface ProfitByCategory {
  categoryId: string;
  categoryName: string;
  totalRevenue: number;
  totalOrders: number;
}

export interface RecentSale {
  id: string;
  orderNumber: string;
  totalAmount: number;
  createdAt: Date;
  itemCount: number;
  customerName: string;
}

export interface PendingPurchaseOrder {
  id: string;
  purchaseNumber: string;
  totalAmount: number;
  createdAt: Date;
  itemCount: number;
  supplierName: string;
}

export interface SalesSummaryPeriod {
  amount: number;
  growth: number;
  comparedTo: string;
}

export interface SalesSummary {
  today: SalesSummaryPeriod;
  week: SalesSummaryPeriod;
  month: SalesSummaryPeriod;
  avgOrderValuePerDayThisMonth: SalesSummaryPeriod;
}

export type LowStockAlertsResponse = ResourceListResponse<LowStockAlert>;
export type SalesTrendResponse = ResourceListResponse<SalesTrendData>;
export type TopSellingProductsResponse = ResourceListResponse<TopSellingProduct>;
export type ProfitByCategoryResponse = ResourceListResponse<ProfitByCategory>;
export type RecentSalesResponse = ResourceListResponse<RecentSale>;
export type PendingPurchaseOrdersResponse = ResourceListResponse<PendingPurchaseOrder>;
export type SalesSummaryResponse = ResourceResponse<SalesSummary>;
