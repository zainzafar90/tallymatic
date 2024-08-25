import Joi from 'joi';
import { Status } from '@shared';

import { uuid } from '@/common/validate/custom.validation';

import { NewCreatedProductVariant } from './product-variant.interfaces';

const createProductVariantBody: Record<keyof NewCreatedProductVariant, any> = {
  name: Joi.string().required(),
  sku: Joi.string().required(),
  price: Joi.number().positive().required(),
  status: Joi.string().valid(Status.ACTIVE, Status.INACTIVE).required(),
};

export const createProductVariant = {
  params: Joi.object().keys({
    productId: Joi.string().custom(uuid).required(),
  }),
  body: Joi.object().keys(createProductVariantBody),
};

export const getProductVariants = {
  params: Joi.object().keys({
    productId: Joi.string().custom(uuid).required(),
  }),
  query: Joi.object().keys({
    name: Joi.string(),
    sku: Joi.string(),
    status: Joi.string().valid(Status.ACTIVE, Status.INACTIVE),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    offset: Joi.number().integer(),
  }),
};

export const getProductVariant = {
  params: Joi.object().keys({
    productId: Joi.string().custom(uuid).required(),
    variantId: Joi.string().custom(uuid).required(),
  }),
};

export const updateProductVariant = {
  params: Joi.object().keys({
    productId: Joi.string().custom(uuid).required(),
    variantId: Joi.string().custom(uuid).required(),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      sku: Joi.string(),
      price: Joi.number().positive(),
      status: Joi.string().valid(Status.ACTIVE, Status.INACTIVE),
    })
    .min(1),
};

export const deleteProductVariant = {
  params: Joi.object().keys({
    productId: Joi.string().custom(uuid).required(),
    variantId: Joi.string().custom(uuid).required(),
  }),
};
