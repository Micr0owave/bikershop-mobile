import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator, Alert, FlatList, Image, Modal,
  Pressable, ScrollView, StyleSheet, TextInput, View,
} from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import {
  getOrden, cambiarEstadoOrden,
  getComentarios, postComentario,
  getMultimedia, postMultimedia, deleteMultimedia,
  getProductosOrden, postProductoOrden, deleteProductoOrden,
} from '@/services/ordenes';
import { searchProductos } from '@/services/productos';

const VS = {
  bg:      '#e9e9ec',
  card:    '#ffffff',
  ink:     '#0f1114',
  line:    '#eae2d6',
  chip:    '#f4efe7',
  muted:   '#8a7f70',
  warn:    '#c85a2a', warnBg:   '#fbeadd',
  good:    '#2f7d4f', goodBg:   '#e4f1e8',
  info:    '#3a6ea5', infoBg:   '#e4eaf2',
  violet:  '#6b5bd1', violetBg: '#ebe7fa',
};

const ESTADO_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  recibida:            { label: 'Recibida',          bg: VS.violetBg, text: VS.violet  },
  en_diagnostico:      { label: 'En diagnóstico',    bg: VS.warnBg,   text: VS.warn    },
  esperando_repuestos: { label: 'Esp. repuestos',    bg: VS.warnBg,   text: VS.warn    },
  en_reparacion:       { label: 'En reparación',     bg: VS.warnBg,   text: VS.warn    },
  control_calidad:     { label: 'Control calidad',   bg: VS.warnBg,   text: VS.warn    },
  lista_para_entrega:  { label: 'Lista p/ entrega',  bg: VS.infoBg,   text: VS.info    },
  entregada:           { label: 'Entregada',          bg: VS.goodBg,   text: VS.good    },
  cancelada:           { label: 'Cancelada',          bg: '#f9e0f0',   text: '#a0316e'  },
};

const ESTADOS_ORDER = [
  'recibida', 'en_diagnostico', 'esperando_repuestos',
  'en_reparacion', 'control_calidad', 'lista_para_entrega',
  'entregada', 'cancelada',
];

export default function OrdenDetalleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ title: `Orden ${id}` });
  }, [id, navigation]);

  const [orden, setOrden]               = useState<any>(null);
  const [loading, setLoading]           = useState(true);
  const [comentarios, setComentarios]   = useState<any[]>([]);
  const [multimedia, setMultimedia]     = useState<any[]>([]);
  const [productos, setProductos]       = useState<any[]>([]);

  const [newComentario, setNewComentario]       = useState('');
  const [savingComentario, setSavingComentario] = useState(false);
  const [uploadingFoto, setUploadingFoto]       = useState(false);
  const [changingEstado, setChangingEstado]     = useState(false);

  const [selectedFoto, setSelectedFoto]           = useState<string | null>(null);
  const [showProductoModal, setShowProductoModal] = useState(false);
  const [productoSearch, setProductoSearch]       = useState('');
  const [catalogo, setCatalogo]                   = useState<any[]>([]);
  const [buscando, setBuscando]                   = useState(false);
  const [addingProducto, setAddingProducto]       = useState(false);

  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      try {
        const [ordRes, comentsRes, mediaRes, prodsRes] = await Promise.allSettled([
          getOrden(id),
          getComentarios(id),
          getMultimedia(id),
          getProductosOrden(id),
        ]);
        if (ordRes.status === 'fulfilled') setOrden(ordRes.value);
        if (comentsRes.status === 'fulfilled') setComentarios(comentsRes.value);
        if (mediaRes.status === 'fulfilled') setMultimedia(mediaRes.value);
        if (prodsRes.status === 'fulfilled') setProductos(prodsRes.value);
        if (ordRes.status === 'rejected') Alert.alert('Error', 'No se pudo cargar la orden.');
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, [id]);

  async function handleCambiarEstado(nuevoEstado: string) {
    const cfg = ESTADO_CONFIG[nuevoEstado];
    Alert.alert(
      'Cambiar estado',
      `¿Cambiar a "${cfg.label}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            setChangingEstado(true);
            try {
              await cambiarEstadoOrden(id, nuevoEstado);
              setOrden((prev: any) => ({ ...prev, estado: nuevoEstado }));
            } catch {
              Alert.alert('Error', 'No se pudo cambiar el estado.');
            } finally {
              setChangingEstado(false);
            }
          },
        },
      ],
    );
  }

  async function handleAgregarComentario() {
    if (!newComentario.trim()) return;
    setSavingComentario(true);
    try {
      await postComentario(id, newComentario.trim());
      setNewComentario('');
      setComentarios(await getComentarios(id));
    } catch {
      Alert.alert('Error', 'No se pudo agregar el comentario.');
    } finally {
      setSavingComentario(false);
    }
  }

  async function handleSubirFoto() {
    if (multimedia.length >= 10) {
      Alert.alert('Límite alcanzado', 'Máximo 10 fotos por orden.');
      return;
    }
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm.status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a la galería.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    setUploadingFoto(true);
    try {
      await postMultimedia(id, asset.uri, asset.mimeType ?? 'image/jpeg');
      setMultimedia(await getMultimedia(id));
    } catch {
      Alert.alert('Error', 'No se pudo subir la foto.');
    } finally {
      setUploadingFoto(false);
    }
  }

  async function handleEliminarFoto(mediaId: string) {
    Alert.alert('Eliminar foto', '¿Eliminar esta foto?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar', style: 'destructive',
        onPress: async () => {
          try {
            await deleteMultimedia(id, mediaId);
            setMultimedia((prev) => prev.filter((m) => m.id !== mediaId));
          } catch {
            Alert.alert('Error', 'No se pudo eliminar la foto.');
          }
        },
      },
    ]);
  }

  async function handleBuscarProductos(q: string) {
    setProductoSearch(q);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (q.length < 2) { setCatalogo([]); return; }
    searchTimeout.current = setTimeout(async () => {
      setBuscando(true);
      try {
        setCatalogo(await searchProductos(q));
      } catch {
        setCatalogo([]);
      } finally {
        setBuscando(false);
      }
    }, 300);
  }

  async function handleAgregarProducto(producto: any) {
    if (addingProducto) return;
    setAddingProducto(true);
    try {
      await postProductoOrden(id, producto.id, 1);
      setProductos(await getProductosOrden(id));
      setShowProductoModal(false);
      setProductoSearch('');
      setCatalogo([]);
    } catch {
      Alert.alert('Error', 'No se pudo agregar el producto.');
    } finally {
      setAddingProducto(false);
    }
  }

  async function handleEliminarProducto(productoId: string) {
    Alert.alert('Quitar producto', '¿Quitar este producto de la orden?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Quitar', style: 'destructive',
        onPress: async () => {
          try {
            await deleteProductoOrden(id, productoId);
            setProductos((prev) => prev.filter((p) => p.productoId !== productoId));
          } catch {
            Alert.alert('Error', 'No se pudo quitar el producto.');
          }
        },
      },
    ]);
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={VS.info} />
      </View>
    );
  }

  if (!orden) {
    return (
      <View style={styles.centered}>
        <ThemedText style={{ color: VS.muted }}>No se pudo cargar la orden.</ThemedText>
      </View>
    );
  }

  const estadoCfg = ESTADO_CONFIG[orden.estado] ?? { label: orden.estado, bg: VS.chip, text: VS.muted };
  const fechaEstimada = orden.fecha_estimada ? new Date(orden.fecha_estimada) : null;
  const vencida = fechaEstimada && fechaEstimada < new Date();

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

      {/* ── 1. Info ── */}
      <View style={styles.section}>
        <View style={styles.infoHeader}>
          <ThemedText style={styles.otNum}>{orden.id}</ThemedText>
          <View style={[styles.estadoPill, { backgroundColor: estadoCfg.bg }]}>
            <ThemedText style={[styles.estadoPillText, { color: estadoCfg.text }]}>
              {estadoCfg.label}
            </ThemedText>
          </View>
        </View>

        <ThemedText style={styles.fieldLabel}>BICICLETA</ThemedText>
        <ThemedText style={styles.fieldValue}>
          {orden.bicicleta.marca} {orden.bicicleta.modelo}
        </ThemedText>
        <ThemedText style={styles.fieldSub}>
          {orden.bicicleta.tipo} · {orden.bicicleta.color} · Talla {orden.bicicleta.talla}
        </ThemedText>

        <ThemedText style={[styles.fieldLabel, { marginTop: 12 }]}>CLIENTE</ThemedText>
        <ThemedText style={styles.fieldValue}>
          {orden.cliente.nombre} {orden.cliente.apellido}
        </ThemedText>
        <ThemedText style={styles.fieldSub}>{orden.cliente.telefono}</ThemedText>

        <View style={styles.fechasRow}>
          <ThemedText style={styles.fechaText}>
            Ingreso: {new Date(orden.fecha_ingreso).toLocaleDateString('es-CL')}
          </ThemedText>
          <ThemedText style={[styles.fechaText, vencida && { color: VS.warn }]}>
            Entrega: {fechaEstimada?.toLocaleDateString('es-CL') ?? '-'}{vencida ? ' ⚠' : ''}
          </ThemedText>
        </View>

        {orden.descripcion ? (
          <View style={styles.descripcionBox}>
            <ThemedText style={styles.descripcionText}>{orden.descripcion}</ThemedText>
          </View>
        ) : null}
      </View>

      {/* ── 2. Cambiar estado ── */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>CAMBIAR ESTADO</ThemedText>
        {changingEstado ? (
          <ActivityIndicator color={VS.info} />
        ) : (
          <View style={styles.estadosWrap}>
            {ESTADOS_ORDER.map((e) => {
              const cfg = ESTADO_CONFIG[e];
              const isActive = orden.estado === e;
              return (
                <Pressable
                  key={e}
                  onPress={() => !isActive && handleCambiarEstado(e)}
                  style={[
                    styles.estadoChip,
                    isActive
                      ? { backgroundColor: cfg.bg, borderColor: cfg.text }
                      : { backgroundColor: VS.card, borderColor: VS.line },
                  ]}>
                  <ThemedText style={[
                    styles.estadoChipText,
                    { color: isActive ? cfg.text : VS.muted },
                    isActive && { fontWeight: '700' },
                  ]}>
                    {isActive ? '● ' : ''}{cfg.label}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        )}
      </View>

      {/* ── 3. Comentarios ── */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>COMENTARIOS ({comentarios.length})</ThemedText>
        {comentarios.map((c) => (
          <View key={c.id} style={styles.comentarioCard}>
            <ThemedText style={styles.comentarioMeta}>
              {c.autor} · {new Date(c.creadoEn).toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' })}
            </ThemedText>
            <ThemedText style={styles.comentarioTexto}>{c.texto}</ThemedText>
          </View>
        ))}
        <View style={styles.comentarioInputRow}>
          <TextInput
            style={styles.comentarioInput}
            placeholder="Agregar comentario..."
            placeholderTextColor={VS.muted}
            value={newComentario}
            onChangeText={setNewComentario}
            multiline
          />
          <Pressable
            onPress={handleAgregarComentario}
            disabled={savingComentario || !newComentario.trim()}
            style={[styles.sendBtn, !newComentario.trim() && { opacity: 0.4 }]}>
            {savingComentario
              ? <ActivityIndicator size="small" color="#fff" />
              : <Ionicons name="send" size={16} color="#fff" />}
          </Pressable>
        </View>
      </View>

      {/* ── 4. Fotos ── */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>FOTOS ({multimedia.length}/10)</ThemedText>
          {multimedia.length < 10 && (
            <Pressable onPress={handleSubirFoto} style={styles.addBtn} disabled={uploadingFoto}>
              {uploadingFoto
                ? <ActivityIndicator size="small" color="#fff" />
                : <ThemedText style={styles.addBtnText}>+ Foto</ThemedText>}
            </Pressable>
          )}
        </View>
        <View style={styles.fotosGrid}>
          {multimedia.map((m) => (
            <Pressable
              key={m.id}
              onPress={() => setSelectedFoto(m.url)}
              onLongPress={() => handleEliminarFoto(m.id)}
              style={styles.fotoWrap}>
              <Image source={{ uri: m.url }} style={styles.fotoImg} />
            </Pressable>
          ))}
        </View>
        {multimedia.length > 0 && (
          <ThemedText style={styles.hintText}>Mantén presionada una foto para eliminarla</ThemedText>
        )}
      </View>

      {/* ── 5. Productos ── */}
      <View style={[styles.section, { marginBottom: 40 }]}>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>PRODUCTOS ({productos.length})</ThemedText>
          <Pressable onPress={() => setShowProductoModal(true)} style={styles.addBtn}>
            <ThemedText style={styles.addBtnText}>+ Buscar</ThemedText>
          </Pressable>
        </View>
        {productos.map((p) => (
          <View key={p.id ?? p.productoId} style={styles.productoRow}>
            <View style={{ flex: 1 }}>
              <ThemedText style={styles.productoNombre}>{p.nombre}</ThemedText>
              <ThemedText style={styles.productoMeta}>
                {p.sku} · x{p.cantidad} · ${p.precioVenta?.toLocaleString('es-CL')}
              </ThemedText>
            </View>
            <Pressable onPress={() => handleEliminarProducto(p.productoId)}>
              <Ionicons name="close-circle" size={20} color={VS.warn} />
            </Pressable>
          </View>
        ))}
      </View>

      {/* ── Modal: ver foto ── */}
      <Modal visible={!!selectedFoto} transparent animationType="fade" onRequestClose={() => setSelectedFoto(null)}>
        <Pressable style={styles.fotoModalBg} onPress={() => setSelectedFoto(null)}>
          {selectedFoto && (
            <Image source={{ uri: selectedFoto }} style={styles.fotoModalImg} resizeMode="contain" />
          )}
        </Pressable>
      </Modal>

      {/* ── Modal: buscar productos ── */}
      <Modal visible={showProductoModal} animationType="slide" onRequestClose={() => { setShowProductoModal(false); setProductoSearch(''); setCatalogo([]); }}>
        <View style={styles.modalPage}>
          <View style={styles.modalHeader}>
            <ThemedText style={styles.modalTitle}>Buscar producto</ThemedText>
            <Pressable onPress={() => { setShowProductoModal(false); setProductoSearch(''); setCatalogo([]); }}>
              <Ionicons name="close" size={22} color={VS.ink} />
            </Pressable>
          </View>
          <View style={[styles.searchBox, { margin: 16 }]}>
            <Ionicons name="search-outline" size={16} color={VS.muted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Nombre, SKU o marca..."
              placeholderTextColor={VS.muted}
              value={productoSearch}
              onChangeText={handleBuscarProductos}
              autoFocus
            />
          </View>
          {buscando && <ActivityIndicator color={VS.info} />}
          <FlatList
            data={catalogo}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
            renderItem={({ item }) => (
              <Pressable style={styles.catalogoRow} onPress={() => handleAgregarProducto(item)}>
                <View style={{ flex: 1 }}>
                  <ThemedText style={styles.productoNombre}>{item.nombre}</ThemedText>
                  <ThemedText style={styles.productoMeta}>
                    {item.sku} · Stock: {item.stock} · ${item.precioVenta?.toLocaleString('es-CL')}
                  </ThemedText>
                </View>
                <Ionicons name="add-circle-outline" size={22} color={VS.violet} />
              </Pressable>
            )}
          />
        </View>
      </Modal>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: VS.bg },
  content: { paddingTop: 8 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  section: {
    backgroundColor: VS.card, marginHorizontal: 12, marginBottom: 8,
    borderRadius: 14, padding: 14, borderWidth: 1, borderColor: VS.line,
  },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 10, fontWeight: '700', color: VS.muted, letterSpacing: 0.6, textTransform: 'uppercase' },
  infoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  otNum: { fontSize: 16, fontWeight: '700', color: VS.ink },
  estadoPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  estadoPillText: { fontSize: 11, fontWeight: '700' },
  fieldLabel: { fontSize: 9, fontWeight: '600', color: VS.muted, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 2 },
  fieldValue: { fontSize: 14, fontWeight: '600', color: VS.ink },
  fieldSub: { fontSize: 12, color: VS.muted, marginBottom: 2 },
  fechasRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  fechaText: { fontSize: 11, color: VS.muted },
  descripcionBox: { marginTop: 10, backgroundColor: VS.chip, borderRadius: 8, padding: 10 },
  descripcionText: { fontSize: 13, color: VS.ink },
  estadosWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  estadoChip: { paddingVertical: 5, paddingHorizontal: 10, borderRadius: 8, borderWidth: 1 },
  estadoChipText: { fontSize: 11 },
  comentarioCard: { backgroundColor: VS.chip, borderRadius: 8, padding: 10, marginBottom: 6 },
  comentarioMeta: { fontSize: 10, color: VS.muted, marginBottom: 3 },
  comentarioTexto: { fontSize: 13, color: VS.ink },
  comentarioInputRow: { flexDirection: 'row', gap: 8, marginTop: 8, alignItems: 'flex-end' },
  comentarioInput: {
    flex: 1, backgroundColor: VS.chip, borderRadius: 10, padding: 10,
    fontSize: 13, color: VS.ink, maxHeight: 100,
  },
  sendBtn: {
    width: 38, height: 38, borderRadius: 10, backgroundColor: VS.violet,
    alignItems: 'center', justifyContent: 'center',
  },
  fotosGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  fotoWrap: { width: '23%', aspectRatio: 1, borderRadius: 8, overflow: 'hidden', backgroundColor: VS.chip },
  fotoImg: { width: '100%', height: '100%' },
  hintText: { fontSize: 10, color: VS.muted, marginTop: 6, textAlign: 'center' },
  addBtn: { backgroundColor: VS.violet, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 8 },
  addBtnText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  productoRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: VS.line,
  },
  productoNombre: { fontSize: 13, fontWeight: '600', color: VS.ink },
  productoMeta: { fontSize: 11, color: VS.muted },
  fotoModalBg: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.9)',
    alignItems: 'center', justifyContent: 'center',
  },
  fotoModalImg: { width: '100%', height: '80%' },
  modalPage: { flex: 1, backgroundColor: VS.card },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 56, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: VS.line,
  },
  modalTitle: { fontSize: 16, fontWeight: '700', color: VS.ink },
  searchBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: VS.chip, borderRadius: 10, paddingHorizontal: 12, height: 44,
  },
  searchInput: { flex: 1, fontSize: 14, color: VS.ink },
  catalogoRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: VS.chip, borderRadius: 10, padding: 12,
  },
});
