import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { apiGetOrder, OrdenResponse } from '@/lib/api';
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

export default function OrderDetailScreen() {
  const params = useLocalSearchParams();
  const orderId = String(params.id ?? '');
  const { token } = useAuth();
  const [order, setOrder] = useState<OrdenResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadOrder() {
      if (!token || !orderId) {
        setLoading(false);
        return;
      }

      try {
        const response = await apiGetOrder(token, orderId);
        if (isMounted) {
          setOrder(response);
        }
      } catch {
        if (isMounted) {
          setOrder(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadOrder();
    return () => {
      isMounted = false;
    };
  }, [orderId, token]);

  const formatDate = (value: string | null) =>
    value ? new Date(value).toLocaleString('es-CL', { dateStyle: 'medium', timeStyle: 'short' }) : 'Sin fecha';

  if (loading) {
    return (
      <ThemedView style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0A7EA4" />
      </ThemedView>
    );
  }

  if (!order) {
    return (
      <ThemedView style={styles.page}>
        <View style={styles.header}>
          <ThemedText type="title">Orden no encontrada</ThemedText>
          <ThemedText style={styles.subtitle}>Revisa la conexión con el backend y vuelve a intentarlo.</ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.page}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <ThemedText type="title">Ficha OT</ThemedText>
          <ThemedText style={styles.subtitle}>{order.numeroOrden}</ThemedText>
        </View>

        <View style={styles.card}>
          <ThemedText type="subtitle">Resumen de la orden</ThemedText>
          <ThemedText style={styles.detail}>Estado: {statusLabels[order.estado] ?? order.estado}</ThemedText>
          <ThemedText style={styles.detail}>Tipo: {order.tipo}</ThemedText>
          <ThemedText style={styles.detail}>Diagnóstico: {order.diagnosticoInicial || 'No disponible'}</ThemedText>
          <ThemedText style={styles.detail}>Fecha ingreso: {formatDate(order.fechaIngreso)}</ThemedText>
          <ThemedText style={styles.detail}>Fecha prometida: {formatDate(order.fechaPrometida)}</ThemedText>
        </View>

        <View style={styles.card}>
          <ThemedText type="subtitle">Información técnica</ThemedText>
          <ThemedText style={styles.detail}>ID Bicicleta: {order.bicicletaId}</ThemedText>
          <ThemedText style={styles.detail}>ID Mecánico: {order.mecanicoId}</ThemedText>
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F8FBFF',
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
  },
  subtitle: {
    marginTop: 6,
    color: '#4A4A4A',
  },
  card: {
    marginBottom: 16,
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
    marginTop: 10,
    lineHeight: 22,
  },
});
