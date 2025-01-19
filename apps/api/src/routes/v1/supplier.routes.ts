import express, { Router } from 'express';

import { validate } from '@/common/validate';
import { validateStore } from '@/middleware/validate-store';
import { auth } from '@/modules/auth';
import { supplierController, supplierValidation } from '@/modules/supplier';

const router: Router = express.Router();

router
  .route('/')
  .post(auth(), validateStore, validate(supplierValidation.createSupplier), supplierController.createSupplier)
  .get(auth(), validateStore, validate(supplierValidation.getSuppliers), supplierController.getSuppliers)
  .delete(auth(), validateStore, validate(supplierValidation.bulkDeleteSuppliers), supplierController.bulkDeleteSuppliers);

router
  .route('/:supplierId')
  .get(auth(), validateStore, validate(supplierValidation.getSupplier), supplierController.getSupplier)
  .patch(auth(), validateStore, validate(supplierValidation.updateSupplier), supplierController.updateSupplier)
  .delete(auth(), validateStore, validate(supplierValidation.deleteSupplier), supplierController.deleteSupplier);

export default router;
