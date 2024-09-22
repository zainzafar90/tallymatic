import { cn } from '@/utils/cn';

import { PlaceholderCell } from '../placeholder-cell';

type CellProps = {
  text?: string | number;
  align?: 'left' | 'right';
};

type HeaderProps = {
  text: string;
  align?: 'left' | 'right';
};

export const TextCell = ({ text, align }: CellProps) => {
  if (!text) {
    return <PlaceholderCell />;
  }

  return (
    <div
      className={cn('flex h-full w-full items-center gap-x-3 overflow-hidden', {
        'justify-start text-left': align === 'left',
        'justify-end text-right': align === 'right',
      })}
    >
      <span className="truncate">{text}</span>
    </div>
  );
};

export const TextHeader = ({ text, align }: HeaderProps) => {
  return (
    <div
      className={cn('flex h-full w-full items-center', {
        'justify-start text-left': align === 'left',
        'justify-end text-right': align === 'right',
      })}
    >
      <span className="truncate">{text}</span>
    </div>
  );
};
