import express, { Router } from 'express';

import { validate } from '@/common/validate';
import { auth } from '@/modules/auth';
import { categoryController, categoryValidation } from '@/modules/category';

const router: Router = express.Router();

router
  .route('/')
  .post(auth(), validate(categoryValidation.createCategory), categoryController.createCategory)
  .get(auth(), validate(categoryValidation.getCategories), categoryController.getCategories);

router
  .route('/:categoryId')
  .get(auth(), validate(categoryValidation.getCategory), categoryController.getCategory)
  .patch(auth(), validate(categoryValidation.updateCategory), categoryController.updateCategory)
  .delete(auth(), validate(categoryValidation.deleteCategory), categoryController.deleteCategory);

export default router;
