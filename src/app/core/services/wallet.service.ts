import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface WalletDTO {
  id: number;
  soldeTotale: number;
  soldeDisponible: number;
  soldeBloque: number;
  userId?: number;
  userNom?: string;
  userEmail?: string;
}

@Injectable({
  providedIn: 'root',
})
export class WalletsService {
  private apiUrl = 'http://localhost:8080/AgriLink/wallets';

  constructor(private http: HttpClient) {}

  getAllWallets(): Observable<WalletDTO[]> {
    return this.http.get<WalletDTO[]>(this.apiUrl);
  }

  getWalletByUser(userId: number): Observable<WalletDTO> {
    return this.http.get<WalletDTO>(`${this.apiUrl}/${userId}`);
  }
}
