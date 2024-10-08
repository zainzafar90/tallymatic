import { RouteObject } from 'react-router-dom';

import { ProtectedRoute } from '@/components/common/protected-route';
import { MainLayout } from '@/components/layout/main-layout';
import { Dashboard } from '@/routes/dashboard/dashboard';

import { ErrorBoundary } from '../../components/common/error-boundary';

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
            path: '/settings',
            lazy: () => import('../../routes/settings'),
          },
          {
            path: '/products',
            children: [
              {
                path: '',
                lazy: () => import('../../routes/products'),
              },
            ],
          },
          {
            path: '/categories',
            children: [
              {
                path: '',
                lazy: () => import('../../routes/categories'),
              },
            ],
          },
          {
            path: '/inventory',
            children: [
              {
                path: '',
                lazy: () => import('../../routes/inventory'),
              },
            ],
          },
          {
            path: '/customers',
            children: [
              {
                path: '',
                lazy: () => import('../../routes/customers'),
              },
            ],
          },

          {
            path: '/suppliers',
            children: [
              {
                path: '',
                lazy: () => import('../../routes/supplier'),
              },
            ],
          },
          {
            path: '/orders',
            handle: {
              crumb: () => 'Orders',
            },
            children: [
              {
                path: '',
                lazy: () => import('../../routes/orders/order-list'),
              },
              {
                path: 'create',
                lazy: () => import('../../routes/orders/order-create'),
              },
            ],
          },
        ],
      },
    ],
  },
];
