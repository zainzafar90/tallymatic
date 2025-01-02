import Joi from 'joi';
import { CreatePurchaseReq, PaymentMethod, PaymentType, PurchaseStatus, UpdatePurchaseReq } from '@repo/shared';

import { uuid } from '@/common/validate/custom.validation';

const purchaseItemSchema = Joi.object().keys({
  variantId: Joi.string().custom(uuid).required(),
  quantity: Joi.number().integer().min(1).required(),
  unitCost: Joi.number().positive().required(),
});

const createPurchaseBody: Record<keyof CreatePurchaseReq, any> = {
  supplierId: Joi.string().custom(uuid).required(),
  status: Joi.string()
    .valid(
      PurchaseStatus.CLOSED,
      PurchaseStatus.DRAFT,
      PurchaseStatus.ORDERED,
      PurchaseStatus.PARTIAL,
      PurchaseStatus.RECEIVED
    )
    .required(),
  notes: Joi.string().allow(null, ''),
  expectedArrivalDate: Joi.date().allow(null),
  receivedQuantity: Joi.number().integer().min(0),
  totalQuantity: Joi.number().integer().min(0),
  items: Joi.array().items(purchaseItemSchema).min(1).required(),
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

export const createPurchase = {
  body: Joi.object().keys(createPurchaseBody),
};

export const getPurchases = {
  query: Joi.object().keys({
    status: Joi.string().valid(...Object.values(PurchaseStatus)),
    supplierId: Joi.string().custom(uuid),
    sortBy: Joi.string(),
    sortOrder: Joi.string().valid('asc', 'desc'),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    offset: Joi.number().integer(),
  }),
};

export const getPurchase = {
  params: Joi.object().keys({
    purchaseId: Joi.string().custom(uuid),
  }),
};

const updatePurchaseBody: Record<keyof UpdatePurchaseReq, any> = {
  ...createPurchaseBody,
};

export const updatePurchase = {
  params: Joi.object().keys({
    purchaseId: Joi.string().custom(uuid).required(),
  }),
  body: Joi.object().keys(updatePurchaseBody),
};

export const deletePurchase = {
  params: Joi.object().keys({
    purchaseId: Joi.string().custom(uuid),
  }),
};
