export type AccountType =
  | 'buyer'
  | 'service'
  | 'parts'
  | 'rental'
  | 'insurance'
  | 'dealer'
  | 'admin';

export interface AuthTokens { access: string; refresh: string; }

export interface User {
  id: number;
  email: string;
  full_name: string;
  phone?: string | null;
  account_type: AccountType;
  is_active: boolean;
  is_staff: boolean;
  created_at: string;
  date_joined: string;
}

export interface LoginPayload { email: string; password: string; }
export interface RegisterPayload { email: string; full_name: string; password: string; account_type: AccountType; }
export interface PhoneLoginPayload { phone: string; code: string; full_name?: string; }