import format from 'date-fns/format';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { PlaceholderCell } from '../placeholder-cell';

type DateCellProps = {
  date: Date | string | null;
};

export const DateCell = ({ date }: DateCellProps) => {
  if (!date) {
    return <PlaceholderCell />;
  }

  const value = new Date(date);
  value.setMinutes(value.getMinutes() - value.getTimezoneOffset());

  const hour12 = Intl.DateTimeFormat().resolvedOptions().hour12;
  const timestampFormat = hour12 ? 'dd MMM yyyy hh:MM a' : 'dd MMM yyyy HH:MM';

  return (
    <div className="flex h-full w-full items-center overflow-hidden">
      <Tooltip>
        <TooltipTrigger>
          <span className="truncate">{format(value, 'dd MMM yyyy')}</span>
        </TooltipTrigger>
        <TooltipContent>
          <span className="text-pretty">{`${format(value, timestampFormat)}`}</span>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export const DateHeader = () => {
  return (
    <div className="flex h-full w-full items-center">
      <span className="truncate">Date</span>
    </div>
  );
};
