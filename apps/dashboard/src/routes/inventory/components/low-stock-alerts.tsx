import React from 'react';

import { useLowStockAlerts } from '@/hooks/api/inventory.hooks';

export const LowStockAlerts: React.FC = () => {
  const { data, isLoading, error } = useLowStockAlerts();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading low stock alerts</div>;

  return (
    <div>
      <h2>Low Stock Alerts</h2>
      <ul>
        {data?.map((item) => (
          <li key={item.id}>
            {item.name}: Current stock {item.stock} (below threshold of {item.lowStockThreshold})
          </li>
        ))}
      </ul>
    </div>
  );
};
