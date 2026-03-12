import { ScrollView, View, Text, StyleSheet, TextInput } from "react-native";
import ExerciseCard from "@/src/components/ExerciseCard";
import FilterButton from "@/src/components/FilterButton";
import { colors, spacing } from "@/src/styles/globalstyles";

export default function ExercisesScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Ejercicios</Text>
        <Text style={styles.subtitle}>Técnica, músculo a trabajar y más.</Text>

        <TextInput
          placeholder="Buscar ejercicios..."
          placeholderTextColor={colors.textSecondary}
          style={styles.search}
        />
      </View>

      {/* FILTROS */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filters}
      >
        <FilterButton label="Todo" active />
        <FilterButton label="Pierna" />
        <FilterButton label="Espalda" />
        <FilterButton label="Abdomen" />
        <FilterButton label="Pecho" />
        <FilterButton label="Hombro" />
        <FilterButton label="Tríceps" />
        <FilterButton label="Bíceps" />
      </ScrollView>

      {/* LISTA */}
      <View style={styles.list}>

        <ExerciseCard
          title="Sentadilla"
          muscle="Músculo: Pierna, glúteo, pantorrilla"
          image="https://images.unsplash.com/photo-1599058917765-a780eda07a3e"
        />

        <ExerciseCard
          title="Pull Ups"
          muscle="Músculo: Espalda, bíceps"
          image="https://images.unsplash.com/photo-1517836357463-d25dfeac3438"
        />

        <ExerciseCard
          title="Press banca"
          muscle="Músculo: Pecho, tríceps"
          image="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61"
        />

        <ExerciseCard
          title="Crunch abdominal"
          muscle="Músculo: Abdomen"
          image="https://images.unsplash.com/photo-1605296867304-46d5465a13f1"
        />

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