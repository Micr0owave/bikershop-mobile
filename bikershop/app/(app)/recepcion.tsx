import { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const fields = [
  { label: 'Frontal', key: 'frontal' },
  { label: 'Lateral', key: 'lateral' },
  { label: 'Transmisión', key: 'transmision' },
  { label: 'N° Serie', key: 'serie' },
] as const;

export default function RecepcionScreen() {
  const [rut, setRut] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [serial, setSerial] = useState('');
  const [images, setImages] = useState<Record<string, string | null>>({ frontal: null, lateral: null, transmision: null, serie: null });

  const handleImagePick = async (key: string) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a la galería para subir evidencia.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7, allowsEditing: true });

    if (!result.canceled) {
      setImages((prev) => ({ ...prev, [key]: result.assets[0].uri }));
    }
  };

  const handleSubmit = () => {
    const missingImages = fields.filter((slot) => !images[slot.key]);
    if (!rut || !brand || !model || !serial) {
      Alert.alert('Faltan datos', 'Completa todos los campos antes de continuar.');
      return;
    }
    if (missingImages.length > 0) {
      Alert.alert('Faltan fotos', `Sube las evidencias: ${missingImages.map((item) => item.label).join(', ')}`);
      return;
    }

    Alert.alert('Recepción confirmada', 'La nueva orden se ha registrado correctamente.');
  };

  return (
    <ThemedView style={styles.page}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <ThemedText type="title">Recepción de Bicicleta</ThemedText>
          <ThemedText style={styles.description}>Registra el ingreso con evidencia técnica y datos del cliente.</ThemedText>
        </View>

        <View style={styles.card}>
          <ThemedText type="subtitle">RUT del cliente</ThemedText>
          <TextInput
            value={rut}
            onChangeText={setRut}
            placeholder="12.345.678-5"
            placeholderTextColor="#A1A1A1"
            style={styles.input}
          />

          <ThemedText type="subtitle">Marca</ThemedText>
          <TextInput
            value={brand}
            onChangeText={setBrand}
            placeholder="Honda, Trek, Specialized"
            placeholderTextColor="#A1A1A1"
            style={styles.input}
          />

          <ThemedText type="subtitle">Modelo</ThemedText>
          <TextInput
            value={model}
            onChangeText={setModel}
            placeholder="Domane SL 7"
            placeholderTextColor="#A1A1A1"
            style={styles.input}
          />

          <ThemedText type="subtitle">N° Serie</ThemedText>
          <TextInput
            value={serial}
            onChangeText={setSerial}
            placeholder="53A8-12B7"
            placeholderTextColor="#A1A1A1"
            style={styles.input}
          />
        </View>

        <View style={styles.card}>
          <ThemedText type="subtitle">Evidencia Fotográfica</ThemedText>
          <ThemedText style={styles.description}>Sube las 4 imágenes obligatorias para cumplir con evidencia técnica.</ThemedText>
          <View style={styles.photoGrid}>
            {fields.map((slot) => (
              <Pressable key={slot.key} style={styles.photoSlot} onPress={() => handleImagePick(slot.key)}>
                {images[slot.key] ? (
                  <Image source={{ uri: images[slot.key] as string }} style={styles.photo} />
                ) : (
                  <ThemedText style={styles.photoLabel}>{slot.label}</ThemedText>
                )}
              </Pressable>
            ))}
          </View>
        </View>

        <Pressable style={styles.submitButton} onPress={handleSubmit}>
          <ThemedText type="defaultSemiBold" style={styles.submitText}>Registrar Recepción</ThemedText>
        </Pressable>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#F8FBFF',
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 20,
  },
  description: {
    marginTop: 6,
    color: '#4A4A4A',
  },
  card: {
    marginBottom: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    shadowColor: '#00000012',
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },
  input: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E6E9EE',
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 18,
    backgroundColor: '#FBFDFF',
    color: '#11181C',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  photoSlot: {
    width: '48%',
    height: 140,
    borderRadius: 18,
    backgroundColor: '#F4F8FB',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
  },
  photoLabel: {
    color: '#4A4A4A',
    fontSize: 14,
    textAlign: 'center',
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
  },
  submitButton: {
    marginTop: 12,
    backgroundColor: '#0A7EA4',
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});
