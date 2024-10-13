import Joi from 'joi';
import { CreateProductVariantReq, Status } from '@shared';

export const createProductVariantBody: Record<keyof CreateProductVariantReq, any> = {
  name: Joi.string().required(),
  sku: Joi.string().required(),
  price: Joi.number().min(0).precision(2).required(),
  costPrice: Joi.number().min(0).precision(2).required(),
  stock: Joi.number().integer().min(0).required(),
  lowStockThreshold: Joi.number().integer().min(0).default(0),
  reorderPoint: Joi.number().integer().min(0).default(0),
  reorderQuantity: Joi.number().integer().min(0).default(0),
  status: Joi.string().valid(Status.ACTIVE, Status.INACTIVE).required(),
  product: Joi.object().optional(),
  createdAt: Joi.date().optional(),
  updatedAt: Joi.date().optional(),
};

export const getProductVariants = {
  query: Joi.object().keys({
    name: Joi.string(),
    productName: Joi.string(),
    sku: Joi.string(),
    status: Joi.string().valid(Status.ACTIVE, Status.INACTIVE),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    offset: Joi.number().integer(),
  }),
};
