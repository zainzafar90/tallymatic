import express, { Router } from 'express';

import config from '@/config/config';

import authRoute from './auth.routes';
import categoryRoute from './category.routes';
import claimRoute from './claim.routes';
import customerRoute from './customer.routes';
import inventoryRoute from './inventory.routes';
import orderRoute from './order.routes';
import organizationRoute from './organization.routes';
import productRoute from './product.routes';
import purchaseRoute from './purchase.routes';
import storeRoute from './store.routes';
import supplierRoute from './supplier.routes';
import docsRoute from './swagger.routes';
import userRoute from './user.routes';
import variantRoute from './variant.routes';

const router: express.Router = express.Router();

interface IRoute {
  path: string;
  route: Router;
}

const defaultIRoute: IRoute[] = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/stores',
    route: storeRoute,
  },
  {
    path: '/organizations',
    route: organizationRoute,
  },
  {
    path: '/products',
    route: productRoute,
  },
  {
    path: '/variants',
    route: variantRoute,
  },
  {
    path: '/categories',
    route: categoryRoute,
  },
  {
    path: '/inventory',
    route: inventoryRoute,
  },
  {
    path: '/claims',
    route: claimRoute,
  },
  {
    path: '/customers',
    route: customerRoute,
  },
  {
    path: '/suppliers',
    route: supplierRoute,
  },
  {
    path: '/orders',
    route: orderRoute,
  },
  {
    path: '/purchases',
    route: purchaseRoute,
  },
];

const devIRoute: IRoute[] = [
  // IRoute available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultIRoute.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devIRoute.forEach((route) => {
    router.use(route.path, route.route);
  });
}

export default router;
