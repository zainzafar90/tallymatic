type RegionCellProps = {
  name: string;
};

export const RegionCell = ({ name }: RegionCellProps) => {
  return (
    <div className="flex h-full w-full items-center overflow-hidden">
      <span className="truncate">{name}</span>
    </div>
  );
};

export const RegionHeader = () => {
  return (
    <div className="flex h-full w-full items-center">
      <span className="truncate">Name</span>
    </div>
  );
};
