import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { KeycloakService } from '../services/keycloak.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private keycloakService: KeycloakService) {}

  async canActivate(): Promise<boolean> {
    if (!this.keycloakService.isAuthenticated()) {
      await this.keycloakService.login();
      return false;
    }

    await this.keycloakService.updateToken(30);

    const tokenParsed: any = this.keycloakService.instance.tokenParsed;
    const realmRoles: string[] = tokenParsed?.realm_access?.roles || [];

    const isAdmin = realmRoles.includes('ADMIN');

    if (!isAdmin) {
      // The user authenticated successfully in Keycloak, but they do not belong
      // in the backoffice. Send them through the frontoffice post-login flow
      // so the public app can route them correctly without creating a logout loop.
      window.location.href = 'http://localhost:4200/post-login';
      return false;
    }

    return true;
  }
}
