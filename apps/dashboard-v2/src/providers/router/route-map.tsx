import { RouteObject } from 'react-router-dom';

import { ProtectedRoute } from '@/components/common/protected-route';
import { MainLayout } from '@/components/layout/main-layout';

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
        path: '/',
        element: <MainLayout />,
        children: [
          {
            path: '/dashboard',
            lazy: () => import('../../routes/dashboard'),
          },
          {
            path: '/products',
            handle: {
              crumb: () => 'Products',
            },
          },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: '/settings',
        element: <div />,
        // children: [
        //   {
        //     index: true,
        //     lazy: () => import('../../routes/settings'),
        //   },
        //   {
        //     path: 'profile',
        //     lazy: () => import('../../routes/profile/profile-detail'),
        //     handle: {
        //       crumb: () => 'Profile',
        //     },
        //     children: [
        //       {
        //         path: 'edit',
        //         lazy: () => import('../../routes/profile/profile-edit'),
        //       },
        //     ],
        //   },
      },
    ],
  },
];
