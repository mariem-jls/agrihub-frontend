import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, OrderStatus } from '../models';
import { API_BASE_URL } from '../api.config';

@Injectable({ providedIn: 'root' })
export class OrderService {

  private url = `${API_BASE_URL}/marketplace/order`;

  constructor(private http: HttpClient) {}

  getById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.url}/getOrderById/${id}`);
  }

  getByBuyer(buyerId: number): Observable<Order[]> {
    return this.http.get<Order[]>(
      `${this.url}/getOrdersByBuyer/${buyerId}`
    );
  }

  getBySeller(sellerId: number): Observable<Order[]> {
    return this.http.get<Order[]>(
      `${this.url}/getOrdersBySeller/${sellerId}`
    );
  }

  create(order: Order, buyerId: number): Observable<Order> {
    return this.http.post<Order>(
      `${this.url}/addOrder/${buyerId}`,
      order
    );
  }

  updateStatus(
    id: number,
    userId: number,
    status: OrderStatus
  ): Observable<Order> {
    const params = new HttpParams().set('status', status);
    return this.http.put<Order>(
      `${this.url}/updateStatus/${id}/${userId}`,
      {},
      { params }
    );
  }

  cancel(
    id: number,
    userId: number,
    reason: string
  ): Observable<void> {
    const params = new HttpParams().set('reason', reason);
    return this.http.put<void>(
      `${this.url}/cancelOrder/${id}/${userId}`,
      {},
      { params }
    );
  }
}