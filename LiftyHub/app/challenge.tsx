import { View, Text, StyleSheet, TextInput, ScrollView, Image, ActivityIndicator, Modal, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { router, Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { colors, spacing } from "@/src/styles/globalstyles";
import { useLanguage } from "@/src/context/LanguageContext";
import HapticButton from "@/src/components/buttons/HapticButton";
import BackButton from "@/src/components/buttons/backButton";

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
  const { t, language } = useLanguage();
  const [loading, setLoading]           = useState(true);
  const [challengeKey, setChallengeKey] = useState("@active_challenge_guest");
  const [challenge, setChallenge]       = useState<Challenge | null>(null);
  const [showCreate, setShowCreate]     = useState(false);
  const [goal, setGoal]                 = useState("");
  const [duration, setDuration]         = useState(3);
  const [saving, setSaving]             = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [noteText, setNoteText]         = useState("");
  const [selectedUri, setSelectedUri]   = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("user").then((userRaw) => {
      const userId = userRaw ? JSON.parse(userRaw).id : "guest";
      const key = `@active_challenge_${userId}`;
      setChallengeKey(key);
      return AsyncStorage.getItem(key);
    }).then((raw) => {
      if (raw) setChallenge(JSON.parse(raw));
      setLoading(false);
    });
  }, []);

  const persist = async (c: Challenge) => {
    await AsyncStorage.setItem(challengeKey, JSON.stringify(c));
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
      Alert.alert(t("challenge.galleryPermTitle"), t("challenge.galleryPermMessage"));
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
      t("challenge.deleteTitle"),
      t("challenge.deleteMessage"),
      [
        { text: t("challenge.deleteCancel"), style: "cancel" },
        {
          text: t("challenge.deleteConfirm"),
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem(challengeKey);
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
            <Text style={styles.createTitle}>{t("challenge.title")}</Text>
            <Text style={styles.createSubtitle}>{t("challenge.subtitle")}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.fieldLabel}>{t("challenge.goalLabel")}</Text>
            <TextInput
              style={styles.input}
              placeholder={t("challenge.goalPlaceholder")}
              placeholderTextColor={colors.textSecondary}
              value={goal}
              onChangeText={setGoal}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />

            <Text style={[styles.fieldLabel, { marginTop: 20 }]}>{t("challenge.durationLabel")}</Text>
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
                      {m === 1 ? t("challenge.monthSingular", { n: m }) : t("challenge.monthPlural", { n: m })}
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
                : <Text style={styles.createBtnText}>{t("challenge.startBtn")}</Text>}
            </HapticButton>
          </View>
        </ScrollView>
      </View>
    );
  }

  /* ──────────────── VER RETO ACTIVO ──────────────── */
  const elapsed     = daysElapsed(challenge.startDate);
  const total       = challenge.durationMonths * 30;
  const left        = daysLeft(challenge.endDate);
  const progress    = Math.min(elapsed / total, 1);
  const pct         = Math.round(progress * 100);
  const isCompleted = left === 0;
  const firstPhoto  = challenge.photos[0];
  const lastPhoto   = challenge.photos[challenge.photos.length - 1];

  const locale = language === "en" ? "en-US" : "es-MX";
  const motivationalMsg = () => {
    if (isCompleted) return { text: t("challenge.motivCompleted"), icon: "trophy" as const };
    if (pct >= 75)   return { text: t("challenge.motiv75"),        icon: "flame" as const };
    if (pct >= 50)   return { text: t("challenge.motiv50"),        icon: "trending-up" as const };
    if (pct >= 25)   return { text: t("challenge.motiv25"),        icon: "flash" as const };
    return { text: t("challenge.motiv0"), icon: "heart" as const };
  };
  const motiv = motivationalMsg();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* HEADER */}
      <View style={styles.activeHeader}>
        <HapticButton style={styles.activeBackBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="white" />
        </HapticButton>
        <Text style={styles.activeHeaderTitle}>{t("challenge.activeTitle")}</Text>
        {isCompleted && (
          <View style={styles.completedBadge}>
            <Text style={styles.completedBadgeText}>{t("challenge.completed")}</Text>
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.viewContent} showsVerticalScrollIndicator={false}>

        {/* TARJETA PRINCIPAL */}
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={[styles.trophyCircle, { backgroundColor: `${ACCENT}22` }]}>
              <Ionicons name="trophy" size={26} color={ACCENT} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroLabel}>{t("challenge.yourGoalLabel")}</Text>
              <Text style={styles.goalText}>{challenge.goal}</Text>
            </View>
          </View>

          {/* BARRA DE PROGRESO CON HITOS */}
          <View style={styles.progressSection}>
            <View style={styles.progressLabelRow}>
              <Text style={styles.progressMeta}>{t("challenge.dayProgress", { elapsed, total })}</Text>
              <Text style={styles.progressPct}>{pct}%</Text>
            </View>
            <View style={styles.progressBg}>
              <View style={[styles.progressFill, { width: `${pct}%` }]} />
              {[25, 50, 75].map((m) => (
                <View key={m} style={[styles.milestone, { left: `${m}%` as any, backgroundColor: pct >= m ? ACCENT : "#3A3A3A" }]} />
              ))}
            </View>
            <View style={styles.milestoneLabels}>
              {[25, 50, 75].map((m) => (
                <Text key={m} style={[styles.milestoneLabel, { left: `${m}%` as any, color: pct >= m ? ACCENT : "#555" }]}>{m}%</Text>
              ))}
            </View>
          </View>

          {/* MENSAJE MOTIVACIONAL */}
          <View style={styles.motivRow}>
            <Ionicons name={motiv.icon} size={15} color={ACCENT} />
            <Text style={styles.motivText}>{motiv.text}</Text>
          </View>
        </View>

        {/* STATS */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{elapsed}</Text>
            <Text style={styles.statLabel}>{t("challenge.daysElapsedLabel")}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: isCompleted ? ACCENT : colors.primary }]}>
              {isCompleted ? "✓" : left}
            </Text>
            <Text style={styles.statLabel}>{t("challenge.daysRemainingLabel")}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{challenge.photos.length}</Text>
            <Text style={styles.statLabel}>{t("challenge.progressPhotosLabel")}</Text>
          </View>
        </View>

        {/* COMPARACIÓN INICIO VS AHORA */}
        {challenge.photos.length >= 2 && (
          <View style={styles.card}>
            <View style={styles.sectionHeaderRow}>
              <Ionicons name="git-compare-outline" size={18} color={ACCENT} />
              <Text style={styles.sectionTitle}>{t("challenge.comparisonTitle")}</Text>
            </View>
            <View style={styles.comparisonRow}>
              <View style={styles.comparisonItem}>
                <Image source={{ uri: firstPhoto.uri }} style={styles.comparisonPhoto} resizeMode="cover" />
                <View style={styles.comparisonLabelBox}>
                  <Text style={styles.comparisonLabel}>{t("challenge.startLabel")}</Text>
                  <Text style={styles.comparisonDate}>
                    {new Date(firstPhoto.date).toLocaleDateString(locale, { day: "numeric", month: "short" })}
                  </Text>
                </View>
              </View>
              <View style={styles.vsCircle}>
                <Ionicons name="arrow-forward" size={18} color={ACCENT} />
              </View>
              <View style={styles.comparisonItem}>
                <Image source={{ uri: lastPhoto.uri }} style={styles.comparisonPhoto} resizeMode="cover" />
                <View style={styles.comparisonLabelBox}>
                  <Text style={styles.comparisonLabel}>{t("challenge.nowLabel")}</Text>
                  <Text style={styles.comparisonDate}>
                    {new Date(lastPhoto.date).toLocaleDateString(locale, { day: "numeric", month: "short" })}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* AGREGAR FOTO */}
        {!isCompleted && (
          <HapticButton style={styles.addPhotoBtn} onPress={handlePickPhoto}>
            <View style={styles.addPhotoIcon}>
              <Ionicons name="camera" size={20} color={ACCENT} />
            </View>
            <View>
              <Text style={styles.addPhotoText}>{t("challenge.addPhotoTitle")}</Text>
              <Text style={styles.addPhotoSub}>{t("challenge.addPhotoSubtitle")}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} style={{ marginLeft: "auto" }} />
          </HapticButton>
        )}

        {/* GALERÍA */}
        {challenge.photos.length > 0 ? (
          <View style={styles.card}>
            <View style={styles.sectionHeaderRow}>
              <Ionicons name="images-outline" size={18} color={colors.primary} />
              <Text style={styles.sectionTitle}>{t("challenge.photosTitle")}</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{challenge.photos.length}</Text>
              </View>
            </View>
            <View style={styles.photoGrid}>
              {[...challenge.photos].reverse().map((photo) => (
                <View key={photo.id} style={styles.photoItem}>
                  <Image source={{ uri: photo.uri }} style={styles.photo} resizeMode="cover" />
                  <View style={styles.photoMeta}>
                    <Text style={styles.photoDate}>
                      {new Date(photo.date).toLocaleDateString(locale, { day: "numeric", month: "short", year: "2-digit" })}
                    </Text>
                    {photo.note ? <Text style={styles.photoNote} numberOfLines={2}>{photo.note}</Text> : null}
                  </View>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.emptyPhotos}>
            <Ionicons name="camera-outline" size={48} color="#333" />
            <Text style={styles.emptyTitle}>{t("challenge.noPhotosTitle")}</Text>
            <Text style={styles.emptyText}>{t("challenge.noPhotosText")}</Text>
          </View>
        )}

        {/* FECHA DE INICIO */}
        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.dateText}>
            {t("challenge.startedOn", { date: new Date(challenge.startDate).toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" }) })}
          </Text>
        </View>

        {/* ELIMINAR */}
        <HapticButton style={styles.deleteBtn} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={15} color={colors.danger} />
          <Text style={styles.deleteBtnText}>{t("challenge.deleteBtn")}</Text>
        </HapticButton>
      </ScrollView>

      {/* MODAL AGREGAR FOTO */}
      <Modal visible={showPhotoModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {selectedUri && (
              <Image source={{ uri: selectedUri }} style={styles.modalPreview} resizeMode="cover" />
            )}
            <Text style={styles.modalTitle}>{t("challenge.photoModalTitle")}</Text>
            <TextInput
              style={styles.noteInput}
              placeholder={t("challenge.photoModalPlaceholder")}
              placeholderTextColor={colors.textSecondary}
              value={noteText}
              onChangeText={setNoteText}
              multiline
            />
            <HapticButton style={styles.savePhotoBtn} onPress={handleSavePhoto}>
              <Text style={styles.savePhotoBtnText}>{t("challenge.savePhotoBtn")}</Text>
            </HapticButton>
            <HapticButton style={styles.cancelModalBtn} onPress={() => setShowPhotoModal(false)}>
              <Text style={styles.cancelModalText}>{t("challenge.cancelBtn")}</Text>
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

  activeHeader:      { flexDirection: "row", alignItems: "center", paddingTop: 60, paddingHorizontal: 20, paddingBottom: 16, gap: 12, borderBottomWidth: 1, borderBottomColor: colors.card },
  activeBackBtn:     { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.primary, justifyContent: "center", alignItems: "center" },
  activeHeaderTitle: { color: colors.text, fontSize: 22, fontWeight: "700", flex: 1 },
  completedBadge:    { backgroundColor: `${ACCENT}22`, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  completedBadgeText:{ color: ACCENT, fontSize: 12, fontWeight: "700" },

  heroCard:     { backgroundColor: colors.card, borderRadius: spacing.borderRadius, padding: 20, marginBottom: 14 },
  heroTopRow:   { flexDirection: "row", gap: 14, marginBottom: 20 },
  trophyCircle: { width: 52, height: 52, borderRadius: 26, justifyContent: "center", alignItems: "center" },
  heroLabel:    { color: colors.textSecondary, fontSize: 11, fontWeight: "700", letterSpacing: 0.8, marginBottom: 4 },
  goalText:     { color: colors.text, fontSize: 16, fontWeight: "700", lineHeight: 22 },

  progressSection:  { marginBottom: 14 },
  progressLabelRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  progressMeta:     { color: colors.textSecondary, fontSize: 12 },
  progressPct:      { color: ACCENT, fontSize: 13, fontWeight: "700" },
  progressBg:       { height: 10, backgroundColor: "#2C2C2E", borderRadius: 5, marginBottom: 6, position: "relative", overflow: "visible" },
  progressFill:     { height: 10, backgroundColor: ACCENT, borderRadius: 5 },
  milestone:        { position: "absolute", top: -3, width: 6, height: 16, borderRadius: 3, marginLeft: -3 },
  milestoneLabels:  { position: "relative", height: 16 },
  milestoneLabel:   { position: "absolute", fontSize: 10, marginLeft: -10 },

  motivRow:   { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: `${ACCENT}11`, borderRadius: 10, padding: 10 },
  motivText:  { color: ACCENT, fontSize: 13, fontWeight: "600", flex: 1 },

  statsRow:    { flexDirection: "row", backgroundColor: colors.card, borderRadius: spacing.borderRadius, padding: 20, marginBottom: 14 },
  statBox:     { flex: 1, alignItems: "center", gap: 6 },
  statValue:   { color: ACCENT, fontSize: 26, fontWeight: "800" },
  statLabel:   { color: colors.textSecondary, fontSize: 11, textAlign: "center", lineHeight: 15 },
  statDivider: { width: 1, backgroundColor: "#2C2C2E", marginHorizontal: 8 },

  sectionHeaderRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 14 },
  sectionTitle:     { color: colors.text, fontSize: 15, fontWeight: "700", flex: 1 },
  countBadge:       { backgroundColor: colors.primary + "22", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  countBadgeText:   { color: colors.primary, fontSize: 12, fontWeight: "700" },

  comparisonRow:    { flexDirection: "row", alignItems: "center", gap: 10 },
  comparisonItem:   { flex: 1, gap: 8 },
  comparisonPhoto:  { width: "100%", aspectRatio: 1, borderRadius: 14 },
  comparisonLabelBox: { alignItems: "center", gap: 2 },
  comparisonLabel:  { color: colors.text, fontSize: 13, fontWeight: "700" },
  comparisonDate:   { color: colors.textSecondary, fontSize: 11 },
  vsCircle:         { width: 36, height: 36, borderRadius: 18, backgroundColor: `${ACCENT}22`, justifyContent: "center", alignItems: "center" },

  addPhotoBtn:  { flexDirection: "row", alignItems: "center", gap: 14, backgroundColor: colors.card, borderRadius: spacing.borderRadius, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: `${ACCENT}44` },
  addPhotoIcon: { width: 42, height: 42, borderRadius: 21, backgroundColor: `${ACCENT}22`, justifyContent: "center", alignItems: "center" },
  addPhotoText: { color: colors.text, fontSize: 15, fontWeight: "600" },
  addPhotoSub:  { color: colors.textSecondary, fontSize: 12, marginTop: 2 },

  photoGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  photoItem: { width: "47%", gap: 6 },
  photo:     { width: "100%", aspectRatio: 1, borderRadius: 12 },
  photoMeta: { gap: 2 },
  photoDate: { color: colors.textSecondary, fontSize: 11 },
  photoNote: { color: colors.text, fontSize: 12, lineHeight: 16 },

  emptyPhotos: { alignItems: "center", gap: 10, paddingVertical: 40, backgroundColor: colors.card, borderRadius: spacing.borderRadius, marginBottom: 14 },
  emptyTitle:  { color: colors.text, fontSize: 16, fontWeight: "700" },
  emptyText:   { color: colors.textSecondary, textAlign: "center", fontSize: 13, lineHeight: 19, paddingHorizontal: 24 },

  dateRow:   { flexDirection: "row", alignItems: "center", gap: 6, justifyContent: "center", marginBottom: 8, marginTop: 4 },
  dateText:  { color: colors.textSecondary, fontSize: 12 },

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
