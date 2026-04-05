export interface Review {
  id?: number;
  product?: { id: number };
  buyerId?: number;
  rating: number;
  comment?: string;
  createdAt?: string;
}