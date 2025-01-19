import express from 'express';

import { validate } from '@/common/validate';
import { validateStore } from '@/middleware/validate-store';
import { auth } from '@/modules/auth';
import { inventoryController, inventoryValidation } from '@/modules/inventory';

const router = express.Router();

router
  .route('/adjust')
  .post(auth(), validateStore, validate(inventoryValidation.adjustStockSchema), inventoryController.adjustStock);

router
  .route('/levels')
  .get(auth(), validate(inventoryValidation.getInventoryLevelsSchema), inventoryController.getAllInventoryLevels);

// router
//   .route('/levels/:productId')
//   .get(auth(), validate(inventoryValidation.getInventoryLevelsSchema), inventoryController.getInventoryLevels);

router.route('/low-stock-alerts').get(auth(), validateStore, inventoryController.getLowStockAlerts);

export default router;
