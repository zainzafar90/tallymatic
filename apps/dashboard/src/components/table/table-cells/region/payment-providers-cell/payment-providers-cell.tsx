import { PaymentProviderDTO } from '@medusajs/types';

import { formatProvider } from '../../../../../lib/format-provider';
import { ListSummary } from '../../../../common/list-summary';
import { PlaceholderCell } from '../../common/placeholder-cell';

type PaymentProvidersCellProps = {
  paymentProviders?: PaymentProviderDTO[] | null;
};

export const PaymentProvidersCell = ({ paymentProviders }: PaymentProvidersCellProps) => {
  if (!paymentProviders || paymentProviders.length === 0) {
    return <PlaceholderCell />;
  }

  const displayValues = paymentProviders.map((p) => formatProvider(p.id));

  return (
    <div className="flex size-full items-center overflow-hidden">
      <ListSummary list={displayValues} />
    </div>
  );
};

export const PaymentProvidersHeader = () => {
  return (
    <div className="flex size-full items-center overflow-hidden">
      <span className="truncate">Payment Provider</span>
    </div>
  );
};
