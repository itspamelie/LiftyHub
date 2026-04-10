import { View, Text, StyleSheet, TextInput, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform, Modal, FlatList,  } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect, useRef } from "react";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors, spacing } from "@/src/styles/globalstyles";
import { useLanguage } from "@/src/context/LanguageContext";
import {
  updateUserRoutine,
  createUserRoutineExercise,
  deleteUserRoutineExercise,
  getUserRoutineExercises,
  getExercises,
} from "@/src/services/api";
import { useToast } from "@/src/hooks/useToast";
import HapticButton from "@/src/components/buttons/HapticButton";

type Exercise = { id: number; name: string; muscle: string; categorie: string };

type SelectedExercise = {
  uid: number;
  exerciseRowId?: number; // ID del registro en userRoutineExercises (para borrar)
  exercise: Exercise;
  sets: string;
  repetitions: string;
  seconds_rest: string;
};

const REST_OPTIONS = [15, 30, 45, 60, 90, 120, 150, 180, 240, 300];
const ITEM_HEIGHT = 60;
const TOTAL_STEPS = 5;

const filters = [
  { key: "Fuerza",    label: "Fuerza" },
  { key: "Movilidad", label: "Movilidad" },
  { key: "Cardio",    label: "Cardio" },
  { key: "HIIT",      label: "HIIT" },
  { key: "Full Body", label: "Full Body" },
];

const levels = [
  { key: "Principiante", label: "Principiante", icon: "leaf-outline" as const },
  { key: "Intermedio",   label: "Intermedio",   icon: "flame-outline" as const },
  { key: "Avanzado",     label: "Avanzado",     icon: "rocket-outline" as const },
];

function formatRest(secs: number): string {
  if (secs < 60) return `${secs} seg`;
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return s === 0 ? `${m} min` : `${m} min ${s} seg`;
}

export default function EditRoutineScreen() {
  const { t } = useLanguage();
  const { showToast, Toast } = useToast();
  const params = useLocalSearchParams<{
    id: string;
    name: string;
    objective: string;
    level: string;
    category: string;
    duration: string;
    img: string;
  }>();

  const routineId = Number(params.id);

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: params.name ?? "",
    objective: params.objective ?? "",
    level: params.level ?? "",
    category: params.category ?? "",
    duration: params.duration ?? "",
    img: params.img ?? "",
  });
  const [restEnabled, setRestEnabled] = useState<boolean | null>(null);
  const [defaultRest, setDefaultRest] = useState("60");
  const [showRestPicker, setShowRestPicker] = useState(false);
  const restScrollRef = useRef<ScrollView>(null);
  const [saving, setSaving] = useState(false);
  const [loadingExercises, setLoadingExercises] = useState(true);

  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<SelectedExercise[]>([]);
  const [removedExerciseRowIds, setRemovedExerciseRowIds] = useState<number[]>([]);
  const uidRef = useRef(0);

  const [showPicker, setShowPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingExercise, setPendingExercise] = useState<Exercise | null>(null);
  const [pendingSets, setPendingSets] = useState("3");
  const [pendingReps, setPendingReps] = useState("12");
  const [pendingRest, setPendingRest] = useState("60");

  // Cargar ejercicios disponibles + ejercicios actuales de la rutina
  useEffect(() => {
    const load = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const [exRes, routineExRes] = await Promise.all([
        getExercises(token),
        getUserRoutineExercises(routineId, token),
      ]);

      setAllExercises(exRes?.data ?? []);

      const existing: SelectedExercise[] = (routineExRes?.data ?? []).map((ex: any) => ({
        uid: ++uidRef.current,
        exerciseRowId: ex.id,
        exercise: ex.exercise ?? { id: ex.exercise_id, name: ex.exercise?.name ?? "Ejercicio", muscle: "", categorie: "" },
        sets: String(ex.sets ?? 3),
        repetitions: String(ex.repetitions ?? 12),
        seconds_rest: String(ex.seconds_rest ?? 0),
      }));

      if (existing.length > 0) {
        const hasRest = existing.some((e) => Number(e.seconds_rest) > 0);
        setRestEnabled(hasRest);
        if (hasRest) {
          const firstRest = existing.find((e) => Number(e.seconds_rest) > 0);
          if (firstRest) setDefaultRest(firstRest.seconds_rest);
        }
      } else {
        setRestEnabled(false);
      }

      setSelectedExercises(existing);
      setLoadingExercises(false);
    };
    load();
  }, []);

  const filteredExercises = allExercises.filter((e) =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectExercise = (exercise: Exercise) => {
    setShowPicker(false);
    setPendingExercise(exercise);
    setPendingSets("3");
    setPendingReps("12");
    setPendingRest(restEnabled ? defaultRest : "0");
  };

  const handleConfirmExercise = () => {
    if (!pendingExercise) return;
    setSelectedExercises((prev) => [
      ...prev,
      { uid: ++uidRef.current, exercise: pendingExercise, sets: pendingSets, repetitions: pendingReps, seconds_rest: pendingRest },
    ]);
    setPendingExercise(null);
  };

  const handleRemoveExercise = (uid: number) => {
    const ex = selectedExercises.find((s) => s.uid === uid);
    if (ex?.exerciseRowId) {
      setRemovedExerciseRowIds((prev) => [...prev, ex.exerciseRowId!]);
    }
    setSelectedExercises((prev) => prev.filter((s) => s.uid !== uid));
  };

  const canContinue = () => {
    if (step === 1) return !!form.name.trim() && !!form.objective.trim();
    if (step === 2) return !!form.level;
    if (step === 3) return !!form.category && !!form.duration;
    if (step === 4) return restEnabled !== null;
    return true;
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      // 1. Actualizar metadata de la rutina
      await updateUserRoutine(
        routineId,
        {
          name: form.name.trim(),
          objective: form.objective.trim(),
          level: form.level,
          category: form.category,
          duration: Number(form.duration),
          img: form.img || undefined,
        },
        token
      );

      // 2. Eliminar ejercicios removidos
      for (const rowId of removedExerciseRowIds) {
        await deleteUserRoutineExercise(rowId, token);
      }

      // 3. Agregar ejercicios nuevos (los que no tienen exerciseRowId)
      const newExercises = selectedExercises.filter((s) => !s.exerciseRowId);
      for (const sel of newExercises) {
        await createUserRoutineExercise(
          {
            user_routine_id: routineId,
            exercise_id: sel.exercise.id,
            sets: Number(sel.sets),
            repetitions: Number(sel.repetitions),
            seconds_rest: Number(sel.seconds_rest),
          },
          token
        );
      }

      router.back();
    } catch {
      showToast(t("editRoutine.errorSave"), "error");
    } finally {
      setSaving(false);
    }
  };

  const stepConfig = [
    { icon: "barbell-outline" as const,     title: t("editRoutine.step1Title"), desc: t("editRoutine.step1Desc") },
    { icon: "stats-chart-outline" as const, title: t("editRoutine.step2Title"), desc: t("editRoutine.step2Desc") },
    { icon: "grid-outline" as const,        title: t("editRoutine.step3Title"), desc: t("editRoutine.step3Desc") },
    { icon: "timer-outline" as const,       title: t("editRoutine.step4Title"), desc: t("editRoutine.step4Desc") },
    { icon: "list-outline" as const,        title: t("editRoutine.step5Title"), desc: t("editRoutine.step5Desc") },
  ];

  if (loadingExercises) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <HapticButton
          style={styles.backButton}
          onPress={() => (step === 1 ? router.back() : setStep(step - 1))}
        >
          <Ionicons name="arrow-back" size={20} color="white" />
        </HapticButton>
        <Text style={styles.headerTitle}>{t("editRoutine.title")}</Text>
      </View>
      <View style={styles.headerDivider} />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <View style={styles.stepHeader}>
            <View style={styles.iconCircle}>
              <Ionicons name={stepConfig[step - 1].icon} size={34} color={colors.primary} />
            </View>
            <Text style={styles.stepTitle}>{stepConfig[step - 1].title}</Text>
            <Text style={styles.stepDesc}>{stepConfig[step - 1].desc}</Text>
          </View>

          {/* PASO 1 */}
          {step === 1 && (
            <View style={styles.stepContent}>
              <TextInput
                placeholder={t("editRoutine.namePlaceholder")}
                placeholderTextColor={colors.textSecondary}
                value={form.name}
                onChangeText={(v) => setForm({ ...form, name: v })}
                style={styles.input}
              />
              <TextInput
                placeholder={t("editRoutine.objectivePlaceholder")}
                placeholderTextColor={colors.textSecondary}
                value={form.objective}
                onChangeText={(v) => setForm({ ...form, objective: v })}
                style={[styles.input, styles.inputMultiline]}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          )}

          {/* PASO 2 */}
          {step === 2 && (
            <View style={styles.stepContent}>
              {levels.map((nivel) => {
                const active = form.level === nivel.key;
                return (
                  <HapticButton
                    key={nivel.key}
                    style={[styles.optionCard, active && styles.optionCardActive]}
                    onPress={() => setForm({ ...form, level: nivel.key })}
                  >
                    <View style={[styles.optionIconBox, active && styles.optionIconBoxActive]}>
                      <Ionicons name={nivel.icon} size={22} color={active ? colors.primary : colors.textSecondary} />
                    </View>
                    <Text style={[styles.optionText, active && styles.optionTextActive]}>{nivel.label}</Text>
                    {active && <Ionicons name="checkmark-circle" size={22} color={colors.primary} />}
                  </HapticButton>
                );
              })}
            </View>
          )}

          {/* PASO 3 */}
          {step === 3 && (
            <View style={styles.stepContent}>
              <Text style={styles.sectionLabel}>{t("editRoutine.categoryLabel")}</Text>
              <View style={styles.categoryGrid}>
                {filters.map((cat) => {
                  const active = form.category === cat.key;
                  return (
                    <HapticButton
                      key={cat.key}
                      style={[styles.categoryButton, active && styles.categoryButtonActive]}
                      onPress={() => setForm({ ...form, category: cat.key })}
                    >
                      <Text style={[styles.categoryText, active && styles.categoryTextActive]}>{cat.label}</Text>
                    </HapticButton>
                  );
                })}
              </View>
              <Text style={styles.sectionLabel}>{t("editRoutine.durationLabel")}</Text>
              <TextInput
                placeholder={t("editRoutine.durationPlaceholder")}
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
                value={form.duration}
                onChangeText={(v) => setForm({ ...form, duration: v })}
                style={styles.input}
              />
            </View>
          )}

          {/* PASO 4 */}
          {step === 4 && (
            <View style={styles.stepContent}>
              <Text style={styles.sectionLabel}>{t("editRoutine.restQuestion")}</Text>
              <View style={styles.restToggleRow}>
                <HapticButton
                  style={[styles.restToggleButton, restEnabled === true && styles.restToggleActive]}
                  onPress={() => setRestEnabled(true)}
                >
                  <Ionicons name="checkmark-circle-outline" size={18} color={restEnabled === true ? colors.primary : colors.textSecondary} />
                  <Text style={[styles.restToggleText, restEnabled === true && styles.restToggleTextActive]}>{t("editRoutine.yes")}</Text>
                </HapticButton>
                <HapticButton
                  style={[styles.restToggleButton, restEnabled === false && styles.restToggleActive]}
                  onPress={() => setRestEnabled(false)}
                >
                  <Ionicons name="close-circle-outline" size={18} color={restEnabled === false ? colors.primary : colors.textSecondary} />
                  <Text style={[styles.restToggleText, restEnabled === false && styles.restToggleTextActive]}>{t("editRoutine.no")}</Text>
                </HapticButton>
              </View>
              {restEnabled === true && (
                <HapticButton
                  style={styles.restPickerTrigger}
                  onPress={() => {
                    setShowRestPicker(true);
                    const idx = REST_OPTIONS.indexOf(Number(defaultRest));
                    setTimeout(() => {
                      restScrollRef.current?.scrollTo({ y: (idx >= 0 ? idx : 3) * ITEM_HEIGHT, animated: false });
                    }, 80);
                  }}
                >
                  <Ionicons name="timer-outline" size={18} color={colors.primary} />
                  <Text style={styles.restPickerValue}>{formatRest(Number(defaultRest))}</Text>
                  <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
                </HapticButton>
              )}
              <Text style={styles.sectionLabel}>{t("editRoutine.imageLabel")}</Text>
              <TextInput
                placeholder="https://..."
                placeholderTextColor={colors.textSecondary}
                value={form.img}
                onChangeText={(v) => setForm({ ...form, img: v })}
                style={styles.input}
                autoCapitalize="none"
              />
            </View>
          )}

          {/* PASO 5 */}
          {step === 5 && (
            <View style={styles.stepContent}>
              {selectedExercises.length === 0 && (
                <Text style={styles.emptyHint}>{t("editRoutine.noExercises")}</Text>
              )}
              {selectedExercises.map((sel) => (
                <View key={sel.uid} style={styles.exerciseCard}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.exerciseName}>{sel.exercise.name}</Text>
                    <Text style={styles.exerciseMeta}>
                      {sel.sets} series × {sel.repetitions} reps · {formatRest(Number(sel.seconds_rest))}
                    </Text>
                  </View>
                  <HapticButton onPress={() => handleRemoveExercise(sel.uid)}>
                    <Ionicons name="close-circle" size={22} color={colors.danger} />
                  </HapticButton>
                </View>
              ))}
              <HapticButton
                style={styles.addExerciseButton}
                onPress={() => { setSearchQuery(""); setShowPicker(true); }}
              >
                <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
                <Text style={styles.addExerciseText}>{t("editRoutine.addExercise")}</Text>
              </HapticButton>
            </View>
          )}
          <HapticButton
            style={[styles.continueButton, (!canContinue() || saving) && { opacity: 0.5 }]}
            onPress={step < TOTAL_STEPS ? () => setStep(step + 1) : handleSave}
            disabled={!canContinue() || saving}
          >
            {saving
              ? <ActivityIndicator color="white" />
              : <Text style={styles.continueText}>{step < TOTAL_STEPS ? t("editRoutine.continue") : t("editRoutine.saveChanges")}</Text>
            }
          </HapticButton>
        </View>
      </ScrollView>

      {/* PROGRESS BAR FIJA ABAJO */}
      <View style={styles.bottomBar}>
        <View style={styles.progressBarContainer}>
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <View key={i} style={[styles.progressSegment, i < step && styles.progressSegmentActive]} />
          ))}
        </View>
        <Text style={styles.stepCounter}>{step}/{TOTAL_STEPS}</Text>
      </View>

      {Toast}

      {/* MODAL PICKER EJERCICIOS */}
      <Modal visible={showPicker} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <HapticButton style={styles.backButton} onPress={() => setShowPicker(false)}>
              <Ionicons name="arrow-back" size={20} color="white" />
            </HapticButton>
            <Text style={styles.modalTitle}>{t("editRoutine.selectExercise")}</Text>
          </View>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={18} color={colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder={t("editRoutine.searchExercise")}
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <FlatList
            data={filteredExercises}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <HapticButton style={styles.exerciseItem} onPress={() => handleSelectExercise(item)}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.exerciseItemName}>{item.name}</Text>
                  <Text style={styles.exerciseItemMeta}>{item.muscle} · {item.categorie}</Text>
                </View>
                <Ionicons name="add-circle-outline" size={22} color={colors.primary} />
              </HapticButton>
            )}
            ListEmptyComponent={<Text style={styles.emptyText}>{t("editRoutine.noResults")}</Text>}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
          />
        </View>
      </Modal>

      {/* MODAL DESCANSO */}
      <Modal visible={showRestPicker} transparent animationType="slide">
        <View style={styles.restPickerOverlay}>
          <HapticButton style={StyleSheet.absoluteFill} onPress={() => setShowRestPicker(false)} />
          <View style={styles.restPickerSheet}>
            <View style={styles.restPickerHeader}>
              <Text style={styles.restPickerTitle}>{t("editRoutine.restBetweenSets")}</Text>
              <HapticButton onPress={() => setShowRestPicker(false)}>
                <Text style={styles.restPickerDoneText}>{t("editRoutine.done")}</Text>
              </HapticButton>
            </View>
            <View style={styles.restPickerBody}>
              <View style={styles.pickerHighlight} pointerEvents="none" />
              <ScrollView
                ref={restScrollRef}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
                onMomentumScrollEnd={(e) => {
                  const idx = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
                  setDefaultRest(REST_OPTIONS[Math.max(0, Math.min(idx, REST_OPTIONS.length - 1))].toString());
                }}
                contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * 2 }}
              >
                {REST_OPTIONS.map((secs) => {
                  const selected = secs.toString() === defaultRest;
                  return (
                    <HapticButton
                      key={secs}
                      style={styles.pickerItem}
                      onPress={() => {
                        restScrollRef.current?.scrollTo({ y: REST_OPTIONS.indexOf(secs) * ITEM_HEIGHT, animated: true });
                        setDefaultRest(secs.toString());
                      }}
                    >
                      <Text style={[styles.pickerItemText, selected && styles.pickerItemTextSelected]}>
                        {formatRest(secs)}
                      </Text>
                    </HapticButton>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL SETS/REPS/REST */}
      <Modal visible={!!pendingExercise} transparent animationType="fade">
        <View style={styles.configOverlay}>
          <View style={styles.configContent}>
            <Text style={styles.configTitle}>{pendingExercise?.name}</Text>
            <Text style={styles.configSubtitle}>{pendingExercise?.muscle}</Text>
            <View style={styles.configRow}>
              {[
                { label: t("editRoutine.sets"), value: pendingSets, setter: setPendingSets },
                { label: t("editRoutine.reps"), value: pendingReps, setter: setPendingReps },
                { label: t("editRoutine.restSecs"), value: pendingRest, setter: setPendingRest },
              ].map(({ label, value, setter }) => (
                <View key={label} style={styles.configField}>
                  <Text style={styles.configLabel}>{label}</Text>
                  <TextInput
                    style={styles.configInput}
                    value={value}
                    onChangeText={setter}
                    keyboardType="numeric"
                    placeholderTextColor={colors.textSecondary}
                  />
                </View>
              ))}
            </View>
            <HapticButton style={styles.saveButton} onPress={handleConfirmExercise}>
              <Text style={styles.saveButtonText}>{t("editRoutine.confirm")}</Text>
            </HapticButton>
            <HapticButton style={styles.cancelButton} onPress={() => setPendingExercise(null)}>
              <Text style={styles.cancelButtonText}>{t("editRoutine.cancel")}</Text>
            </HapticButton>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", paddingTop: 60, paddingBottom: 12, paddingHorizontal: spacing.screenPadding, backgroundColor: colors.background, gap: 12 },
  headerTitle: { flex: 1, color: colors.text, fontSize: 20, fontWeight: "700" },
  headerDivider: { height: 1, backgroundColor: "#2A2A2A" },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, justifyContent: "center", alignItems: "center" },
  progressBar: { flex: 1, flexDirection: "row", gap: 6 },
  progressSegment: { flex: 1, height: 4, borderRadius: 2, backgroundColor: colors.card },
  progressSegmentActive: { backgroundColor: colors.primary },
  stepCounter: { color: colors.textSecondary, fontSize: 13, fontWeight: "600", minWidth: 28, textAlign: "right" },
  content: { flexGrow: 1, justifyContent: "center", padding: spacing.screenPadding, paddingBottom: 40 },
  card: { backgroundColor: colors.card, borderRadius: spacing.borderRadius, padding: 20 },
  stepHeader: { alignItems: "center", marginBottom: 32, marginTop: 8 },
  iconCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: `${colors.primary}18`, justifyContent: "center", alignItems: "center", marginBottom: 14 },
  stepTitle: { color: colors.text, fontSize: 24, fontWeight: "700", textAlign: "center" },
  stepDesc: { color: colors.textSecondary, fontSize: 14, textAlign: "center", marginTop: 6, lineHeight: 20 },
  stepContent: { gap: 12, marginBottom: 8 },
  input: { backgroundColor: "#2C2C2E", borderRadius: spacing.borderRadius, paddingHorizontal: 16, paddingVertical: 14, color: colors.text, fontSize: 16 },
  inputMultiline: { minHeight: 90, paddingTop: 14 },
  sectionLabel: { color: colors.textSecondary, fontSize: 13, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 },
  optionCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#2C2C2E", borderRadius: spacing.borderRadius, padding: 16, gap: 14, borderWidth: 1, borderColor: "transparent" },
  optionCardActive: { borderColor: colors.primary, backgroundColor: `${colors.primary}12` },
  optionIconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: "#2C2C2E", justifyContent: "center", alignItems: "center" },
  optionIconBoxActive: { backgroundColor: `${colors.primary}20` },
  optionText: { flex: 1, color: colors.textSecondary, fontSize: 16, fontWeight: "600" },
  optionTextActive: { color: colors.text },
  categoryGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  categoryButton: { backgroundColor: "#2C2C2E", paddingVertical: 10, paddingHorizontal: 16, borderRadius: spacing.borderRadius, borderWidth: 1, borderColor: "transparent" },
  categoryButtonActive: { backgroundColor: `${colors.primary}18`, borderColor: colors.primary },
  categoryText: { color: colors.textSecondary, fontWeight: "600", fontSize: 14 },
  categoryTextActive: { color: colors.primary },
  restToggleRow: { flexDirection: "row", gap: 10, marginBottom: 8 },
  restToggleButton: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, backgroundColor: "#2C2C2E", borderRadius: spacing.borderRadius, paddingVertical: 12, borderWidth: 1, borderColor: "transparent" },
  restToggleActive: { borderColor: colors.primary, backgroundColor: `${colors.primary}18` },
  restToggleText: { color: colors.textSecondary, fontSize: 15, fontWeight: "600" },
  restToggleTextActive: { color: colors.primary },
  restPickerTrigger: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "#2C2C2E", borderRadius: spacing.borderRadius, paddingHorizontal: 16, paddingVertical: 14, borderWidth: 1, borderColor: `${colors.primary}55` },
  restPickerValue: { flex: 1, color: colors.text, fontSize: 16, fontWeight: "600" },
  emptyHint: { color: colors.textSecondary, textAlign: "center", marginVertical: 20, fontSize: 14 },
  exerciseCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#2C2C2E", borderRadius: spacing.borderRadius, padding: 14 },
  exerciseName: { color: colors.text, fontSize: 15, fontWeight: "600" },
  exerciseMeta: { color: colors.textSecondary, fontSize: 13, marginTop: 2 },
  addExerciseButton: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: colors.card, borderRadius: spacing.borderRadius, padding: 14, borderWidth: 1, borderColor: colors.primary, borderStyle: "dashed" },
  addExerciseText: { color: colors.primary, fontSize: 15, fontWeight: "600" },
  continueButton: { backgroundColor: colors.primary, borderRadius: 30, paddingVertical: 16, alignItems: "center", marginTop: 28 },
  continueText: { color: "white", fontSize: 16, fontWeight: "bold" },
  bottomBar: { flexDirection: "row", alignItems: "center", paddingHorizontal: spacing.screenPadding, paddingVertical: 14, paddingBottom: 32, backgroundColor: colors.background, borderTopWidth: 1, borderTopColor: colors.card, gap: 10 },
  progressBarContainer: { flex: 1, flexDirection: "row", gap: 6 },
  modalContainer: { flex: 1, backgroundColor: colors.background },
  modalHeader: { flexDirection: "row", alignItems: "center", paddingTop: 60, paddingBottom: 16, paddingHorizontal: spacing.screenPadding, borderBottomWidth: 1, borderBottomColor: colors.card, gap: 12 },
  modalTitle: { color: colors.text, fontSize: 20, fontWeight: "bold" },
  searchContainer: { flexDirection: "row", alignItems: "center", backgroundColor: colors.card, margin: 16, borderRadius: spacing.borderRadius, paddingHorizontal: 14, gap: 8 },
  searchInput: { flex: 1, color: colors.text, fontSize: 15, paddingVertical: 12 },
  exerciseItem: { flexDirection: "row", alignItems: "center", paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.card },
  exerciseItemName: { color: colors.text, fontSize: 15, fontWeight: "600" },
  exerciseItemMeta: { color: colors.textSecondary, fontSize: 13, marginTop: 2 },
  emptyText: { color: colors.textSecondary, textAlign: "center", marginTop: 40, fontSize: 15 },
  configOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "center", alignItems: "center" },
  configContent: { backgroundColor: "#1C1C1E", borderRadius: 20, padding: 24, width: "90%" },
  configTitle: { color: colors.text, fontSize: 18, fontWeight: "700", marginBottom: 4 },
  configSubtitle: { color: colors.textSecondary, fontSize: 13, marginBottom: 20 },
  configRow: { flexDirection: "row", gap: 12, marginBottom: 8 },
  configField: { flex: 1, alignItems: "center" },
  configLabel: { color: colors.textSecondary, fontSize: 12, marginBottom: 6, textAlign: "center" },
  configInput: { backgroundColor: colors.background, borderRadius: 12, paddingVertical: 10, color: colors.text, fontSize: 18, fontWeight: "700", textAlign: "center", width: "100%" },
  saveButton: { backgroundColor: colors.primary, borderRadius: spacing.borderRadius, paddingVertical: 14, alignItems: "center", marginTop: 8 },
  saveButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
  cancelButton: { alignItems: "center", marginTop: 12 },
  cancelButtonText: { color: colors.textSecondary, fontSize: 14 },
  restPickerOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.55)", justifyContent: "flex-end" },
  restPickerSheet: { backgroundColor: "#1C1C1E", borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: 36 },
  restPickerHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: "#2C2C2E" },
  restPickerTitle: { color: colors.text, fontSize: 16, fontWeight: "700" },
  restPickerDoneText: { color: colors.primary, fontSize: 16, fontWeight: "700" },
  restPickerBody: { height: ITEM_HEIGHT * 5, overflow: "hidden", position: "relative" },
  pickerHighlight: { position: "absolute", left: 0, right: 0, top: ITEM_HEIGHT * 2, height: ITEM_HEIGHT, backgroundColor: `${colors.primary}18`, borderTopWidth: 1, borderBottomWidth: 1, borderColor: `${colors.primary}40`, zIndex: 1 },
  pickerItem: { height: ITEM_HEIGHT, justifyContent: "center", alignItems: "center" },
  pickerItemText: { color: colors.textSecondary, fontSize: 18, fontWeight: "500" },
  pickerItemTextSelected: { color: colors.text, fontSize: 22, fontWeight: "700" },
});
