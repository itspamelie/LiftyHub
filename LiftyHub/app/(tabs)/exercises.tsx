import { ScrollView, View, Text, StyleSheet, TextInput } from "react-native";
import { useState } from "react";
import ExerciseCard from "@/src/components/exercises/ExerciseCard";
import FilterButton from "@/src/components/exercises/FilterButton";
import { colors, spacing } from "@/src/styles/globalstyles";

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

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("Todo");

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

  const filters = [
  "Todo",
  "Pecho",
  "Espalda",
  "Pierna",
  "Glúteos",
  "Hombro",
  "Bíceps",
  "Tríceps",
  "Antebrazo",
  "Abdomen",
  "Core",
  "Pantorrilla",
  "Cardio"
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
        <Text style={styles.title}>Ejercicios</Text>
        <Text style={styles.subtitle}>
          Técnica, músculo a trabajar y más.
        </Text>

        <TextInput
          placeholder="Buscar ejercicios..."
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
            key={filter}
            label={filter}
            active={activeFilter === filter}
            onPress={() => setActiveFilter(filter)}
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