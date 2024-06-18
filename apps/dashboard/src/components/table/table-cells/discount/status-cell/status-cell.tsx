import { Discount } from '@medusajs/medusa';

import { getDiscountStatus, PromotionStatus } from '@/lib/discounts';

import { StatusCell as StatusCellComp } from '../../common/status-cell';

type DiscountCellProps = {
  discount: Discount;
};

export const StatusCell = ({ discount }: DiscountCellProps) => {
  const [color, text] = {
    [PromotionStatus.DISABLED]: ['grey', 'Disabled'],
    [PromotionStatus.ACTIVE]: ['green', 'Active'],
    [PromotionStatus.SCHEDULED]: ['orange', 'Scheduled'],
    [PromotionStatus.EXPIRED]: ['red', 'Expired'],
  }[getDiscountStatus(discount)] as ['grey' | 'orange' | 'green' | 'red', string];

  return <StatusCellComp color={color}>{text}</StatusCellComp>;
};

export const StatusHeader = () => {
  return (
    <div className=" flex h-full w-full items-center ">
      <span>Status</span>
    </div>
  );
};
