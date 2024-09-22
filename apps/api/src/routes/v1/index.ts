import express, { Router } from 'express';

import config from '@/config/config';

import authRoute from './auth.route';
import categoryRoute from './category.route';
import claimRoute from './claim.route';
import customerRoute from './customer.route';
import inventoryRoute from './inventory.route';
import organizationRoute from './organization.route';
import productRoute from './product.route';
import storeRoute from './store.route';
import supplierRoute from './supplier.route';
import docsRoute from './swagger.route';
import userRoute from './user.route';

const router = express.Router();

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
