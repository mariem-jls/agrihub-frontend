import { OrderItem } from './order-item.model';
import { Payment } from './payment.model';

export type OrderStatus =
  | 'PENDING' | 'CONFIRMED' | 'PREPARING'
  | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface Order {
  id?: number;
  orderNumber?: string;
  buyerId?: number;
  sellerId: number;
  items: OrderItem[];
  payment?: Payment;
  status?: OrderStatus;
  totalAmount?: number;
  deliveryAddress?: string;
  trackingNumber?: string;
  carrierName?: string;
  cancellationReason?: string;
  shippedAt?: string;
  deliveredAt?: string;
  createdAt?: string;
  updatedAt?: string;
}