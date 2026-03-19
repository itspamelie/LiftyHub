import { View, Text, StyleSheet } from "react-native";
import { colors, spacing } from "@/src/styles/globalstyles";

type Props = {
  progress: number;
  workouts: number;
  reps: number;
  sets: number;
};

export default function ProgressCard({
  progress,
  workouts,
  reps,
  sets
}: Props) {
  return (
    <View style={styles.card}>

      <Text style={styles.title}>Progreso semanal</Text>

      {/* Círculo simple */}
      <View style={styles.circle}>
        <Text style={styles.percent}>{progress}%</Text>
        <Text style={styles.week}>de la semana</Text>
      </View>

      <View style={styles.stats}>

        <View style={styles.stat}>
          <Text style={styles.number}>{workouts}</Text>
          <Text style={styles.label}>Entrenos</Text>
        </View>

        <View style={styles.stat}>
          <Text style={styles.number}>{reps}</Text>
          <Text style={styles.label}>Reps</Text>
        </View>

        <View style={styles.stat}>
          <Text style={styles.number}>{sets}</Text>
          <Text style={styles.label}>Series</Text>
        </View>

      </View>

    </View>
  );
}
const styles = StyleSheet.create({

  card: {
    backgroundColor: colors.card,
    borderRadius: spacing.borderRadius,
    padding: 20,
    marginTop: 20
  },

  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16
  },

  circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 6,
    borderColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 20
  },

  percent: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "bold"
  },

  week: {
    color: colors.textSecondary,
    fontSize: 13
  },

  stats: {
    flexDirection: "row",
    justifyContent: "space-between"
  },

  stat: {
    alignItems: "center",
    gap: 2
  },

  number: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "bold"
  },

  label: {
    color: colors.textSecondary,
    fontSize: 13
  }

});