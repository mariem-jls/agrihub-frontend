import { Category } from './category.model';
import { ProductImage } from './product-image.model';

export type ProductStatus = 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK';

export interface Product {
  id?: number;
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
  unit?: string;
  isBio?: boolean;
  isCertified?: boolean;
  status?: ProductStatus;
  sellerId?: number;
  category?: Category;
  images?: ProductImage[];
  createdAt?: string;
  updatedAt?: string;
}