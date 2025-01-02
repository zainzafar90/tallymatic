import { PaymentMethod } from '@repo/shared';

import { Color } from '@/components/ui/utils';

export const paymentMethodConfig: Record<PaymentMethod, [Color, string, string]> = {
  [PaymentMethod.CASH]: ['green', 'Cash', 'cash'],
  [PaymentMethod.BANK_TRANSFER]: ['blue', 'Bank Transfer', 'bankTransfer'],
  [PaymentMethod.CREDIT_CARD]: ['purple', 'Credit Card', 'creditCard'],
  [PaymentMethod.DEBIT_CARD]: ['indigo', 'Debit Card', 'debitCard'],
  [PaymentMethod.CHEQUE]: ['orange', 'Cheque', 'cheque'],
  [PaymentMethod.ONLINE]: ['cyan', 'Online', 'online'],
  [PaymentMethod.OTHER]: ['zinc', 'Other', 'other'],
};
