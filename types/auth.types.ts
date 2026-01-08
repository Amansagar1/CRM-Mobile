/**
 * Authentication Type Definitions
 */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  data?: string; // Encrypted token from login
  id?: string;
  email?: string;
  firstname?: string;
  lastname?: string;
  phone?: string;
  photo?: string | null;
  role?: string;
  org?: string[];
  lob?: string[];
  assigned_admins?: string[];
  permissions?: {
    activity_types: boolean;
    manage_rm: boolean;
    status_types: boolean;
  };
  rf_tk_exp: string; // Refresh token expiration
}


export interface User {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  phone: string;
  photo: string | null;
  role: string;
  org: string[];
  lob: string[];
  assigned_admins: string[];
  permissions: {
    activity_types: boolean;
    manage_rm: boolean;
    status_types: boolean;
  };
  rf_tk_exp: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}
