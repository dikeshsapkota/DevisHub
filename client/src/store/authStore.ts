import { create } from 'zustand';
import { User } from '../types';
import { api } from '../services/api';
import { connectSocket, disconnectSocket } from '../services/socket';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  checkAuth: () => Promise<void>;
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  demoLogin: (username?: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  checkAuth: async () => {
    try {
      set({ isLoading: true, error: null });
      const res: any = await api.get('/auth/me');
      set({ user: res.data, isAuthenticated: true, isLoading: false });
      connectSocket();
    } catch (err: any) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (credentials) => {
    try {
      set({ isLoading: true, error: null });
      const res: any = await api.post('/auth/login', credentials);
      set({ user: res.data.user, isAuthenticated: true, isLoading: false });
      connectSocket();
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
      throw err;
    }
  },

  register: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const res: any = await api.post('/auth/register', data);
      set({ user: res.data.user, isAuthenticated: true, isLoading: false });
      connectSocket();
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
      throw err;
    }
  },

  demoLogin: async (username = 'alex_dev') => {
    try {
      set({ isLoading: true, error: null });
      const res: any = await api.post('/auth/demo-login', { username });
      set({ user: res.data.user, isAuthenticated: true, isLoading: false });
      connectSocket();
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
      throw err;
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      // Ignore
    } finally {
      disconnectSocket();
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  setUser: (user) => set({ user, isAuthenticated: !!user }),
}));
