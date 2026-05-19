import { useEffect, useState } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  ScrollView,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/components/AuthProvider';

// ── VeloService Design Tokens ──────────────────────
const VS = {
  bg:      '#e9e9ec',
  card:    '#ffffff',
  ink:     '#0f1114',
  line:    '#eae2d6',
  line2:   '#efe9df',
  chip:    '#f4efe7',
  muted:   '#8a7f70',
  warn:    '#c85a2a',
  warnBg:  '#fbeadd',
  info:    '#3a6ea5',
  infoBg:  '#e4eaf2',
};

export default function LoginScreen() {
  const router = useRouter();
  const { user, login, isLoading } = useAuth();
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [showPass, setShowPass]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]         = useState<string | null>(null);

  useEffect(() => {
    if (user) router.replace('/dashboard');
  }, [user, router]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const success = await login(email.trim(), password.trim());
      if (!success) {
        setError('Revisa tu correo y contraseña e intenta nuevamente.');
        return;
      }
      router.replace('/dashboard');
    } catch (e) {
      setError('Error de red o del servidor.');
    } finally {
      setSubmitting(false);
    }
  };

  const busy = submitting || isLoading;

  return (
    <View style={styles.page}>
      {/* Fondo: contenedor overflow hidden + imagen anclada abajo para mostrar la bici */}
      <View style={[StyleSheet.absoluteFill, { overflow: 'hidden' }]}>
        <Image
          source={require('../../assets/images/branding-bg.png')}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '130%', // más alta que la pantalla: recorta por ARRIBA, muestra la bici ABAJO
          }}
          resizeMode="cover"
        />
      </View>

      {/* Overlay sutil para que la card blanca resalte sobre la pared blanca */}
      <View style={[StyleSheet.absoluteFill, styles.overlay]} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">

        {/* ── Brand header ── */}
        <View style={styles.brandRow}>
          <View style={styles.brandIcon}>
            <Ionicons name="bicycle" size={20} color="#fff" />
          </View>
          <View>
            <ThemedText style={styles.brandName}>VeloService</ThemedText>
            <ThemedText style={styles.brandSub}>Taller de bicicletas</ThemedText>
          </View>
        </View>

        {/* ── Card ── */}
        <View style={styles.card}>
          <ThemedText style={styles.heading}>Bienvenid@</ThemedText>
          <ThemedText style={styles.subheading}>
            Ingresa con tu cuenta para acceder al panel del taller.
          </ThemedText>

          {/* Email */}
          <View style={[styles.inputWrap, error ? styles.inputError : null]}>
            <Ionicons name="mail-outline" size={17} color={VS.muted} style={styles.inputIcon} />
            <TextInput
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
              placeholder="admin@veloservice.cl"
              placeholderTextColor={VS.muted}
              style={styles.input}
              editable={!busy}
            />
          </View>

          {/* Password */}
          <View style={[styles.inputWrap, { marginTop: 10 }, error ? styles.inputError : null]}>
            <Ionicons name="lock-closed-outline" size={17} color={VS.muted} style={styles.inputIcon} />
            <TextInput
              secureTextEntry={!showPass}
              value={password}
              onChangeText={setPassword}
              placeholder="Contraseña"
              placeholderTextColor={VS.muted}
              style={styles.input}
              editable={!busy}
            />
            <Pressable onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
              <Ionicons
                name={showPass ? 'eye-off-outline' : 'eye-outline'}
                size={17}
                color={VS.muted}
              />
            </Pressable>
          </View>

          {/* Error */}
          {error && (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle-outline" size={15} color={VS.warn} />
              <ThemedText style={styles.errorText}>{error}</ThemedText>
            </View>
          )}

          {/* Forgot */}
          <Link href="/forgot-password" style={styles.forgotLink}>
            <ThemedText style={styles.forgotText}>¿Olvidaste tu contraseña?</ThemedText>
          </Link>

          {/* Submit */}
          <Pressable
            style={[styles.btn, busy && styles.btnDisabled]}
            onPress={handleSubmit}
            disabled={busy}>
            <ThemedText style={styles.btnText}>
              {busy ? 'Ingresando...' : 'Ingresar al panel'}
            </ThemedText>
            {!busy && <Ionicons name="arrow-forward" size={17} color="#fff" />}
          </Pressable>
        </View>

        {/* ── Feature chips ── */}
        <View style={styles.chipsRow}>
          <View style={styles.featureChip}>
            <View style={styles.chipIcon}>
              <Ionicons name="flash-outline" size={16} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText style={styles.chipTitle}>Pipeline en vivo</ThemedText>
              <ThemedText style={styles.chipDesc}>Recepción → diagnóstico → reparación</ThemedText>
            </View>
          </View>
          <View style={styles.featureChip}>
            <View style={styles.chipIcon}>
              <Ionicons name="bicycle-outline" size={16} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText style={styles.chipTitle}>Bicis & e-bikes</ThemedText>
              <ThemedText style={styles.chipDesc}>Mantenciones, motor Bosch/Shimano</ThemedText>
            </View>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // ── Background ──
  page: {
    flex: 1,
  },
  overlay: {
    backgroundColor: 'rgba(15, 17, 20, 0.08)', // ligeramente más oscuro para contraste
  },
  scroll: {
    flex: 1,
  },

  // ── Content ──
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
    gap: 20,
  },

  // ── Brand ──
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  brandIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: VS.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    fontSize: 16,
    fontWeight: '700',
    color: VS.ink,
    letterSpacing: -0.2,
  },
  brandSub: {
    fontSize: 11,
    color: VS.muted,
  },

  // ── Card ──
  card: {
    backgroundColor: VS.card,
    borderRadius: 18,
    padding: 22,
    borderWidth: 1,
    borderColor: VS.line,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: VS.ink,
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  subheading: {
    fontSize: 13,
    color: VS.muted,
    marginBottom: 20,
    lineHeight: 19,
  },

  // ── Inputs ──
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: VS.chip,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: VS.line2,
    height: 50,
    paddingHorizontal: 12,
  },
  inputError: {
    borderColor: VS.warn,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: VS.ink,
  },
  eyeBtn: {
    padding: 4,
  },

  // ── Error banner ──
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: VS.warnBg,
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  errorText: {
    fontSize: 12,
    color: VS.warn,
    flex: 1,
  },

  // ── Forgot ──
  forgotLink: {
    alignSelf: 'flex-end',
    marginTop: 10,
    marginBottom: 16,
  },
  forgotText: {
    fontSize: 13,
    color: VS.info,
  },

  // ── Button ──
  btn: {
    backgroundColor: VS.ink,
    borderRadius: 12,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  btnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },

  // ── Feature chips ──
  chipsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  featureChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: VS.ink,
    borderRadius: 14,
    padding: 14,
  },
  chipIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 2,
  },
  chipDesc: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.55)',
    lineHeight: 14,
  },
});