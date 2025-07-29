import api from '@/api/axios';
import type { AuthTokens, User, LoginPayload, RegisterPayload, PhoneLoginPayload } from './types';

export const authApi = {
  login: (data: LoginPayload) => api.post<AuthTokens>('/auth/login/', data),
  register: (data: RegisterPayload) => api.post<AuthTokens>('/auth/register/', data),
  confirmEmail: (code: string) => api.post<AuthTokens>('/auth/register/confirm/', { code }),
  phoneSendCode: (phone: string) => api.post('/auth/phone/send-code/', { phone }),
  phoneLogin: (data: PhoneLoginPayload) => api.post<AuthTokens>('/auth/phone/register/', data),
  getProfile: () => api.get<User>('/auth/profile/'),
  logout: async () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    return Promise.resolve();
  },
  // ← NEW: patch endpoint to update the current user’s profile
  updateProfile: (data: Partial<User>) => api.patch<User>('/auth/profile/', data),
};
