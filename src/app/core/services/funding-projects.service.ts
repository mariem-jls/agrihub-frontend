import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FundingProjectDTO {
  id: number;
  titre: string;
  description: string;
  objectif: number;
  montantCollecte: number;
  dateDebut: string;
  dateFin: string;
  statut: 'PENDING' | 'ACTIVE' | 'FUNDED' | 'FAILED';
  type: 'CULTURE' | 'MATERIEL' | 'SERRE';
  typeRetour: 'NONE' | 'ARGENT_VIRTUEL';
  userId?: number;
  contributionCount?: number;
  userName?: string;
}

@Injectable({
  providedIn: 'root',
})
export class FundingProjectsService {
  private readonly apiUrl = 'http://localhost:8080/AgriLink/projects';

  constructor(private http: HttpClient) {}

  getAllProjects(): Observable<FundingProjectDTO[]> {
    return this.http.get<FundingProjectDTO[]>(this.apiUrl);
  }

  getProjectById(projectId: number): Observable<FundingProjectDTO> {
    return this.http.get<FundingProjectDTO>(`${this.apiUrl}/${projectId}`);
  }

  getProjectsByUser(userId: number): Observable<FundingProjectDTO[]> {
    return this.http.get<FundingProjectDTO[]>(`${this.apiUrl}/user/${userId}`);
  }

  // ✅ ACCEPT
  acceptProject(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/accept/${id}`, {});
  }

  // ❌ REJECT
  rejectProject(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/reject/${id}`, {});
  }
}
