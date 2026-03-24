import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FundingProjectDTO {
  id: number;
  titre: string;
  description: string;
  objectif: number;
  montantCollecte: number;
  dateDebut: string; // ISO string
  dateFin: string;   // ISO string
  statut: 'PENDING' | 'ACTIVE' | 'FUNDED' | 'FAILED';
  type: 'CULTURE' | 'MATERIEL' | 'SERRE';
  typeRetour: 'NONE' | 'ARGENT_VIRTUEL';
  userId?: number;
  contributionCount?: number; // optionnel
  userName?: string; // optionnel, pour afficher le nom du propriétaire
}

@Injectable({
  providedIn: 'root',
})
export class FundingProjectsService {
  private readonly apiUrl = 'http://localhost:8080/AgriLink/projects';

  constructor(private http: HttpClient) {}

  getAllProjects(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getProjectById(projectId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${projectId}`);
  }

  getProjectsByUser(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`);
  }
}
