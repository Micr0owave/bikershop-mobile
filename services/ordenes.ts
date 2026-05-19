import { USE_MOCK_API } from './config';
import * as real from './ordenes.api';
import * as mocks from './ordenes.mocks';

export const getOrdenes          = USE_MOCK_API ? mocks.mockGetOrdenes          : real.getOrdenes;
export const getOrden            = USE_MOCK_API ? mocks.mockGetOrden            : real.getOrden;
export const cambiarEstadoOrden  = USE_MOCK_API ? mocks.mockCambiarEstadoOrden  : real.cambiarEstadoOrden;
export const getOrdenesEstados   = USE_MOCK_API ? mocks.mockGetOrdenesEstados   : real.getOrdenesEstados;
export const getComentarios      = USE_MOCK_API ? mocks.mockGetComentarios      : real.getComentarios;
export const postComentario      = USE_MOCK_API ? mocks.mockPostComentario      : real.postComentario;
export const getMultimedia       = USE_MOCK_API ? mocks.mockGetMultimedia       : real.getMultimedia;
export const postMultimedia      = USE_MOCK_API ? mocks.mockPostMultimedia      : real.postMultimedia;
export const deleteMultimedia    = USE_MOCK_API ? mocks.mockDeleteMultimedia    : real.deleteMultimedia;
export const getProductosOrden   = USE_MOCK_API ? mocks.mockGetProductosOrden   : real.getProductosOrden;
export const postProductoOrden   = USE_MOCK_API ? mocks.mockPostProductoOrden   : real.postProductoOrden;
export const deleteProductoOrden = USE_MOCK_API ? mocks.mockDeleteProductoOrden : real.deleteProductoOrden;
