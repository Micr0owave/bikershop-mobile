import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Badge } from '@/components/ui/Badge';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const orders = [
  {
    id: 'OT-2024-001',
    client: 'María Sánchez',
    bike: 'Trek Domane SL',
    schedule: '11:30 AM',
    status: 'En Proceso',
  },
  {
    id: 'OT-2024-002',
    client: 'Esteban Ruiz',
    bike: 'Specialized Sirrus',
    schedule: '13:00 PM',
    status: 'Pendiente',
  },
  {
    id: 'OT-2024-003',
    client: 'Ana Pérez',
    bike: 'Giant TCR',
    schedule: '15:00 PM',
    status: 'Completado',
  },
];

const statusMap: Record<string, string> = {
  'En Proceso': '#0A7EA4',
  Pendiente: '#E86A13',
  Completado: '#2C9A63',
};

export default function OrdenesScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'Todas' | 'En Proceso' | 'Pendiente' | 'Completado'>('Todas');

  const filteredOrders = useMemo(
    () =>
      orders.filter((order) => {
        const matchesText = [order.client, order.bike, order.id]
          .join(' ')
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchesStatus = status === 'Todas' || order.status === status;
        return matchesText && matchesStatus;
      }),
    [search, status],
  );

  return (
    <ThemedView style={styles.page}>
      <View style={styles.toolbar}>
        <ThemedText type="title">Órdenes Activas</ThemedText>
        <ThemedText style={styles.description}>Busca y organiza tareas por estado del servicio.</ThemedText>
      </View>

      <TextInput
        placeholder="Buscar por cliente, modelo o OT"
        placeholderTextColor="#A1A1A1"
        value={search}
        onChangeText={setSearch}
        style={styles.searchInput}
      />

      <View style={styles.filters}>
        {(['Todas', 'En Proceso', 'Pendiente', 'Completado'] as const).map((option) => (
          <Pressable
            key={option}
            onPress={() => setStatus(option)}
            style={[styles.filterButton, status === option && styles.filterActive]}>
            <ThemedText style={[styles.filterText, status === option && styles.filterTextActive]}>{option}</ThemedText>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/ordenes/${item.id}`)}
            style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <ThemedText type="subtitle">{item.id}</ThemedText>
              <View style={[styles.statusDot, { backgroundColor: statusMap[item.status] }]} />
            </View>
            <ThemedText style={styles.orderMeta}>{item.client}</ThemedText>
            <ThemedText style={styles.orderMeta}>{item.bike}</ThemedText>
            <ThemedText style={styles.orderMeta}>Cita {item.schedule}</ThemedText>
            <View style={styles.badgeRow}>
              <Badge membership={item.status === 'Completado' ? 'NORMAL' : item.status === 'Pendiente' ? 'SILVER' : 'GOLD'} />
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
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 10,
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
});
