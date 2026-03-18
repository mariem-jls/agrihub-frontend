import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment, PaymentMethod } from '../models';
import { API_BASE_URL } from '../api.config';

@Injectable({ providedIn: 'root' })
export class PaymentService {

  private url = `${API_BASE_URL}/marketplace/payment`;

  constructor(private http: HttpClient) {}

  getByOrder(orderId: number): Observable<Payment> {
    return this.http.get<Payment>(
      `${this.url}/getPaymentByOrder/${orderId}`
    );
  }

  create(
    orderId: number,
    method: PaymentMethod
  ): Observable<Payment> {
    const params = new HttpParams().set('method', method);
    return this.http.post<Payment>(
      `${this.url}/addPayment/${orderId}`,
      {},
      { params }
    );
  }

  confirm(
    orderId: number,
    transactionId: string
  ): Observable<Payment> {
    const params = new HttpParams().set('transactionId', transactionId);
    return this.http.put<Payment>(
      `${this.url}/confirmPayment/${orderId}`,
      {},
      { params }
    );
  }

  refund(orderId: number): Observable<Payment> {
    return this.http.put<Payment>(
      `${this.url}/refundPayment/${orderId}`,
      {}
    );
  }
}