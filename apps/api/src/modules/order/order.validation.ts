import Joi from 'joi';
import { CreateOrderReq, OrderStatus, UpdateOrderReq } from '@repo/shared';

import { uuid } from '@/common/validate/custom.validation';

const createOrderBody: Record<keyof CreateOrderReq, any> = {
  customerId: Joi.string().custom(uuid).optional(),
  status: Joi.string()
    .valid(...Object.values(OrderStatus))
    .required(),
  taxAmount: Joi.number().required(),
  discountAmount: Joi.number().required(),
  items: Joi.array()
    .items(
      Joi.object({
        variantId: Joi.string().custom(uuid).required(),
        quantity: Joi.number().integer().min(1).required(),
        price: Joi.number().required(),
        totalDiscount: Joi.number().required(),
      })
    )
    .min(1)
    .required(),
};

export const createOrder = {
  body: Joi.object().keys(createOrderBody),
};

export const getOrders = {
  query: Joi.object().keys({
    status: Joi.string().valid(...Object.values(OrderStatus)),
    sortBy: Joi.string(),
    sortOrder: Joi.string().valid('asc', 'desc'),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    offset: Joi.number().integer(),
    orderNumber: Joi.string(),
  }),
};

export const getOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(uuid).required(),
  }),
};

const updateOrderBody: Record<keyof UpdateOrderReq, any> = {
  ...createOrderBody,
  closedAt: Joi.date().optional().allow(null),
};

export const updateOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(uuid).required(),
  }),
  body: Joi.object().keys(updateOrderBody),
};

export const deleteOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(uuid).required(),
  }),
};
