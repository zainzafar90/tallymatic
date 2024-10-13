import Joi from 'joi';
import { CreateOrderReq, OrderStatus } from '@shared';

import { uuid } from '@/common/validate/custom.validation';

const createOrderBody: Record<keyof CreateOrderReq, any> = {
  customerId: Joi.string().custom(uuid).optional(),
  currency: Joi.string().optional().default('PKR'),
  status: Joi.string()
    .valid(...Object.values(OrderStatus))
    .required(),
  totalTax: Joi.number().required(),
  totalDiscount: Joi.number().required(),
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
    customerId: Joi.string().custom(uuid),
    status: Joi.string().valid(...Object.values(OrderStatus)),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    offset: Joi.number().integer(),
  }),
};

export const getOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(uuid).required(),
  }),
};

export const updateOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(uuid).required(),
  }),
  body: Joi.object()
    .keys({
      ...createOrderBody,
      customerId: Joi.string().custom(uuid),
      orderNumber: Joi.string(),
      items: Joi.array().items(
        Joi.object({
          id: Joi.string().custom(uuid),
          orderId: Joi.string().custom(uuid),
          variantId: Joi.string().custom(uuid),
          quantity: Joi.number().integer().min(1),
          price: Joi.number(),
          totalDiscount: Joi.number(),
        })
      ),
    })
    .min(1),
};

export const deleteOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(uuid).required(),
  }),
};
