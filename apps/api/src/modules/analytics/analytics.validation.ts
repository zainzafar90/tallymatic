import Joi from 'joi';

export const getSalesTrend = {
  query: Joi.object().keys({
    days: Joi.number().integer().min(1).max(365).optional(),
  }),
};

export const getTopSellingProducts = {
  query: Joi.object().keys({
    days: Joi.number().integer().min(1).max(365).optional(),
    limit: Joi.number().integer().min(1).max(100).optional(),
  }),
};

export const getLowStockAlerts = {
  query: Joi.object().keys({
    limit: Joi.number().integer().min(1).max(100).optional(),
  }),
};
