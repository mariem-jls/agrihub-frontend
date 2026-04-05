import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Notification {
  id?: number;
  message: string;
  type: string; // CONFIRMATION / REFUS / RAPPEL / MODIFICATION_EVENT
  lu: boolean;
  dateCreation: string;
  eventId?: number;
  nomEvent?: string;
  imageEvent?: string;
  nomParticipant?: string;
  emailParticipant?: string;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly baseUrl = '/AgriHub/api/notifications';

  constructor(private http: HttpClient) {}

  getAllNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.baseUrl);
  }

  getUnreadNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.baseUrl}/unread`);
  }

  countUnread(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/unread/count`);
  }

  markAsRead(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/read`, {});
  }

  markAllAsRead(): Observable<any> {
    return this.http.put(`${this.baseUrl}/read-all`, {});
  }

  deleteNotification(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
