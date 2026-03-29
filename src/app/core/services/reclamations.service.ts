import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Reclamation {
  id: number;
  titre: string;
  description: string;
  type: string;
  status: string;
  priorite: string;
  dateCreation: string;
  userName: string; // récupéré depuis user
}

@Injectable({
  providedIn: 'root',
})
export class ReclamationsService {
  private apiUrl = 'http://localhost:8080/AgriLink/reclamations'; // adapte si nécessaire

  constructor(private http: HttpClient) {}

  getAllReclamations(): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>(this.apiUrl + '/getAll');
  }

  accepterReclamation(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/acceptReclamation/${id}`, {});
  }

  refuserReclamation(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/refuseReclamation/${id}`, {});
  }

  finirReclamation(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/finirReclamation/${id}`, {});
  }
}
