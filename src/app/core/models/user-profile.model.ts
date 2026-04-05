export type BusinessUserType = 'INVESTOR' | 'AGRICULTOR' | 'RECYCLING_POINT';

export interface UserProfile {
  id?: number;
  keycloakId?: string;
  username: string;
  email: string;
  fullName?: string;
  phone?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
  userType?: BusinessUserType;
  onboardingCompleted: boolean;
  accountEnabled: boolean;
  orphanedInKeycloak: boolean;
}
