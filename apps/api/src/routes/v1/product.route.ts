import express, { Router } from 'express';

import { validate } from '@/common/validate';
import { auth } from '@/modules/auth';
import { productController, productValidation } from '@/modules/product';

const router: Router = express.Router();

router
  .route('/')
  .post(auth(), validate(productValidation.createProduct), productController.createProduct)
  .get(auth(), validate(productValidation.getProducts), productController.getProducts);

router
  .route('/:productId')
  .get(auth(), validate(productValidation.getProduct), productController.getProduct)
  .patch(auth(), validate(productValidation.updateProduct), productController.updateProduct)
  .delete(auth(), validate(productValidation.deleteProduct), productController.deleteProduct);

export default router;
