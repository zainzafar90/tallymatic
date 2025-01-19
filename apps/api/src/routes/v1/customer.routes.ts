import express, { Router } from 'express';

import { validate } from '@/common/validate';
import { validateStore } from '@/middleware/validate-store';
import { auth } from '@/modules/auth';
import { customerController, customerValidation } from '@/modules/customer';

const router: Router = express.Router();

router
  .route('/')
  .post(auth(), validateStore, validate(customerValidation.createCustomer), customerController.createCustomer)
  .get(auth(), validateStore, validate(customerValidation.getCustomers), customerController.getCustomers)
  .delete(auth(), validateStore, validate(customerValidation.bulkDeleteCustomers), customerController.bulkDeleteCustomers);

router
  .route('/:customerId')
  .get(auth(), validateStore, validate(customerValidation.getCustomer), customerController.getCustomer)
  .patch(auth(), validateStore, validate(customerValidation.updateCustomer), customerController.updateCustomer)
  .delete(auth(), validateStore, validate(customerValidation.deleteCustomer), customerController.deleteCustomer);

export default router;
