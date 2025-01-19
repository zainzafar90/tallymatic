import express from 'express';

import { validate } from '@/common/validate';
import { validateStore } from '@/middleware/validate-store';
import { auth } from '@/modules/auth';
import { purchaseController, purchaseValidation } from '@/modules/purchase';

const router: express.Router = express.Router();

router
  .route('/')
  .post(auth(), validateStore, validate(purchaseValidation.createPurchase), purchaseController.createPurchase)
  .get(auth(), validateStore, validate(purchaseValidation.getPurchases), purchaseController.getPurchases)
  .delete(auth(), validateStore, validate(purchaseValidation.bulkDeletePurchases), purchaseController.bulkDeletePurchases);

router
  .route('/:purchaseId')
  .get(auth(), validateStore, validate(purchaseValidation.getPurchase), purchaseController.getPurchase)
  .patch(auth(), validateStore, validate(purchaseValidation.updatePurchase), purchaseController.updatePurchase)
  .delete(auth(), validateStore, validate(purchaseValidation.deletePurchase), purchaseController.deletePurchase);

export default router;
