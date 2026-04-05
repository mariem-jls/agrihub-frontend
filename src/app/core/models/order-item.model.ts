export interface OrderItem {
  id?: number;
  order?: { id: number };
  product: { id: number };
  quantity: number;
  unitPrice?: number;
  subtotal?: number;
}
