import { Fragment } from 'react/jsx-runtime';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { Spinner } from '@/components/ui/spinner';
import { useMe } from '@/hooks/api/users';

// import { SidebarProvider } from '../../../providers/sidebar-provider';

export const ProtectedRoute = () => {
  const { data, isLoading } = useMe();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="text-ui-fg-interactive" />
      </div>
    );
  }

  if (!data) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <Fragment>
      {/* <SidebarProvider> */}
      {/* <SearchProvider> */}
      <Outlet />
      {/* </SearchProvider> */}
      {/* </SidebarProvider> */}
    </Fragment>
  );
};
