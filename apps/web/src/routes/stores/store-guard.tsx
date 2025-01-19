import { Navigate, Outlet, useParams } from 'react-router-dom';

import { Spinner } from '@/components/ui/spinner';
import { useMe } from '@/hooks/api/users.hooks';
import { SELECTED_STORE_KEY } from '@/utils/common.utils';

export const StoreGuard = () => {
  const { data: user, isLoading } = useMe();
  const stores = user?.stores || [];

  const { storeId } = useParams();
  const savedStoredId = localStorage.getItem(SELECTED_STORE_KEY);
  const store = stores.find((store) => store.id === (storeId || savedStoredId));

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!store && savedStoredId) {
    localStorage.removeItem(SELECTED_STORE_KEY);
  }

  if (!store) {
    return <Navigate to="/stores" replace />;
  }

  return <Outlet />;
};
