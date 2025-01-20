import { useQuery } from '@tanstack/react-query';

import { client } from '@/lib/client';
import { queryKeysFactory } from '@/lib/query-key-factory';

const ANALYTICS_QUERY_KEY = 'analytics' as const;
export const analyticsQueryKeys = queryKeysFactory(ANALYTICS_QUERY_KEY);

export const useLowStockAlerts = () => {
  const { data, ...rest } = useQuery({
    queryFn: () => client.analytics.getLowStockAlerts(),
    queryKey: analyticsQueryKeys.list(['low-stock-alerts']),
  });

  return { ...data, ...rest };
};

export const useSalesTrend = (days: number = 30) => {
  const { data, ...rest } = useQuery({
    queryFn: () => client.analytics.getSalesTrend(days),
    queryKey: analyticsQueryKeys.list(['sales-trend']),
  });

  return { ...data, ...rest };
};

export const useTopSellingProducts = (days: number = 30) => {
  const { data, ...rest } = useQuery({
    queryFn: () => client.analytics.getTopSellingProducts(days),
    queryKey: analyticsQueryKeys.list(['top-selling-products']),
  });

  return { ...data, ...rest };
};
