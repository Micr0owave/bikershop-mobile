import { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';

import { apiGetOrders, OrdenResponse } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/components/AuthProvider';

const statusLabels: Record<string, string> = {
  recibida: 'Recibida',
  en_diagnostico: 'En diagnóstico',
  esperando_repuestos: 'Esperando repuestos',
  en_reparacion: 'En reparación',
  control_calidad: 'Control calidad',
  lista_para_entrega: 'Lista para entrega',
  entregada: 'Entregada',
  cancelada: 'Cancelada',
};

const statusMap: Record<string, string> = {
  recibida: '#0A7EA4',
  en_diagnostico: '#E86A13',
  esperando_repuestos: '#E86A13',
  en_reparacion: '#0A7EA4',
  control_calidad: '#2C9A63',
  lista_para_entrega: '#2C9A63',
  entregada: '#2C9A63',
  cancelada: '#B00020',
};

export default function OrdenesScreen() {
  const router = useRouter();
  const { token } = useAuth();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'Todas' | string>('Todas');
  const [orders, setOrders] = useState<OrdenResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadOrders() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await apiGetOrders(token);
        if (isMounted) {
          setOrders(response);
        }
      } catch {
        if (isMounted) {
          setOrders([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadOrders();
    return () => {
      isMounted = false;
    };
  }, [token]);

  const filteredOrders = useMemo(() => {
    const query = search.toLowerCase();
    return orders.filter((order) => {
      const label = [order.numeroOrden, order.tipo, statusLabels[order.estado] ?? order.estado]
        .join(' ')
        .toLowerCase();
      const matchesText = label.includes(query);
      const matchesStatus = status === 'Todas' || order.estado === status;
      return matchesText && matchesStatus;
    });
  }, [orders, search, status]);

  const statusOptions = ['Todas', 'recibida', 'en_diagnostico', 'esperando_repuestos', 'en_reparacion', 'control_calidad', 'lista_para_entrega', 'entregada'];

  return (
    <ThemedView style={styles.page}>
      <View style={styles.toolbar}>
        <ThemedText type="title">Órdenes Activas</ThemedText>
        <ThemedText style={styles.description}>Listado real de órdenes cargadas desde el backend.</ThemedText>
      </View>

      <TextInput
        placeholder="Buscar por OT, tipo o estado"
        placeholderTextColor="#A1A1A1"
        value={search}
        onChangeText={setSearch}
        style={styles.searchInput}
      />

      <View style={styles.filters}>
        {statusOptions.map((option) => (
          <Pressable
            key={option}
            onPress={() => setStatus(option)}
            style={[styles.filterButton, status === option && styles.filterActive]}>
            <ThemedText style={[styles.filterText, status === option && styles.filterTextActive]}>
              {option === 'Todas' ? 'Todas' : statusLabels[option] ?? option}
            </ThemedText>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          loading ? (
            <ThemedText style={styles.emptyText}>Cargando órdenes...</ThemedText>
          ) : (
            <ThemedText style={styles.emptyText}>No hay órdenes disponibles.</ThemedText>
          )
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/ordenes/${item.id}`)}
            style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <ThemedText type="subtitle">{item.numeroOrden}</ThemedText>
              <View style={[styles.statusDot, { backgroundColor: statusMap[item.estado] ?? '#999' }]} />
            </View>
            <ThemedText style={styles.orderMeta}>{statusLabels[item.estado] ?? item.estado}</ThemedText>
            <ThemedText style={styles.orderMeta}>{item.tipo}</ThemedText>
            <ThemedText style={styles.orderMeta}>Ingreso {item.fechaIngreso ? new Date(item.fechaIngreso).toLocaleDateString('es-CL') : 'sin fecha'}</ThemedText>
            <View style={styles.badgeRow}>
              <Badge membership={item.estado === 'entregada' ? 'NORMAL' : item.estado === 'recibida' ? 'GOLD' : 'SILVER'} />
            </View>
          </Pressable>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#F8FBFF',
  },
  toolbar: {
    padding: 20,
  },
  description: {
    marginTop: 6,
    color: '#4A4A4A',
  },
  searchInput: {
    marginHorizontal: 20,
    marginBottom: 12,
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E6E9EE',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#11181C',
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 10,
    gap: 8,
  },
  filterButton: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6E9EE',
  },
  filterActive: {
    backgroundColor: '#0A7EA4',
    borderColor: '#0A7EA4',
  },
  filterText: {
    color: '#11181C',
    fontSize: 13,
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#00000012',
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 999,
  },
  orderMeta: {
    color: '#5B6069',
    marginTop: 3,
  },
  badgeRow: {
    marginTop: 16,
  },
  emptyText: {
    marginTop: 24,
    marginHorizontal: 20,
    color: '#5B6069',
  },
});
