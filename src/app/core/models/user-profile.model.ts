export type BusinessUserType = 'INVESTOR' | 'AGRICULTOR' | 'RECYCLING_POINT';

export interface UserProfile {
  id?: number;
  keycloakId?: string;
  username: string;
  email: string;
  fullName?: string;
  phone?: string;
  address?: string;
  region?: string;
  organizationName?: string;
  activityDescription?: string;
  createdAt?: string;
  updatedAt?: string;
  userType?: BusinessUserType;
  onboardingCompleted: boolean;
  aiReadinessScore?: number | null;
  aiRiskScore?: number | null;
  aiRecommendation?: string | null;
  duplicateWarningCount?: number | null;
  aiReviewedAt?: string | null;
  accountEnabled: boolean;
  orphanedInKeycloak: boolean;
}
