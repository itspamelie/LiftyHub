import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing } from "@/src/styles/globalstyles";
import { useLanguage } from "@/src/context/LanguageContext";

export default function WeeklyActivityChart() {

  const { t } = useLanguage();

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{t("stats.weeklyActivity")}</Text>
      <View style={styles.empty}>
        <Ionicons name="bar-chart-outline" size={36} color={colors.textSecondary} />
        <Text style={styles.emptyText}>Empieza a entrenar para ver tu actividad semanal</Text>
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
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 15
  },

  chartWrapper: {
    width: "100%",
    overflow: "hidden"
  },

  empty: {
    alignItems: "center",
    paddingVertical: 32,
    gap: 10,
  },

  emptyText: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
  }

});