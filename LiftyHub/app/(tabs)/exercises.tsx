import { ScrollView, View, Text, StyleSheet, TextInput, ActivityIndicator, RefreshControl, Modal, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from "react-native";
import { useState, useEffect, useCallback } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import ExerciseCard from "@/src/components/exercises/ExerciseCard";
import FilterButton from "@/src/components/exercises/FilterButton";
import { colors, spacing } from "@/src/styles/globalstyles";
import { useLanguage } from "@/src/context/LanguageContext";
import { getExercises, getUserRoutines, createUserRoutineExercise } from "@/src/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useToast } from "@/src/hooks/useToast";
import { useNetworkStatus } from "@/src/hooks/useNetworkStatus";
import { saveCache, loadCache } from "@/src/utils/cache";
import OfflineBanner from "@/src/components/OfflineBanner";

type ExerciseFile = {
  file_path: string;
  type: "image" | "video" | "pdf";
};

type Exercise = {
  id: number;
  name: string;
  muscle: string;
  technique: string;
  files?: ExerciseFile[];
};

export default function ExercisesScreen() {

  const { t } = useLanguage();
  const { showToast, Toast } = useToast();
  const isConnected = useNetworkStatus();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("Todo");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Modal "agregar a rutina"
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [userRoutines, setUserRoutines] = useState<any[]>([]);
  const [routinesLoading, setRoutinesLoading] = useState(false);
  const [addStep, setAddStep] = useState<"pick" | "config">("pick");
  const [selectedRoutine, setSelectedRoutine] = useState<any | null>(null);
  const [addSets, setAddSets] = useState("3");
  const [addReps, setAddReps] = useState("12");
  const [addRest, setAddRest] = useState("60");
  const [adding, setAdding] = useState(false);

  const FAV_KEY = "@liftyhub_favorites_exercises";

  const loadFavorites = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(FAV_KEY);
      setFavorites(new Set(raw ? JSON.parse(raw) : []));
    } catch {}
  }, []);

  const toggleFavorite = async (id: number) => {
    const itemKey = String(id);
    const next = new Set(favorites);
    if (next.has(itemKey)) next.delete(itemKey);
    else next.add(itemKey);
    setFavorites(next);
    try {
      await AsyncStorage.setItem(FAV_KEY, JSON.stringify([...next]));
    } catch {}
  };

  const filters = [
    { key: "Todo",       labelKey: "exercises.muscleGroups.all" },
    { key: "Favoritos",  labelKey: "exercises.muscleGroups.favorites" },
    { key: "Pecho",      labelKey: "exercises.muscleGroups.chest" },
    { key: "Espalda",    labelKey: "exercises.muscleGroups.back" },
    { key: "Cuádriceps", labelKey: "exercises.muscleGroups.leg" },
    { key: "Glúteos",    labelKey: "exercises.muscleGroups.glutes" },
    { key: "Hombro",     labelKey: "exercises.muscleGroups.shoulder" },
    { key: "Bíceps",     labelKey: "exercises.muscleGroups.bicep" },
    { key: "Tríceps",    labelKey: "exercises.muscleGroups.tricep" },
    { key: "Antebrazo",  labelKey: "exercises.muscleGroups.forearm" },
    { key: "Abdomen",    labelKey: "exercises.muscleGroups.abdomen" },
    { key: "Core",       labelKey: "exercises.muscleGroups.core" },
    { key: "Pantorrilla",labelKey: "exercises.muscleGroups.calf" },
    { key: "Cardio",     labelKey: "exercises.muscleGroups.cardio" },
  ];

  const fetchExercises = useCallback(async (isRefresh = false) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;
      const res = await getExercises(token);
      if (res?.data) {
        setExercises(res.data);
        await saveCache("exercises", res.data);
      }
    } catch {
      const cached = await loadCache<any[]>("exercises");
      if (cached) setExercises(cached);
      else showToast("No se pudieron cargar los ejercicios.", "error");
    } finally {
      if (isRefresh) setRefreshing(false);
      else setLoading(false);
    }
  }, []);

  useEffect(() => { fetchExercises(); loadFavorites(); }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchExercises(true);
  }, [fetchExercises]);

  const handleOpenAdd = async (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setAddStep("pick");
    setSelectedRoutine(null);
    setAddSets("3");
    setAddReps("12");
    setAddRest("60");
    setAddModalVisible(true);
    setRoutinesLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const userRaw = await AsyncStorage.getItem("user");
      if (!token || !userRaw) return;
      const user = JSON.parse(userRaw);
      const res = await getUserRoutines(user.id, token);
      setUserRoutines(res?.data ?? []);
    } catch {
      setUserRoutines([]);
    } finally {
      setRoutinesLoading(false);
    }
  };

  const handleConfirmAdd = async () => {
    if (!selectedRoutine || !selectedExercise) return;
    setAdding(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;
      await createUserRoutineExercise(
        {
          user_routine_id: selectedRoutine.id,
          exercise_id: selectedExercise.id,
          sets: parseInt(addSets) || 3,
          repetitions: parseInt(addReps) || 12,
          seconds_rest: parseInt(addRest) || 60,
        },
        token
      );
      setAddModalVisible(false);
      showToast(`${selectedExercise.name} agregado a ${selectedRoutine.name}`, "success");
    } catch {
      showToast("No se pudo agregar el ejercicio", "error");
    } finally {
      setAdding(false);
    }
  };

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch = exercise.name.toLowerCase().includes(search.toLowerCase());
    const isFav = favorites.has(String(exercise.id));
    const matchesFilter =
      activeFilter === "Todo" ||
      (activeFilter === "Favoritos" ? isFav : exercise.muscle === activeFilter);
    return matchesSearch && matchesFilter;
  });

  return (
    <View style={{ flex: 1 }}>
      {!isConnected && <OfflineBanner />}
      {Toast}
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary} />
        }
      >

        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>{t("exercises.title")}</Text>
          <Text style={styles.subtitle}>{t("exercises.subtitle")}</Text>

          <TextInput
            placeholder={t("exercises.search")}
            placeholderTextColor={colors.textSecondary}
            style={styles.search}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* FILTROS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filters}
        >
          {filters.map((filter) => (
            <FilterButton
              key={filter.key}
              label={t(filter.labelKey)}
              active={activeFilter === filter.key}
              onPress={() => setActiveFilter(filter.key)}
            />
          ))}
        </ScrollView>

        {/* LISTA */}
        {loading ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} />
        ) : (
          <View style={styles.list}>
            {filteredExercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                isFavorite={favorites.has(String(exercise.id))}
                onToggleFavorite={() => toggleFavorite(exercise.id)}
                onAdd={() => handleOpenAdd(exercise)}
              />
            ))}
            {filteredExercises.length === 0 && (
              <Text style={styles.empty}>No se encontraron ejercicios</Text>
            )}
          </View>
        )}

      </ScrollView>

      {/* MODAL AGREGAR A RUTINA */}
      <Modal visible={addModalVisible} transparent animationType="slide">
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>

              {/* Cabecera */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {addStep === "pick" ? "Agregar a rutina" : selectedRoutine?.name ?? "Configurar"}
                </Text>
                <TouchableOpacity onPress={() => setAddModalVisible(false)}>
                  <Ionicons name="close" size={22} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              {addStep === "pick" ? (
                /* ── PASO 1: elegir rutina ── */
                routinesLoading ? (
                  <ActivityIndicator color={colors.primary} style={{ marginVertical: 30 }} />
                ) : userRoutines.length === 0 ? (
                  <View style={styles.emptyRoutines}>
                    <Ionicons name="barbell" size={36} color={colors.textSecondary} />
                    <Text style={styles.emptyRoutinesText}>No tienes rutinas creadas.</Text>
                  </View>
                ) : (
                  <FlatList
                    data={userRoutines}
                    keyExtractor={(item) => String(item.id)}
                    style={{ maxHeight: 320 }}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.routineRow}
                        onPress={() => { setSelectedRoutine(item); setAddStep("config"); }}
                      >
                        <View style={styles.routineRowIcon}>
                          <Ionicons name="barbell" size={18} color={colors.primary} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.routineName}>{item.name}</Text>
                          {item.categorie ? (
                            <Text style={styles.routineCat}>{item.categorie}</Text>
                          ) : null}
                        </View>
                        <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
                      </TouchableOpacity>
                    )}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                  />
                )
              ) : (
                /* ── PASO 2: configurar sets/reps/descanso ── */
                <View style={styles.configSection}>
                  <Text style={styles.configExName}>{selectedExercise?.name}</Text>

                  <View style={styles.configRow}>
                    <Text style={styles.configLabel}>Series</Text>
                    <TextInput
                      style={styles.configInput}
                      value={addSets}
                      onChangeText={setAddSets}
                      keyboardType="number-pad"
                      maxLength={2}
                    />
                  </View>
                  <View style={styles.configRow}>
                    <Text style={styles.configLabel}>Repeticiones</Text>
                    <TextInput
                      style={styles.configInput}
                      value={addReps}
                      onChangeText={setAddReps}
                      keyboardType="number-pad"
                      maxLength={3}
                    />
                  </View>
                  <View style={styles.configRow}>
                    <Text style={styles.configLabel}>Descanso (seg)</Text>
                    <TextInput
                      style={styles.configInput}
                      value={addRest}
                      onChangeText={setAddRest}
                      keyboardType="number-pad"
                      maxLength={3}
                    />
                  </View>

                  <View style={styles.modalBtns}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => setAddStep("pick")}>
                      <Text style={styles.backBtnText}>Atrás</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.confirmBtn, adding && { opacity: 0.6 }]}
                      onPress={handleConfirmAdd}
                      disabled={adding}
                    >
                      {adding
                        ? <ActivityIndicator color="white" />
                        : <Text style={styles.confirmBtnText}>Agregar</Text>
                      }
                    </TouchableOpacity>
                  </View>
                </View>
              )}

            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.background
  },

  content: {
    padding: spacing.screenPadding,
    paddingBottom: 40
  },

  header: {
    marginBottom: 20
  },

  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 40
  },

  subtitle: {
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 16
  },

  search: {
    backgroundColor: colors.card,
    borderRadius: spacing.borderRadius,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 16
  },

  filters: {
    flexDirection: "row",
    marginBottom: 20
  },

  list: {
    marginTop: 10
  },

  empty: {
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 40
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },

  modalBox: {
    backgroundColor: "#1C1C1E",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  modalTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
  },

  routineRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    gap: 12,
  },

  routineRowIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${colors.primary}20`,
    justifyContent: "center",
    alignItems: "center",
  },

  routineName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
  },

  routineCat: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },

  separator: {
    height: 1,
    backgroundColor: "#2A2A2A",
  },

  emptyRoutines: {
    alignItems: "center",
    paddingVertical: 32,
    gap: 10,
  },

  emptyRoutinesText: {
    color: colors.textSecondary,
    fontSize: 14,
  },

  configSection: {
    gap: 14,
  },

  configExName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },

  configRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  configLabel: {
    color: colors.textSecondary,
    fontSize: 14,
  },

  configInput: {
    backgroundColor: "#2C2C2E",
    color: colors.text,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 16,
    fontWeight: "600",
    width: 80,
    textAlign: "center",
  },

  modalBtns: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },

  backBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: spacing.borderRadius,
    backgroundColor: "#2C2C2E",
    alignItems: "center",
  },

  backBtnText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: "600",
  },

  confirmBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: spacing.borderRadius,
    backgroundColor: colors.primary,
    alignItems: "center",
  },

  confirmBtnText: {
    color: "white",
    fontSize: 15,
    fontWeight: "700",
  },

});
