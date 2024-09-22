import { CreateCustomerReq, CustomerListResponse, CustomerResponse, UpdateCustomerReq } from '@shared';

import { deleteRequest, getRequest, patchRequest, postRequest } from './common';

async function retrieveCustomer(id: string, query?: Record<string, any>) {
  return getRequest<CustomerResponse>(`/v1/customers/${id}`, query);
}

async function listCustomers(query?: Record<string, any>) {
  return getRequest<CustomerListResponse>(`/v1/customers`, query);
}

async function createCustomer(payload: CreateCustomerReq) {
  return postRequest<CustomerResponse>('/v1/customers', payload);
}

async function updateCustomer(id: string, payload: UpdateCustomerReq) {
  return patchRequest<CustomerResponse>(`/v1/customers/${id}`, payload);
}

async function deleteCustomer(id: string) {
  return deleteRequest<void>(`/v1/customers/${id}`);
}

async function bulkDeleteCustomers(ids: string[]) {
  return deleteRequest<void>(`/v1/customers`, { customerIds: ids });
}

export const customers = {
  list: listCustomers,
  retrieve: retrieveCustomer,
  create: createCustomer,
  update: updateCustomer,
  delete: deleteCustomer,
  bulkDelete: bulkDeleteCustomers,
};
