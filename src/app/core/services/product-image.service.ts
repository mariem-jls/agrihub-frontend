import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductImage } from '../models';
import { API_BASE_URL } from '../api.config';

@Injectable({ providedIn: 'root' })
export class ProductImageService {

  private url = `${API_BASE_URL}/marketplace/productImage`;

  constructor(private http: HttpClient) {}

  getByProduct(productId: number): Observable<ProductImage[]> {
    return this.http.get<ProductImage[]>(
      `${this.url}/getProductImagesByProduct/${productId}`
    );
  }

  create(image: ProductImage): Observable<ProductImage> {
    return this.http.post<ProductImage>(
      `${this.url}/addProductImage`,
      image
    );
  }

  update(image: ProductImage): Observable<ProductImage> {
    return this.http.put<ProductImage>(
      `${this.url}/updateProductImage`,
      image
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.url}/deleteProductImage/${id}`
    );
  }
}