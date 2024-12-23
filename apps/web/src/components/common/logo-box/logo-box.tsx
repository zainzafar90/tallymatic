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
      {/* <svg width="36" height="38" viewBox="0 0 36 38" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M30.85 6.16832L22.2453 1.21782C19.4299 -0.405941 15.9801 -0.405941 13.1648 1.21782L4.52043 6.16832C1.74473 7.79208 0 10.802 0 14.0099V23.9505C0 27.198 1.74473 30.1683 4.52043 31.7921L13.1251 36.7822C15.9405 38.4059 19.3903 38.4059 22.2056 36.7822L30.8103 31.7921C33.6257 30.1683 35.3307 27.198 35.3307 23.9505V14.0099C35.41 10.802 33.6653 7.79208 30.85 6.16832ZM17.6852 27.8317C12.8079 27.8317 8.8426 23.8713 8.8426 19C8.8426 14.1287 12.8079 10.1683 17.6852 10.1683C22.5625 10.1683 26.5674 14.1287 26.5674 19C26.5674 23.8713 22.6022 27.8317 17.6852 27.8317Z"
          className="relative drop-shadow-sm"
          fill="currentColor"
        />
      </svg> */}
      {/* FFC107 */}
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
