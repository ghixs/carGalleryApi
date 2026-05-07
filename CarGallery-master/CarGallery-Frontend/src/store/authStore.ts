import { create } from 'zustand';
import { User } from '../types';
import { authService } from '../services/authService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  isAuthenticated: !!localStorage.getItem('user'),

  login: async (username: string, password: string) => {
    try {
      const user = await authService.login({ username, password });
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', 'fake-jwt-token');
      set({ user, isAuthenticated: true });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Giriş başarısız');
    }
  },

  register: async (username: string, password: string) => {
    try {
      const user = await authService.register({ username, password });
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', 'fake-jwt-token');
      set({ user, isAuthenticated: true });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Kayıt başarısız');
    }
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    set({ user: null, isAuthenticated: false });
  },
}));
