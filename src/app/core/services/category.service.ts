import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models';
import { API_BASE_URL } from '../api.config';

@Injectable({ providedIn: 'root' })
export class CategoryService {

  private url = `${API_BASE_URL}/marketplace/category`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.url}/getCategories`);
  }

  getById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.url}/getCategoryById/${id}`);
  }

  create(category: Category): Observable<Category> {
    return this.http.post<Category>(`${this.url}/addCategory`, category);
  }

  update(category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.url}/updateCategory`, category);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/deleteCategory/${id}`);
  }
}