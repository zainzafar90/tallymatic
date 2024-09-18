import express from 'express';

import { validate } from '@/common/validate';
import { auth } from '@/modules/auth';
import { inventoryController, inventoryValidation } from '@/modules/inventory';

const router = express.Router();

router.route('/adjust').post(auth(), validate(inventoryValidation.adjustStockSchema), inventoryController.adjustStock);

router
  .route('/levels/:productId')
  .get(auth(), validate(inventoryValidation.getInventoryLevelsSchema), inventoryController.getInventoryLevels);

router.route('/low-stock-alerts').get(auth(), inventoryController.getLowStockAlerts);

export default router;
