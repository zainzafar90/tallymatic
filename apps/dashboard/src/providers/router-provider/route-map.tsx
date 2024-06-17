import { Outlet, RouteObject } from 'react-router-dom';

// import { ProtectedRoute } from '../../components/authentication/protected-route';
// import { MainLayout } from '../../components/layout/main-layout';
// import { SettingsLayout } from '../../components/layout/settings-layout';
// import { ErrorBoundary } from '../../components/utilities/error-boundary';
// import { PriceListRes } from '../../types/api-responses';

export const RouteMap: RouteObject[] = [
  {
    path: '/login',
    lazy: () => import('../../routes/login'),
  },
  // {
  //   path: '/',
  //   lazy: () => import('../../routes/home'),
  // },
  // {
  //   path: '*',
  //   lazy: () => import('../../routes/no-match'),
  // },
];
