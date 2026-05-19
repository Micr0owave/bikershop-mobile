import { Pressable, ScrollView, StyleSheet, View, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/components/AuthProvider';
import { getDashboardHoy } from '@/services/dashboard';
import { getOrdenesEstados } from '@/services/ordenes';

// ── VeloService Design Tokens ──────────────────────
const VS = {
  bg:       '#e9e9ec',
  card:     '#ffffff',
  ink:      '#0f1114',
  line:     '#eae2d6',
  chip:     '#f4efe7',
  muted:    '#8a7f70',
  warn:     '#c85a2a',
  warnBg:   '#fbeadd',
  good:     '#2f7d4f',
  goodBg:   '#e4f1e8',
  info:     '#3a6ea5',
  infoBg:   '#e4eaf2',
  violet:   '#6b5bd1',
  violetBg: '#ebe7fa',
};

export default function DashboardScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [hoy, setHoy]         = useState<any>(null);
  const [estados, setEstados] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [hoyData, estadosData] = await Promise.all([
          getDashboardHoy(),
          getOrdenesEstados(),
        ]);
        setHoy(hoyData);
        setEstados(estadosData);
      } catch (e) {
        setError('Error al cargar los datos del dashboard.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // ── Cards — cada una navega a /ordenes?grupo=X ──
  // /dashboard/hoy  → ordenesRecibidas, ordenesEntregadas
  // /ordenes/estados → { recibida: n, en_proceso: n, lista_para_entrega: n, entregada: n }
  const overviewCards = [
    {
      label:  'Recibidas',
      value:  estados?.recibida           ?? '-',
      color:  VS.violet,
      bg:     VS.violetBg,
      icon:   'time-outline',
      grupo:  'recibida',
    },
    {
      label:  'En proceso',
      value:  estados?.en_proceso         ?? '-',
      color:  VS.warn,
      bg:     VS.warnBg,
      icon:   'construct-outline',
      grupo:  'en_proceso',
    },
    {
      label:  'Listas',
      value:  estados?.lista_para_entrega ?? '-',
      color:  VS.info,
      bg:     VS.infoBg,
      icon:   'checkmark-done-outline',
      grupo:  'lista_para_entrega',
    },
    {
      label:  'Entregadas',
      value:  estados?.entregada          ?? '-',
      color:  VS.good,
      bg:     VS.goodBg,
      icon:   'checkmark-circle-outline',
      grupo:  'entregada',
    },
  ];

  return (
    <View style={styles.page}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── Greeting band ── */}
        <View style={styles.greetingBand}>
          <View>
            <ThemedText style={styles.greetingHello}>Buenos días</ThemedText>
            <ThemedText style={styles.greetingName}>
              {user?.nombre ?? 'Técnico'} {user?.apellido ?? ''}
            </ThemedText>
            <ThemedText style={styles.greetingMeta}>
              {user?.rol ?? 'Mecánico'}
            </ThemedText>
          </View>
          <View style={styles.notifBtn}>
            <Ionicons name="notifications-outline" size={18} color="rgba(255,255,255,0.7)" />
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={VS.info} style={{ marginVertical: 40 }} />
        ) : error ? (
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        ) : (
          <>
            <ThemedText style={styles.sectionLabel}>Órdenes activas</ThemedText>
            <View style={styles.grid}>
              {overviewCards.map((card) => (
                <Pressable
                  key={card.label}
                  style={styles.metricCard}
                  onPress={() => router.push(`/ordenes?grupo=${card.grupo}`)}>
                  <View style={[styles.metricIconWrap, { backgroundColor: card.bg }]}>
                    <Ionicons name={card.icon as any} size={15} color={card.color} />
                  </View>
                  <ThemedText style={styles.metricLabel}>{card.label}</ThemedText>
                  <ThemedText style={[styles.metricValue, { color: card.color }]}>
                    {card.value}
                  </ThemedText>
                  <Ionicons
                    name="chevron-forward"
                    size={12}
                    color={VS.muted}
                    style={{ alignSelf: 'flex-end', marginTop: 4 }}
                  />
                </Pressable>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: VS.bg,
  },
  content: {
    paddingBottom: 32,
  },

  // ── Greeting ──
  greetingBand: {
    backgroundColor: VS.ink,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    marginBottom: 16,
  },
  greetingHello: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  greetingName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 3,
  },
  greetingMeta: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.45)',
  },
  notifBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Section label ──
  sectionLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: VS.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    paddingHorizontal: 16,
    marginBottom: 10,
  },

  // ── Metrics ──
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: 16,
  },
  metricCard: {
    width: '47.5%',
    backgroundColor: VS.card,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: VS.line,
    gap: 5,
  },
  metricIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 10,
    color: VS.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metricValue: {
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 30,
  },

  errorText: {
    color: VS.warn,
    marginVertical: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
