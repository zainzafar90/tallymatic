import { clx } from '@medusajs/ui';

type LogoBoxProps = {
  className?: string;
};

export const LogoBox = ({ className }: LogoBoxProps) => {
  return (
    <div
      className={clx(
        'size-14 bg-ui-button-neutral shadow-buttons-neutral relative flex items-center justify-center rounded-xl',
        "after:button-neutral-gradient after:inset-0 after:content-['']",
        className
      )}
    >
      <svg
        width="36"
        height="38"
        viewBox="0 0 36 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M30.85 6.16832L22.2453 1.21782C19.4299 -0.405941 15.9801 -0.405941 13.1648 1.21782L4.52043 6.16832C1.74473 7.79208 0 10.802 0 14.0099V23.9505C0 27.198 1.74473 30.1683 4.52043 31.7921L13.1251 36.7822C15.9405 38.4059 19.3903 38.4059 22.2056 36.7822L30.8103 31.7921C33.6257 30.1683 35.3307 27.198 35.3307 23.9505V14.0099C35.41 10.802 33.6653 7.79208 30.85 6.16832ZM17.6852 27.8317C12.8079 27.8317 8.8426 23.8713 8.8426 19C8.8426 14.1287 12.8079 10.1683 17.6852 10.1683C22.5625 10.1683 26.5674 14.1287 26.5674 19C26.5674 23.8713 22.6022 27.8317 17.6852 27.8317Z"
          className="fill-ui-button-inverted relative drop-shadow-sm"
        />
      </svg>
    </div>
  );
};
