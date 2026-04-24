import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api.config';
import { UserProfile } from '../models/user-profile.model';
import {
  CreateBusinessUserRequest,
  UpdateBusinessUserRequest
} from '../models/admin-user-request.model';
import { AdminAiPreviewResult, DuplicateScanResult, UserAiReview } from '../models/user-ai.model';

@Injectable({ providedIn: 'root' })
export class UserService {

  private url = `${API_BASE_URL}/api/admin/users`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<UserProfile[]> {
    return this.http.get<UserProfile[]>(this.url);
  }

  getById(id: number): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.url}/${id}`);
  }

  create(user: CreateBusinessUserRequest): Observable<UserProfile> {
    return this.http.post<UserProfile>(this.url, user);
  }

  update(id: number, user: UpdateBusinessUserRequest): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.url}/${id}`, user);
  }

  lock(id: number): Observable<UserProfile> {
    return this.http.post<UserProfile>(`${this.url}/${id}/lock`, {});
  }

  unlock(id: number): Observable<UserProfile> {
    return this.http.post<UserProfile>(`${this.url}/${id}/unlock`, {});
  }

  getAiReview(id: number): Observable<UserAiReview> {
    return this.http.get<UserAiReview>(`${this.url}/${id}/ai-review`);
  }

  runAiReview(id: number): Observable<UserAiReview> {
    return this.http.post<UserAiReview>(`${this.url}/${id}/ai-review`, {});
  }

  previewAiReview(id: number, user: UpdateBusinessUserRequest): Observable<AdminAiPreviewResult> {
    return this.http.post<AdminAiPreviewResult>(`${this.url}/${id}/ai-review/preview`, user);
  }

  getDuplicateCandidates(id: number): Observable<DuplicateScanResult> {
    return this.http.get<DuplicateScanResult>(`${this.url}/${id}/duplicate-candidates`);
  }
}
