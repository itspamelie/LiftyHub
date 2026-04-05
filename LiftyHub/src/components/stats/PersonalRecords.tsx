import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing } from "@/src/styles/globalstyles";
import { useLanguage } from "@/src/context/LanguageContext";

type Props = {
  logs: any[];
};

type Record = {
  exercise: string;
  weight: number;
  reps: number;
};

function calculate1RM(weight: number, reps: number) {
  return Math.round(weight * (1 + reps / 30));
}

export default function PersonalRecords({ logs }: Props) {

  const { t } = useLanguage();

  // Agrupar por ejercicio y quedarse con el mayor peso
  const recordMap: { [exerciseId: number]: Record } = {};
  logs.forEach((l: any) => {
    const weight = parseFloat(l.weight_lifted) || 0;
    const name = l.exercise?.name ?? `Ejercicio ${l.exercise_id}`;
    const existing = recordMap[l.exercise_id];
    if (!existing || weight > existing.weight) {
      recordMap[l.exercise_id] = {
        exercise: name,
        weight,
        reps: l.repetitions ?? 1,
      };
    }
  });

  const records = Object.values(recordMap);

  if (records.length === 0) {
    return (
      <View style={styles.section}>
        <Text style={styles.title}>{t("stats.personalRecords")}</Text>
        <View style={styles.emptyContainer}>
          <Ionicons name="trophy-outline" size={36} color={colors.textSecondary} />
          <Text style={styles.empty}>Empieza a entrenar para ver tus records personales</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <Text style={styles.title}>{t("stats.personalRecords")}</Text>
      {records.map((record, index) => (
        <RecordItem
          key={index}
          exercise={record.exercise}
          weight={record.weight}
          reps={record.reps}
        />
      ))}
    </View>
  );
}

type RecordItemProps = {
  exercise: string;
  weight: number;
  reps: number;
};

function RecordItem({ exercise, weight, reps }: RecordItemProps) {
  const rm = calculate1RM(weight, reps);
  return (
    <View style={styles.card}>
      <Text style={styles.exercise}>{exercise}</Text>
      <View style={styles.row}>
        <Text style={styles.label}>PR</Text>
        <Text style={styles.value}>{weight} kg</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>1RM est.</Text>
        <Text style={styles.value}>{rm} kg</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({

  section: {
    marginTop: 30,
  },

  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },

  card: {
    backgroundColor: colors.card,
    borderRadius: spacing.borderRadius,
    padding: 16,
    marginBottom: 10,
  },

  exercise: {
    color: colors.text,
    fontWeight: "600",
    marginBottom: 8,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },

  label: {
    color: colors.textSecondary,
  },

  value: {
    color: colors.primary,
    fontWeight: "bold",
  },

  emptyContainer: {
    alignItems: "center",
    paddingVertical: 32,
    gap: 10,
  },

  empty: {
    color: colors.textSecondary,
    textAlign: "center",
  },

});
