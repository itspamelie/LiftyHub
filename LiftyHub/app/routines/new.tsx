import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLanguage } from "@/src/context/LanguageContext";
import { colors, spacing } from "@/src/styles/globalstyles";
import { createUserRoutine, createUserRoutineExercise, getExercises } from "@/src/services/api";

type Exercise = { id: number; name: string; muscle: string; categorie: string };
type SelectedExercise = {
  exercise: Exercise;
  sets: string;
  repetitions: string;
  seconds_rest: string;
};

export default function NewRoutineScreen() {
  const { t } = useLanguage();

  const filters = [
    { key: "Fuerza",    label: t("routines.categories.strength") },
    { key: "Movilidad", label: t("routines.categories.mobility") },
    { key: "Cardio",    label: t("routines.categories.cardio") },
    { key: "HIIT",      label: t("routines.categories.hiit") },
    { key: "Full Body", label: t("routines.categories.fullBody") },
  ];

  const levels = [
    { key: "Principiante", label: t("routines.levels.beginner") },
    { key: "Intermedio",   label: t("routines.levels.intermediate") },
    { key: "Avanzado",     label: t("routines.levels.advanced") },
  ];

  const [form, setForm] = useState({
    name: "",
    objective: "",
    level: "",
    category: "",
    duration: "",
    img: "",
  });
  const [saving, setSaving] = useState(false);

  // Ejercicios
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<SelectedExercise[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingExercise, setPendingExercise] = useState<Exercise | null>(null);
  const [pendingSets, setPendingSets] = useState("3");
  const [pendingReps, setPendingReps] = useState("12");
  const [pendingRest, setPendingRest] = useState("60");

  useEffect(() => {
    const load = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;
      const res = await getExercises(token);
      setExercises(res?.data ?? []);
    };
    load();
  }, []);

  const filteredExercises = exercises.filter(
    (e) =>
      !selectedExercises.some((s) => s.exercise.id === e.id) &&
      e.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectExercise = (exercise: Exercise) => {
    setShowPicker(false);
    setPendingExercise(exercise);
    setPendingSets("3");
    setPendingReps("12");
    setPendingRest("60");
  };

  const handleConfirmExercise = () => {
    if (!pendingExercise) return;
    setSelectedExercises((prev) => [
      ...prev,
      { exercise: pendingExercise, sets: pendingSets, repetitions: pendingReps, seconds_rest: pendingRest },
    ]);
    setPendingExercise(null);
  };

  const handleRemoveExercise = (id: number) => {
    setSelectedExercises((prev) => prev.filter((s) => s.exercise.id !== id));
  };

  const handleSave = async () => {
    if (!form.name || !form.objective || !form.level || !form.duration || !form.category) {
      Alert.alert(t("routines.modal.errorEmpty"));
      return;
    }

    setSaving(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const userRaw = await AsyncStorage.getItem("user");
      if (!token || !userRaw) return;

      const user = JSON.parse(userRaw);
      const res = await createUserRoutine(
        {
          user_id: user.id,
          name: form.name.trim(),
          objective: form.objective.trim(),
          level: form.level,
          category: form.category,
          duration: Number(form.duration),
          img: form.img || undefined,
        },
        token
      );

      const routineId = res?.data?.id;
      if (routineId && selectedExercises.length > 0) {
        for (const sel of selectedExercises) {
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
      }

      router.back();
    } catch (error) {
      console.log("Error creando rutina:", error);
      Alert.alert("Error", "No se pudo crear la rutina.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>{t("routines.modal.title")}</Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* INFO BASICA */}
        <Text style={styles.sectionTitle}>{t("routines.modal.section")}</Text>

        <TextInput
          placeholder={t("routines.modal.name")}
          placeholderTextColor={colors.textSecondary}
          value={form.name}
          onChangeText={(v) => setForm({ ...form, name: v })}
          style={styles.input}
        />

        <TextInput
          placeholder={t("routines.modal.objective")}
          placeholderTextColor={colors.textSecondary}
          value={form.objective}
          onChangeText={(v) => setForm({ ...form, objective: v })}
          style={styles.input}
        />

        {/* NIVEL */}
        <Text style={styles.sectionTitle}>{t("routines.modal.level")}</Text>
        <View style={styles.levelRow}>
          {levels.map((nivel) => (
            <TouchableOpacity
              key={nivel.key}
              style={[styles.levelButton, form.level === nivel.key && styles.buttonActive]}
              onPress={() => setForm({ ...form, level: nivel.key })}
            >
              <Text style={[styles.buttonText, form.level === nivel.key && styles.buttonTextActive]}>
                {nivel.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* CATEGORIA */}
        <Text style={styles.sectionTitle}>{t("routines.modal.type")}</Text>
        <View style={styles.categoryGrid}>
          {filters.map((cat) => (
            <TouchableOpacity
              key={cat.key}
              style={[styles.categoryButton, form.category === cat.key && styles.buttonActive]}
              onPress={() => setForm({ ...form, category: cat.key })}
            >
              <Text style={[styles.buttonText, form.category === cat.key && styles.buttonTextActive]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* DURACION */}
        <Text style={styles.sectionTitle}>{t("routines.modal.duration")}</Text>
        <TextInput
          placeholder={t("routines.modal.durationPlaceholder")}
          placeholderTextColor={colors.textSecondary}
          keyboardType="numeric"
          value={form.duration}
          onChangeText={(v) => setForm({ ...form, duration: v })}
          style={styles.input}
        />

        {/* IMAGEN */}
        <Text style={styles.sectionTitle}>{t("routines.modal.image")}</Text>
        <TextInput
          placeholder={t("routines.modal.imagePlaceholder")}
          placeholderTextColor={colors.textSecondary}
          value={form.img}
          onChangeText={(v) => setForm({ ...form, img: v })}
          style={styles.input}
          autoCapitalize="none"
        />

        {/* EJERCICIOS */}
        <Text style={styles.sectionTitle}>{t("routines.modal.exercises")}</Text>

        {selectedExercises.map((sel) => (
          <View key={sel.exercise.id} style={styles.exerciseCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.exerciseName}>{sel.exercise.name}</Text>
              <Text style={styles.exerciseMeta}>
                {sel.sets} series × {sel.repetitions} reps · {sel.seconds_rest}s
              </Text>
            </View>
            <TouchableOpacity onPress={() => handleRemoveExercise(sel.exercise.id)}>
              <Ionicons name="close-circle" size={22} color={colors.danger} />
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity
          style={styles.addExerciseButton}
          onPress={() => { setSearchQuery(""); setShowPicker(true); }}
        >
          <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
          <Text style={styles.addExerciseText}>{t("routines.modal.addExercise")}</Text>
        </TouchableOpacity>

        {/* GUARDAR */}
        <TouchableOpacity
          style={[styles.saveButton, saving && { opacity: 0.6 }]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving
            ? <ActivityIndicator color="white" />
            : <Text style={styles.saveButtonText}>{t("routines.modal.button")}</Text>
          }
        </TouchableOpacity>
      </ScrollView>

      {/* MODAL PICKER DE EJERCICIOS */}
      <Modal visible={showPicker} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity style={styles.backButton} onPress={() => setShowPicker(false)}>
              <Ionicons name="arrow-back" size={20} color="white" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{t("routines.modal.selectExercise")}</Text>
          </View>

          <View style={styles.searchContainer}>
            <Ionicons name="search" size={18} color={colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder={t("routines.modal.searchExercises")}
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <FlatList
            data={filteredExercises}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.exerciseItem} onPress={() => handleSelectExercise(item)}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.exerciseItemName}>{item.name}</Text>
                  <Text style={styles.exerciseItemMeta}>{item.muscle} · {item.categorie}</Text>
                </View>
                <Ionicons name="add-circle-outline" size={22} color={colors.primary} />
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>{t("routines.modal.noExercisesFound")}</Text>
            }
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
          />
        </View>
      </Modal>

      {/* MODAL CONFIG SETS/REPS/REST */}
      <Modal visible={!!pendingExercise} transparent animationType="fade">
        <View style={styles.configOverlay}>
          <View style={styles.configContent}>
            <Text style={styles.configTitle}>{pendingExercise?.name}</Text>
            <Text style={styles.configSubtitle}>{pendingExercise?.muscle}</Text>

            <View style={styles.configRow}>
              <View style={styles.configField}>
                <Text style={styles.configLabel}>{t("routines.modal.sets")}</Text>
                <TextInput
                  style={styles.configInput}
                  value={pendingSets}
                  onChangeText={setPendingSets}
                  keyboardType="numeric"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
              <View style={styles.configField}>
                <Text style={styles.configLabel}>{t("routines.modal.repetitions")}</Text>
                <TextInput
                  style={styles.configInput}
                  value={pendingReps}
                  onChangeText={setPendingReps}
                  keyboardType="numeric"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
              <View style={styles.configField}>
                <Text style={styles.configLabel}>{t("routines.modal.rest")}</Text>
                <TextInput
                  style={styles.configInput}
                  value={pendingRest}
                  onChangeText={setPendingRest}
                  keyboardType="numeric"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleConfirmExercise}>
              <Text style={styles.saveButtonText}>{t("routines.modal.confirm")}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={() => setPendingExercise(null)}>
              <Text style={styles.cancelButtonText}>{t("settings.cancel")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: spacing.screenPadding,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.card,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "bold",
  },

  content: {
    padding: spacing.screenPadding,
    paddingBottom: 40,
  },

  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 8,
  },

  input: {
    backgroundColor: colors.card,
    borderRadius: spacing.borderRadius,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: colors.text,
    fontSize: 16,
    marginBottom: 8,
  },

  levelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },

  levelButton: {
    flex: 1,
    backgroundColor: colors.card,
    paddingVertical: 12,
    borderRadius: spacing.borderRadius,
    alignItems: "center",
  },

  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  categoryButton: {
    backgroundColor: colors.card,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: spacing.borderRadius,
  },

  buttonActive: {
    backgroundColor: colors.primary,
  },

  buttonText: {
    color: colors.textSecondary,
    fontWeight: "600",
    fontSize: 14,
  },

  buttonTextActive: {
    color: "white",
  },

  exerciseCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: spacing.borderRadius,
    padding: 14,
    marginBottom: 8,
  },

  exerciseName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
  },

  exerciseMeta: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },

  addExerciseButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.card,
    borderRadius: spacing.borderRadius,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: "dashed",
  },

  addExerciseText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "600",
  },

  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: spacing.borderRadius,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 20,
  },

  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  // Modal picker
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: spacing.screenPadding,
    borderBottomWidth: 1,
    borderBottomColor: colors.card,
  },

  modalTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "bold",
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    margin: 16,
    borderRadius: spacing.borderRadius,
    paddingHorizontal: 14,
    gap: 8,
  },

  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    paddingVertical: 12,
  },

  exerciseItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.card,
  },

  exerciseItemName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
  },

  exerciseItemMeta: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },

  emptyText: {
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 40,
    fontSize: 15,
  },

  // Modal config
  configOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },

  configContent: {
    backgroundColor: "#1C1C1E",
    borderRadius: 20,
    padding: 24,
    width: "90%",
  },

  configTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },

  configSubtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    marginBottom: 20,
  },

  configRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 8,
  },

  configField: {
    flex: 1,
    alignItems: "center",
  },

  configLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: 6,
    textAlign: "center",
  },

  configInput: {
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingVertical: 10,
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    width: "100%",
  },

  cancelButton: {
    alignItems: "center",
    marginTop: 12,
  },

  cancelButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
});
