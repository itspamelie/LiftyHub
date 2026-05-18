import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Stack, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import PlanCard from "@/src/components/plans/PlanCard";
import { useLanguage } from "@/src/context/LanguageContext";
import { useSubscription } from "@/src/context/SubscriptionContext";
import { colors, planColors } from "@/src/styles/globalstyles";
import HapticButton from "@/src/components/buttons/HapticButton";

const PLANS = [
  { key: "Free",  label: "Free",  price: "Gratis",   color: planColors.Free  },
  { key: "Basic", label: "Basic", price: "$79/mes",  color: planColors.Basic },
  { key: "Meal",  label: "Meal",  price: "$149/mes", color: planColors.Meal  },
  { key: "Pro",   label: "Pro",   price: "$229/mes", color: planColors.Pro, recommended: true },
];

type RowValue = string | boolean;

type CompareRow = {
  label: string;
  icon: string;
  values: [RowValue, RowValue, RowValue, RowValue];
};

const COMPARE_ROWS: CompareRow[] = [
  { label: "Rutinas propias",      icon: "barbell-outline",      values: ["7",     "20",    "20",     "∞"]   },
  { label: "Rutinas de la app",    icon: "apps-outline",         values: [false,   true,    true,     true]  },
  { label: "Catálogo ejercicios",  icon: "fitness-outline",      values: [true,    true,    true,     true]  },
  { label: "Escanear QR",         icon: "qr-code-outline",      values: ["1/mes", "5/mes", "10/mes", "∞"]   },
  { label: "Compartir QR",        icon: "share-social-outline",  values: ["1/mes", "5/mes", "10/mes", "∞"]   },
  { label: "Estadísticas",        icon: "stats-chart-outline",   values: [false,   true,    true,     true]  },
  { label: "Músculos trabajados", icon: "body-outline",          values: ["7 días",true,   true,     true]  },
  { label: "Nutriólogo",          icon: "person-outline",        values: [false,   false,   true,     true]  },
  { label: "Plan de dieta",       icon: "nutrition-outline",     values: [false,   false,   true,     true]  },
  { label: "Suplementos",         icon: "flask-outline",         values: [false,   false,   true,     true]  },
  { label: "Generar rutina con IA", icon: "color-wand-outline",  values: [false,   false,   false,    true]  },
  { label: "Hidratación",          icon: "water-outline",        values: [false,   false,   false,    true]  },
];

// Widths calibrated to fit 4 plan columns without horizontal scroll (~375px screen)
const COL_W = 58;
const FEATURE_W = 110;

function CellValue({ value, color }: { value: RowValue; color: string }) {
  if (value === true)  return <Ionicons name="checkmark-circle" size={18} color={color} />;
  if (value === false) return <Text style={{ color: "#2A2A2A", fontSize: 18, lineHeight: 18 }}>—</Text>;
  return (
    <View style={[cellStyles.badge, { backgroundColor: color + "20" }]}>
      <Text style={[cellStyles.badgeText, { color }]}>{value}</Text>
    </View>
  );
}

const cellStyles = StyleSheet.create({
  badge: {
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 2,
    minWidth: 36,
    alignItems: "center",
  },
  badgeText: {
    fontSize: 9,
    fontWeight: "800",
    textAlign: "center",
  },
});

export default function Plans() {

  const { t } = useLanguage();
  const { plan: currentPlan } = useSubscription();
  const [activeTab, setActiveTab] = useState<"plans" | "compare">("plans");

  const planList = [
    {
      id: 1,
      title: "Free",
      description: t("plans.free"),
      price: "$0",
      accentColor: planColors.Free,
      features: [
        { label: t("plans.features.routines7"),     included: true  },
        { label: t("plans.features.appRoutines"),   included: false },
        { label: t("plans.features.scanQR1"),       included: true  },
        { label: t("plans.features.stats"),         included: false },
        { label: t("plans.features.nutritionist"),  included: false },
        { label: t("plans.features.dietPlan"),      included: false },
        { label: t("plans.features.supplements"),   included: false },
      ],
    },
    {
      id: 2,
      title: "Basic",
      description: "Más rutinas y seguimiento",
      price: "$79 " + t("plans.month"),
      accentColor: planColors.Basic,
      features: [
        { label: t("plans.features.routines20"),    included: true  },
        { label: t("plans.features.appRoutines"),   included: true  },
        { label: t("plans.features.scanQR5"),       included: true  },
        { label: t("plans.features.stats"),         included: true  },
        { label: t("plans.features.nutritionist"),  included: false },
        { label: t("plans.features.dietPlan"),      included: false },
        { label: t("plans.features.supplements"),   included: false },
      ],
    },
    {
      id: 4,
      title: "Meal",
      description: "Dieta + entrenamiento",
      price: "$149 " + t("plans.month"),
      accentColor: planColors.Meal,
      features: [
        { label: t("plans.features.routines20"),    included: true  },
        { label: t("plans.features.appRoutines"),   included: true  },
        { label: t("plans.features.scanQR10"),      included: true  },
        { label: t("plans.features.stats"),         included: true  },
        { label: t("plans.features.nutritionist"),  included: true  },
        { label: t("plans.features.dietPlan"),      included: true  },
        { label: t("plans.features.supplements"),   included: true  },
      ],
    },
    {
      id: 3,
      title: "Pro",
      description: "Acceso completo + nutriólogo",
      price: "$229 " + t("plans.month"),
      accentColor: planColors.Pro,
      recommended: true,
      features: [
        { label: t("plans.features.routinesUnlimited"), included: true },
        { label: t("plans.features.appRoutines"),        included: true },
        { label: t("plans.features.scanQRUnlimited"),    included: true },
        { label: t("plans.features.stats"),              included: true },
        { label: t("plans.features.nutritionist"),       included: true },
        { label: t("plans.features.dietPlan"),           included: true },
        { label: t("plans.features.supplements"),        included: true },
      ],
    },
  ];

  return (
    <View style={styles.container}>

      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <HapticButton style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="white" />
        </HapticButton>
        <Text style={styles.headerTitle}>{t("plans.title")}</Text>
      </View>

      {/* TAB NAVBAR */}
      <View style={styles.tabRow}>
        <HapticButton
          style={[styles.tabBtn, activeTab === "plans" && styles.tabBtnActive]}
          onPress={() => setActiveTab("plans")}
        >
          <Text style={[styles.tabBtnText, activeTab === "plans" && styles.tabBtnTextActive]}>Planes</Text>
        </HapticButton>
        <HapticButton
          style={[styles.tabBtn, activeTab === "compare" && styles.tabBtnActive]}
          onPress={() => setActiveTab("compare")}
        >
          <Text style={[styles.tabBtnText, activeTab === "compare" && styles.tabBtnTextActive]}>Comparar</Text>
        </HapticButton>
      </View>

      {activeTab === "plans" ? (

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.subtitle}>{t("plans.subtitle")}</Text>
          {planList.map((plan) => (
            <PlanCard
              key={plan.id}
              title={plan.title}
              description={plan.description}
              price={plan.price}
              features={plan.features}
              recommended={plan.recommended}
              isCurrent={currentPlan?.id === plan.id}
              accentColor={plan.accentColor}
              onSelect={plan.title !== "Free" ? () => router.push({
                pathname: "/settings/payment",
                params: { title: plan.title, price: plan.price, accentColor: plan.accentColor, planId: String(plan.id) },
              }) : undefined}
            />
          ))}
          <Text style={styles.note}>{t("plans.contact")}</Text>
        </ScrollView>

      ) : (

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.compareContent}>

          {/* Subtítulo */}
          <Text style={styles.compareSubtitle}>Elige el plan que mejor se adapta a ti</Text>

          {/* Tabla fija — sin scroll horizontal */}
          <View style={styles.table}>

            {/* Cabeceras */}
            <View style={styles.tableHeader}>
              <View style={styles.featureCol} />
              {PLANS.map((p) => (
                <View
                  key={p.key}
                  style={[styles.planHeaderCol, p.recommended && styles.planHeaderColHighlight]}
                >
                  {p.recommended && (
                    <View style={[styles.recommendedBadge, { backgroundColor: p.color }]}>
                      <Text style={styles.recommendedText}>TOP</Text>
                    </View>
                  )}
                  <Text style={[styles.planHeaderName, { color: p.color }]}>{p.label}</Text>
                  <Text style={styles.planHeaderPrice}>{p.price}</Text>
                  {currentPlan?.name === p.key && (
                    <View style={[styles.currentBadge, { borderColor: p.color }]}>
                      <Text style={[styles.currentBadgeText, { color: p.color }]}>Actual</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>

            {/* Filas */}
            {COMPARE_ROWS.map((row, i) => (
              <View key={i} style={[styles.tableRow, i % 2 !== 0 && styles.tableRowAlt]}>
                <View style={[styles.featureCell, styles.featureCol]}>
                  <Ionicons name={row.icon as any} size={12} color="#666" />
                  <Text style={styles.featureLabel}>{row.label}</Text>
                </View>
                {row.values.map((val, j) => (
                  <View key={j} style={[styles.valueCell, PLANS[j].recommended && styles.valueCellHighlight]}>
                    <CellValue value={val} color={PLANS[j].color} />
                  </View>
                ))}
              </View>
            ))}

            {/* Botones */}
            <View style={[styles.tableRow, styles.actionRow]}>
              <View style={styles.featureCol} />
              {PLANS.map((p) => (
                <View key={p.key} style={[styles.valueCell, p.recommended && styles.valueCellHighlight]}>
                  {p.key !== "Free" ? (
                    <HapticButton
                      style={[styles.selectBtn, { backgroundColor: p.color }]}
                      onPress={() => {
                        const found = planList.find(pl => pl.title === p.key);
                        if (found) router.push({
                          pathname: "/settings/payment",
                          params: { title: found.title, price: found.price, accentColor: found.accentColor, planId: String(found.id) },
                        });
                      }}
                    >
                      <Text style={styles.selectBtnText}>Elegir</Text>
                    </HapticButton>
                  ) : (
                    <View style={styles.freeBadge}>
                      <Text style={styles.freeBadgeText}>Free</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>

          </View>

          <Text style={styles.note}>{t("plans.contact")}</Text>

        </ScrollView>

      )}

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#0F0F10",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.card,
  },

  backBtn: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
  },

  tabRow: {
    flexDirection: "row",
    backgroundColor: "#1C1C1E",
    borderRadius: 12,
    padding: 4,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 4,
  },

  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },

  tabBtnActive: {
    backgroundColor: colors.primary,
  },

  tabBtnText: {
    color: "#A1A1A1",
    fontSize: 14,
    fontWeight: "600",
  },

  tabBtnTextActive: {
    color: "white",
  },

  // Plans tab
  content: {
    padding: 20,
    paddingBottom: 80,
  },

  subtitle: {
    color: "#A1A1A1",
    fontSize: 14,
    marginBottom: 24,
  },

  note: {
    color: "#555",
    fontSize: 12,
    textAlign: "center",
    marginTop: 20,
    marginBottom: 40,
  },

  // Compare tab
  compareContent: {
    paddingTop: 20,
    paddingBottom: 60,
    paddingHorizontal: 12,
  },

  compareSubtitle: {
    color: "#A1A1A1",
    fontSize: 13,
    marginBottom: 20,
    textAlign: "center",
  },

  table: {
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#222",
  },

  tableHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#111",
    paddingBottom: 8,
    paddingTop: 6,
  },

  featureCol: {
    flex: 2.2,
    paddingLeft: 10,
  },

  planHeaderCol: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 2,
    gap: 3,
  },

  planHeaderColHighlight: {
    backgroundColor: "#16163A",
  },

  recommendedBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 20,
  },

  recommendedText: {
    color: "white",
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 0.8,
  },

  planHeaderName: {
    fontSize: 12,
    fontWeight: "800",
    textAlign: "center",
  },

  planHeaderPrice: {
    color: "#555",
    fontSize: 9,
    fontWeight: "600",
    textAlign: "center",
  },

  currentBadge: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },

  currentBadgeText: {
    fontSize: 8,
    fontWeight: "700",
  },

  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 44,
  },

  tableRowAlt: {
    backgroundColor: "#141414",
  },

  featureCell: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingLeft: 10,
    paddingRight: 4,
  },

  featureLabel: {
    color: "#B0B0B0",
    fontSize: 11,
    fontWeight: "500",
    flexShrink: 1,
  },

  valueCell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },

  valueCellHighlight: {
    backgroundColor: "#12122A",
  },

  actionRow: {
    borderTopWidth: 1,
    borderTopColor: "#222",
    paddingVertical: 10,
    backgroundColor: "#111",
  },

  selectBtn: {
    borderRadius: 7,
    paddingVertical: 6,
    paddingHorizontal: 6,
    alignItems: "center",
    width: "85%",
  },

  selectBtnText: {
    color: "white",
    fontSize: 10,
    fontWeight: "700",
  },

  freeBadge: {
    borderRadius: 7,
    paddingVertical: 6,
    paddingHorizontal: 6,
    backgroundColor: "#222",
    alignItems: "center",
    width: "85%",
  },

  freeBadgeText: {
    color: "#555",
    fontSize: 10,
    fontWeight: "600",
  },

});
