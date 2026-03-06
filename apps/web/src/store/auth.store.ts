import { create } from 'zustand';
import { IUser } from '@/types';

interface AuthState {
  user: IUser | null;
  token: string | null;
  setAuth: (user: IUser, token: string) => void;
  logout: () => void;
}

// Read synchronously from localStorage at module init time (client only).
// This avoids the async rehydration gap that persist middleware has with Next.js SSR,
// which caused the store to briefly be null on reload, triggering logout redirects.
function getInitialAuth(): { user: IUser | null; token: string | null } {
  if (typeof window === 'undefined') return { user: null, token: null };
  try {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return { token, user: user ? JSON.parse(user) : null };
  } catch {
    return { user: null, token: null };
  }
}

export const useAuthStore = create<AuthState>()((set) => ({
  ...getInitialAuth(),
  setAuth: (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  },
}));
