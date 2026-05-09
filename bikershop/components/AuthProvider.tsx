import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Membership = 'GOLD' | 'SILVER' | 'NORMAL';

type User = {
  name: string;
  email: string;
  specialty: string;
  branch: string;
  membership: Membership;
  tallerId: string;
};

type AuthContextData = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  sendResetEmail: (email: string) => Promise<boolean>;
  validateRut: (rut: string) => boolean;
  validatePhone: (phone: string) => boolean;
};

const AuthContext = createContext<AuthContextData>({
  user: null,
  token: null,
  login: async () => false,
  logout: async () => {},
  sendResetEmail: async () => false,
  validateRut: () => false,
  validatePhone: () => false,
});

const STORAGE_KEYS = {
  token: 'velo_jwt',
  user: 'velo_user',
};

function buildJwt(email: string, tallerId: string) {
  return `VEL0-${email.replace(/[^a-zA-Z0-9]/g, '')}-${tallerId}-${Math.floor(Date.now() / 1000)}`;
}

function formatRut(rut: string) {
  return rut.replace(/[^0-9kK]/g, '').toUpperCase();
}

function checksumRut(rut: string) {
  let sum = 0;
  let multiplier = 2;

  for (let i = rut.length - 1; i >= 0; i -= 1) {
    sum += Number(rut.charAt(i)) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const rest = 11 - (sum % 11);
  if (rest === 11) return '0';
  if (rest === 10) return 'K';
  return String(rest);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    async function restore() {
      try {
        const storedToken = await AsyncStorage.getItem(STORAGE_KEYS.token);
        const storedUser = await AsyncStorage.getItem(STORAGE_KEYS.user);
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch {
        await AsyncStorage.removeItem(STORAGE_KEYS.token);
        await AsyncStorage.removeItem(STORAGE_KEYS.user);
      }
    }

    restore();
  }, []);

  const login = async (email: string, password: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) || password.length < 6) {
      return false;
    }

    const tallerId = 'TALLER-CHL-001';
    const newUser: User = {
      name: 'Camilo Pizarro',
      email,
      specialty: 'Mantenimiento y diagnóstico',
      branch: 'Santiago Centro',
      membership: 'GOLD',
      tallerId,
    };
    const jwt = buildJwt(email, tallerId);

    await AsyncStorage.setItem(STORAGE_KEYS.token, jwt);
    await AsyncStorage.setItem(STORAGE_KEYS.user, JSON.stringify(newUser));
    setToken(jwt);
    setUser(newUser);
    return true;
  };

  const logout = async () => {
    await AsyncStorage.removeItem(STORAGE_KEYS.token);
    await AsyncStorage.removeItem(STORAGE_KEYS.user);
    setToken(null);
    setUser(null);
  };

  const sendResetEmail = async (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateRut = (rut: string) => {
    const cleaned = formatRut(rut);
    if (cleaned.length < 8 || cleaned.length > 10) return false;
    const body = cleaned.slice(0, -1);
    const dv = cleaned.slice(-1);
    return checksumRut(body) === dv;
  };

  const validatePhone = (phone: string) => {
    return /^\+569\d{8}$/.test(phone);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      logout,
      sendResetEmail,
      validateRut,
      validatePhone,
    }),
    [user, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
