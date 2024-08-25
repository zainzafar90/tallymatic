import Joi from 'joi';

import { uuid } from '@/common/validate/custom.validation';

import { NewCreatedCategory } from './category.interfaces';
import { CategoryStatus } from './category.model';

const createCategoryBody: Record<keyof NewCreatedCategory, any> = {
  name: Joi.string().required(),
  description: Joi.string().optional(),
  parentCategoryId: Joi.string().custom(uuid).optional().allow(null),
  status: Joi.string()
    .valid(...Object.values(CategoryStatus))
    .required(),
};

export const createCategory = {
  body: Joi.object().keys(createCategoryBody),
};

export const getCategories = {
  query: Joi.object().keys({
    name: Joi.string(),
    parentCategoryId: Joi.string().custom(uuid),
    status: Joi.string().valid(...Object.values(CategoryStatus)),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    offset: Joi.number().integer(),
  }),
};

export const getCategory = {
  params: Joi.object().keys({
    categoryId: Joi.string().custom(uuid),
  }),
};

export const updateCategory = {
  params: Joi.object().keys({
    categoryId: Joi.required().custom(uuid),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      description: Joi.string(),
      parentCategoryId: Joi.string().custom(uuid).allow(null),
      status: Joi.string().valid(...Object.values(CategoryStatus)),
    })
    .min(1),
};

export const deleteCategory = {
  params: Joi.object().keys({
    categoryId: Joi.string().custom(uuid),
  }),
};
