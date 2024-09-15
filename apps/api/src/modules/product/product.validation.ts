import Joi from 'joi';
import { CreateProductReq, Status } from '@shared';

import { uuid } from '@/common/validate/custom.validation';

import { createProductVariantBody } from '../product-variant/product-variant.validation';

const createProductBody: Record<keyof CreateProductReq, any> = {
  name: Joi.string().required(),
  description: Joi.string().allow('').optional(),
  status: Joi.string().valid(Status.ACTIVE, Status.INACTIVE).required(),
  categoryId: Joi.string().custom(uuid).optional(),
  variants: Joi.array().items(Joi.object().keys(createProductVariantBody)).min(1).required(),
  createdAt: Joi.date().optional(),
  updatedAt: Joi.date().optional(),
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
      id: Joi.string().custom(uuid).optional(),
      name: Joi.string(),
      description: Joi.string().allow('').optional(),
      status: Joi.string().valid(Status.ACTIVE, Status.INACTIVE),
      categoryId: Joi.string().custom(uuid).optional(),
      variants: Joi.array().items(Joi.object().keys(createProductVariantBody)).min(1),
    })
    .min(1),
};

export const deleteProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(uuid),
  }),
};
