import Joi from 'joi';
import { CreateOrderReq, OrderStatus, PaymentMethod, PaymentType, UpdateOrderReq } from '@repo/shared';

import { uuid } from '@/common/validate/custom.validation';

const orderItemSchema = Joi.object().keys({
  variantId: Joi.string().custom(uuid).required(),
  quantity: Joi.number().integer().min(1).required(),
  price: Joi.number().positive().required(),
  totalDiscount: Joi.number().min(0).required(),
});

const createOrderBody: Record<keyof CreateOrderReq, any> = {
  customerId: Joi.string().custom(uuid).required(),
  status: Joi.string()
    .valid(
      OrderStatus.PAID,
      OrderStatus.UNPAID,
      OrderStatus.PARTIALLY_PAID,
      OrderStatus.REFUNDED,
      OrderStatus.VOIDED,
      OrderStatus.PENDING
    )
    .required(),
  taxAmount: Joi.number().min(0),
  discountAmount: Joi.number().min(0),
  items: Joi.array().items(orderItemSchema).min(1).required(),
  paymentMethod: Joi.string()
    .valid(
      PaymentMethod.CASH,
      PaymentMethod.BANK_TRANSFER,
      PaymentMethod.CREDIT_CARD,
      PaymentMethod.DEBIT_CARD,
      PaymentMethod.CHEQUE,
      PaymentMethod.ONLINE,
      PaymentMethod.OTHER
    )
    .optional(),
  paymentType: Joi.string().valid(PaymentType.DEBIT, PaymentType.CREDIT).optional(),
  amountPaid: Joi.number().min(0).optional(),
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
