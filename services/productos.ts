import api from './api';

export async function searchProductos(query: string) {
  const res = await api.get('/productos', { params: { search: query } });
  return Array.isArray(res.data) ? res.data : (res.data.productos ?? []);
}
