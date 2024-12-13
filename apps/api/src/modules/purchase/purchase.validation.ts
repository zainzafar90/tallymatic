import Joi from 'joi';
import { PurchaseStatus } from '@shared';

import { uuid } from '@/common/validate/custom.validation';

const purchaseItemSchema = Joi.object().keys({
  variantId: Joi.string().custom(uuid).required(),
  quantity: Joi.number().integer().min(1).required(),
  unitCost: Joi.number().positive().required(),
});

export const createPurchase = {
  body: Joi.object().keys({
    supplierId: Joi.string().custom(uuid).required(),
    status: Joi.string()
      .valid(...Object.values(PurchaseStatus))
      .required(),
    notes: Joi.string().allow(null, ''),
    expectedArrivalDate: Joi.date().allow(null),
    receivedQuantity: Joi.number().integer().min(0),
    totalQuantity: Joi.number().integer().min(0),
    items: Joi.array().items(purchaseItemSchema).min(1).required(),
  }),
};

export const getPurchases = {
  query: Joi.object().keys({
    status: Joi.string().valid(...Object.values(PurchaseStatus)),
    supplierId: Joi.string().custom(uuid),
    sortBy: Joi.string(),
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

export const updatePurchase = {
  params: Joi.object().keys({
    purchaseId: Joi.required().custom(uuid),
  }),
  body: Joi.object()
    .keys({
      supplierId: Joi.string().custom(uuid).required(),
      status: Joi.string().valid(...Object.values(PurchaseStatus)),
      notes: Joi.string().allow(null, ''),
      expectedArrivalDate: Joi.date().allow(null),
      receivedQuantity: Joi.number().integer().min(0),
      totalQuantity: Joi.number().integer().min(0),
      items: Joi.array().items(purchaseItemSchema).min(1),
    })
    .min(1),
};

export const deletePurchase = {
  params: Joi.object().keys({
    purchaseId: Joi.string().custom(uuid),
  }),
};
