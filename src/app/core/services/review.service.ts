import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from '../models';
import { API_BASE_URL } from '../api.config';

@Injectable({ providedIn: 'root' })
export class ReviewService {

  private url = `${API_BASE_URL}/marketplace/review`;

  constructor(private http: HttpClient) {}

  getByProduct(productId: number): Observable<Review[]> {
    return this.http.get<Review[]>(
      `${this.url}/getReviewsByProduct/${productId}`
    );
  }

  getAverageRating(productId: number): Observable<number> {
    return this.http.get<number>(
      `${this.url}/getAverageRating/${productId}`
    );
  }

  create(
    review: Review,
    buyerId: number,
    productId: number
  ): Observable<Review> {
    return this.http.post<Review>(
      `${this.url}/addReview/${buyerId}/${productId}`,
      review
    );
  }

  delete(id: number, buyerId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.url}/deleteReview/${id}/${buyerId}`
    );
  }
}