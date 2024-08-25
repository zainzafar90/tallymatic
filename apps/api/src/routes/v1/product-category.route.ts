import express, { Router } from 'express';

import { validate } from '@/common/validate';
import { auth } from '@/modules/auth';
import { productCategoryController, productCategoryValidation } from '@/modules/product-category';

const router: Router = express.Router();

router
  .route('/')
  .post(auth(), validate(productCategoryValidation.createProductCategory), productCategoryController.createProductCategory)
  .get(auth(), validate(productCategoryValidation.getProductCategories), productCategoryController.getProductCategories);

router
  .route('/:productCategoryId')
  .get(auth(), validate(productCategoryValidation.getProductCategory), productCategoryController.getProductCategory)
  .delete(
    auth(),
    validate(productCategoryValidation.deleteProductCategory),
    productCategoryController.deleteProductCategory
  );

export default router;
