import { useAuthStore } from '@/store/auth.store';
import { authService } from '@/services/auth.service';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const { user, token, setAuth, logout } = useAuthStore();
  const router = useRouter();

  const login = async (email: string, password: string) => {
    const data = await authService.login({ email, password });
    setAuth(data.user, data.access_token);
    return data;
  };

  const register = async (email: string, password: string, fullName: string) => {
    const data = await authService.register({ email, password, fullName });
    setAuth(data.user, data.access_token);
    return data;
  };

  const signOut = () => {
    logout();
    router.push('/login');
  };

  return {
    user,
    token,
    isAuthenticated: !!token,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout: signOut,
  };
}
