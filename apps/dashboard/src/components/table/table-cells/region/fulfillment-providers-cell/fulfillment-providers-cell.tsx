import { FulfillmentProvider } from '@medusajs/medusa';

import { formatProvider } from '../../../../../lib/format-provider';
import { PlaceholderCell } from '../../common/placeholder-cell';

type FulfillmentProvidersCellProps = {
  fulfillmentProviders?: FulfillmentProvider[] | null;
};

export const FulfillmentProvidersCell = ({ fulfillmentProviders }: FulfillmentProvidersCellProps) => {
  if (!fulfillmentProviders || fulfillmentProviders.length === 0) {
    return <PlaceholderCell />;
  }

  const displayValue = fulfillmentProviders
    .slice(0, 2)
    .map((p) => formatProvider(p.id))
    .join(', ');

  const additionalProviders = fulfillmentProviders.slice(2).length;

  const text = `${displayValue}${additionalProviders > 0 ? ` + ${additionalProviders} more` : ''}`;

  return (
    <div className="flex size-full items-center overflow-hidden">
      <span className="truncate">{text}</span>
    </div>
  );
};

export const FulfillmentProvidersHeader = () => {
  return (
    <div className="flex size-full items-center overflow-hidden">
      <span className="truncate">Fullfilment Providers</span>
    </div>
  );
};
