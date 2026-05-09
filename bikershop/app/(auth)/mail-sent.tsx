import { StyleSheet, View } from 'react-native';
import { Link } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function MailSentScreen() {
  return (
    <ThemedView style={styles.page}>
      <View style={styles.card}>
        <ThemedText type="title" style={styles.title}>
          Correo enviado
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Revisa tu bandeja de entrada y sigue las instrucciones para recuperar el acceso.
        </ThemedText>

        <Link href="/login" style={styles.button}>
          <ThemedText type="defaultSemiBold" style={styles.buttonText}>
            Volver a inicio
          </ThemedText>
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
});
