import express, { Router } from 'express';

import { validate } from '@/common/validate';
import { auth } from '@/modules/auth';
import { customerController, customerValidation } from '@/modules/customer';

const router: Router = express.Router();

router
  .route('/')
  .post(auth(), validate(customerValidation.createCustomer), customerController.createCustomer)
  .get(auth(), validate(customerValidation.getCustomers), customerController.getCustomers);

router
  .route('/:customerId')
  .get(auth(), validate(customerValidation.getCustomer), customerController.getCustomer)
  .patch(auth(), validate(customerValidation.updateCustomer), customerController.updateCustomer)
  .delete(auth(), validate(customerValidation.deleteCustomer), customerController.deleteCustomer);

export default router;
