import type { Discount } from '@medusajs/medusa';

type DiscountCellProps = {
  discount: Discount;
};

export const CodeCell = ({ discount }: DiscountCellProps) => {
  return (
    <div className="flex h-full w-full items-center gap-x-3 overflow-hidden">
      {/* // TODO: border color inversion*/}
      <span className="bg-ui-tag-neutral-bg truncate rounded-md border border-neutral-200 p-1 text-xs">{discount.code}</span>
    </div>
  );
};

export const CodeHeader = () => {
  return (
    <div className=" flex h-full w-full items-center ">
      <span>Code</span>
    </div>
  );
};
