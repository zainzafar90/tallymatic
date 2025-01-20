import {
  LowStockAlertsResponse,
  PendingPurchaseOrdersResponse,
  ProfitByCategoryResponse,
  RecentSalesResponse,
  SalesTrendResponse,
  TopSellingProductsResponse,
} from '@repo/shared';

import { getRequest } from './common';

async function getLowStockAlerts() {
  return getRequest<LowStockAlertsResponse>('/v1/analytics/low-stock-alerts', {
    limit: 5,
  });
}

async function getSalesTrend(days: number = 30) {
  return getRequest<SalesTrendResponse>('/v1/analytics/sales-trend', { days });
}

async function getTopSellingProducts(days: number = 30) {
  return getRequest<TopSellingProductsResponse>('/v1/analytics/top-selling-products', {
    days,
    limit: 5,
  });
}

async function getProfitByCategory(days: number = 30) {
  return getRequest<ProfitByCategoryResponse>('/v1/analytics/profit-by-category', { days, limit: 5 });
}

async function getRecentSales() {
  return getRequest<RecentSalesResponse>('/v1/analytics/recent-sales', { limit: 5 });
}

async function getPendingPurchaseOrders() {
  return getRequest<PendingPurchaseOrdersResponse>('/v1/analytics/pending-purchase-orders', { limit: 5 });
}

export const analytics = {
  getLowStockAlerts,
  getSalesTrend,
  getTopSellingProducts,
  getProfitByCategory,
  getRecentSales,
  getPendingPurchaseOrders,
};
