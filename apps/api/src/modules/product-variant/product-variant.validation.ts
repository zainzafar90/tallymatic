import Joi from 'joi';
import { Status } from '@shared';

import { uuid } from '@/common/validate/custom.validation';

import { NewCreatedProductVariant } from './product-variant.interfaces';

const createProductVariantBody: Record<keyof NewCreatedProductVariant, any> = {
  productId: Joi.string().custom(uuid).required(),
  name: Joi.string().required(),
  sku: Joi.string().required(),
  price: Joi.number().positive().required(),
  status: Joi.string().valid(Status.ACTIVE, Status.INACTIVE).required(),
};

export const createProductVariant = {
  body: Joi.object().keys(createProductVariantBody),
};

export const getProductVariants = {
  query: Joi.object().keys({
    productId: Joi.string().custom(uuid),
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
    variantId: Joi.string().custom(uuid),
  }),
};

export const updateProductVariant = {
  params: Joi.object().keys({
    variantId: Joi.required().custom(uuid),
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
    variantId: Joi.string().custom(uuid),
  }),
};
