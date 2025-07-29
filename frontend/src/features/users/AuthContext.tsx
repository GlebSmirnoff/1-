import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from 'react';
import { useNavigate } from 'react-router-dom';
import type {
  User,
  AuthTokens,
  LoginPayload,
  RegisterPayload,
  PhoneLoginPayload,
} from './types';
import { authApi } from './api';

export interface AuthContextValue {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (data: LoginPayload) => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  confirmEmail: (code: string) => Promise<void>;
  sendPhoneCode: (phone: string) => Promise<boolean>;
  loginByPhone: (data: PhoneLoginPayload) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;  // ← NEW
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const setTokens = (t: AuthTokens) => {
    localStorage.setItem('accessToken', t.access);
    localStorage.setItem('refreshToken', t.refresh);
  };

  const fetchProfile = async () => {
    try {
      const res = await authApi.getProfile();
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('accessToken')) fetchProfile();
    else setLoading(false);
  }, []);

  const login = async (data: LoginPayload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authApi.login(data);
      setTokens(res.data);
      await fetchProfile();
      navigate('/profile');
    } catch (e: any) {
      setError(e.response?.data?.detail || e.message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterPayload) => {
    setLoading(true);
    setError(null);
    try {
      await authApi.register(data);
      navigate('/register/confirm');
    } catch (e: any) {
      const errData = e.response?.data;
      if (errData && typeof errData === 'object') {
        const msgs = Object.entries(errData)
          .map(([f, m]) =>
            Array.isArray(m) ? `${f}: ${m.join(', ')}` : `${f}: ${m}`
          )
          .join('\n');
        setError(msgs);
      } else {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const confirmEmail = async (code: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authApi.confirmEmail(code);
      setTokens(res.data);
      await fetchProfile();
      navigate('/profile');
    } catch (e: any) {
      setError(e.response?.data?.detail || e.message);
      throw e; // keep page if code invalid
    } finally {
      setLoading(false);
    }
  };

  const sendPhoneCode = async (phone: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await authApi.phoneSendCode(phone);
      return true;
    } catch (e: any) {
      setError(e.response?.data?.detail || e.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const loginByPhone = async (data: PhoneLoginPayload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authApi.phoneLogin(data);
      setTokens(res.data);
      await fetchProfile();
      navigate('/profile');
    } catch (e: any) {
      setError(e.response?.data?.detail || e.message);
    } finally {
      setLoading(false);
    }
  };

  // ← NEW: allow editing user profile
  const updateProfile = async (data: Partial<User>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authApi.updateProfile(data);
      setUser(res.data);
    } catch (e: any) {
      setError(e.response?.data?.detail || e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        confirmEmail,
        sendPhoneCode,
        loginByPhone,
        logout,
        updateProfile,  // ← NEW
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
