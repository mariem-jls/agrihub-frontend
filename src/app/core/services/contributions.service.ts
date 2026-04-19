import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ContributionDTO {
  id: number;
  montant: number;
  pourcentage: number;
  retourAttendu: number;
  retourRecu: number;
  dateContribution: string;
  statut: string;
  projectName: string;
  description: string;
  montantCollecte: number;
  objectif: number;
  idProjet: number;
  statutContirubtion: string;
  typeProjet: string;
  typeRetour: string;
  username: string;
  useremail: string;
}

@Injectable({
  providedIn: 'root',
})
export class ContributionsService {
  private apiUrl = 'http://localhost:8080/AgriLink/contributions';

  constructor(private http: HttpClient) {}

  // 🔹 Toutes les contributions
  getAllContributions(): Observable<ContributionDTO[]> {
    return this.http.get<ContributionDTO[]>(this.apiUrl);
  }

  // 🔹 Par user
  getContributionsByUser(userId: number): Observable<ContributionDTO[]> {
    return this.http.get<ContributionDTO[]>(`${this.apiUrl}/user/${userId}`);
  }

  // 🔹 Par projet
  getContributionsByProject(projectId: number): Observable<ContributionDTO[]> {
    return this.http.get<ContributionDTO[]>(
      `${this.apiUrl}/project/${projectId}`,
    );
  }

  // 🔹 Par ID
  getContributionById(id: number): Observable<ContributionDTO> {
    return this.http.get<ContributionDTO>(`${this.apiUrl}/${id}`);
  }
}
