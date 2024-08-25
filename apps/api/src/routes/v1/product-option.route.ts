import express, { Router } from 'express';

import { validate } from '@/common/validate';
import { auth } from '@/modules/auth';
import { productOptionController, productOptionValidation } from '@/modules/product-option';

const router: Router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(auth(), validate(productOptionValidation.createProductOption), productOptionController.createProductOption)
  .get(auth(), validate(productOptionValidation.getProductOptions), productOptionController.getProductOptions);

router
  .route('/:optionId')
  .get(auth(), validate(productOptionValidation.getProductOption), productOptionController.getProductOption)
  .patch(auth(), validate(productOptionValidation.updateProductOption), productOptionController.updateProductOption)
  .delete(auth(), validate(productOptionValidation.deleteProductOption), productOptionController.deleteProductOption);

export default router;
