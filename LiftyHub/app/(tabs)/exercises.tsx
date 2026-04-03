import { ScrollView, View, Text, StyleSheet, TextInput, ActivityIndicator, RefreshControl } from "react-native";
import { useState, useEffect, useCallback } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import ExerciseCard from "@/src/components/exercises/ExerciseCard";
import FilterButton from "@/src/components/exercises/FilterButton";
import { colors, spacing } from "@/src/styles/globalstyles";
import { useLanguage } from "@/src/context/LanguageContext";
import { getExercises } from "@/src/services/api";

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
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("Todo");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
      if (res?.data) setExercises(res.data);
    } catch (error) {
      console.log("Error cargando ejercicios:", error);
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

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch = exercise.name.toLowerCase().includes(search.toLowerCase());
    const isFav = favorites.has(String(exercise.id));
    const matchesFilter =
      activeFilter === "Todo" ||
      (activeFilter === "Favoritos" ? isFav : exercise.muscle === activeFilter);
    return matchesSearch && matchesFilter;
  });

  return (
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
            />
          ))}
          {filteredExercises.length === 0 && (
            <Text style={styles.empty}>No se encontraron ejercicios</Text>
          )}
        </View>
      )}

    </ScrollView>
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
  }

});
