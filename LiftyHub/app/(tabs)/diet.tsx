import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLanguage } from "@/src/context/LanguageContext";
import { colors, spacing } from "@/src/styles/globalstyles";

export default function DietScreen() {
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconBg}>
          <Ionicons name="nutrition" size={44} color={colors.primary} />
        </View>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>{t("diet.comingSoon")}</Text>
        </View>

        <Text style={styles.title}>{t("diet.comingSoonTitle")}</Text>
        <Text style={styles.subtitle}>{t("diet.comingSoonSubtitle")}</Text>

        <View style={styles.featureList}>
          {(["diet.feature1", "diet.feature2", "diet.feature3"] as const).map((key) => (
            <View key={key} style={styles.featureRow}>
              <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
              <Text style={styles.featureText}>{t(key)}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.screenPadding,
  },
  card: {
    backgroundColor: "#1C1C1E",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    width: "100%",
    gap: 12,
  },
  iconBg: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "rgba(59,130,246,0.12)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  badge: {
    backgroundColor: "rgba(59,130,246,0.15)",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: colors.primary + "55",
  },
  badgeText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  title: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 4,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 8,
  },
  featureList: {
    width: "100%",
    gap: 10,
    marginTop: 4,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  featureText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
});
