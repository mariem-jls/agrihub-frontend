import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderItem } from '../models';
import { API_BASE_URL } from '../api.config';

@Injectable({ providedIn: 'root' })
export class OrderItemService {

  private url = `${API_BASE_URL}/marketplace/orderItem`;

  constructor(private http: HttpClient) {}

  getById(id: number): Observable<OrderItem> {
    return this.http.get<OrderItem>(
      `${this.url}/getOrderItemById/${id}`
    );
  }

  getByOrder(orderId: number): Observable<OrderItem[]> {
    return this.http.get<OrderItem[]>(
      `${this.url}/getOrderItemsByOrder/${orderId}`
    );
  }

  create(orderItem: OrderItem): Observable<OrderItem> {
    return this.http.post<OrderItem>(
      `${this.url}/addOrderItem`,
      orderItem
    );
  }

  update(orderItem: OrderItem): Observable<OrderItem> {
    return this.http.put<OrderItem>(
      `${this.url}/updateOrderItem`,
      orderItem
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.url}/deleteOrderItem/${id}`
    );
  }
}