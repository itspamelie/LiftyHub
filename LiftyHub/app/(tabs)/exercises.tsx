import { ScrollView, View, Text, StyleSheet, TextInput } from "react-native";
import { useState } from "react";
import ExerciseCard from "@/src/components/exercises/ExerciseCard";
import FilterButton from "@/src/components/exercises/FilterButton";
import { colors, spacing } from "@/src/styles/globalstyles";
import { useLanguage } from "@/src/context/LanguageContext";

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

  // key = valor interno para filtrar (viene del backend en español)
  // labelKey = clave de traducción para mostrar
  const filters = [
    { key: "Todo",       labelKey: "exercises.muscleGroups.all" },
    { key: "Pecho",      labelKey: "exercises.muscleGroups.chest" },
    { key: "Espalda",    labelKey: "exercises.muscleGroups.back" },
    { key: "Pierna",     labelKey: "exercises.muscleGroups.leg" },
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

  // MOCK DATA simulando backend
  const exercises: Exercise[] = [
    {
      id: 1,
      name: "Sentadilla",
      muscle: "Pierna",
      technique: "Mantén la espalda recta",
      files: [
        {
          file_path: "https://images.unsplash.com/photo-1599058917765-a780eda07a3e",
          type: "image"
        }
      ]
    },
    {
      id: 2,
      name: "Pull Ups",
      muscle: "Espalda",
      technique: "Sube controlado",
      files: [
        {
          file_path: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
          type: "image"
        }
      ]
    },
    {
      id: 3,
      name: "Press banca",
      muscle: "Pecho",
      technique: "Baja la barra controladamente",
      files: [
        {
          file_path: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61",
          type: "image"
        }
      ]
    },
    {
      id: 4,
      name: "Crunch abdominal",
      muscle: "Abdomen",
      technique: "Contrae el abdomen al subir",
      files: [
        {
          file_path: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1",
          type: "image"
        }
      ]
    }
  ];


  const filteredExercises = exercises.filter((exercise) => {

    const matchesSearch =
      exercise.name.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      activeFilter === "Todo" ||
      exercise.muscle === activeFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
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
      <View style={styles.list}>

        {filteredExercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
          />
        ))}

      </View>

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
  }

});