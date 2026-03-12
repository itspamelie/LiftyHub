import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing } from "@/src/styles/globalstyles";

type Props = {
  icon: string;
  label: string;
  value: string;
};

export default function StatSummaryCard({ icon, label, value }: Props) {
  return (
    <View style={styles.card}>

      <Ionicons name={icon as any} size={22} color={colors.primary} />

      <Text style={styles.value}>{value}</Text>

      <Text style={styles.label}>{label}</Text>

    </View>
  );
}

const styles = StyleSheet.create({

  card: {
    backgroundColor: colors.card,
    borderRadius: spacing.borderRadius,
    padding: 18,
    width: "48%",
    alignItems: "center"
  },

  value: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8
  },

  label: {
    color: colors.textSecondary,
    marginTop: 4
  }

});