import { Drawer } from 'expo-router/drawer';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

function CustomDrawerContent() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>VeloService</Text>
      <Pressable style={styles.item} onPress={() => router.push('/')}>
        <Text style={styles.itemText}>Inicio</Text>
      </Pressable>
      <Pressable style={styles.item} onPress={() => router.push('/recepcion')}>
        <Text style={styles.itemText}>Nueva Recepción</Text>
      </Pressable>
      <Pressable style={styles.item} onPress={() => router.push('/ordenes')}>
        <Text style={styles.itemText}>Órdenes Activas</Text>
      </Pressable>
      <Pressable style={styles.item} onPress={() => router.push('/hoja-vida')}>
        <Text style={styles.itemText}>Hoja de Vida</Text>
      </Pressable>
      <Pressable style={styles.item} onPress={() => router.push('/perfil')}>
        <Text style={styles.itemText}>Perfil Técnico</Text>
      </Pressable>
      <Pressable style={styles.item} onPress={() => {/* logout */}}>
        <Text style={styles.itemText}>Cerrar Sesión</Text>
      </Pressable>
    </View>
  );
}

export default function DrawerLayout() {
  return (
    <Drawer drawerContent={CustomDrawerContent}>
      <Drawer.Screen name="(tabs)" options={{ headerShown: false }} />
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
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#000',
  },
  item: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemText: {
    fontSize: 18,
    color: '#333',
  },
});