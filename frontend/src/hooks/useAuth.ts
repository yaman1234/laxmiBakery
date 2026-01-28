import { useState } from 'react';
import authService from '../services/authService';

export interface User {
  _id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string): Promise<LoginResponse> => {
    setLoading(true);
    try {
      const response = await authService.login(email, password);
      return response;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: authService.isAuthenticated(),
    isAdmin: user?.role === 'admin',
  };
};

export default useAuth; 