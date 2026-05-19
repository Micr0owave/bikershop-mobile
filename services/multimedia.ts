import api from './api';

export async function subirFotoOrden(ordenId: string | number, etapa: string, data: FormData) {
  const res = await api.post(`/multimedia/orden/${ordenId}?etapa=${encodeURIComponent(etapa)}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function getFotosOrden(ordenId: string | number) {
  const res = await api.get(`/multimedia/orden/${ordenId}`);
  return res.data;
}
