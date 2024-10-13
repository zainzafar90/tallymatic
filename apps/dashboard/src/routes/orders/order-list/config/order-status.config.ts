import { OrderStatus } from '@shared';

import { Color } from '@/components/ui/utils';

export const orderStatusConfig: Record<OrderStatus, [Color, string]> = {
  [OrderStatus.PENDING]: ['yellow', 'Pending'],
  [OrderStatus.PAID]: ['green', 'Paid'],
  [OrderStatus.UNPAID]: ['red', 'Unpaid'],
  [OrderStatus.PARTIALLY_PAID]: ['orange', 'Partially Paid'],
  [OrderStatus.REFUNDED]: ['blue', 'Refunded'],
  [OrderStatus.VOIDED]: ['zinc', 'Voided'],
};
