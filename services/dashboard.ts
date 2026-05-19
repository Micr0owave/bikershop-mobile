import api from './api';

export async function getDashboardHoy() {
  const res = await api.get('/dashboard/hoy');
  return res.data;
}

export async function getDashboardEstados() {
  const res = await api.get('/dashboard/estados');
  return res.data;
}

export async function getDashboardAlertas() {
  const res = await api.get('/dashboard/alertas');
  return res.data;
}
