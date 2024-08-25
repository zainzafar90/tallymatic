import Joi from 'joi';

import { uuid } from '@/common/validate/custom.validation';

import { NewCreatedProduct } from './product.interfaces';
import { ProductStatus } from './product.model';

const createProductBody: Record<keyof NewCreatedProduct, any> = {
  organizationId: Joi.string().custom(uuid).required(),
  storeId: Joi.string().custom(uuid).required(),
  name: Joi.string().required(),
  description: Joi.string().optional(),
  price: Joi.number().positive().required(),
  status: Joi.string()
    .valid(...Object.values(ProductStatus))
    .required(),
};

export const createProduct = {
  body: Joi.object().keys(createProductBody),
};

export const getProducts = {
  query: Joi.object().keys({
    organizationId: Joi.string().custom(uuid).required(),
    storeId: Joi.string().custom(uuid),
    name: Joi.string(),
    status: Joi.string().valid(...Object.values(ProductStatus)),
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
      status: Joi.string().valid(...Object.values(ProductStatus)),
    })
    .min(1),
};

export const deleteProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(uuid),
  }),
};
