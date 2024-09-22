export enum TokenType {
  ACCESS = 'access',
  REFRESH = 'refresh',
  RESET_PASSWORD = 'resetPassword',
  VERIFY_EMAIL = 'verifyEmail',
  INVITE = 'invite',
}

export enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum ProductStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  DRAFT = 'draft',
}

export enum TransactionType {
  RECEIVED = 'received',
  SOLD = 'sold',
  ADJUSTED = 'adjusted',
}

export enum FinancialStatus {
  PENDING = 'pending',
  PAID = 'paid',
  UNPAID = 'unpaid',
  PARTIALLY_PAID = 'partiallyPaid',
  REFUNDED = 'refunded',
  VOIDED = 'voided',
}

export enum FulfillmentStatus {
  FULFILLED = 'fulfilled',
  PARTIAL = 'partial',
  UNFULFILLED = 'unfulfilled',
}
