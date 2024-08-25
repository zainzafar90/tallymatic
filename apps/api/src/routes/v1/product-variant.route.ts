import express, { Router } from 'express';

import { validate } from '@/common/validate';
import { auth } from '@/modules/auth';
import { productVariantController, productVariantValidation } from '@/modules/product-variant';

const router: Router = express.Router();

router
  .route('/')
  .post(auth(), validate(productVariantValidation.createProductVariant), productVariantController.createProductVariant)
  .get(auth(), validate(productVariantValidation.getProductVariants), productVariantController.getProductVariants);

router
  .route('/:variantId')
  .get(auth(), validate(productVariantValidation.getProductVariant), productVariantController.getProductVariant)
  .patch(auth(), validate(productVariantValidation.updateProductVariant), productVariantController.updateProductVariant)
  .delete(auth(), validate(productVariantValidation.deleteProductVariant), productVariantController.deleteProductVariant);

export default router;
