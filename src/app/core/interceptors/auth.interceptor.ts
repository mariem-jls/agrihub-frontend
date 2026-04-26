import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { KeycloakService } from '../services/keycloak.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private keycloakService: KeycloakService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isApiCall = req.url.startsWith('http://localhost:8080/AgriLink/');
    if (!isApiCall) {
      return next.handle(req);
    }

    return from(this.keycloakService.updateToken(30)).pipe(
      switchMap(() => {
        const token = this.keycloakService.getToken();

        if (!token) {
          return next.handle(req);
        }

        const cloned = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });

        return next.handle(cloned);
      })
    );
  }
}
