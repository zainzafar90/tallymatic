import { ProductVariant } from '@medusajs/medusa';

import { PlaceholderCell } from '../../common/placeholder-cell';

type VariantCellProps = {
  variants?: ProductVariant[] | null;
};

export const VariantCell = ({ variants }: VariantCellProps) => {
  if (!variants || !variants.length) {
    return <PlaceholderCell />;
  }

  return (
    <div className="flex h-full w-full items-center overflow-hidden">
      <span className="truncate">{variants.length} variant</span>
    </div>
  );
};

export const VariantHeader = () => {
  return (
    <div className="flex h-full w-full items-center">
      <span>Variant</span>
    </div>
  );
};
