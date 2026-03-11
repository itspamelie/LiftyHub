import { View, Text, StyleSheet } from "react-native";
import { colors, spacing } from "@/src/styles/globalstyles";

export default function PersonalRecords() {
  return (
    <View style={styles.section}>

      <Text style={styles.title}>Récords personales</Text>

      <RecordItem exercise="Bench Press" weight="90 kg" />
      <RecordItem exercise="Squat" weight="120 kg" />
      <RecordItem exercise="Deadlift" weight="150 kg" />

    </View>
  );
}

function RecordItem({ exercise, weight }: any) {
  return (
    <View style={styles.card}>
      <Text style={styles.exercise}>{exercise}</Text>
      <Text style={styles.weight}>{weight}</Text>
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
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10
  },

  exercise: {
    color: colors.text
  },

  weight: {
    color: colors.primary,
    fontWeight: "bold"
  }

});