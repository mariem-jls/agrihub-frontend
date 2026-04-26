import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {
  private keycloak: Keycloak;

  constructor() {
    this.keycloak = new Keycloak({
      url: 'http://localhost:8081',
      realm: 'agrilink',
      clientId: 'agrilink-backoffice'
    });
  }

  init(): Promise<boolean> {
    return this.keycloak.init({
      onLoad: 'check-sso',
      pkceMethod: 'S256',
      checkLoginIframe: false
    });
  }

  login(): Promise<void> {
    return this.keycloak.login({
      redirectUri: window.location.origin + '/seller'
    });
  }

  logout(): Promise<void> {
    return this.keycloak.logout({
      redirectUri: window.location.origin + '/seller'
    });
  }

  getToken(): string | undefined {
    return this.keycloak.token;
  }

  isAuthenticated(): boolean {
    return !!this.keycloak.authenticated;
  }

  async updateToken(minValidity = 30): Promise<boolean> {
    try {
      return await this.keycloak.updateToken(minValidity);
    } catch {
      return false;
    }
  }

  get instance(): Keycloak {
    return this.keycloak;
  }
}
