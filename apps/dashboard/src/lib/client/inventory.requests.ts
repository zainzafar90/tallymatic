import { AdjustStockReq, InventoryLevelsResponse, LowStockAlertsResponse } from '@shared';

import { getRequest, postRequest } from './common';

async function adjustStock(payload: AdjustStockReq) {
  return postRequest<void>('/v1/inventory/adjust', payload);
}

// async function getInventoryLevels(productId: string) {
//   return getRequest<InventoryLevelsResponse>(`/v1/inventory/levels/${productId}`);
// }

async function getAllInventoryLevels(query?: Record<string, any>) {
  return getRequest<InventoryLevelsResponse>('/v1/inventory/levels', query);
}

async function getLowStockAlerts() {
  return getRequest<LowStockAlertsResponse>('/v1/inventory/low-stock-alerts');
}

export const inventory = {
  adjustStock,
  // getInventoryLevels,
  getAllInventoryLevels,
  getLowStockAlerts,
};
