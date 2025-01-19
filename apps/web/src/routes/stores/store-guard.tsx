import { Navigate, Outlet, useParams } from 'react-router-dom';

import { Spinner } from '@/components/ui/spinner';
import { useMe } from '@/hooks/api/users.hooks';

export const StoreGuard = () => {
  const { data: user, isLoading } = useMe();
  const stores = user?.stores || [];

  const { storeId } = useParams();
  const store = stores.find((store) => store.id === storeId);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!store) {
    return <Navigate to="/stores" replace />;
  }

  return <Outlet />;
};
