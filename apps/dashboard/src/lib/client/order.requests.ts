import { CreateOrderReq, OrderDeleteResponse, OrderListResponse, OrderResponse, UpdateOrderReq } from '@shared';

import { deleteRequest, getRequest, patchRequest, postRequest } from './common';

async function listOrders(query?: Record<string, any>) {
  return getRequest<OrderListResponse>('/v1/orders', query);
}

async function retrieveOrder(id: string) {
  return getRequest<OrderResponse>(`/v1/orders/${id}`);
}

async function createOrder(payload: CreateOrderReq) {
  return postRequest<OrderResponse>('/v1/orders', payload);
}

async function updateOrder(id: string, payload: UpdateOrderReq) {
  return patchRequest<OrderResponse>(`/v1/orders/${id}`, payload);
}

async function deleteOrder(id: string) {
  return deleteRequest<OrderDeleteResponse>(`/v1/orders/${id}`);
}

async function bulkDeleteOrders(ids: string[]) {
  return deleteRequest<OrderDeleteResponse[]>('/v1/orders', { orderIds: ids });
}

export const orders = {
  list: listOrders,
  retrieve: retrieveOrder,
  create: createOrder,
  update: updateOrder,
  delete: deleteOrder,
  bulkDelete: bulkDeleteOrders,
};
