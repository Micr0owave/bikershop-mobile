import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AuthResponse = {
  nombre: string;
  apellido: string;
  token: string;
  rol: string;
};

export type User = {
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  token: string;
};

const STORAGE_KEYS = {
  token: 'velo_jwt',
  user: 'velo_user',
};

export async function login(email: string, password: string): Promise<User | null> {
  try {
    const response = await api.post('/auth/login', { email, password });
    const data = response.data;

    const user: User = {
      nombre: data.nombre,
      apellido: data.apellido,
      email,
      rol: data.rol,
      token: data.token,
    };

    await AsyncStorage.setItem(STORAGE_KEYS.token, data.token);
    await AsyncStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));

    return user;
  } catch (error: any) {
    console.error('Login error:', error.response?.data || error.message);
    return null;
  }
}

export async function logout(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEYS.token);
  await AsyncStorage.removeItem(STORAGE_KEYS.user);
}

export async function getStoredUser(): Promise<User | null> {
  try {
    const userJson = await AsyncStorage.getItem(STORAGE_KEYS.user);
    const token = await AsyncStorage.getItem(STORAGE_KEYS.token);
    if (userJson && token) {
      const user = JSON.parse(userJson) as User;
      return user;
    }
    return null;
  } catch (e) {
    console.error('Error parsing stored user:', e);
    await AsyncStorage.removeItem(STORAGE_KEYS.token);
    await AsyncStorage.removeItem(STORAGE_KEYS.user);
    return null;
  }
}

export async function sendResetEmail(email: string): Promise<boolean> {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateRut(rut: string): boolean {
  const cleaned = rut.replace(/[^0-9kK]/g, '').toUpperCase();
  if (cleaned.length < 8 || cleaned.length > 10) return false;
  const body = cleaned.slice(0, -1);
  const dv = cleaned.slice(-1);

  let sum = 0;
  let multiplier = 2;
  for (let i = body.length - 1; i >= 0; i -= 1) {
    sum += Number(body.charAt(i)) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  const rest = 11 - (sum % 11);
  const expectedDv = rest === 11 ? '0' : rest === 10 ? 'K' : String(rest);
  return expectedDv === dv;
}

export function validatePhone(phone: string): boolean {
  return /^\+569\d{8}$/.test(phone);
}
