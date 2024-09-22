import Joi from 'joi';
import { CreateSupplierReq } from '@shared';

import { uuid } from '@/common/validate/custom.validation';

const createSupplierBody: Record<keyof CreateSupplierReq, any> = {
  companyName: Joi.string().required(),
  contactName: Joi.string().required(),
  email: Joi.string().required().email(),
  phone: Joi.string().optional(),
  address: Joi.string().optional(),
};

export const createSupplier = {
  body: Joi.object().keys(createSupplierBody),
};

export const getSuppliers = {
  query: Joi.object().keys({
    companyName: Joi.string(),
    contactName: Joi.string(),
    email: Joi.string(),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    offset: Joi.number().integer(),
  }),
};

export const getSupplier = {
  params: Joi.object().keys({
    supplierId: Joi.string().custom(uuid),
  }),
};

export const updateSupplier = {
  params: Joi.object().keys({
    supplierId: Joi.required().custom(uuid),
  }),
  body: Joi.object()
    .keys({
      companyName: Joi.string(),
      contactName: Joi.string(),
      email: Joi.string().email(),
      phone: Joi.string(),
      address: Joi.string(),
    })
    .min(1),
};

export const deleteSupplier = {
  params: Joi.object().keys({
    supplierId: Joi.string().custom(uuid),
  }),
};
