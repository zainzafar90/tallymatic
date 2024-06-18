import { DateCell } from '../../common/date-cell';
import { PlaceholderCell } from '../../common/placeholder-cell';

type FirstSeenCellProps = {
  createdAt?: Date | string | null;
};

export const FirstSeenCell = ({ createdAt }: FirstSeenCellProps) => {
  if (!createdAt) {
    return <PlaceholderCell />;
  }

  return <DateCell date={createdAt} />;
};

export const FirstSeenHeader = () => {
  return (
    <div className="flex h-full w-full items-center">
      <span className="truncate">Created At</span>
    </div>
  );
};
