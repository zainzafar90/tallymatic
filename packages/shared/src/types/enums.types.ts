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

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  UNPAID = 'unpaid',
  PARTIALLY_PAID = 'partiallyPaid',
  REFUNDED = 'refunded',
  VOIDED = 'voided',
}

export enum PurchaseStatus {
  DRAFT = 'draft',
  ORDERED = 'ordered',
  PARTIAL = 'partial',
  RECEIVED = 'received',
  CLOSED = 'closed',
}

export enum PaymentMethod {
  CASH = 'cash',
  BANK_TRANSFER = 'bankTransfer',
  CREDIT_CARD = 'creditCard',
  DEBIT_CARD = 'debitCard',
  CHEQUE = 'cheque',
  ONLINE = 'online',
  OTHER = 'other',
}

export enum PaymentType {
  DEBIT = 'debit',
  CREDIT = 'credit',
}
