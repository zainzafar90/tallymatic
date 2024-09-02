import Joi from 'joi';
import { CreateProductReq, Status } from '@shared';

import { uuid } from '@/common/validate/custom.validation';

const createProductBody: Record<keyof CreateProductReq, any> = {
  organizationId: Joi.string().custom(uuid).required(),
  storeId: Joi.string().custom(uuid).required(),
  name: Joi.string().required(),
  description: Joi.string().optional(),
  basePrice: Joi.number().positive().required(),
  costPrice: Joi.number().positive().required(),
  status: Joi.string().valid(Status.ACTIVE, Status.INACTIVE).required(),
};

export const createProduct = {
  body: Joi.object().keys(createProductBody),
};

export const getProducts = {
  query: Joi.object().keys({
    storeId: Joi.string().custom(uuid),
    name: Joi.string(),
    status: Joi.string().valid(Status.ACTIVE, Status.INACTIVE),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    offset: Joi.number().integer(),
  }),
};

export const getProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(uuid),
  }),
};

export const updateProduct = {
  params: Joi.object().keys({
    productId: Joi.required().custom(uuid),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      description: Joi.string(),
      price: Joi.number().positive(),
      status: Joi.string().valid(Status.ACTIVE, Status.INACTIVE),
    })
    .min(1),
};

export const deleteProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(uuid),
  }),
};
