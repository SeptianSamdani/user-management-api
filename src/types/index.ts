import { Request } from 'express';

// Define Role enum locally
export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: Role;
  };
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: Role;
}

export interface RegisterDTO {
  email: string;
  password: string;
  name: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface UpdateProfileDTO {
  name?: string;
  email?: string;
}

export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  role?: Role;
  isActive?: boolean;
}

export interface ResetPasswordDTO {
  token: string;
  newPassword: string;
}