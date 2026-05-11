import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { apiGetDashboardAlertas, apiGetDashboardEstados, apiGetDashboardHoy } from '@/lib/api';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/components/AuthProvider';

function formatCurrency(value: string | number) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0));
}

export default function DashboardScreen() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [hoy, setHoy] = useState<null | { ordenesRecibidas: number; ordenesEntregadas: number; ingresosHoy: string }>(null);
  const [estados, setEstados] = useState<Record<string, number>>({});
  const [alertas, setAlertas] = useState<null | { productosStockBajo: { nombre: string }[]; ordenesAtrasadas: { numeroOrden: string }[] }>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const [hoyData, estadosData, alertasData] = await Promise.all([
          apiGetDashboardHoy(token),
          apiGetDashboardEstados(token),
          apiGetDashboardAlertas(token),
        ]);

        if (!isMounted) return;
        setHoy(hoyData);
        setEstados(estadosData);
        setAlertas(alertasData);
      } catch {
        // ignore fetch error for dashboard sections
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadDashboard();
    return () => {
      isMounted = false;
    };
  }, [token]);

  const overviewCards = useMemo(
    () => [
      {
        label: 'Órdenes recibidas hoy',
        value: loading ? '...' : String(hoy?.ordenesRecibidas ?? 0),
        tone: '#0A7EA4',
      },
      {
        label: 'Órdenes entregadas',
        value: loading ? '...' : String(hoy?.ordenesEntregadas ?? 0),
        tone: '#2C9A63',
      },
      {
        label: 'Ingresos hoy',
        value: loading ? '...' : formatCurrency(hoy?.ingresosHoy ?? 0),
        tone: '#0A7EA4',
      },
    ],
    [hoy, loading],
  );

  const alertCount = alertas ? alertas.productosStockBajo.length + alertas.ordenesAtrasadas.length : 0;
  const mostUsedStatus = Object.entries(estados)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 1)[0]?.[0] ?? 'sin datos';

  return (
    <ThemedView style={styles.page}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <ThemedText type="title">Bienvenido, {user?.name ?? 'técnico'}</ThemedText>
          <ThemedText style={styles.description}>Resumen real de órdenes y rendimiento desde tu backend.</ThemedText>
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
            <ThemedText type="subtitle">Estado de órdenes</ThemedText>
          </View>
          <View style={styles.taskCard}>
            <ThemedText style={styles.taskMeta}>Estado más frecuente: {mostUsedStatus}</ThemedText>
            <ThemedText style={styles.taskMeta}>Alertas activas: {loading ? '...' : alertCount}</ThemedText>
            <Pressable style={styles.quickButton} onPress={() => router.push('/ordenes')}>
              <ThemedText type="defaultSemiBold" style={styles.quickButtonText}>Ver órdenes</ThemedText>
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle">Alertas</ThemedText>
          </View>
          <View style={styles.alertCard}>
            <ThemedText style={styles.alertTitle}>Productos con stock bajo</ThemedText>
            <ThemedText style={styles.alertDetail}>{loading ? 'Cargando...' : `${alertas?.productosStockBajo.length ?? 0} productos`}</ThemedText>
            <ThemedText style={styles.alertTitle}>Órdenes atrasadas</ThemedText>
            <ThemedText style={styles.alertDetail}>{loading ? 'Cargando...' : `${alertas?.ordenesAtrasadas.length ?? 0} órdenes`}</ThemedText>
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
  alertCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    shadowColor: '#00000012',
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 2,
  },
  alertTitle: {
    fontWeight: '700',
    marginTop: 10,
  },
  alertDetail: {
    color: '#5B6069',
    marginTop: 4,
  },
});
