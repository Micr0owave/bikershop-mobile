import { useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const statusOptions = ['Recibido', 'En Proceso', 'Pausado', 'Listo para Entrega'] as const;
const inventoryItems = [
  { sku: 'REP-0123', label: 'Cadena 11v', stock: 8 },
  { sku: 'REP-0321', label: 'Pastillas freno disco', stock: 14 },
  { sku: 'REP-0540', label: 'Cable cambio Shimano', stock: 12 },
];

export default function OrderDetailScreen() {
  const params = useLocalSearchParams();
  const orderId = String(params.id ?? 'OT-2024-001');
  const [status, setStatus] = useState<typeof statusOptions[number]>('Recibido');
  const [finalEvidenceUploaded, setFinalEvidenceUploaded] = useState(false);
  const [assigned, setAssigned] = useState<string[]>([]);

  useEffect(() => {
    if (status === 'Listo para Entrega' && !finalEvidenceUploaded) {
      Alert.alert('Requisito pendiente', 'Sube la evidencia técnica final antes de marcar como Listo para Entrega.');
      setStatus('Pausado');
    }
  }, [status, finalEvidenceUploaded]);

  const handleAssign = (sku: string) => {
    if (!assigned.includes(sku)) {
      setAssigned((prev) => [...prev, sku]);
    }
  };

  return (
    <ThemedView style={styles.page}>
      <View style={styles.header}>
        <ThemedText type="title">Ficha OT</ThemedText>
        <ThemedText style={styles.subtitle}>{orderId} • Especialidad suspensión</ThemedText>
      </View>

      <View style={styles.statusBar}>
        {statusOptions.map((option) => (
          <Pressable
            key={option}
            onPress={() => setStatus(option)}
            style={[styles.statusChip, status === option && styles.statusActive]}
          >
            <ThemedText style={[styles.statusText, status === option && styles.statusTextActive]}>{option}</ThemedText>
          </Pressable>
        ))}
      </View>

      <View style={styles.card}>
        <ThemedText type="subtitle">Datos técnicos</ThemedText>
        <ThemedText style={styles.detail}>Cliente: José Morales</ThemedText>
        <ThemedText style={styles.detail}>Bicicleta: Scott Addict</ThemedText>
        <ThemedText style={styles.detail}>N° Serie: 53A8-12B7</ThemedText>
      </View>

      <View style={styles.card}>
        <View style={styles.rowSpace}>
          <ThemedText type="subtitle">Asignar insumos y repuestos</ThemedText>
          <ThemedText style={styles.tag}>{assigned.length} asignados</ThemedText>
        </View>
        <FlatList
          data={inventoryItems}
          keyExtractor={(item) => item.sku}
          renderItem={({ item }) => (
            <View style={styles.inventoryRow}>
              <View>
                <ThemedText>{item.label}</ThemedText>
                <ThemedText style={styles.detail}>SKU {item.sku} • Stock {item.stock}</ThemedText>
              </View>
              <Pressable
                style={styles.assignButton}
                onPress={() => handleAssign(item.sku)}>
                <ThemedText type="defaultSemiBold" style={styles.assignText}>Asignar</ThemedText>
              </Pressable>
            </View>
          )}
        />
      </View>

      <View style={styles.card}>
        <View style={styles.rowSpace}>
          <ThemedText type="subtitle">Evidencia técnica final</ThemedText>
          <Pressable
            style={[styles.assignButton, finalEvidenceUploaded && styles.assignButtonActive]}
            onPress={() => setFinalEvidenceUploaded((prev) => !prev)}>
            <ThemedText type="defaultSemiBold" style={[styles.assignText, finalEvidenceUploaded && styles.assignTextActive]}>
              {finalEvidenceUploaded ? 'Subida' : 'Marcar como subida'}
            </ThemedText>
          </Pressable>
        </View>
        <ThemedText style={styles.detail}>
          {finalEvidenceUploaded ? 'Evidencia técnica final disponible.' : 'Necesitas subir evidencia para cambiar a Listo para Entrega.'}
        </ThemedText>
      </View>
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
  subtitle: {
    marginTop: 6,
    color: '#4A4A4A',
  },
  statusBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 10,
  },
  statusChip: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6E9EE',
  },
  statusActive: {
    backgroundColor: '#0A7EA4',
  },
  statusText: {
    color: '#11181C',
  },
  statusTextActive: {
    color: '#FFFFFF',
  },
  card: {
    marginHorizontal: 20,
    marginTop: 16,
    padding: 18,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    shadowColor: '#00000012',
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 2,
  },
  detail: {
    color: '#5B6069',
    marginTop: 8,
    lineHeight: 22,
  },
  rowSpace: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  inventoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#EFF3F7',
  },
  assignButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#F1F7FB',
  },
  assignButtonActive: {
    backgroundColor: '#0A7EA4',
  },
  assignText: {
    color: '#0A7EA4',
  },
  assignTextActive: {
    color: '#FFFFFF',
  },
  tag: {
    color: '#0A7EA4',
    fontSize: 13,
    fontWeight: '700',
  },
});
