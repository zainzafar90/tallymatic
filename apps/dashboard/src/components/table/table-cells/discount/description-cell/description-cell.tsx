import type { Discount } from '@medusajs/medusa';

type DiscountCellProps = {
  discount: Discount;
};

export const DescriptionCell = ({ discount }: DiscountCellProps) => {
  return (
    <div className="flex h-full w-full items-center gap-x-3 overflow-hidden">
      <span className="truncate">{discount.rule.description}</span>
    </div>
  );
};

export const DescriptionHeader = () => {
  return (
    <div className=" flex h-full w-full items-center ">
      <span>Description</span>
    </div>
  );
};
