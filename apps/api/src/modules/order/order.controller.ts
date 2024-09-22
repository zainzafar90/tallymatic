import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { IOptions } from '@shared';

import { catchAsync } from '@/utils/catch-async';
import { pick } from '@/utils/pick';
import { ApiError } from '@/common/errors/api-error';

import * as orderService from './order.service';

export const createOrder = catchAsync(async (req: Request, res: Response) => {
  const order = await orderService.createOrder(req.body);
  res.status(httpStatus.CREATED).send(order);
});

export const getOrders = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['storeId', 'customerId', 'financialStatus', 'fulfillmentStatus']);
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'offset', 'projectBy']);
  const result = await orderService.queryOrders(filter, options);
  res.send(result);
});

export const getOrder = catchAsync(async (req: Request, res: Response) => {
  const order = await orderService.getOrderById(req.params.orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  res.send(order);
});

export const updateOrder = catchAsync(async (req: Request, res: Response) => {
  const order = await orderService.updateOrderById(req.params.orderId, req.body);
  res.send(order);
});

export const deleteOrder = catchAsync(async (req: Request, res: Response) => {
  await orderService.deleteOrderById(req.params.orderId);
  res.status(httpStatus.NO_CONTENT).send();
});
