import Joi from 'joi';
import { CreateCustomerReq } from '@shared';

import { uuid } from '@/common/validate/custom.validation';

const createCustomerBody: Record<keyof CreateCustomerReq, any> = {
  name: Joi.string().required(),
  email: Joi.string().optional().email(),
  phone: Joi.string().optional(),
  address: Joi.string().optional(),
};

export const createCustomer = {
  body: Joi.object().keys(createCustomerBody),
};

export const getCustomers = {
  query: Joi.object().keys({
    name: Joi.string(),
    email: Joi.string(),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    offset: Joi.number().integer(),
  }),
};

export const getCustomer = {
  params: Joi.object().keys({
    customerId: Joi.string().custom(uuid),
  }),
};

export const updateCustomer = {
  params: Joi.object().keys({
    customerId: Joi.required().custom(uuid),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      email: Joi.string().email(),
      phone: Joi.string(),
      address: Joi.string(),
    })
    .min(1),
};

export const deleteCustomer = {
  params: Joi.object().keys({
    customerId: Joi.string().custom(uuid),
  }),
};

export const bulkDeleteCustomers = {
  body: Joi.object().keys({
    customerIds: Joi.array().items(Joi.string().custom(uuid)).min(1).required(),
  }),
};
