import { useState } from 'react';
import { Alert, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Link, useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/components/AuthProvider';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { sendResetEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSend = async () => {
    setSubmitting(true);
    const success = await sendResetEmail(email.trim());
    setSubmitting(false);

    if (!success) {
      Alert.alert('Correo inválido', 'Ingresa un correo válido para poder continuar.');
      return;
    }

    router.push('/mail-sent');
  };

  return (
    <ThemedView style={styles.page}>
      <View style={styles.card}>
        <ThemedText type="title" style={styles.title}>
          Recuperar acceso
        </ThemedText>
        <ThemedText style={styles.subtitle}>Te enviaremos un enlace de restablecimiento.</ThemedText>

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="ejemplo@taller.com"
          placeholderTextColor="#A1A1A1"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <Pressable style={styles.button} onPress={handleSend} disabled={submitting}>
          <ThemedText type="defaultSemiBold" style={styles.buttonText}>
            {submitting ? 'Enviando...' : 'Enviar correo'}
          </ThemedText>
        </Pressable>

        <Link href="/login" style={styles.footerLink}>
          <ThemedText type="link">Volver al inicio de sesión</ThemedText>
        </Link>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
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
    marginBottom: 26,
    color: '#55575E',
  },
  input: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E6E9EE',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 18,
    backgroundColor: '#FBFDFF',
    color: '#11181C',
  },
  button: {
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
  footerLink: {
    marginTop: 18,
    alignSelf: 'center',
  },
});
