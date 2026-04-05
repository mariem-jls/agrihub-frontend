export type PaymentMethod =
  'CASH_ON_DELIVERY' | 'FLOUCI' | 'KONNECT';

export type PaymentStatus =
  'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export interface Payment {
  id?: number;
  order?: { id: number };
  method: PaymentMethod;
  status?: PaymentStatus;
  amount?: number;
  transactionId?: string;
  paidAt?: string;
  createdAt?: string;
}