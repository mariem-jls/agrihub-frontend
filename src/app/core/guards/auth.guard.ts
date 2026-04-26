import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { KeycloakService } from '../services/keycloak.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private keycloakService: KeycloakService) {}

  async canActivate(): Promise<boolean> {
    if (this.keycloakService.isAuthenticated()) {
      return true;
    }

    await this.keycloakService.login();
    return false;
  }
}
