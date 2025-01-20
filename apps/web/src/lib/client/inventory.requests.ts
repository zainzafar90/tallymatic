import { AdjustStockReq, InventoryLevelsResponse } from '@repo/shared';

import { getRequest, postRequest } from './common';

async function adjustStock(payload: AdjustStockReq) {
  return postRequest<void>('/v1/inventory/adjust', payload);
}

async function getAllInventoryLevels(query?: Record<string, any>) {
  return getRequest<InventoryLevelsResponse>('/v1/inventory/levels', query);
}

export const inventory = {
  adjustStock,
  getAllInventoryLevels,
};
