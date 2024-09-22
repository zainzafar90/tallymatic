import React from 'react';

import { TableListSkeleton } from '@/components/common/table/table-list-selecton';
import { useLowStockAlerts } from '@/hooks/api/inventory.hooks';

export const LowStockAlerts: React.FC = () => {
  const { results = [], isLoading, isError, error } = useLowStockAlerts();

  if (isError) {
    throw error;
  }

  if (isLoading) {
    return <TableListSkeleton />;
  }

  return (
    <div>
      <h2>Low Stock Alerts</h2>
      <ul>
        {results.map((item) => (
          <li key={item.id}>
            {item.name}: Current stock {item.stock} (below threshold of {item.lowStockThreshold})
          </li>
        ))}

        {results.length === 0 && <li>No low stock alerts</li>}
      </ul>
    </div>
  );
};
