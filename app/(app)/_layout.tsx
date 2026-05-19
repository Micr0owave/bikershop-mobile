import { Drawer } from 'expo-router/drawer';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '@/components/AuthProvider';

// ── VeloService Design Tokens ──────────────────────
const VS = {
  bg:        '#e9e9ec',
  card:      '#ffffff',
  ink:       '#0f1114',
  line:      '#eae2d6',
  chip:      '#f4efe7',
  muted:     '#8a7f70',
  warn:      '#c85a2a',
  warnBg:    '#fbeadd',
  good:      '#2f7d4f',
  goodBg:    '#e4f1e8',
  info:      '#3a6ea5',
  infoBg:    '#e4eaf2',
  violet:    '#6b5bd1',
  violetBg:  '#ebe7fa',
};

const navigationItems = [
  { label: 'Inicio',         route: '/dashboard', icon: 'grid-outline',          section: 'PRINCIPAL' },
  { label: 'Órdenes',        route: '/ordenes',   icon: 'list-outline',          section: null },
  { label: 'Perfil Técnico', route: '/perfil',    icon: 'person-circle-outline', section: null },
];

function CustomDrawerContent() {
  const router   = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const initials = [user?.nombre?.[0], user?.apellido?.[0]]
    .filter(Boolean).join('').toUpperCase() || 'US';

  return (
    <View style={styles.container}>
      {/* ── Brand header ── */}
      <View style={styles.header}>
        <View style={styles.logoBox}>
          <Ionicons name="bicycle" size={20} color="#fff" />
        </View>
        <View>
          <Text style={styles.brand}>VeloService</Text>
          <Text style={styles.brandSub}>Taller de bicicletas</Text>
        </View>
      </View>

      {/* ── Nav items ── */}
      <View style={styles.nav}>
        {navigationItems.map((item) => {
          const isActive = pathname === item.route;
          return (
            <View key={item.route}>
              {item.section && (
                <Text style={styles.sectionLabel}>{item.section}</Text>
              )}
              <Pressable
                style={[styles.item, isActive && styles.itemActive]}
                onPress={() => router.push(item.route)}>
                <Ionicons
                  name={item.icon as any}
                  size={20}
                  color={isActive ? VS.ink : VS.muted}
                />
                <Text style={[styles.itemText, isActive && styles.itemTextActive]}>
                  {item.label}
                </Text>
              </Pressable>
            </View>
          );
        })}
      </View>

      {/* ── Footer ── */}
      <View style={styles.footer}>
        <View style={styles.userRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.userName} numberOfLines={1}>
              {user?.nombre ?? ''} {user?.apellido ?? ''}
            </Text>
            <Text style={styles.userRole}>{user?.rol ?? 'Mecánico'}</Text>
          </View>
        </View>

        <Pressable
          style={styles.logoutBtn}
          onPress={async () => {
            await logout();
            router.replace('/login');
          }}>
          <Ionicons name="log-out-outline" size={16} color={VS.warn} />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function AppLayout() {
  return (
    <Drawer drawerContent={CustomDrawerContent}>
      <Drawer.Screen name="dashboard" options={{ title: 'Inicio' }} />
      <Drawer.Screen name="ordenes"   options={{ title: 'Órdenes' }} />
      <Drawer.Screen name="perfil"    options={{ title: 'Perfil Técnico' }} />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: VS.card,
  },

  // ── Header ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 18,
    paddingTop: 52,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: VS.line,
  },
  logoBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: VS.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    fontSize: 17,
    fontWeight: '700',
    color: VS.ink,
    letterSpacing: -0.3,
  },
  brandSub: {
    fontSize: 11,
    color: VS.muted,
    marginTop: 1,
  },

  // ── Nav ──
  nav: {
    flex: 1,
    paddingTop: 8,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: VS.muted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 4,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderLeftWidth: 2,
    borderLeftColor: 'transparent',
  },
  itemActive: {
    backgroundColor: VS.chip,
    borderLeftColor: VS.ink,
  },
  itemText: {
    fontSize: 14,
    color: VS.ink,
  },
  itemTextActive: {
    fontWeight: '600',
    color: VS.ink,
  },

  // ── Footer ──
  footer: {
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: VS.line,
    gap: 12,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: VS.chip,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '700',
    color: VS.ink,
  },
  userName: {
    fontSize: 13,
    fontWeight: '600',
    color: VS.ink,
  },
  userRole: {
    fontSize: 11,
    color: VS.muted,
    marginTop: 1,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logoutText: {
    fontSize: 13,
    fontWeight: '600',
    color: VS.warn,
  },
});
