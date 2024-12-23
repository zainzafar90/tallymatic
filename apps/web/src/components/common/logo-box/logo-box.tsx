import { cn } from '@/utils/cn';

type LogoBoxProps = {
  className?: string;
};

export const LogoBox = ({ className }: LogoBoxProps) => {
  return (
    <div
      className={cn(
        'w-ful h-full relative flex items-center justify-center rounded-xl text-black dark:text-white',
        className
      )}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 172 172">
        <path
          d="M 128 8 L 164 44 C 168 48 172 52 172 60 L 172 112 C 172 120 168 124 164 128 L 128 164 C 124 168 120 172 112 172 L 60 172 C 52 172 48 168 44 164 L 8 128 C 4 124 0 120 0 112 L 0 60 C 0 52 4 48 8 44 L 44 8 C 48 4 52 0 60 0 L 112 0 C 120 0 124 4 128 8 Z"
          fill="currentColor"
          className="relative drop-shadow-sm"
        />
        <g transform="translate(86,88) rotate(-45) translate(-82,-82)">
          <rect
            x={44}
            y={44}
            width={84}
            height={28}
            rx={16}
            className="relative drop-shadow-sm fill-white dark:fill-black"
          />
          <rect
            x={44}
            y={88}
            width={84}
            height={28}
            rx={16}
            className="relative drop-shadow-sm fill-white dark:fill-black"
          />
        </g>
      </svg>
    </div>
  );
};
