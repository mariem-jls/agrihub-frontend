import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Participation {
  id?: number;
  nomComplet: string;
  email: string;
  telephone: string;
  nombrePlaces: number;
  message?: string;
  statut?: string;
  causeDecision?: string;
  dateInscription?: string;
  /** Réponse admin (jointure API) */
  eventId?: number;
  event?: any;
  // FOIRE_AGRICOLE
  typeVisiteur?: string;
  // FORMATION
  niveauActuel?: string;
  anneesExperience?: number;
  // CONFERENCE
  organisationRepresentee?: string;
  // INVESTISSEMENT
  budgetDisponible?: number;
  secteurInteret?: string;
  // RECYCLAGE
  typeDechetsApportes?: string;
  quantiteEstimeeKg?: number;
  // ATELIER_PRATIQUE
  niveauActuelAtelier?: string;
  materielPossede?: string;
  // MARCHE_LOCAL
  typeStand?: string;
  // INNOVATION_AGRO
  domaineExpertise?: string;
  interetDemo?: boolean;
  user: {
    id: number;
    username: string;
    email: string;
    fullName: string;
    phone?: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class ParticipationService {
  private readonly baseUrl = '/AgriHub/api/participations';

  constructor(private http: HttpClient) {}

  addParticipation(eventId: number, participation: Participation): Observable<Participation> {
    return this.http.post<Participation>(`${this.baseUrl}/event/${eventId}`, participation);
  }

  getAllParticipations(): Observable<Participation[]> {
    return this.http.get<Participation[]>(this.baseUrl);
  }

  getParticipationsByEvent(eventId: number): Observable<Participation[]> {
    return this.http.get<Participation[]>(`${this.baseUrl}/event/${eventId}`);
  }

  confirmerParticipation(id: number, message?: string): Observable<any> {
    const payload = message?.trim() ? { message } : {};
    return this.http.put<any>(`${this.baseUrl}/${id}/confirmer`, payload);
  }

  refuserParticipation(id: number, cause: string): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}/refuser`, { cause });
  }

  deleteParticipation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // Compatibilité avec le code existant
  confirmer(id: number): Observable<any> {
    return this.confirmerParticipation(id);
  }

  refuser(id: number): Observable<any> {
    return this.refuserParticipation(id, 'Refusé par l’administration');
  }

  delete(id: number): Observable<void> {
    return this.deleteParticipation(id);
  }
}
