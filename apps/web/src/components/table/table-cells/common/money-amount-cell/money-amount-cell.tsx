import { cn } from '@/utils/cn';
import { getStylizedAmount } from '@/utils/money-amount.utils';

import { PlaceholderCell } from '../placeholder-cell';

type MoneyAmountCellProps = {
  currencyCode: string;
  amount?: number | string | null;
  align?: 'left' | 'right';
  className?: string;
};

export const MoneyAmountCell = ({ currencyCode, amount, align = 'left', className }: MoneyAmountCellProps) => {
  if (typeof amount === 'undefined' || amount === null || amount === '0.00') {
    return <PlaceholderCell align="right" />;
  }

  const formatted = getStylizedAmount(+amount, currencyCode);

  return (
    <div
      className={cn(
        'flex h-full w-full items-center overflow-hidden',
        {
          'justify-start text-left': align === 'left',
          'justify-end text-right': align === 'right',
        },
        className
      )}
    >
      <span className="truncate">{formatted}</span>
    </div>
  );
};
