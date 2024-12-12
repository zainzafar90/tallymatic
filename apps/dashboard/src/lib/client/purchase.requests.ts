import { CreatePurchaseReq, PurchaseDeleteResponse, PurchaseListResponse, PurchaseResponse, UpdatePurchaseReq } from '@shared';

import { deleteRequest, getRequest, patchRequest, postRequest } from './common';

async function retrievePurchase(id: string, query?: Record<string, any>) {
  return getRequest<PurchaseResponse>(`/v1/purchases/${id}`, query);
}

async function listPurchases(query?: Record<string, any>) {
  return getRequest<PurchaseListResponse>(`/v1/purchases`, query);
}

async function createPurchase(payload: CreatePurchaseReq) {
  return postRequest<PurchaseResponse>('/v1/purchases', payload);
}

async function updatePurchase(id: string, payload: UpdatePurchaseReq) {
  return patchRequest<PurchaseResponse>(`/v1/purchases/${id}`, payload);
}

async function deletePurchase(id: string) {
  return deleteRequest<PurchaseDeleteResponse>(`/v1/purchases/${id}`);
}

async function bulkDeletePurchases(ids: string[]) {
  return deleteRequest<PurchaseDeleteResponse[]>(`/v1/purchases`, { purchaseIds: ids });
}

export const purchases = {
  list: listPurchases,
  retrieve: retrievePurchase,
  create: createPurchase,
  update: updatePurchase,
  delete: deletePurchase,
  bulkDelete: bulkDeletePurchases,
};
    