import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/components/AuthProvider';

const MENU_ITEMS = [
  { label: 'Inicio', icon: 'home-outline', route: '/dashboard' },
  { label: 'Ordenes Activas', icon: 'list-outline', route: '/ordenes' },
  { label: 'Perfil Tecnico', icon: 'person-outline', route: '/perfil' },
];

export default function DrawerLayout() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { logout, user } = useAuth();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.drawerHeader}>
        <View style={styles.logoContainer}>
          <Ionicons name="bicycle" size={32} color="#0A7EA4" />
          <Text style={styles.logoText}>VELOSERVICE</Text>
        </View>
        <Text style={styles.logoSubtitle}>Taller de bicicletas</Text>
        {user && (
          <Text style={styles.userName}>{user.nombre} {user.apellido}</Text>
        )}
      </View>

      <View style={styles.menu}>
        {MENU_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.route}
            style={styles.menuItem}
            onPress={() => router.push(item.route)}
          >
            <Ionicons name={item.icon} size={22} color="#5B6069" />
            <Text style={styles.menuItemText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Ionicons name="log-out-outline" size={22} color="#D32F2F" />
          <Text style={styles.logoutText}>Cerrar Sesion</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  drawerHeader: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E6E9EE',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#11181C',
    letterSpacing: 1,
  },
  logoSubtitle: {
    fontSize: 13,
    color: '#5B6069',
    marginTop: 2,
  },
  userName: {
    fontSize: 14,
    color: '#0A7EA4',
    marginTop: 8,
    fontWeight: '600',
  },
  menu: {
    flex: 1,
    paddingTop: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  menuItemText: {
    fontSize: 16,
    color: '#11181C',
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#E6E9EE',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  logoutText: {
    fontSize: 16,
    color: '#D32F2F',
    fontWeight: '600',
  },
});
