import { cn } from '@/utils/cn';

export const PlaceholderCell = (props: { align?: 'left' | 'right' }) => {
  return (
    <div
      className={cn('flex h-full w-full items-center text-muted-foreground', {
        'justify-start text-left': props.align === 'left',
        'justify-end text-right': props.align === 'right',
      })}
    >
      &mdash;
    </div>
  );
};
