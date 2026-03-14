import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing } from "@/src/styles/globalstyles";
import AnimatedStatNumber from "@/src/components/Animations/AnimatedStatNumber";

type Props = {
  icon: string;
  label: string;
  value: number;
  trigger?: number;
};

export default function StatSummaryCard({ icon, label, value, trigger = 0 }: Props) {

  return (
    <View style={styles.card}>

      <Ionicons name={icon as any} size={22} color={colors.primary} />

      <AnimatedStatNumber
        value={value}
        trigger={trigger}
        style={styles.value}
      />

      <Text style={styles.label}>{label}</Text>

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    backgroundColor: colors.card,
    borderRadius: spacing.borderRadius,
    padding: 16,
    gap: 8
  },

  value: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "bold"
  },

  label: {
    color: colors.textSecondary,
    fontSize: 12
  }
});