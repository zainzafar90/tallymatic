import express, { Router } from 'express';

import { validate } from '@/common/validate';
import { auth } from '@/modules/auth';
import { supplierController, supplierValidation } from '@/modules/supplier';

const router: Router = express.Router();

router
  .route('/')
  .post(auth(), validate(supplierValidation.createSupplier), supplierController.createSupplier)
  .get(auth(), validate(supplierValidation.getSuppliers), supplierController.getSuppliers);

router
  .route('/:supplierId')
  .get(auth(), validate(supplierValidation.getSupplier), supplierController.getSupplier)
  .patch(auth(), validate(supplierValidation.updateSupplier), supplierController.updateSupplier)
  .delete(auth(), validate(supplierValidation.deleteSupplier), supplierController.deleteSupplier);

export default router;
