import Joi from 'joi';
import { CreatePurchaseReq, PurchaseStatus, UpdatePurchaseReq } from '@repo/shared';

import { uuid } from '@/common/validate/custom.validation';

const purchaseItemSchema = Joi.object().keys({
  variantId: Joi.string().custom(uuid).required(),
  quantity: Joi.number().integer().min(1).required(),
  unitCost: Joi.number().positive().required(),
});

const createPurchaseBody: Record<keyof CreatePurchaseReq, any> = {
  supplierId: Joi.string().custom(uuid).required(),
  status: Joi.string()
    .valid(...Object.values(PurchaseStatus))
    .required(),
  notes: Joi.string().allow(null, ''),
  expectedArrivalDate: Joi.date().allow(null),
  receivedQuantity: Joi.number().integer().min(0),
  totalQuantity: Joi.number().integer().min(0),
  items: Joi.array().items(purchaseItemSchema).min(1).required(),
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
    purchaseId: Joi.required().custom(uuid),
  }),
  body: Joi.object().keys(updatePurchaseBody),
};

export const deletePurchase = {
  params: Joi.object().keys({
    purchaseId: Joi.string().custom(uuid),
  }),
};
