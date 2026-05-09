import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/components/AuthProvider';
import { Badge } from '@/components/ui/Badge';

const overviewCards = [
  { label: 'Órdenes en Proceso', value: '12', tone: '#0A7EA4' },
  { label: 'Prioridad Alta', value: '4', tone: '#E86A13' },
  { label: 'Última actividad', value: 'Revisión transmisión', tone: '#2C9A63' },
];

const task = {
  client: 'María Sánchez',
  bike: 'Trek Domane SL',
  schedule: '11:30 AM',
  orderId: 'OT-2024-001',
  membership: 'GOLD' as const,
};

export default function DashboardScreen() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <ThemedView style={styles.page}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <ThemedText type="title">Bienvenido, {user?.name ?? 'técnico'}</ThemedText>
          <ThemedText style={styles.description}>Resumen rápido de órdenes y datos de rendimiento.</ThemedText>
        </View>

        <View style={styles.grid}>
          {overviewCards.map((card) => (
            <View key={card.label} style={[styles.metricCard, { borderColor: card.tone }]}> 
              <ThemedText type="subtitle" style={{ color: card.tone }}>{card.label}</ThemedText>
              <ThemedText style={styles.metricValue}>{card.value}</ThemedText>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle">Retomar última reparación</ThemedText>
          </View>
          <View style={styles.taskCard}>
            <Badge membership={task.membership} />
            <ThemedText type="subtitle" style={styles.taskTitle}>{task.orderId}</ThemedText>
            <ThemedText style={styles.taskMeta}>{task.client} • {task.bike}</ThemedText>
            <ThemedText style={styles.taskMeta}>Cita {task.schedule}</ThemedText>
            <Pressable style={styles.quickButton} onPress={() => router.push('/ordenes/OT-2024-001')}>
              <ThemedText type="defaultSemiBold" style={styles.quickButtonText}>Retomar Reparación</ThemedText>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#F8FBFF',
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
  },
  description: {
    marginTop: 6,
    color: '#4A4A4A',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    justifyContent: 'space-between',
  },
  metricCard: {
    width: '48%',
    borderWidth: 1,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    padding: 18,
    shadowColor: '#00000010',
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },
  metricValue: {
    marginTop: 10,
    fontSize: 28,
    fontWeight: '800',
    color: '#11181C',
  },
  section: {
    marginTop: 26,
  },
  sectionHeader: {
    marginBottom: 14,
  },
  taskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    gap: 12,
    shadowColor: '#00000012',
    shadowOpacity: 0.06,
    shadowRadius: 15,
    elevation: 2,
  },
  taskTitle: {
    marginTop: 6,
  },
  taskMeta: {
    color: '#5B6069',
  },
  quickButton: {
    marginTop: 18,
    backgroundColor: '#0A7EA4',
    borderRadius: 14,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});
