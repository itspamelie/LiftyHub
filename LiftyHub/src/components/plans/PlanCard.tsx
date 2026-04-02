import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing } from "@/src/styles/globalstyles";
import { useLanguage } from "@/src/context/LanguageContext";

type Feature = {
  label: string;
  included: boolean;
};

type Props = {
  title: string;
  description: string;
  price: string;
  features: Feature[];
  recommended?: boolean;
  isCurrent?: boolean;
  accentColor?: string;
  onSelect?: () => void;
};

export default function PlanCard({
  title,
  description,
  price,
  features,
  recommended,
  isCurrent,
  accentColor = colors.primary,
  onSelect,
}: Props) {

  const { t } = useLanguage();

  return (
    <View style={[styles.card, isCurrent && { borderColor: accentColor, borderWidth: 2 }, recommended && !isCurrent && { borderColor: accentColor, borderWidth: 1 }]}>

      {/* Badges */}
      <View style={styles.badges}>
        {isCurrent && (
          <View style={[styles.badge, { backgroundColor: accentColor }]}>
            <Ionicons name="checkmark-circle" size={12} color="white" />
            <Text style={styles.badgeText}>Plan actual</Text>
          </View>
        )}
        {recommended && !isCurrent && (
          <View style={[styles.badge, { backgroundColor: accentColor }]}>
            <Ionicons name="star" size={12} color="white" />
            <Text style={styles.badgeText}>Recomendado</Text>
          </View>
        )}
      </View>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: accentColor }]}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        <Text style={[styles.price, isCurrent && { color: accentColor }]}>{price}</Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Features */}
      {features.map((feature, index) => (
        <View key={index} style={styles.featureRow}>
          <Ionicons
            name={feature.included ? "checkmark-circle" : "close-circle"}
            size={18}
            color={feature.included ? accentColor : "#555"}
          />
          <Text style={[styles.featureText, !feature.included && styles.featureTextDisabled]}>
            {feature.label}
          </Text>
        </View>
      ))}

      {/* Select button */}
      {onSelect && !isCurrent && (
        <>
          <View style={styles.divider} />
          <TouchableOpacity
            style={[styles.selectBtn, { backgroundColor: accentColor }]}
            onPress={onSelect}
          >
            <Text style={styles.selectBtnText}>{t("payment.selectPlan")}</Text>
          </TouchableOpacity>
        </>
      )}

    </View>
  );
}

const styles = StyleSheet.create({

  card: {
    backgroundColor: "#1C1C1E",
    borderRadius: spacing.borderRadius,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },

  recommendedCard: {
    borderColor: "#3B82F6",
    borderWidth: 1,
  },

  badges: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  badgeText: {
    color: "white",
    fontSize: 11,
    fontWeight: "700",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 2,
  },

  description: {
    color: "#A1A1A1",
    fontSize: 13,
  },

  price: {
    color: "white",
    fontSize: 17,
    fontWeight: "700",
  },

  divider: {
    height: 1,
    backgroundColor: "#2A2A2A",
    marginBottom: 14,
  },

  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },

  featureText: {
    color: "white",
    fontSize: 14,
  },

  featureTextDisabled: {
    color: "#555",
  },

  selectBtn: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 14,
  },

  selectBtnText: {
    color: "white",
    fontSize: 15,
    fontWeight: "700",
  },

});
