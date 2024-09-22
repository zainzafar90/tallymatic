import Joi from 'joi';
import { CreateOrderReq, FinancialStatus, FulfillmentStatus } from '@shared';

import { uuid } from '@/common/validate/custom.validation';

const createOrderBody: Record<keyof CreateOrderReq, any> = {
  number: Joi.string().required(),
  customerId: Joi.string().custom(uuid).required(),
  currency: Joi.string().optional().default('PKR'),
  financialStatus: Joi.string()
    .valid(...Object.values(FinancialStatus))
    .required(),
  fulfillmentStatus: Joi.string()
    .valid(...Object.values(FulfillmentStatus))
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
    financialStatus: Joi.string().valid(...Object.values(FinancialStatus)),
    fulfillmentStatus: Joi.string().valid(...Object.values(FulfillmentStatus)),
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
      number: Joi.string(),
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
