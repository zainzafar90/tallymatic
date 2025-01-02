import { BaseSupplier, CreateSupplierReq, SupplierListResponse, UpdateSupplierReq } from '@repo/shared';

import { deleteRequest, getRequest, patchRequest, postRequest } from './common';

async function retrieveSupplier(id: string, query?: Record<string, any>) {
  return getRequest<BaseSupplier>(`/v1/suppliers/${id}`, query);
}

async function listSuppliers(query?: Record<string, any>) {
  return getRequest<SupplierListResponse>(`/v1/suppliers`, query);
}

async function createSupplier(payload: CreateSupplierReq) {
  return postRequest<BaseSupplier>('/v1/suppliers', payload);
}

async function updateSupplier(id: string, payload: UpdateSupplierReq) {
  return patchRequest<BaseSupplier>(`/v1/suppliers/${id}`, payload);
}

async function deleteSupplier(id: string) {
  return deleteRequest<void>(`/v1/suppliers/${id}`);
}

async function bulkDeleteSuppliers(ids: string[]) {
  return deleteRequest<void>(`/v1/suppliers`, { supplierIds: ids });
}

export const suppliers = {
  list: listSuppliers,
  retrieve: retrieveSupplier,
  create: createSupplier,
  update: updateSupplier,
  delete: deleteSupplier,
  bulkDelete: bulkDeleteSuppliers,
};
