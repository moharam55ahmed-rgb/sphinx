import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'CONTENT_MANAGER' | 'SEO_MARKETING';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null,
  isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('admin_token') : false,
  
  setAuth: (user, token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_token', token);
    }
    set({ user, token, isAuthenticated: true });
  },
  
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
    }
    set({ user: null, token: null, isAuthenticated: false });
    if (typeof window !== 'undefined') {
      window.location.href = '/admin/login';
    }
  },
}));
