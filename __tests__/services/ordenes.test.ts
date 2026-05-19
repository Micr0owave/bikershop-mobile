import api from '../../services/api';
import {
  cambiarEstadoOrden,
  getComentarios,
  postComentario,
  getMultimedia,
  postMultimedia,
  deleteMultimedia,
  getProductosOrden,
  postProductoOrden,
  deleteProductoOrden,
} from '../../services/ordenes';

jest.mock('../../services/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
}));

const apiMock = api as jest.Mocked<typeof api>;

beforeEach(() => jest.clearAllMocks());

describe('cambiarEstadoOrden', () => {
  it('sends PATCH with estado', async () => {
    apiMock.patch.mockResolvedValue({ data: { ok: true } });
    await cambiarEstadoOrden('OT-001', 'en_reparacion');
    expect(apiMock.patch).toHaveBeenCalledWith('/ordenes/OT-001/estado', { estado: 'en_reparacion' });
  });
});

describe('getComentarios', () => {
  it('returns array from data.comentarios', async () => {
    apiMock.get.mockResolvedValue({ data: { comentarios: [{ id: '1', texto: 'ok' }] } });
    const result = await getComentarios('OT-001');
    expect(result).toEqual([{ id: '1', texto: 'ok' }]);
  });

  it('returns data directly if array', async () => {
    apiMock.get.mockResolvedValue({ data: [{ id: '2', texto: 'hi' }] });
    const result = await getComentarios('OT-001');
    expect(result).toEqual([{ id: '2', texto: 'hi' }]);
  });
});

describe('postComentario', () => {
  it('posts texto to comentarios endpoint', async () => {
    apiMock.post.mockResolvedValue({ data: { id: '3' } });
    await postComentario('OT-001', 'Revisé frenos');
    expect(apiMock.post).toHaveBeenCalledWith('/ordenes/OT-001/comentarios', { texto: 'Revisé frenos' });
  });
});

describe('getMultimedia', () => {
  it('returns array from data.multimedia', async () => {
    apiMock.get.mockResolvedValue({ data: { multimedia: [{ id: 'm1', url: 'http://x' }] } });
    const result = await getMultimedia('OT-001');
    expect(result).toEqual([{ id: 'm1', url: 'http://x' }]);
  });

  it('returns data directly if array', async () => {
    apiMock.get.mockResolvedValue({ data: [{ id: 'm2', url: 'http://y' }] });
    const result = await getMultimedia('OT-001');
    expect(result).toEqual([{ id: 'm2', url: 'http://y' }]);
  });
});

describe('postMultimedia', () => {
  it('posts FormData with foto field', async () => {
    apiMock.post.mockResolvedValue({ data: { id: 'm2' } });
    await postMultimedia('OT-001', 'file:///photo.jpg', 'image/jpeg');
    expect(apiMock.post).toHaveBeenCalledWith(
      '/ordenes/OT-001/multimedia',
      expect.any(FormData),
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  });
});

describe('deleteMultimedia', () => {
  it('calls DELETE with mediaId', async () => {
    apiMock.delete.mockResolvedValue({ data: {} });
    await deleteMultimedia('OT-001', 'm1');
    expect(apiMock.delete).toHaveBeenCalledWith('/ordenes/OT-001/multimedia/m1');
  });
});

describe('getProductosOrden', () => {
  it('returns array of products', async () => {
    apiMock.get.mockResolvedValue({ data: [{ id: 'p1', nombre: 'Cadena' }] });
    const result = await getProductosOrden('OT-001');
    expect(result).toEqual([{ id: 'p1', nombre: 'Cadena' }]);
  });

  it('returns data.productos if wrapped', async () => {
    apiMock.get.mockResolvedValue({ data: { productos: [{ id: 'p2', nombre: 'Pastilla' }] } });
    const result = await getProductosOrden('OT-001');
    expect(result).toEqual([{ id: 'p2', nombre: 'Pastilla' }]);
  });
});

describe('postProductoOrden', () => {
  it('posts productoId and cantidad', async () => {
    apiMock.post.mockResolvedValue({ data: {} });
    await postProductoOrden('OT-001', 'prod-uuid', 2);
    expect(apiMock.post).toHaveBeenCalledWith('/ordenes/OT-001/productos', { productoId: 'prod-uuid', cantidad: 2 });
  });

  it('defaults cantidad to 1', async () => {
    apiMock.post.mockResolvedValue({ data: {} });
    await postProductoOrden('OT-001', 'prod-uuid');
    expect(apiMock.post).toHaveBeenCalledWith('/ordenes/OT-001/productos', { productoId: 'prod-uuid', cantidad: 1 });
  });
});

describe('deleteProductoOrden', () => {
  it('calls DELETE with productoId', async () => {
    apiMock.delete.mockResolvedValue({ data: {} });
    await deleteProductoOrden('OT-001', 'prod-uuid');
    expect(apiMock.delete).toHaveBeenCalledWith('/ordenes/OT-001/productos/prod-uuid');
  });
});
