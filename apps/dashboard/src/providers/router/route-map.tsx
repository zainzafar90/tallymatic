import { RouteObject } from 'react-router-dom';

import { ProtectedRoute } from '@/components/common/protected-route';
import { MainLayout } from '@/components/layout/main-layout';
import { CustomerList } from '@/routes/customer/customer-list/customer-list';
import { Dashboard } from '@/routes/dashboard/dashboard';

import { ErrorBoundary } from '../../components/common/error-boundary';
import { InventoryList } from '../../routes/inventory/inventory-list';

export const RouteMap: RouteObject[] = [
  {
    path: '/login',
    lazy: () => import('../../routes/login'),
  },
  {
    path: '/',
    lazy: () => import('../../routes/home'),
  },
  {
    path: '*',
    lazy: () => import('../../routes/no-match'),
  },
  {
    element: <ProtectedRoute />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: '',
        element: <MainLayout />,
        children: [
          {
            path: '/dashboard',
            element: <Dashboard />,
          },
          {
            path: '/events',
            lazy: () => import('../../routes/events'),
          },
          {
            path: '/orders',
            lazy: () => import('../../routes/orders'),
          },
          {
            path: '/settings',
            lazy: () => import('../../routes/settings'),
          },
          {
            path: '/products',
            handle: {
              crumb: () => 'Products',
            },
            children: [
              {
                path: '',
                lazy: () => import('../../routes/products/product-list'),
              },
            ],
          },
          {
            path: '/categories',
            handle: {
              crumb: () => 'Categories',
            },
            children: [
              {
                path: '',
                lazy: () => import('../../routes/categories/category-list'),
              },
            ],
          },
          {
            path: '/inventory',
            handle: {
              crumb: () => 'Inventory',
            },
            children: [
              {
                path: '',
                element: <InventoryList />,
              },
            ],
          },
          {
            path: '/customers',
            handle: {
              crumb: () => 'Customers',
            },
            children: [
              {
                path: '',
                element: <CustomerList />,
              },
            ],
          },
        ],
      },
    ],
  },
];
