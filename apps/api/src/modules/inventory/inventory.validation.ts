import Joi from 'joi';

import { TransactionType } from './inventory.model';

export const adjustStockSchema = {
  body: Joi.object().keys({
    variantId: Joi.string().uuid().required(),
    quantity: Joi.number().required(),
    type: Joi.string()
      .valid(...Object.values(TransactionType))
      .required(),
    notes: Joi.string().optional(),
  }),
};

export const getInventoryLevelsSchema = {
  params: Joi.object().keys({
    productId: Joi.string().uuid().required(),
  }),
};
