export interface OrderItem {
  id?: number;
  productId?: number;
  productName?: string;
  productImageUrl?: string;
  order?: { id: number };
  product: { id: number };
  quantity: number;
  unitPrice?: number;
  subtotal?: number;
}
