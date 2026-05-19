const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

let nextComentarioId = 100;
let nextMultimediaId = 100;
let nextProductoOrdenId = 100;

const MOCK_ORDENES: any[] = [
  {
    id: 'OT-2024-001',
    estado: 'recibida',
    descripcion: 'Cambio de frenos y ajuste de cambios traseros.',
    fecha_ingreso: '2024-11-10T09:30:00.000Z',
    fecha_estimada: '2024-11-15T18:00:00.000Z',
    cliente: { nombre: 'Juan', apellido: 'Pérez', telefono: '+56 9 1234 5678' },
    bicicleta: { marca: 'Trek', modelo: 'Marlin 7', tipo: 'MTB', color: 'Rojo', talla: 'M' },
  },
  {
    id: 'OT-2024-002',
    estado: 'en_diagnostico',
    descripcion: 'Ruido extraño en el pedalier.',
    fecha_ingreso: '2024-11-12T10:00:00.000Z',
    fecha_estimada: '2024-11-18T18:00:00.000Z',
    cliente: { nombre: 'María', apellido: 'González', telefono: '+56 9 8765 4321' },
    bicicleta: { marca: 'Specialized', modelo: 'Rockhopper', tipo: 'MTB', color: 'Negro', talla: 'S' },
  },
  {
    id: 'OT-2024-003',
    estado: 'en_reparacion',
    descripcion: 'Service completo y cambio de cableado.',
    fecha_ingreso: '2024-11-08T08:15:00.000Z',
    fecha_estimada: '2024-11-14T18:00:00.000Z',
    cliente: { nombre: 'Carlos', apellido: 'López', telefono: '+56 9 5555 9999' },
    bicicleta: { marca: 'Giant', modelo: 'Defy Advanced', tipo: 'Ruta', color: 'Azul', talla: 'L' },
  },
  {
    id: 'OT-2024-004',
    estado: 'esperando_repuestos',
    descripcion: 'Cambio de cubiertas y cámara de aire.',
    fecha_ingreso: '2024-11-11T11:45:00.000Z',
    fecha_estimada: '2024-11-20T18:00:00.000Z',
    cliente: { nombre: 'Ana', apellido: 'Martínez', telefono: '+56 9 3333 7777' },
    bicicleta: { marca: 'Cannondale', modelo: 'Trail 5', tipo: 'MTB', color: 'Verde', talla: 'M' },
  },
  {
    id: 'OT-2024-005',
    estado: 'lista_para_entrega',
    descripcion: 'Ajuste de suspensión y lubricación de cadena.',
    fecha_ingreso: '2024-11-05T14:00:00.000Z',
    fecha_estimada: '2024-11-12T18:00:00.000Z',
    cliente: { nombre: 'Pedro', apellido: 'Soto', telefono: '+56 9 2222 8888' },
    bicicleta: { marca: 'Scott', modelo: 'Aspect 940', tipo: 'MTB', color: 'Gris', talla: 'XL' },
  },
  {
    id: 'OT-2024-006',
    estado: 'entregada',
    descripcion: 'Revisión general y cambio de pastillas de freno.',
    fecha_ingreso: '2024-11-01T09:00:00.000Z',
    fecha_estimada: '2024-11-05T18:00:00.000Z',
    cliente: { nombre: 'Laura', apellido: 'Rojas', telefono: '+56 9 4444 6666' },
    bicicleta: { marca: 'Merida', modelo: 'Scultura 400', tipo: 'Ruta', color: 'Blanco', talla: 'S' },
  },
];

const MOCK_COMENTARIOS: Record<string, any[]> = {
  'OT-2024-001': [
    { id: 'c1', autor: 'Técnico Diego', creadoEn: '2024-11-10T10:00:00.000Z', texto: 'Cliente deja la bici para el fin de semana.' },
    { id: 'c2', autor: 'Técnico Diego', creadoEn: '2024-11-11T09:00:00.000Z', texto: 'Piezas revisadas, todo en orden.' },
  ],
  'OT-2024-002': [
    { id: 'c3', autor: 'Mecánico Ana', creadoEn: '2024-11-12T11:00:00.000Z', texto: 'Revisando pedalier, posible rodamiento dañado.' },
  ],
  'OT-2024-003': [
    { id: 'c4', autor: 'Técnico Diego', creadoEn: '2024-11-08T09:00:00.000Z', texto: 'Ingreso confirmado, cliente avisado.' },
    { id: 'c5', autor: 'Mecánico Ana', creadoEn: '2024-11-09T10:30:00.000Z', texto: 'Cables cambiados, probando cambios.' },
    { id: 'c6', autor: 'Técnico Diego', creadoEn: '2024-11-10T08:00:00.000Z', texto: 'Todo listo para entrega.' },
  ],
  'OT-2024-004': [
    { id: 'c7', autor: 'Mecánico Ana', creadoEn: '2024-11-11T12:00:00.000Z', texto: 'Esperando llegada de cubiertas Schwalbe.' },
  ],
  'OT-2024-005': [
    { id: 'c8', autor: 'Técnico Diego', creadoEn: '2024-11-05T15:00:00.000Z', texto: 'Suspensión ajustada, cadena lubricada.' },
  ],
  'OT-2024-006': [
    { id: 'c9', autor: 'Mecánico Ana', creadoEn: '2024-11-01T10:00:00.000Z', texto: 'Entregada al cliente, pagado en efectivo.' },
  ],
};

const MOCK_MULTIMEDIA: Record<string, any[]> = {
  'OT-2024-001': [
    { id: 'm1', url: 'https://picsum.photos/seed/bike001/400/400' },
    { id: 'm2', url: 'https://picsum.photos/seed/bike002/400/400' },
  ],
  'OT-2024-002': [
    { id: 'm3', url: 'https://picsum.photos/seed/bike003/400/400' },
  ],
  'OT-2024-003': [
    { id: 'm4', url: 'https://picsum.photos/seed/bike004/400/400' },
    { id: 'm5', url: 'https://picsum.photos/seed/bike005/400/400' },
    { id: 'm6', url: 'https://picsum.photos/seed/bike006/400/400' },
  ],
  'OT-2024-005': [
    { id: 'm7', url: 'https://picsum.photos/seed/bike007/400/400' },
  ],
};

const MOCK_PRODUCTOS: Record<string, any[]> = {
  'OT-2024-001': [
    { id: 'po1', productoId: 'p1', nombre: 'Pastillas de freno Shimano B01S', sku: 'SH-B01S', cantidad: 2, precioVenta: 12990 },
    { id: 'po2', productoId: 'p2', nombre: 'Cable de cambio Shimano', sku: 'SH-CAB-CAM', cantidad: 1, precioVenta: 4990 },
  ],
  'OT-2024-003': [
    { id: 'po3', productoId: 'p3', nombre: 'Cadena Shimano CN-HG53', sku: 'SH-CN53', cantidad: 1, precioVenta: 24990 },
    { id: 'po4', productoId: 'p4', nombre: 'Grasa Park Tool PPL-1', sku: 'PT-PPL1', cantidad: 1, precioVenta: 8990 },
  ],
  'OT-2024-004': [
    { id: 'po5', productoId: 'p5', nombre: 'Cubierta Schwalbe Smart Sam 29x2.10', sku: 'SW-SM29', cantidad: 2, precioVenta: 39990 },
  ],
};

export async function mockGetOrdenes() {
  await delay(400);
  return [...MOCK_ORDENES];
}

export async function mockGetOrden(id: string) {
  await delay(300);
  const orden = MOCK_ORDENES.find((o) => o.id === id);
  if (!orden) throw new Error('Orden no encontrada');
  return { ...orden };
}

export async function mockCambiarEstadoOrden(id: string, estado: string) {
  await delay(300);
  const orden = MOCK_ORDENES.find((o) => o.id === id);
  if (!orden) throw new Error('Orden no encontrada');
  orden.estado = estado;
  return { ...orden };
}

export async function mockGetOrdenesEstados() {
  await delay(300);
  const estados = { recibida: 0, en_proceso: 0, lista_para_entrega: 0, entregada: 0 };
  for (const o of MOCK_ORDENES) {
    if (o.estado === 'recibida') estados.recibida++;
    else if (['en_diagnostico', 'esperando_repuestos', 'en_reparacion', 'control_calidad'].includes(o.estado)) estados.en_proceso++;
    else if (o.estado === 'lista_para_entrega') estados.lista_para_entrega++;
    else if (o.estado === 'entregada') estados.entregada++;
  }
  return estados;
}

export async function mockGetComentarios(id: string) {
  await delay(250);
  return [...(MOCK_COMENTARIOS[id] ?? [])];
}

export async function mockPostComentario(id: string, texto: string) {
  await delay(400);
  const nuevo = {
    id: `c${nextComentarioId++}`,
    autor: 'Técnico Diego',
    creadoEn: new Date().toISOString(),
    texto,
  };
  if (!MOCK_COMENTARIOS[id]) MOCK_COMENTARIOS[id] = [];
  MOCK_COMENTARIOS[id].push(nuevo);
  return nuevo;
}

export async function mockGetMultimedia(id: string) {
  await delay(250);
  return [...(MOCK_MULTIMEDIA[id] ?? [])];
}

export async function mockPostMultimedia(_id: string, uri: string, _mimeType: string = 'image/jpeg') {
  await delay(600);
  const nuevo = {
    id: `m${nextMultimediaId++}`,
    url: uri,
  };
  if (!MOCK_MULTIMEDIA[_id]) MOCK_MULTIMEDIA[_id] = [];
  MOCK_MULTIMEDIA[_id].push(nuevo);
  return nuevo;
}

export async function mockDeleteMultimedia(id: string, mediaId: string) {
  await delay(300);
  if (!MOCK_MULTIMEDIA[id]) throw new Error('Multimedia no encontrada');
  const idx = MOCK_MULTIMEDIA[id].findIndex((m) => m.id === mediaId);
  if (idx === -1) throw new Error('Multimedia no encontrada');
  MOCK_MULTIMEDIA[id].splice(idx, 1);
  return { ok: true };
}

export async function mockGetProductosOrden(id: string) {
  await delay(250);
  return [...(MOCK_PRODUCTOS[id] ?? [])];
}

export async function mockPostProductoOrden(id: string, productoId: string, cantidad: number = 1) {
  await delay(400);
  const catalogoMock: Record<string, any> = {
    p1: { nombre: 'Pastillas de freno Shimano B01S', sku: 'SH-B01S', precioVenta: 12990 },
    p2: { nombre: 'Cable de cambio Shimano', sku: 'SH-CAB-CAM', precioVenta: 4990 },
    p3: { nombre: 'Cadena Shimano CN-HG53', sku: 'SH-CN53', precioVenta: 24990 },
    p4: { nombre: 'Grasa Park Tool PPL-1', sku: 'PT-PPL1', precioVenta: 8990 },
    p5: { nombre: 'Cubierta Schwalbe Smart Sam 29x2.10', sku: 'SW-SM29', precioVenta: 39990 },
    p6: { nombre: 'Pedales Shimano PD-M520', sku: 'SH-PD520', precioVenta: 59990 },
    p7: { nombre: 'Manillar Ritchey Comp', sku: 'RT-COMP', precioVenta: 34990 },
  };
  const prod = catalogoMock[productoId];
  if (!prod) throw new Error('Producto no encontrado');

  if (!MOCK_PRODUCTOS[id]) MOCK_PRODUCTOS[id] = [];
  const existente = MOCK_PRODUCTOS[id].find((p) => p.productoId === productoId);
  if (existente) {
    existente.cantidad += cantidad;
    return existente;
  }

  const nuevo = {
    id: `po${nextProductoOrdenId++}`,
    productoId,
    nombre: prod.nombre,
    sku: prod.sku,
    cantidad,
    precioVenta: prod.precioVenta,
  };
  MOCK_PRODUCTOS[id].push(nuevo);
  return nuevo;
}

export async function mockDeleteProductoOrden(id: string, productoId: string) {
  await delay(300);
  if (!MOCK_PRODUCTOS[id]) throw new Error('Producto no encontrado');
  const idx = MOCK_PRODUCTOS[id].findIndex((p) => p.productoId === productoId);
  if (idx === -1) throw new Error('Producto no encontrado');
  MOCK_PRODUCTOS[id].splice(idx, 1);
  return { ok: true };
}
