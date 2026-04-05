export interface ProductImage {
  id?: number;
  imageUrl: string;
  isPrimary?: boolean;
  product?: { id: number };
}