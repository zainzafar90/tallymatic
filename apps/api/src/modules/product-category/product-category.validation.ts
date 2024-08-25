import Joi from 'joi';

import { uuid } from '@/common/validate/custom.validation';

import { NewCreatedProductCategory } from './product-category.interfaces';

const createProductCategoryBody: Record<keyof NewCreatedProductCategory, any> = {
  productId: Joi.string().custom(uuid).required(),
  categoryId: Joi.string().custom(uuid).required(),
};

export const createProductCategory = {
  body: Joi.object().keys(createProductCategoryBody),
};

export const getProductCategories = {
  query: Joi.object().keys({
    productId: Joi.string().custom(uuid),
    categoryId: Joi.string().custom(uuid),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    offset: Joi.number().integer(),
  }),
};

export const getProductCategory = {
  params: Joi.object().keys({
    productCategoryId: Joi.string().custom(uuid),
  }),
};

export const deleteProductCategory = {
  params: Joi.object().keys({
    productCategoryId: Joi.string().custom(uuid),
  }),
};
