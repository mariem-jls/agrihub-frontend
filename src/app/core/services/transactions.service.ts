import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TransactionDTO {
  id: number;
  montant: number;
  transactionType: string;
  dateTransaction: string; // ISO string
  userName: string;
  userEmail: string;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  private baseUrl = 'http://localhost:8080/AgriLink/transactions'; // adapter selon ton backend

  constructor(private http: HttpClient) { }

  getAllTransactions(): Observable<TransactionDTO[]> {
    return this.http.get<TransactionDTO[]>(this.baseUrl);
  }

  getTransactionsByWallet(walletId: number): Observable<TransactionDTO[]> {
    return this.http.get<TransactionDTO[]>(`${this.baseUrl}/wallet/${walletId}`);
  }

  getTransactionsByUser(userId: number): Observable<TransactionDTO[]> {
    return this.http.get<TransactionDTO[]>(`${this.baseUrl}/user/${userId}`);
  }
}