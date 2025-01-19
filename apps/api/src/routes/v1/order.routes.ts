import express, { Router } from 'express';

import { validate } from '@/common/validate';
import { validateStore } from '@/middleware/validate-store';
import { auth } from '@/modules/auth';
import { orderController, orderValidation } from '@/modules/order';

const router: Router = express.Router();

router
  .route('/')
  .post(auth(), validateStore, validate(orderValidation.createOrder), orderController.createOrder)
  .get(auth(), validateStore, validate(orderValidation.getOrders), orderController.getOrders)
  .delete(auth(), validateStore, validate(orderValidation.bulkDeleteOrders), orderController.bulkDeleteOrders);

router
  .route('/:orderId')
  .get(auth(), validateStore, validate(orderValidation.getOrder), orderController.getOrder)
  .patch(auth(), validateStore, validate(orderValidation.updateOrder), orderController.updateOrder)
  .delete(auth(), validateStore, validate(orderValidation.deleteOrder), orderController.deleteOrder);

export default router;
