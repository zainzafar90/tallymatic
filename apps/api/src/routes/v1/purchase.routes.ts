import express from 'express';

import { validate } from '@/common/validate';
import { auth } from '@/modules/auth';
import { purchaseController, purchaseValidation } from '@/modules/purchase';

const router: express.Router = express.Router();

router
  .route('/')
  .post(auth(), validate(purchaseValidation.createPurchase), purchaseController.createPurchase)
  .get(auth(), validate(purchaseValidation.getPurchases), purchaseController.getPurchases);

router
  .route('/:purchaseId')
  .get(auth(), validate(purchaseValidation.getPurchase), purchaseController.getPurchase)
  .patch(auth(), validate(purchaseValidation.updatePurchase), purchaseController.updatePurchase)
  .delete(auth(), validate(purchaseValidation.deletePurchase), purchaseController.deletePurchase);

export default router;
