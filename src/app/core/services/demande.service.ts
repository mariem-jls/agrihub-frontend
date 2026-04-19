import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Demande {
  demandeId?: number;
  userId: number;
  ressourceId: number;
  toUserId: number;
  expireDate?: string;
  message?: string;
  proposition?: string;
  nomDemandeur?: string;
  nomOwner?: string;
  priorite?: string;
  status?: string;
  reponse?: string;
}
@Injectable({
  providedIn: 'root'
})
export class DemandeService {

  
  
  private apiUrl = 'http://localhost:8089/AgriHub/demandes';

  constructor(private http: HttpClient) {}

  createDemande(demande: Demande): Observable<Demande> {
    return this.http.post<Demande>(`${this.apiUrl}/create`, demande);
  }

  getAll() {
    return this.http.get<Demande[]>(this.apiUrl);
  }
  acceptDemande(id:number){
return this.http.put(`http://localhost:8089/AgriHub/demandes/accept/${id}`,{});
}

refuseDemande(id:number){
return this.http.put(`http://localhost:8089/AgriHub/demandes/refuse/${id}`,{});
}
}
