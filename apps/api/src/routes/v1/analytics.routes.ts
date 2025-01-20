import express from 'express';

import { validate } from '@/common/validate';
import { validateStore } from '@/middleware/validate-store';
import { analyticsController, analyticsValidation } from '@/modules/analytics';
import { auth } from '@/modules/auth';

const router = express.Router();

router.get(
  '/sales-trend',
  auth(),
  validateStore,
  validate(analyticsValidation.getSalesTrend),
  analyticsController.getSalesTrend
);
router.get(
  '/top-selling-products',
  auth(),
  validateStore,
  validate(analyticsValidation.getTopSellingProducts),
  analyticsController.getTopSellingProducts
);
router.get(
  '/low-stock-alerts',
  auth(),
  validateStore,
  validate(analyticsValidation.getLowStockAlerts),
  analyticsController.getLowStockAlerts
);

export default router;
