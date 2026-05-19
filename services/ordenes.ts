import api from './api';

export async function getOrdenes() {
  const res = await api.get('/ordenes');
  return Array.isArray(res.data) ? res.data : (res.data.ordenes ?? []);
}

export async function getOrden(id: string) {
  const res = await api.get(`/ordenes/${id}`);
  return res.data;
}

export async function cambiarEstadoOrden(id: string, estado: string) {
  const res = await api.patch(`/ordenes/${id}/estado`, { estado });
  return res.data;
}

export async function getOrdenesEstados() {
  const res = await api.get('/ordenes/estados');
  return res.data;
}

export async function getComentarios(id: string) {
  const res = await api.get(`/ordenes/${id}/comentarios`);
  return Array.isArray(res.data) ? res.data : (res.data.comentarios ?? []);
}

export async function postComentario(id: string, texto: string) {
  const res = await api.post(`/ordenes/${id}/comentarios`, { texto });
  return res.data;
}

export async function getMultimedia(id: string) {
  const res = await api.get(`/ordenes/${id}/multimedia`);
  return Array.isArray(res.data) ? res.data : (res.data.multimedia ?? []);
}

export async function postMultimedia(id: string, uri: string, mimeType: string = 'image/jpeg') {
  const form = new FormData();
  form.append('foto', { uri, type: mimeType, name: 'foto.jpg' } as any);
  const res = await api.post(`/ordenes/${id}/multimedia`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function deleteMultimedia(id: string, mediaId: string) {
  const res = await api.delete(`/ordenes/${id}/multimedia/${mediaId}`);
  return res.data;
}

export async function getProductosOrden(id: string) {
  const res = await api.get(`/ordenes/${id}/productos`);
  return Array.isArray(res.data) ? res.data : (res.data.productos ?? []);
}

export async function postProductoOrden(id: string, productoId: string, cantidad: number = 1) {
  const res = await api.post(`/ordenes/${id}/productos`, { productoId, cantidad });
  return res.data;
}

export async function deleteProductoOrden(id: string, productoId: string) {
  const res = await api.delete(`/ordenes/${id}/productos/${productoId}`);
  return res.data;
}
