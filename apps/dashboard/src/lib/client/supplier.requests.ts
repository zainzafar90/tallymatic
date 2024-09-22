import { CreateSupplierReq, SupplierListResponse, SupplierResponse, UpdateSupplierReq } from '@shared';

import { deleteRequest, getRequest, patchRequest, postRequest } from './common';

async function retrieveSupplier(id: string, query?: Record<string, any>) {
  return getRequest<SupplierResponse>(`/v1/suppliers/${id}`, query);
}

async function listSuppliers(query?: Record<string, any>) {
  return getRequest<SupplierListResponse>(`/v1/suppliers`, query);
}

async function createSupplier(payload: CreateSupplierReq) {
  return postRequest<SupplierResponse>('/v1/suppliers', payload);
}

async function updateSupplier(id: string, payload: UpdateSupplierReq) {
  return patchRequest<SupplierResponse>(`/v1/suppliers/${id}`, payload);
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
