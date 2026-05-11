import Constants from 'expo-constants';
import { Platform } from 'react-native';

const DEFAULT_BASE_URL = Platform.OS === 'android'
  ? 'http://10.0.2.2:8080/api/v1'
  : 'http://localhost:8080/api/v1';

const config = Constants.expoConfig?.extra as { apiBaseUrl?: string } | undefined;
export const API_BASE_URL = config?.apiBaseUrl?.trim()?.length
  ? config.apiBaseUrl.trim()
  : DEFAULT_BASE_URL;

async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) ?? {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const type = response.headers.get('content-type');
    let errorMessage = `Error en la petición (${response.status})`;

    if (type?.includes('application/json')) {
      try {
        const body = await response.json();
        if (body?.message) {
          errorMessage = body.message;
        }
      } catch {
        // ignore parse errors
      }
    }

    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return null as unknown as T;
  }

  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    return response.json();
  }

  return (await response.text()) as unknown as T;
}

export type AuthResponse = {
  nombre: string;
  apellido: string;
  token: string;
  rol: string;
};

export type OrdenResponse = {
  id: string;
  numeroOrden: string;
  estado: string;
  tipo: string;
  bicicletaId: string;
  mecanicoId: string;
  diagnosticoInicial: string;
  fechaIngreso: string | null;
  fechaPrometida: string | null;
};

export type DashboardHoyResponse = {
  ordenesRecibidas: number;
  ordenesEntregadas: number;
  ingresosHoy: string;
};

export type DashboardAlertasResponse = {
  productosStockBajo: Array<{
    productoId: string;
    nombre: string;
    stock: number;
    stockMinimo: number;
  }>;
  ordenesAtrasadas: Array<{
    ordenId: string;
    numeroOrden: string;
    estado: string;
    fechaPrometida: string;
  }>;
};

export async function apiLogin(email: string, password: string): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function apiResetPassword(email: string): Promise<boolean> {
  await request<void>('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
  return true;
}

export async function apiGetOrders(token: string): Promise<OrdenResponse[]> {
  return request<OrdenResponse[]>('/ordenes', {
    method: 'GET',
  }, token);
}

export async function apiGetOrder(token: string, id: string): Promise<OrdenResponse> {
  return request<OrdenResponse>(`/ordenes/${id}`, {
    method: 'GET',
  }, token);
}

export async function apiGetDashboardHoy(token: string): Promise<DashboardHoyResponse> {
  return request<DashboardHoyResponse>('/dashboard/hoy', {
    method: 'GET',
  }, token);
}

export async function apiGetDashboardEstados(token: string): Promise<Record<string, number>> {
  return request<Record<string, number>>('/dashboard/estados', {
    method: 'GET',
  }, token);
}

export async function apiGetDashboardAlertas(token: string): Promise<DashboardAlertasResponse> {
  return request<DashboardAlertasResponse>('/dashboard/alertas', {
    method: 'GET',
  }, token);
}
