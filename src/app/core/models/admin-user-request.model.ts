export type BusinessUserType = 'INVESTOR' | 'AGRICULTOR' | 'RECYCLING_POINT';

export interface CreateBusinessUserRequest {
  username: string;
  email: string;
  temporaryPassword: string;
  fullName: string;
  phone: string;
  address: string;
  userType: BusinessUserType;
}

export interface UpdateBusinessUserRequest {
  fullName: string;
  phone: string;
  address: string;
  userType: BusinessUserType;
}
