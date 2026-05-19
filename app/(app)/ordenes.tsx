import { FlatList, Pressable, StyleSheet, TextInput, View, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useMemo, useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { getOrdenes } from '@/services/ordenes';

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

const STATUS_STYLE: Record<string, { bg: string; text: string; label: string; grupo: string }> = {
  recibida:            { bg: VS.violetBg, text: VS.violet, label: 'Recibida',          grupo: 'recibida'           },
  en_diagnostico:      { bg: VS.warnBg,   text: VS.warn,   label: 'En diagnóstico',    grupo: 'en_proceso'         },
  esperando_repuestos: { bg: VS.warnBg,   text: VS.warn,   label: 'Esp. repuestos',    grupo: 'en_proceso'         },
  en_reparacion:       { bg: VS.warnBg,   text: VS.warn,   label: 'En reparación',     grupo: 'en_proceso'         },
  control_calidad:     { bg: VS.warnBg,   text: VS.warn,   label: 'Control calidad',   grupo: 'en_proceso'         },
  lista_para_entrega:  { bg: VS.infoBg,   text: VS.info,   label: 'Lista p/ entrega',  grupo: 'lista_para_entrega' },
  entregada:           { bg: VS.goodBg,   text: VS.good,   label: 'Entregada',         grupo: 'entregada'          },
  cancelada:           { bg: '#f9e0f0',   text: '#a0316e', label: 'Cancelada',         grupo: 'cancelada'          },
};

const GRUPOS = ['Todas', 'recibida', 'en_proceso', 'lista_para_entrega', 'entregada'];
const GRUPO_LABEL: Record<string, string> = {
  recibida:           'Recibidas',
  en_proceso:         'En proceso',
  lista_para_entrega: 'Listas',
  entregada:          'Entregadas',
};

export default function OrdenesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ grupo?: string }>();

  const [search, setSearch]   = useState('');
  const [grupo, setGrupo]     = useState(params.grupo ?? 'Todas');
  const [orders, setOrders]   = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      setError(null);
      try {
        setOrders(await getOrdenes());
      } catch (e: any) {
        setError(e.message || 'Error al cargar las órdenes.');
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const st = STATUS_STYLE[order.estado];
      const matchesGrupo =
        grupo === 'Todas' || (st ? st.grupo === grupo : order.estado === grupo);
      const searchStr = [
        order.id,
        order.descripcion,
        order.cliente?.nombre,
        order.cliente?.apellido,
        order.bicicleta?.marca,
        order.bicicleta?.modelo,
      ].join(' ').toLowerCase();
      return matchesGrupo && searchStr.includes(search.toLowerCase());
    });
  }, [orders, search, grupo]);

  return (
    <View style={styles.page}>
      <View style={styles.searchWrap}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={16} color={VS.muted} />
          <TextInput
            placeholder="Buscar OT, cliente, bicicleta..."
            placeholderTextColor={VS.muted}
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={16} color={VS.muted} />
            </Pressable>
          )}
        </View>
      </View>

      <View style={styles.filtersRow}>
        {GRUPOS.map((g) => {
          const isActive = grupo === g;
          return (
            <Pressable
              key={g}
              onPress={() => setGrupo(g)}
              style={[
                styles.filterChip,
                isActive && styles.filterChipActive,
              ]}>
              <ThemedText style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                {GRUPO_LABEL[g] ?? g}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={VS.info} style={{ marginVertical: 40 }} />
      ) : error ? (
        <ThemedText style={styles.stateText}>{error}</ThemedText>
      ) : filteredOrders.length === 0 ? (
        <ThemedText style={styles.stateText}>No hay órdenes para mostrar.</ThemedText>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const st = STATUS_STYLE[item.estado] ?? { bg: VS.chip, text: VS.muted, label: item.estado };
            const fechaEstimada = item.fecha_estimada ? new Date(item.fecha_estimada) : null;
            const vencida = fechaEstimada && fechaEstimada < new Date();
            return (
              <Pressable
                onPress={() => router.push(`/ordenes/${item.id}`)}
                style={styles.orderCard}>
                <View style={styles.orderTop}>
                  <ThemedText style={styles.orderNum}>{item.id}</ThemedText>
                  <View style={[styles.statusPill, { backgroundColor: st.bg }]}>
                    <ThemedText style={[styles.statusText, { color: st.text }]}>
                      {st.label}
                    </ThemedText>
                  </View>
                </View>
                <ThemedText style={styles.orderBici}>
                  {item.bicicleta?.marca} {item.bicicleta?.modelo}
                </ThemedText>
                <ThemedText style={styles.orderCliente}>
                  {item.cliente?.nombre} {item.cliente?.apellido}
                </ThemedText>
                {item.descripcion ? (
                  <ThemedText style={styles.orderDesc} numberOfLines={1}>
                    {item.descripcion}
                  </ThemedText>
                ) : null}
                <View style={styles.orderFooter}>
                  <ThemedText style={styles.orderFecha}>
                    Ingreso: {new Date(item.fecha_ingreso).toLocaleDateString('es-CL')}
                  </ThemedText>
                  {fechaEstimada && (
                    <ThemedText style={[styles.orderFecha, vencida && { color: VS.warn }]}>
                      Entrega: {fechaEstimada.toLocaleDateString('es-CL')}{vencida ? ' ⚠' : ''}
                    </ThemedText>
                  )}
                </View>
              </Pressable>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: VS.bg },
  searchWrap: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 10 },
  searchBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: VS.card, borderRadius: 12, borderWidth: 1,
    borderColor: VS.line, paddingHorizontal: 12, height: 44,
  },
  searchInput: { flex: 1, fontSize: 14, color: VS.ink },
  filtersRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 6, marginBottom: 12, flexWrap: 'wrap' },
  filterChip: {
    paddingVertical: 5, paddingHorizontal: 12, borderRadius: 999,
    borderWidth: 1, borderColor: VS.line, backgroundColor: VS.card,
  },
  filterChipActive: { backgroundColor: VS.ink, borderColor: VS.ink },
  filterChipText: { fontSize: 12, color: VS.muted },
  filterChipTextActive: { color: '#ffffff', fontWeight: '600' },
  list: { paddingHorizontal: 16, paddingBottom: 32, gap: 10 },
  orderCard: {
    backgroundColor: VS.card, borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: VS.line, gap: 3,
  },
  orderTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  orderNum: { fontSize: 14, fontWeight: '700', color: VS.ink },
  statusPill: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999 },
  statusText: { fontSize: 11, fontWeight: '700' },
  orderBici: { fontSize: 13, fontWeight: '600', color: VS.ink },
  orderCliente: { fontSize: 12, color: VS.muted },
  orderDesc: { fontSize: 12, color: VS.ink, opacity: 0.7 },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  orderFecha: { fontSize: 11, color: VS.muted },
  stateText: { textAlign: 'center', marginVertical: 40, color: VS.muted, fontSize: 14, paddingHorizontal: 20 },
});
