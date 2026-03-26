export interface OrderItem {
  id?: number;
  productId?: number;
  productName?: string;
  productImageUrl?: string;
  quantity: number;
  unitPrice?: number;
  subtotal?: number;
}