import api from '../../services/api';
import { searchProductos } from '../../services/productos';

jest.mock('../../services/api', () => ({
  get: jest.fn(),
}));

const apiMock = api as jest.Mocked<typeof api>;

beforeEach(() => jest.clearAllMocks());

describe('searchProductos', () => {
  it('calls GET /productos with search param', async () => {
    apiMock.get.mockResolvedValue({ data: [] });
    await searchProductos('shimano');
    expect(apiMock.get).toHaveBeenCalledWith('/productos', { params: { search: 'shimano' } });
  });

  it('returns array from data directly', async () => {
    const productos = [{ id: 'p1', nombre: 'Cadena' }];
    apiMock.get.mockResolvedValue({ data: productos });
    const result = await searchProductos('cadena');
    expect(result).toEqual(productos);
  });

  it('returns data.productos if wrapped', async () => {
    const productos = [{ id: 'p2', nombre: 'Pastilla' }];
    apiMock.get.mockResolvedValue({ data: { productos } });
    const result = await searchProductos('pastilla');
    expect(result).toEqual(productos);
  });
});
