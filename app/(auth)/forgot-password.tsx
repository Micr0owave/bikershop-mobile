import { useState } from 'react';
import { Alert, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/components/AuthProvider';

// ── VeloService Design Tokens ──────────────────────
const VS = {
  bg:     '#e9e9ec',
  card:   '#ffffff',
  ink:    '#0f1114',
  line:   '#eae2d6',
  line2:  '#efe9df',
  chip:   '#f4efe7',
  muted:  '#8a7f70',
  warn:   '#c85a2a',
  warnBg: '#fbeadd',
};

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { sendResetEmail } = useAuth();
  const [email, setEmail]         = useState('');
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
    <View style={styles.page}>

      {/* ── Card ── */}
      <View style={styles.card}>

        {/* Back link */}
        <Link href="/login" style={styles.backLink}>
          <View style={styles.backRow}>
            <Ionicons name="arrow-back" size={15} color={VS.muted} />
            <ThemedText style={styles.backText}>Volver al inicio de sesión</ThemedText>
          </View>
        </Link>

        <ThemedText style={styles.heading}>Recuperar contraseña</ThemedText>
        <ThemedText style={styles.subheading}>
          Te enviaremos un enlace de recuperación al correo asociado a tu cuenta.
        </ThemedText>

        {/* Email input */}
        <View style={styles.inputWrap}>
          <Ionicons name="mail-outline" size={17} color={VS.muted} style={styles.inputIcon} />
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="tu@veloservice.cl"
            placeholderTextColor={VS.muted}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
            editable={!submitting}
          />
        </View>

        <ThemedText style={styles.hint}>
          Solo se aceptan correos del dominio @veloservice.cl
        </ThemedText>

        {/* Submit */}
        <Pressable
          style={[styles.btn, submitting && styles.btnDisabled]}
          onPress={handleSend}
          disabled={submitting}>
          <ThemedText style={styles.btnText}>
            {submitting ? 'Enviando...' : 'Enviar solicitud'}
          </ThemedText>
        </Pressable>

      </View>

      {/* ── Footer ── */}
      <View style={styles.footer}>
        <View style={styles.statusDot} />
        <ThemedText style={styles.footerText}>Sistema operativo</ThemedText>
        <ThemedText style={styles.footerDivider}>·</ThemedText>
        <ThemedText style={styles.footerLink}>Privacidad</ThemedText>
        <ThemedText style={styles.footerDivider}>·</ThemedText>
        <ThemedText style={styles.footerLink}>Términos</ThemedText>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: VS.bg,
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 16,
  },

  // ── Card ──
  card: {
    backgroundColor: VS.card,
    borderRadius: 18,
    padding: 22,
    borderWidth: 1,
    borderColor: VS.line,
    gap: 0,
  },

  // ── Back ──
  backLink: {
    marginBottom: 20,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  backText: {
    fontSize: 13,
    color: VS.muted,
  },

  // ── Heading ──
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: VS.ink,
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  subheading: {
    fontSize: 13,
    color: VS.muted,
    lineHeight: 19,
    marginBottom: 20,
  },

  // ── Input ──
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: VS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: VS.line,
    height: 50,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: VS.ink,
  },
  hint: {
    fontSize: 11,
    color: VS.muted,
    marginBottom: 20,
    paddingHorizontal: 2,
  },

  // ── Button ──
  btn: {
    backgroundColor: VS.ink,
    borderRadius: 12,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDisabled: {
    opacity: 0.5,
  },
  btnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },

  // ── Footer ──
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: '#2f7d4f',
  },
  footerText: {
    fontSize: 11,
    color: VS.muted,
  },
  footerDivider: {
    fontSize: 11,
    color: VS.line,
  },
  footerLink: {
    fontSize: 11,
    color: VS.muted,
  },
});
