import Joi from 'joi';
import { TransactionType } from '@repo/shared';

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

// export const getInventoryLevelsSchema = {
//   params: Joi.object().keys({
//     productId: Joi.string().uuid().required(),
//   }),
// };

export const getInventoryLevelsSchema = {
  query: Joi.object().keys({
    name: Joi.string(),
    sortBy: Joi.string(),
    sortOrder: Joi.string().valid('asc', 'desc'),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    offset: Joi.number().integer(),
  }),
};
