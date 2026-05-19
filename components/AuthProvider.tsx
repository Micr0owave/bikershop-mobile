import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { login as loginService, logout as logoutService, getStoredUser, validateRut, validatePhone, User } from '../services/auth';

type AuthContextData = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  sendResetEmail: (email: string) => Promise<boolean>;
  validateRut: (rut: string) => boolean;
  validatePhone: (phone: string) => boolean;
};

const AuthContext = createContext<AuthContextData>({
  user: null,
  isLoading: false,
  login: async () => false,
  logout: async () => {},
  sendResetEmail: async () => false,
  validateRut: () => false,
  validatePhone: () => false,
});


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function restore() {
      setIsLoading(true);
      try {
        const storedUser = await getStoredUser();
        if (storedUser) {
          setUser(storedUser);
        } else {
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    }
    restore();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const loggedUser = await loginService(email, password);
      setUser(loggedUser);
      return loggedUser !== null;
    } catch {
      setUser(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    await logoutService();
    setUser(null);
    setIsLoading(false);
  };

  const sendResetEmail = async (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const value = useMemo(
    () => ({
      user,
      isLoading,
      login,
      logout,
      sendResetEmail,
      validateRut,
      validatePhone,
    }),
    [user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
