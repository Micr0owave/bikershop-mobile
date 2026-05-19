import { StyleSheet, View, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/components/AuthProvider';

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

const metrics = [
  { label: 'Órdenes completadas', value: '342',          icon: 'checkmark-circle-outline', color: VS.good,   bg: VS.goodBg   },
  { label: 'Tasa de calidad',      value: '99.8%',        icon: 'ribbon-outline',           color: VS.violet, bg: VS.violetBg },
  { label: 'Tiempo promedio / OT', value: '2.4 hrs',      icon: 'time-outline',             color: VS.info,   bg: VS.infoBg   },
  { label: 'Activas hoy',          value: '4',            icon: 'flash-outline',            color: VS.warn,   bg: VS.warnBg   },
];

const recentActivity = [
  { id: 'OT-2026-001', client: 'Matías Díaz',    bike: 'Trek Domane SL',      estado: 'EN_PROCESO', time: 'Hace 23 min' },
  { id: 'OT-2026-002', client: 'Carla Soto',     bike: 'Specialized Allez',   estado: 'RECIBIDA',   time: 'Hace 1 hr'   },
  { id: 'OT-2025-098', client: 'Jorge Fuentes',  bike: 'Giant Contend AR',    estado: 'ENTREGADA',  time: 'Ayer 17:30'  },
];

const ESTADO_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  EN_PROCESO: { bg: VS.infoBg,  text: VS.info,  label: 'En proceso' },
  RECIBIDA:   { bg: VS.warnBg,  text: VS.warn,  label: 'Recibida'   },
  ENTREGADA:  { bg: VS.goodBg,  text: VS.good,  label: 'Entregada'  },
};

export default function PerfilScreen() {
  const { user } = useAuth();

  const initials = [user?.nombre?.[0], user?.apellido?.[0]]
    .filter(Boolean).join('').toUpperCase() || 'US';

  return (
    <View style={styles.page}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── Header band ── */}
        <View style={styles.headerBand}>
          <View style={styles.avatarWrap}>
            <ThemedText style={styles.avatarText}>{initials}</ThemedText>
          </View>
          <ThemedText style={styles.userName}>
            {user?.nombre ?? 'Técnico'} {user?.apellido ?? ''}
          </ThemedText>
          <View style={styles.rolePill}>
            <ThemedText style={styles.roleText}>{user?.rol ?? 'Mecánico'}</ThemedText>
          </View>
          <ThemedText style={styles.branchText}>
            <Ionicons name="location-outline" size={11} /> {user?.branch ?? 'Sucursal Centro'}
          </ThemedText>
        </View>

        {/* ── Info card ── */}
        <ThemedText style={styles.sectionLabel}>Información</ThemedText>
        <View style={styles.card}>
          <InfoRow icon="mail-outline"   label="Correo"   value={user?.email    ?? 'oscar@veloservice.cl'} />
          <InfoRow icon="card-outline"   label="RUT"      value={user?.rut      ?? '12.345.678-9'} last={false} />
          <InfoRow icon="bicycle-outline" label="Especialidad" value={user?.specialty ?? 'Mecánica general'} last />
        </View>

        {/* ── Métricas ── */}
        <ThemedText style={styles.sectionLabel}>Métricas operativas</ThemedText>
        <View style={styles.metricsGrid}>
          {metrics.map((m) => (
            <View key={m.label} style={styles.metricCard}>
              <View style={[styles.metricIconWrap, { backgroundColor: m.bg }]}>
                <Ionicons name={m.icon as any} size={16} color={m.color} />
              </View>
              <ThemedText style={styles.metricLabel}>{m.label}</ThemedText>
              <ThemedText style={[styles.metricValue, { color: m.color }]}>{m.value}</ThemedText>
            </View>
          ))}
        </View>

        {/* ── Actividad reciente ── */}
        <ThemedText style={styles.sectionLabel}>Actividad reciente</ThemedText>
        <View style={styles.card}>
          {recentActivity.map((item, idx) => {
            const st = ESTADO_STYLE[item.estado];
            const isLast = idx === recentActivity.length - 1;
            return (
              <View key={item.id} style={[styles.actRow, !isLast && styles.actRowBorder]}>
                <View style={styles.actLeft}>
                  <ThemedText style={styles.actId}>{item.id}</ThemedText>
                  <ThemedText style={styles.actMeta}>{item.client} · {item.bike}</ThemedText>
                  <ThemedText style={styles.actTime}>{item.time}</ThemedText>
                </View>
                <View style={[styles.actPill, { backgroundColor: st.bg }]}>
                  <ThemedText style={[styles.actPillText, { color: st.text }]}>{st.label}</ThemedText>
                </View>
              </View>
            );
          })}
        </View>

      </ScrollView>
    </View>
  );
}

// ── InfoRow helper ─────────────────────────────────
function InfoRow({ icon, label, value, last = false }: {
  icon: string; label: string; value: string; last?: boolean;
}) {
  return (
    <View style={[infoStyles.row, !last && infoStyles.rowBorder]}>
      <View style={infoStyles.iconWrap}>
        <Ionicons name={icon as any} size={15} color={VS.muted} />
      </View>
      <View style={{ flex: 1 }}>
        <ThemedText style={infoStyles.label}>{label}</ThemedText>
        <ThemedText style={infoStyles.value}>{value}</ThemedText>
      </View>
    </View>
  );
}

const infoStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 11,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: VS.line,
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: VS.chip,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 10,
    color: VS.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 1,
  },
  value: {
    fontSize: 13,
    color: VS.ink,
    fontWeight: '500',
  },
});

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: VS.bg,
  },
  content: {
    paddingBottom: 40,
  },

  // ── Header band ──
  headerBand: {
    backgroundColor: VS.ink,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 28,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  avatarWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
  },
  userName: {
    fontSize: 19,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: -0.3,
  },
  rolePill: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 999,
  },
  roleText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '500',
  },
  branchText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.45)',
    marginTop: 2,
  },

  // ── Section label ──
  sectionLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: VS.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    paddingHorizontal: 16,
    marginBottom: 8,
    marginTop: 4,
  },

  // ── Card ──
  card: {
    backgroundColor: VS.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: VS.line,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 14,
  },

  // ── Metrics grid ──
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  metricCard: {
    width: '47%',
    backgroundColor: VS.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: VS.line,
    padding: 14,
    gap: 6,
  },
  metricIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 10,
    color: VS.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 26,
  },

  // ── Activity ──
  actRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    gap: 10,
  },
  actRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: VS.line,
  },
  actLeft: {
    flex: 1,
    gap: 2,
  },
  actId: {
    fontSize: 13,
    fontWeight: '700',
    color: VS.ink,
  },
  actMeta: {
    fontSize: 11,
    color: VS.muted,
  },
  actTime: {
    fontSize: 10,
    color: VS.muted,
    marginTop: 1,
  },
  actPill: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
  },
  actPillText: {
    fontSize: 10,
    fontWeight: '700',
  },
});
