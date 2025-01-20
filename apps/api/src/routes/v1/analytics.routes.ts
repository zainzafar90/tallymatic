import express from 'express';

import { validate } from '@/common/validate';
import { validateStore } from '@/middleware/validate-store';
import { analyticsController, analyticsValidation } from '@/modules/analytics';
import { auth } from '@/modules/auth';

const router = express.Router();

router.get('/sales-summary', auth(), validateStore, analyticsController.getSalesSummary);

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
router.get(
  '/profit-by-category',
  auth(),
  validateStore,
  validate(analyticsValidation.getProfitByCategory),
  analyticsController.getProfitByCategory
);
router.get(
  '/recent-sales',
  auth(),
  validateStore,
  validate(analyticsValidation.getRecentSales),
  analyticsController.getRecentSales
);
router.get(
  '/pending-purchase-orders',
  auth(),
  validateStore,
  validate(analyticsValidation.pendingPurchaseOrders),
  analyticsController.getPendingPurchaseOrders
);

export default router;
