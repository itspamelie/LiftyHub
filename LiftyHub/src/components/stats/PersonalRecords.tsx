import { View, Text, StyleSheet } from "react-native";
import { colors, spacing } from "@/src/styles/globalstyles";
import { useLanguage } from "@/src/context/LanguageContext";

type Record = {
  exercise: string;
  weight: number;
  reps: number;
};

export default function PersonalRecords() {

  const { t } = useLanguage();

  // ⚠️ Estos datos luego vendrán del backend
  const records: Record[] = [
    { exercise: "Bench Press", weight: 90, reps: 5 },
    { exercise: "Squat", weight: 120, reps: 4 },
    { exercise: "Deadlift", weight: 150, reps: 3 }
  ];

  // 🧠 Si el usuario aún no tiene datos
  if (records.length === 0) {
    return (
      <View style={styles.section}>
        <Text style={styles.title}>{t("stats.personalRecords")}</Text>

        <Text style={styles.empty}>{t("stats.noRecords")}</Text>
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

// 🧠 Calcula el One Rep Max
function calculate1RM(weight: number, reps: number) {
  return Math.round(weight * (1 + reps / 30));
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
        <Text style={styles.label}>1RM</Text>
        <Text style={styles.value}>{rm} kg</Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  section: {
    marginTop: 30
  },

  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12
  },

  card: {
    backgroundColor: colors.card,
    borderRadius: spacing.borderRadius,
    padding: 16,
    marginBottom: 10
  },

  exercise: {
    color: colors.text,
    fontWeight: "600",
    marginBottom: 8
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4
  },

  label: {
    color: colors.textSecondary
  },

  value: {
    color: colors.primary,
    fontWeight: "bold"
  },

  empty: {
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 10
  }

});