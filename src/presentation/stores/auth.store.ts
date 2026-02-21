import { create } from 'zustand';
import { User } from '@domain/entities/User';
import { UserRole } from '@domain/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, role: UserRole, name?: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: (email: string, role: UserRole, name?: string) => {
    // Mock login - En producción, esto llamaría a la API
    const user = new User(
      crypto.randomUUID(),
      name || email.split('@')[0],
      email,
      role
    );
    const token = 'mock-token-' + crypto.randomUUID();
    
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
