import { KeycloakService } from './core/services/keycloak.service';

export function initializeKeycloak(keycloak: KeycloakService) {
  return () => keycloak.init();
}
