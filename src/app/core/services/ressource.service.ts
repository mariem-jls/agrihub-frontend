import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ressource } from '../models/ressource';
@Injectable({
  providedIn: 'root'
})
export class RessourceService {


   private apiUrl = 'http://localhost:8089/AgriHub/ressources';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Ressource[]> {
    return this.http.get<Ressource[]>(this.apiUrl);
  }

  getById(id: number): Observable<Ressource> {
    return this.http.get<Ressource>(`${this.apiUrl}/${id}`);
  }

  create(ressource: Ressource): Observable<Ressource> {
    return this.http.post<Ressource>(this.apiUrl, ressource);
  }

  update(id: number, ressource: Ressource): Observable<Ressource> {
    return this.http.put<Ressource>(`${this.apiUrl}/${id}`, ressource);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
  createWithImage(formData: FormData) {
  return this.http.post<Ressource>('http://localhost:8089/AgriHub/ressources/create', formData);
}
updateWithImage(id: number, formData: FormData): Observable<Ressource> {
    return this.http.put<Ressource>(`http://localhost:8089/AgriHub/ressources/update/${id}`, formData);
  }
validateDescription(description: string) {
  return this.http.post<any>('http://localhost:8089/AgriHub/validation/description', {
    description: description
  });
}


addToFavorites(id: number) {
  return this.http.post(`http://localhost:8089/AgriHub/api/favorites/${id}`, {});
}

removeFromFavorites(id: number) {
  return this.http.delete(`http://localhost:8089/AgriHub/api/favorites/${id}`);
}

getFavorites() {
  return this.http.get<number[]>(`http://localhost:8089/AgriHub/api/favorites`);
}
}

