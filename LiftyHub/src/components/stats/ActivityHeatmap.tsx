import { View, Text, StyleSheet } from "react-native";
import { colors, spacing } from "@/src/styles/globalstyles";

export default function ActivityHeatmap({ refreshTrigger = 0 }: { refreshTrigger?: number }) {
  console.log("[ActivityHeatmap] render");

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Actividad (test)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: spacing.borderRadius,
    padding: 20,
    marginTop: 20,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
});
