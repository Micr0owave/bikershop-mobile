import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Link, useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/components/AuthProvider';

export default function LoginScreen() {
  const router = useRouter();
  const { user, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      router.replace('/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async () => {
    setSubmitting(true);
    const success = await login(email.trim(), password.trim());
    setSubmitting(false);

    if (!success) {
      Alert.alert('Error de acceso', 'Revisa tu correo y contraseña e intenta nuevamente.');
      return;
    }

    router.replace('/dashboard');
  };

  return (
    <ThemedView style={styles.page}>
      <View style={styles.card}>
        <ThemedText type="title" style={styles.title}>
          VeloService
        </ThemedText>
        <ThemedText style={styles.subtitle}>Gestión técnica de talleres de bicicletas</ThemedText>

        <View style={styles.field}>
          <ThemedText type="subtitle">Correo electrónico</ThemedText>
          <TextInput
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            placeholder="ejemplo@taller.com"
            placeholderTextColor="#A1A1A1"
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <ThemedText type="subtitle">Contraseña</ThemedText>
          <TextInput
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholder="●●●●●●●●"
            placeholderTextColor="#A1A1A1"
            style={styles.input}
          />
        </View>

        <Pressable style={styles.button} onPress={handleSubmit} disabled={submitting}>
          <ThemedText type="defaultSemiBold" style={styles.buttonText}>
            {submitting ? 'Ingresando...' : 'Ingresar'}
          </ThemedText>
        </Pressable>

        <Link href="/forgot-password" style={styles.footerLink}>
          <ThemedText type="link">¿Olvidaste tu contraseña?</ThemedText>
        </Link>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#F8FBFF',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#00000015',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 24,
    color: '#55575E',
  },
  field: {
    marginBottom: 18,
    gap: 8,
  },
  input: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E6E9EE',
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#FBFDFF',
    color: '#11181C',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#0A7EA4',
    borderRadius: 14,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  footerLink: {
    marginTop: 18,
    alignSelf: 'center',
  },
});
