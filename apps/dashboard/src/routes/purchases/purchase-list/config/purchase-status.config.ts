import { PurchaseStatus } from '@shared';

import { Color } from '@/components/ui/utils';

export const purchaseStatusConfig: Record<PurchaseStatus, [Color, string]> = {
  [PurchaseStatus.DRAFT]: ['zinc', 'Draft'],
  [PurchaseStatus.PENDING]: ['yellow', 'Pending'],
  [PurchaseStatus.COMPLETED]: ['green', 'Completed'],
  [PurchaseStatus.CANCELLED]: ['red', 'Cancelled'],
};
