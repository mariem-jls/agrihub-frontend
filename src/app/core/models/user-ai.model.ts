export interface AiFlag {
  code: string;
  severity: string;
  message: string;
}

export interface AiSuggestion {
  field: string;
  message: string;
  suggestedValue?: string | null;
}

export interface UserAiReview {
  userId: number;
  reviewType: string;
  readinessScore: number | null;
  riskScore: number | null;
  recommendation: string;
  summary: string;
  flags: AiFlag[];
  suggestions: AiSuggestion[];
  duplicateCandidateCount: number;
  modelName: string;
  reviewedAt: string;
  sourceHash: string;
}

export interface DuplicateCandidate {
  userId: number;
  username: string;
  email: string;
  matchScore: number;
  reasons: string[];
}

export interface DuplicateScanResult {
  userId: number;
  candidateCount: number;
  summary: string;
  riskScore: number;
  recommendation: string;
  flags: string[];
  candidates: DuplicateCandidate[];
  reviewedAt: string;
}

export interface AdminAiPreviewResult {
  review: UserAiReview;
  duplicateScan: DuplicateScanResult;
}
