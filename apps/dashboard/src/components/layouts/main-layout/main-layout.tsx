import { CurrencyDollar, ShoppingCart, Tag, Users } from '@medusajs/icons';
import { Avatar, Text } from '@medusajs/ui';

import { useStore } from '../../../hooks/api/store';
import { Skeleton } from '../../common/skeleton';
import { NavItem, NavItemProps } from '../nav-item';
import { Shell } from '../shell';

import { Divider } from '../../common/divider';

export const MainLayout = () => {
  return (
    <Shell>
      <MainSidebar />
    </Shell>
  );
};

const MainSidebar = () => {
  return (
    <aside className="flex flex-1 flex-col justify-between overflow-y-auto">
      <div className="flex flex-1 flex-col">
        <div className="bg-ui-bg-subtle sticky top-0">
          <Header />
          <div className="px-3">
            <Divider variant="dashed" />
          </div>
        </div>
        <CoreRouteSection />
      </div>
    </aside>
  );
};

const Header = () => {
  const { store, isError, error } = useStore();

  const name = store?.name;
  const fallback = store?.name?.slice(0, 1).toUpperCase();

  if (isError) {
    throw error;
  }

  return (
    <div className="w-full px-3 py-2">
      <div className="flex items-center p-1 md:pr-2">
        <div className="flex items-center gap-x-3">
          {fallback ? (
            <Avatar variant="squared" fallback={fallback} />
          ) : (
            <Skeleton className="h-8 w-8 rounded-md" />
          )}
          {name ? (
            <Text size="small" weight="plus" leading="compact">
              {store.name}
            </Text>
          ) : (
            <Skeleton className="h-[9px] w-[120px]" />
          )}
        </div>
      </div>
    </div>
  );
};

const useCoreRoutes = (): Omit<NavItemProps, 'pathname'>[] => {
  return [
    {
      icon: <ShoppingCart />,
      label: 'Orders',
      to: '/orders',
    },
    {
      icon: <Tag />,
      label: 'Products',
      to: '/products',
      items: [
        {
          label: 'Collections',
          to: '/collections',
        },
        {
          label: 'Categories',
          to: '/categories',
        },
      ],
    },

    {
      icon: <Users />,
      label: 'Customers',
      to: '/customers',
      items: [
        {
          label: 'Customer Groups',
          to: '/customer-groups',
        },
      ],
    },
    {
      icon: <CurrencyDollar />,
      label: 'Pricing',
      to: '/pricing',
    },
  ];
};

const CoreRouteSection = () => {
  const coreRoutes = useCoreRoutes();

  return (
    <nav className="flex flex-col gap-y-1 py-3">
      {coreRoutes.map((route) => {
        return <NavItem key={route.to} {...route} />;
      })}
    </nav>
  );
};
