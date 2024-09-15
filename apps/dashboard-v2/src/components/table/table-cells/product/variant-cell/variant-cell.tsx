import { IProductVariant } from '@shared';

import { PlaceholderCell } from '../../common/placeholder-cell';

type VariantCellProps = {
  variants?: IProductVariant[] | null;
};

export const VariantCell = ({ variants }: VariantCellProps) => {
  if (!variants || !variants.length) {
    return <PlaceholderCell />;
  }

  return (
    <div className="flex h-full w-full items-center justify-end overflow-hidden">
      <span className="truncate">{variants.length}</span>
    </div>
  );
};
