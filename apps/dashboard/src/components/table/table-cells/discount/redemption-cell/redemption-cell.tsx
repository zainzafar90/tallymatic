type DiscountCellProps = {
  redemptions: number;
};

export const RedemptionCell = ({ redemptions }: DiscountCellProps) => {
  return (
    <div className="flex h-full w-full items-center justify-end gap-x-3 text-right">
      <span>{redemptions}</span>
    </div>
  );
};

export const RedemptionHeader = () => {
  return (
    <div className="flex h-full w-full items-center justify-end text-right">
      <span className="truncate">Total Redemptions</span>
    </div>
  );
};
