import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Aligné sur l'entité JPA `Event` / enum `CategorieEvenement` (sérialisation JSON camelCase).
 */
export interface Event {
  id?: number;
  // Champs communs
  nom: string;
  date: string;
  adresse: string;
  description: string;
  image: string;
  nbrPlaces: number;
  placesRestantes?: number;
  /** Valeurs: FOIRE_AGRICOLE, FORMATION, CONFERENCE, … */
  categorie: string;
  /** DISPONIBLE | COMPLET */
  statut?: string;
  /** true si événement archivé (masqué de la liste principale) */
  archive?: boolean;
  latitude?: number;
  longitude?: number;
  
  // FOIRE_AGRICOLE
  nbExposants?: number;
  typeProduits?: string;
  prixEntree?: number;

  // FORMATION
  formateur?: string;
  niveauRequis?: string;
  dureeHeures?: number;
  certification?: boolean;

  // CONFERENCE
  intervenant?: string;
  themePrincipal?: string;

  // INVESTISSEMENT
  montantMin?: number;
  secteurCible?: string;

  // RECYCLAGE
  typeDechets?: string;
  capaciteTraitement?: string;
  partenaires?: string;

  // ATELIER_PRATIQUE
  materielNecessaire?: string;
  prerequis?: string;
  niveauAtelier?: string;

  // MARCHE_LOCAL
  horairesOuverture?: string;
  nbStands?: number;

  // INNOVATION_AGRO
  technologie?: string;
  entreprise?: string;
  demoDisponible?: boolean;
}

export type AgriHubEvent = Event;

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private apiUrl = '/AgriHub/api/events';

  constructor(private http: HttpClient) {}

  getAllEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl);
  }

  getArchivedEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/archives`);
  }

  archiverEvent(id: number): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/${id}/archiver`, {});
  }

  getEventById(id: number): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${id}`);
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  addEvent(event: any, file?: File) {
    const formData = new FormData();
    formData.append('data', JSON.stringify(event));
    if (file) formData.append('image', file);
    return this.http.post(`${this.apiUrl}/create`, formData);
  }

  updateEventWithImage(id: number, event: any, file?: File) {
    const formData = new FormData();
    formData.append('data', JSON.stringify(event));
    if (file) formData.append('image', file);
    return this.http.put<Event>(`${this.apiUrl}/update/${id}`, formData);
  }
}