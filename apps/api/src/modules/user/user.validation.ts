import Joi from 'joi';
import { CreateUserReq, RoleType } from '@shared';

import { password, uuid } from '@/common/validate/custom.validation';

const createUserBody: Record<keyof CreateUserReq, any> = {
  email: Joi.string().required().email(),
  password: Joi.string().required().custom(password),
  name: Joi.string().required(),
  contact: Joi.string().optional(),
  role: Joi.string().valid(RoleType.Member, RoleType.Admin).required(),
  organizationId: Joi.string().required().custom(uuid),
};

export const createUser = {
  body: Joi.object().keys(createUserBody),
};

export const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    offset: Joi.number().integer(),
  }),
};

export const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(uuid),
  }),
};

export const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(uuid),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string(),
    })
    .min(1),
};

export const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(uuid),
  }),
};
