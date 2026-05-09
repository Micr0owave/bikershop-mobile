import { Drawer } from 'expo-router/drawer';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { useAuth } from '@/components/AuthProvider';

const navigationItems = [
  { label: 'Inicio', route: '/dashboard' },
  { label: 'Nueva Recepción', route: '/recepcion' },
  { label: 'Órdenes Activas', route: '/ordenes' },
  { label: 'Hoja de Vida', route: '/hoja-vida' },
  { label: 'Perfil Técnico', route: '/perfil' },
];

function CustomDrawerContent() {
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.brand}>VeloService</Text>
        <Text style={styles.subtitle}>{user?.branch ?? 'Taller'} - {user?.specialty ?? 'Especialidad'}</Text>
      </View>

      {navigationItems.map((item) => (
        <Pressable
          key={item.route}
          style={styles.item}
          onPress={() => router.push(item.route)}>
          <Text style={styles.itemText}>{item.label}</Text>
        </Pressable>
      ))}

      <View style={styles.footer}>
        <Pressable
          style={styles.logout}
          onPress={async () => {
            await logout();
            router.replace('/login');
          }}>
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function AppLayout() {
  return (
    <Drawer drawerContent={CustomDrawerContent}>
      <Drawer.Screen name="dashboard" options={{ title: 'Inicio' }} />
      <Drawer.Screen name="recepcion" options={{ title: 'Nueva Recepción' }} />
      <Drawer.Screen name="ordenes" options={{ title: 'Órdenes Activas' }} />
      <Drawer.Screen name="hoja-vida" options={{ title: 'Hoja de Vida' }} />
      <Drawer.Screen name="perfil" options={{ title: 'Perfil Técnico' }} />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 48,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 24,
  },
  brand: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0A7EA4',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#4A4A4A',
  },
  item: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EFF3F7',
  },
  itemText: {
    fontSize: 18,
    color: '#11181C',
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 12,
  },
  logout: {
    paddingVertical: 16,
  },
  logoutText: {
    color: '#D64545',
    fontSize: 16,
    fontWeight: '600',
  },
});
