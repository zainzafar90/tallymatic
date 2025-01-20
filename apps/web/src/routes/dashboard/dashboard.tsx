import { Link, useParams } from 'react-router-dom';

import { ShoppingCart } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Heading, Subheading } from '@/components/ui/heading';
import { useMe } from '@/hooks/api/users.hooks';

import { LowStockWarnings } from './components/low-stock-warnings';
import { PendingPurchaseOrders } from './components/pending-purchase-orders';
import { ProfitByCategory } from './components/profit-by-category';
import { RecentSales } from './components/recent-sales';
import { SalesSummary } from './components/sales-summary';
import { SalesTrend } from './components/sales-trend';
import { TopSellingProducts } from './components/top-selling-products';

export const Dashboard = () => {
  const { data: user } = useMe();
  const { storeId } = useParams();

  const stores = user?.stores || [];
  const store = stores.find((store) => store.id === storeId);

  if (!store) {
    return <div>Store not found</div>;
  }

  return (
    <>
      <Heading>Good afternoon, {user?.name}</Heading>
      <div className="mt-8 flex items-end justify-between">
        <Subheading>Overview</Subheading>
        <Link to={`/stores/${storeId}/sales/create`}>
          <Button>
            <ShoppingCart className="w-4 h-4" /> New Sale
          </Button>
        </Link>
      </div>

      <SalesSummary />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
        <SalesTrend />
        <LowStockWarnings />
        <TopSellingProducts />
        <ProfitByCategory />
        <RecentSales />
        <PendingPurchaseOrders />
      </div>
    </>
  );
};
