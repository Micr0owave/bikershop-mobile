import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/components/AuthProvider';

const metrics = [
  { label: 'Reparadas', value: '342' },
  { label: 'Calidad', value: '99.8%' },
  { label: 'Taller', value: 'Santiago Centro' },
];

export default function PerfilScreen() {
  const { user } = useAuth();

  return (
    <ThemedView style={styles.page}>
      <View style={styles.header}>
        <ThemedText type="title">Perfil Técnico</ThemedText>
        <ThemedText style={styles.description}>Métricas operativas y datos clave del mecánico.</ThemedText>
      </View>

      <View style={styles.profileCard}>
        <ThemedText type="subtitle">{user?.name ?? 'Técnico'}</ThemedText>
        <ThemedText style={styles.profileText}>{user?.specialty}</ThemedText>
        <ThemedText style={styles.profileText}>{user?.branch}</ThemedText>
      </View>

      <View style={styles.metricsGrid}>
        {metrics.map((metric) => (
          <View key={metric.label} style={styles.metricCard}>
            <ThemedText type="subtitle">{metric.label}</ThemedText>
            <ThemedText style={styles.metricValue}>{metric.value}</ThemedText>
          </View>
        ))}
      </View>

      <Pressable style={styles.button}>
        <ThemedText type="defaultSemiBold" style={styles.buttonText}>Actualizar especialidad</ThemedText>
      </Pressable>
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
  profileCard: {
    marginHorizontal: 20,
    borderRadius: 22,
    padding: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#00000012',
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 2,
  },
  profileText: {
    marginTop: 10,
    color: '#5B6069',
  },
  metricsGrid: {
    marginTop: 20,
    paddingHorizontal: 20,
    gap: 14,
  },
  metricCard: {
    borderRadius: 20,
    padding: 18,
    backgroundColor: '#FFFFFF',
    shadowColor: '#00000012',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  metricValue: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: '800',
    color: '#11181C',
  },
  button: {
    marginTop: 24,
    marginHorizontal: 20,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#0A7EA4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});
