import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models';
import { API_BASE_URL } from '../api.config';

@Injectable({ providedIn: 'root' })
export class ProductService {

  private url = `${API_BASE_URL}/marketplace/product`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.url}/getProducts`);
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.url}/getProductById/${id}`);
  }

  getBySeller(sellerId: number): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${this.url}/getProductsBySeller/${sellerId}`
    );
  }

  create(product: Product, sellerId: number): Observable<Product> {
    return this.http.post<Product>(
      `${this.url}/addProduct/${sellerId}`,
      product
    );
  }

  update(product: Product, sellerId: number): Observable<Product> {
    return this.http.put<Product>(
      `${this.url}/updateProduct/${sellerId}`,
      product
    );
  }

  toggleStatus(product: Product, sellerId: number): Observable<Product> {
  const updated = {
    ...product,
    status: product.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
  };
  return this.http.put<Product>(
    `${this.url}/updateProduct/${sellerId}`,
    updated
  );
}

  delete(id: number, sellerId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.url}/deleteProduct/${id}/${sellerId}`
    );
  }
}
