import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing } from "@/src/styles/globalstyles";
import HapticButton from "@/src/components/buttons/HapticButton";

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  onPress?: () => void;
};

export default function InfoStatCard({ icon, label, value, onPress }: Props) {
  if (onPress) {
    return (
      <HapticButton style={styles.card} onPress={onPress}>
        <Ionicons name={icon} size={22} color={colors.textSecondary} />
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>

      </HapticButton>
    );
  }
  return (
    <View style={styles.card}>
      <Ionicons name={icon} size={22} color={colors.textSecondary} />
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({

  card: {
    backgroundColor: colors.card,
    borderRadius: spacing.borderRadius,
    padding: 16,
    width: "48%",
    marginBottom: 12
  },

  editIcon: {
    marginTop: 6,
  },

  label: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 6
  },

  value: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 4
  }

});