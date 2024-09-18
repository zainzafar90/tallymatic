import Joi from 'joi';

import { ClaimStatus, ClaimType } from './claim.model';

export const createClaimSchema = {
  body: Joi.object().keys({
    claim: Joi.object().keys({
      type: Joi.string()
        .valid(...Object.values(ClaimType))
        .required(),
      description: Joi.string().required(),
      filedBy: Joi.string().uuid().required(),
    }),
    items: Joi.array()
      .items(
        Joi.object().keys({
          variantId: Joi.string().uuid().required(),
          quantityReported: Joi.number().integer().required(),
          notes: Joi.string().optional(),
        })
      )
      .min(1)
      .required(),
  }),
};

export const updateClaimStatusSchema = {
  params: Joi.object().keys({
    claimId: Joi.string().uuid().required(),
  }),
  body: Joi.object().keys({
    status: Joi.string()
      .valid(...Object.values(ClaimStatus))
      .required(),
  }),
};

export const assignClaimSchema = {
  params: Joi.object().keys({
    claimId: Joi.string().uuid().required(),
  }),
  body: Joi.object().keys({
    userId: Joi.string().uuid().required(),
  }),
};

export const resolveClaimSchema = {
  params: Joi.object().keys({
    claimId: Joi.string().uuid().required(),
  }),
  body: Joi.object().keys({
    resolution: Joi.string().required(),
  }),
};

export const getClaimsByVariantSchema = {
  params: Joi.object().keys({
    variantId: Joi.string().uuid().required(),
  }),
};

export const getClaimsByDateRangeSchema = {
  query: Joi.object().keys({
    startDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().min(Joi.ref('startDate')).required(),
  }),
};
