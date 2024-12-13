import { PurchaseStatus } from '@shared';

import { Color } from '@/components/ui/utils';

export const purchaseStatusConfig: Record<PurchaseStatus, [Color, string]> = {
  [PurchaseStatus.DRAFT]: ['zinc', 'Draft'],
  [PurchaseStatus.ORDERED]: ['yellow', 'Ordered'],
  [PurchaseStatus.PARTIAL]: ['orange', 'Partial'],
  [PurchaseStatus.RECEIVED]: ['green', 'Received'],
  [PurchaseStatus.CLOSED]: ['blue', 'Closed'],
};
