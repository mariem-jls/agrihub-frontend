import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReponseDTO {
  id: number;
  content: string;
  dateReponse: Date;
  reclamationId: number;
  titre: string;
  description: string;
  type: string;
  status: string;
  priorite: string;
  dateCreation: Date;
  userName: string;
}

@Injectable({
  providedIn: 'root',
})
export class ReponsesService {
  private apiUrl = 'http://localhost:8080/AgriLink/reponses';

  constructor(private http: HttpClient) {}

  getReponsesByReclamation(idR: number): Observable<ReponseDTO[]> {
    return this.http.get<ReponseDTO[]>(
      `${this.apiUrl}/getReponseByReclamationId/${idR}`,
    );
  }

  addReponse(reclamationId: number, content: string): Observable<ReponseDTO> {
    return this.http.post<ReponseDTO>(
      `${this.apiUrl}/addReponse/${reclamationId}`,
      { content },
    );
  }
}
