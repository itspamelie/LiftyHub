import { View, Text, StyleSheet, TextInput, ScrollView, Image, ActivityIndicator, Modal, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { router, Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { colors, spacing } from "@/src/styles/globalstyles";
import HapticButton from "@/src/components/buttons/HapticButton";
import BackButton from "@/src/components/buttons/backButton";

const CHALLENGE_KEY = "@active_challenge";
const DURATION_OPTIONS = [1, 2, 3, 6, 12];
const ACCENT = "#F59E0B";

type ChallengePhoto = {
  id: string;
  uri: string;
  date: string;
  note?: string;
};

type Challenge = {
  goal: string;
  durationMonths: number;
  startDate: string;
  endDate: string;
  photos: ChallengePhoto[];
};

function daysLeft(endDate: string): number {
  const diff = new Date(endDate).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 86400000));
}

function daysElapsed(startDate: string): number {
  return Math.floor((Date.now() - new Date(startDate).getTime()) / 86400000);
}

export default function ChallengeScreen() {
  const [loading, setLoading]           = useState(true);
  const [challenge, setChallenge]       = useState<Challenge | null>(null);
  const [showCreate, setShowCreate]     = useState(false);
  const [goal, setGoal]                 = useState("");
  const [duration, setDuration]         = useState(3);
  const [saving, setSaving]             = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [noteText, setNoteText]         = useState("");
  const [selectedUri, setSelectedUri]   = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(CHALLENGE_KEY).then((raw) => {
      if (raw) setChallenge(JSON.parse(raw));
      setLoading(false);
    });
  }, []);

  const persist = async (c: Challenge) => {
    await AsyncStorage.setItem(CHALLENGE_KEY, JSON.stringify(c));
    setChallenge(c);
  };

  const handleCreate = async () => {
    if (!goal.trim()) return;
    setSaving(true);
    const start = new Date();
    const end   = new Date(start);
    end.setMonth(end.getMonth() + duration);
    await persist({
      goal: goal.trim(),
      durationMonths: duration,
      startDate: start.toISOString(),
      endDate:   end.toISOString(),
      photos:    [],
    });
    setSaving(false);
    setShowCreate(false);
  };

  const handlePickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso necesario", "Necesitamos acceso a tu galería para agregar fotos.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setSelectedUri(result.assets[0].uri);
      setNoteText("");
      setShowPhotoModal(true);
    }
  };

  const handleSavePhoto = async () => {
    if (!selectedUri || !challenge) return;
    const photo: ChallengePhoto = {
      id:   Date.now().toString(),
      uri:  selectedUri,
      date: new Date().toISOString(),
      note: noteText.trim() || undefined,
    };
    await persist({ ...challenge, photos: [...challenge.photos, photo] });
    setShowPhotoModal(false);
    setSelectedUri(null);
    setNoteText("");
  };

  const handleDelete = () => {
    Alert.alert(
      "Eliminar reto",
      "¿Seguro? Se perderán todas las fotos guardadas.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem(CHALLENGE_KEY);
            setChallenge(null);
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }}>
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  /* ──────────────── CREAR RETO ──────────────── */
  if (!challenge || showCreate) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <BackButton />
        <ScrollView contentContainerStyle={styles.createContent} keyboardShouldPersistTaps="handled">
          <View style={styles.createHeader}>
            <View style={[styles.iconCircle, { backgroundColor: `${ACCENT}22` }]}>
              <Ionicons name="trophy" size={42} color={ACCENT} />
            </View>
            <Text style={styles.createTitle}>Reto Personal</Text>
            <Text style={styles.createSubtitle}>
              Define tu meta y registra tu transformación con fotos a lo largo del tiempo
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.fieldLabel}>¿CUÁL ES TU META?</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: En 3 meses quiero bajar 10 kg y ver mi progreso..."
              placeholderTextColor={colors.textSecondary}
              value={goal}
              onChangeText={setGoal}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />

            <Text style={[styles.fieldLabel, { marginTop: 20 }]}>DURACIÓN DEL RETO</Text>
            <View style={styles.durationRow}>
              {DURATION_OPTIONS.map((m) => {
                const active = duration === m;
                return (
                  <HapticButton
                    key={m}
                    style={[styles.durationBtn, active && styles.durationBtnActive]}
                    onPress={() => setDuration(m)}
                  >
                    <Text style={[styles.durationText, active && styles.durationTextActive]}>
                      {m}{m === 1 ? " mes" : " meses"}
                    </Text>
                  </HapticButton>
                );
              })}
            </View>

            <HapticButton
              style={[styles.createBtn, (!goal.trim() || saving) && { opacity: 0.5 }]}
              onPress={handleCreate}
              disabled={!goal.trim() || saving}
            >
              {saving
                ? <ActivityIndicator color="white" />
                : <Text style={styles.createBtnText}>Iniciar Reto</Text>}
            </HapticButton>
          </View>
        </ScrollView>
      </View>
    );
  }

  /* ──────────────── VER RETO ACTIVO ──────────────── */
  const elapsed  = daysElapsed(challenge.startDate);
  const total    = challenge.durationMonths * 30;
  const left     = daysLeft(challenge.endDate);
  const progress = Math.min(elapsed / total, 1);
  const isCompleted = left === 0;
  const firstPhoto = challenge.photos[0];
  const lastPhoto  = challenge.photos[challenge.photos.length - 1];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <BackButton />

      <ScrollView contentContainerStyle={styles.viewContent}>

        {/* ENCABEZADO DEL RETO */}
        <View style={styles.challengeHeader}>
          <View style={styles.trophyRow}>
            <Ionicons name="trophy" size={22} color={ACCENT} />
            {isCompleted && (
              <View style={[styles.badge, { backgroundColor: `${ACCENT}22` }]}>
                <Text style={[styles.badgeText, { color: ACCENT }]}>¡Completado!</Text>
              </View>
            )}
          </View>

          <Text style={styles.goalText}>{challenge.goal}</Text>

          <View style={styles.progressLabelRow}>
            <Text style={styles.progressMeta}>
              {challenge.durationMonths} {challenge.durationMonths === 1 ? "mes" : "meses"} · Día {elapsed} de {total}
            </Text>
            <Text style={styles.progressPct}>{Math.round(progress * 100)}%</Text>
          </View>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${Math.round(progress * 100)}%` }]} />
          </View>
          <Text style={styles.daysLeft}>
            {isCompleted ? "Reto completado" : `${left} días restantes`}
          </Text>
        </View>

        {/* COMPARACIÓN INICIO VS AHORA */}
        {challenge.photos.length >= 2 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Comparación</Text>
            <View style={styles.comparisonRow}>
              <View style={styles.comparisonItem}>
                <Image source={{ uri: firstPhoto.uri }} style={styles.comparisonPhoto} resizeMode="cover" />
                <Text style={styles.comparisonLabel}>Inicio</Text>
                <Text style={styles.comparisonDate}>
                  {new Date(firstPhoto.date).toLocaleDateString("es-MX", { day: "numeric", month: "short" })}
                </Text>
              </View>
              <Ionicons name="arrow-forward" size={28} color={colors.textSecondary} />
              <View style={styles.comparisonItem}>
                <Image source={{ uri: lastPhoto.uri }} style={styles.comparisonPhoto} resizeMode="cover" />
                <Text style={styles.comparisonLabel}>Ahora</Text>
                <Text style={styles.comparisonDate}>
                  {new Date(lastPhoto.date).toLocaleDateString("es-MX", { day: "numeric", month: "short" })}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* AGREGAR FOTO */}
        {!isCompleted && (
          <HapticButton style={styles.addPhotoBtn} onPress={handlePickPhoto}>
            <Ionicons name="camera" size={20} color={colors.primary} />
            <Text style={styles.addPhotoText}>Agregar foto de progreso</Text>
          </HapticButton>
        )}

        {/* GALERÍA */}
        {challenge.photos.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Fotos de progreso ({challenge.photos.length})</Text>
            <View style={styles.photoGrid}>
              {[...challenge.photos].reverse().map((photo) => (
                <View key={photo.id} style={styles.photoItem}>
                  <Image source={{ uri: photo.uri }} style={styles.photo} resizeMode="cover" />
                  <Text style={styles.photoDate}>
                    {new Date(photo.date).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "2-digit" })}
                  </Text>
                  {photo.note ? <Text style={styles.photoNote} numberOfLines={2}>{photo.note}</Text> : null}
                </View>
              ))}
            </View>
          </>
        ) : (
          <View style={styles.emptyPhotos}>
            <Ionicons name="images-outline" size={44} color={colors.textSecondary} />
            <Text style={styles.emptyText}>Sube tu primera foto para empezar a registrar tu progreso</Text>
          </View>
        )}

        {/* ELIMINAR */}
        <HapticButton style={styles.deleteBtn} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={15} color={colors.danger} />
          <Text style={styles.deleteBtnText}>Eliminar reto</Text>
        </HapticButton>
      </ScrollView>

      {/* MODAL AGREGAR FOTO */}
      <Modal visible={showPhotoModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {selectedUri && (
              <Image source={{ uri: selectedUri }} style={styles.modalPreview} resizeMode="cover" />
            )}
            <Text style={styles.modalTitle}>Agregar nota (opcional)</Text>
            <TextInput
              style={styles.noteInput}
              placeholder="¿Cómo te sientes hoy?"
              placeholderTextColor={colors.textSecondary}
              value={noteText}
              onChangeText={setNoteText}
              multiline
            />
            <HapticButton style={styles.savePhotoBtn} onPress={handleSavePhoto}>
              <Text style={styles.savePhotoBtnText}>Guardar foto</Text>
            </HapticButton>
            <HapticButton style={styles.cancelModalBtn} onPress={() => setShowPhotoModal(false)}>
              <Text style={styles.cancelModalText}>Cancelar</Text>
            </HapticButton>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: colors.background },
  createContent: { padding: spacing.screenPadding, paddingTop: 110, paddingBottom: 40 },
  viewContent:   { padding: spacing.screenPadding, paddingTop: 90, paddingBottom: 60 },

  createHeader:   { alignItems: "center", marginBottom: 32 },
  iconCircle:     { width: 84, height: 84, borderRadius: 42, justifyContent: "center", alignItems: "center", marginBottom: 16 },
  createTitle:    { color: colors.text, fontSize: 26, fontWeight: "700", textAlign: "center" },
  createSubtitle: { color: colors.textSecondary, fontSize: 14, textAlign: "center", marginTop: 8, lineHeight: 20 },

  card:       { backgroundColor: colors.card, borderRadius: spacing.borderRadius, padding: 20, marginBottom: 16 },
  fieldLabel: { color: colors.textSecondary, fontSize: 12, fontWeight: "700", letterSpacing: 0.5, marginBottom: 8 },
  input:      { backgroundColor: "#2C2C2E", borderRadius: 12, padding: 14, color: colors.text, fontSize: 15, minHeight: 90, textAlignVertical: "top" },

  durationRow:       { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 24 },
  durationBtn:       { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 20, backgroundColor: "#2C2C2E", borderWidth: 1.5, borderColor: "transparent" },
  durationBtnActive: { borderColor: ACCENT, backgroundColor: `${ACCENT}18` },
  durationText:      { color: colors.textSecondary, fontSize: 14, fontWeight: "600" },
  durationTextActive:{ color: ACCENT },

  createBtn:     { backgroundColor: ACCENT, borderRadius: 30, paddingVertical: 16, alignItems: "center" },
  createBtnText: { color: "white", fontSize: 16, fontWeight: "700" },

  challengeHeader:  { backgroundColor: colors.card, borderRadius: spacing.borderRadius, padding: 20, marginBottom: 16 },
  trophyRow:        { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 },
  badge:            { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText:        { fontSize: 12, fontWeight: "700" },
  goalText:         { color: colors.text, fontSize: 18, fontWeight: "700", marginBottom: 16, lineHeight: 26 },
  progressLabelRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  progressMeta:     { color: colors.textSecondary, fontSize: 12 },
  progressPct:      { color: ACCENT, fontSize: 12, fontWeight: "700" },
  progressBg:       { height: 8, backgroundColor: "#2C2C2E", borderRadius: 4, marginBottom: 8 },
  progressFill:     { height: 8, backgroundColor: ACCENT, borderRadius: 4 },
  daysLeft:         { color: colors.textSecondary, fontSize: 12, textAlign: "center", marginTop: 4 },

  sectionTitle:  { color: colors.text, fontSize: 16, fontWeight: "700", marginBottom: 12 },
  comparisonRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8, marginTop: 8 },
  comparisonItem:  { flex: 1, alignItems: "center", gap: 6 },
  comparisonPhoto: { width: "100%", aspectRatio: 1, borderRadius: 12 },
  comparisonLabel: { color: colors.text, fontSize: 13, fontWeight: "700" },
  comparisonDate:  { color: colors.textSecondary, fontSize: 11 },

  addPhotoBtn:  { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: colors.card, borderRadius: spacing.borderRadius, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: colors.primary, borderStyle: "dashed" },
  addPhotoText: { color: colors.primary, fontSize: 15, fontWeight: "600" },

  photoGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 24 },
  photoItem: { width: "47%", gap: 4 },
  photo:     { width: "100%", aspectRatio: 1, borderRadius: 12 },
  photoDate: { color: colors.textSecondary, fontSize: 11 },
  photoNote: { color: colors.text, fontSize: 12, lineHeight: 16 },

  emptyPhotos: { alignItems: "center", gap: 12, paddingVertical: 40 },
  emptyText:   { color: colors.textSecondary, textAlign: "center", fontSize: 14, lineHeight: 20 },

  deleteBtn:     { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 16, marginTop: 4 },
  deleteBtnText: { color: colors.danger, fontSize: 14 },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.75)", justifyContent: "flex-end" },
  modalCard:    { backgroundColor: "#1C1C1E", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 48 },
  modalPreview: { width: "100%", height: 220, borderRadius: 16, marginBottom: 16 },
  modalTitle:   { color: colors.text, fontSize: 17, fontWeight: "700", marginBottom: 12 },
  noteInput:    { backgroundColor: "#2C2C2E", borderRadius: 12, padding: 14, color: colors.text, fontSize: 15, minHeight: 80, marginBottom: 16, textAlignVertical: "top" },
  savePhotoBtn:     { backgroundColor: colors.primary, borderRadius: 30, paddingVertical: 14, alignItems: "center", marginBottom: 10 },
  savePhotoBtnText: { color: "white", fontSize: 16, fontWeight: "700" },
  cancelModalBtn:  { alignItems: "center", paddingVertical: 8 },
  cancelModalText: { color: colors.textSecondary, fontSize: 14 },
});
