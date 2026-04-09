import { View, Text, StyleSheet } from "react-native";
import { colors, spacing } from "@/src/styles/globalstyles";
import { useLanguage } from "@/src/context/LanguageContext";

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
  const { t } = useLanguage();

  return (
    <View style={styles.card}>

      <Text style={styles.title}>{t("stats.weeklyProgress")}</Text>

      {/* Círculo simple */}
      <View style={[styles.circle, progress === 0 && styles.circleEmpty]}>
        <Text style={styles.percent}>{progress > 0 ? `${progress}%` : "—"}</Text>
        <Text style={styles.week}>{t("stats.ofTheWeek")}</Text>
      </View>

      <View style={styles.stats}>

        <View style={styles.stat}>
          <Text style={styles.number}>{workouts > 0 ? workouts : "—"}</Text>
          <Text style={styles.label}>{t("stats.workouts")}</Text>
        </View>

        <View style={styles.stat}>
          <Text style={styles.number}>{reps > 0 ? reps : "—"}</Text>
          <Text style={styles.label}>{t("stats.reps")}</Text>
        </View>

        <View style={styles.stat}>
          <Text style={styles.number}>{sets > 0 ? sets : "—"}</Text>
          <Text style={styles.label}>{t("stats.sets")}</Text>
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

  circleEmpty: {
    borderColor: colors.textSecondary,
    borderStyle: "dashed",
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