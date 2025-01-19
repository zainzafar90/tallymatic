import { Navigate, useNavigate } from 'react-router-dom';

import { ChevronRightIcon } from '@heroicons/react/20/solid';

import { LetterBox } from '@/components/common/letter-box/letter-box';
import { LogoBox } from '@/components/common/logo-box';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { useMe } from '@/hooks/api/users.hooks';
import { SELECTED_STORE_KEY } from '@/utils/common.utils';

export const StoreList = () => {
  const navigate = useNavigate();
  const { data: user, isLoading } = useMe();
  const stores = user?.stores || [];

  const handleStoreSelect = (storeId: string) => {
    localStorage.setItem(SELECTED_STORE_KEY, storeId);
    navigate(`/stores/${storeId}/dashboard`);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading stores...</div>
      </div>
    );
  }

  if (stores.length === 1) {
    return <Navigate to={`/stores/${stores[0].id}/dashboard`} replace />;
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center pt-16">
      <div className="absolute inset-0 bg-[url(/bg/grid.svg)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      <div className="relative w-full max-w-xl space-y-8 px-4">
        <div className="flex items-center space-x-4">
          <LogoBox className="h-6 w-6" />
          <Heading className="text-lg capitalize">Tallymatic</Heading>
        </div>
        <div>
          <Heading className="text-xl">Select a Store</Heading>
          <Text className="text-muted-foreground">Choose a store to manage</Text>
        </div>

        {stores.length > 0 ? (
          <ul className="divide-y divide-gray-100 overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl">
            {stores.map((store) => (
              <li
                key={store.id}
                className="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6 cursor-pointer"
                onClick={() => handleStoreSelect(store.id)}
              >
                <div className="flex min-w-0 gap-x-4">
                  <LetterBox text={store.name} size="lg" />
                  <div className="min-w-0 flex-auto">
                    <p className="text-sm font-semibold text-gray-900">
                      <span className="absolute inset-x-0 -top-px bottom-0" />
                      {store.name}
                    </p>
                    {store.address && <p className="mt-1 truncate text-xs text-gray-500">{store.address}</p>}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-x-4">
                  <ChevronRightIcon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border border-dashed border-muted p-8">
            <LetterBox text="New" size="lg" />
            <Text className="text-muted-foreground">No stores found</Text>
            <button
              onClick={() => navigate('/settings/stores')}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Create Store
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
