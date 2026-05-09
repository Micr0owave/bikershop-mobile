import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const historyItems = [
  { id: '1', serial: '53A8-12B7', date: '04/05/2024', service: 'Cambio de transmisión', mechanic: 'Camilo Pizarro', status: 'Completado' },
  { id: '2', serial: '53A8-12B7', date: '02/03/2024', service: 'Alineación frenos', mechanic: 'María López', status: 'Completado' },
  { id: '3', serial: '53A8-12B7', date: '11/01/2024', service: 'Revisión suspensión', mechanic: 'Javier Castro', status: 'Completado' },
];

export default function HojaVidaScreen() {
  const [serial, setSerial] = useState('');

  const filtered = useMemo(
    () =>
      historyItems.filter(
        (item) =>
          serial.length === 0 ||
          item.serial.toLowerCase().includes(serial.toLowerCase()) ||
          item.mechanic.toLowerCase().includes(serial.toLowerCase()),
      ),
    [serial],
  );

  return (
    <ThemedView style={styles.page}>
      <View style={styles.header}>
        <ThemedText type="title">Hoja de Vida</ThemedText>
        <ThemedText style={styles.description}>Historial cronológico de servicios por número de serie.</ThemedText>
      </View>

      <TextInput
        placeholder="Filtrar por número de serie o técnico"
        placeholderTextColor="#A1A1A1"
        value={serial}
        onChangeText={setSerial}
        style={styles.search}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.rowSpace}>
              <ThemedText type="subtitle">{item.date}</ThemedText>
              <ThemedText style={styles.status}>{item.status}</ThemedText>
            </View>
            <ThemedText style={styles.detail}>{item.service}</ThemedText>
            <ThemedText style={styles.detail}>Mecánico asignado: {item.mechanic}</ThemedText>
          </View>
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
  header: {
    padding: 20,
  },
  description: {
    marginTop: 6,
    color: '#4A4A4A',
  },
  search: {
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
  list: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#00000012',
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },
  rowSpace: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  status: {
    color: '#2C9A63',
    fontWeight: '700',
  },
  detail: {
    color: '#5B6069',
    marginTop: 4,
    lineHeight: 22,
  },
});
