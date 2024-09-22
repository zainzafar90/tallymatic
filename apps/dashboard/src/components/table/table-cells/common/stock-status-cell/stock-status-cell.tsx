import { Badge } from '@/components/ui/badge';

export const StockStatus = ({ stock, lowStockThreshold }: { stock: number; lowStockThreshold: number }) => {
  const isLowStock = stock <= lowStockThreshold;
  const isCriticalStock = stock === 0;

  if (!isLowStock) {
    return (
      <div className="flex items-center space-x-2">
        <Badge color="zinc" className="text-xs">
          In Stock
        </Badge>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      {isLowStock && (
        <Badge color={isCriticalStock ? 'red' : 'yellow'} className="text-xs">
          {isCriticalStock ? 'Critical' : 'Low'}
        </Badge>
      )}
    </div>
  );
};
