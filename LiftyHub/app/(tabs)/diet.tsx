import {
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  View,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import { useState, useEffect, useCallback } from "react";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { useLanguage } from "@/src/context/LanguageContext";
import { useSubscription } from "@/src/context/SubscriptionContext";
import { colors, spacing } from "@/src/styles/globalstyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDietPlans } from "@/src/services/api";
import { useToast } from "@/src/hooks/useToast";
import { useNetworkStatus } from "@/src/hooks/useNetworkStatus";
import { saveCache, loadCache } from "@/src/utils/cache";
import OfflineBanner from "@/src/components/OfflineBanner";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const PLAN_OPTIONS = [
  {
    name: "Meal",
    price: "$400/mes",
    color: "#10B981",
    features: ["Nutriólogo personal", "Plan de dieta personalizado", "Suplementos recomendados"],
  },
  {
    name: "Pro",
    price: "$600/mes",
    color: "#F59E0B",
    features: ["Nutriólogo personal", "Plan de dieta personalizado", "Suplementos recomendados", "Estadísticas avanzadas", "Rutinas ilimitadas"],
    highlighted: true,
  },
];

export default function DietScreen() {

  const { t } = useLanguage();
  const { showToast, Toast } = useToast();
  const { planLevel, loading: subLoading } = useSubscription();
  const isConnected = useNetworkStatus();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [dietPlan, setDietPlan] = useState<any>(null);

  const hasAccess = planLevel >= 2;

  const loadDietPlan = useCallback(async (isRefresh = false) => {
    let userId: number | null = null;
    try {
      const token = await AsyncStorage.getItem("token");
      const userStorage = await AsyncStorage.getItem("user");
      if (!token || !userStorage) return;

      const user = JSON.parse(userStorage);
      userId = user.id;
      const data = await getDietPlans(token);
      const plans = data?.data ?? [];
      const userPlan = plans.find((p: any) => p.user_id === user.id) ?? null;
      setDietPlan(userPlan);
      await saveCache("dietPlan_" + user.id, userPlan);
    } catch {
      const cached = userId ? await loadCache<any>("dietPlan_" + userId) : null;
      if (cached !== null) setDietPlan(cached);
      else showToast(t("diet.errorLoad"), "error");
    } finally {
      setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadDietPlan(); }, [loadDietPlan]);

  useEffect(() => {
    if (!subLoading && !hasAccess) setShowUpgradeModal(true);
  }, [subLoading, hasAccess]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadDietPlan(true);
  };

  if (loading || subLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {!isConnected && <OfflineBanner />}

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        scrollEnabled={hasAccess}
        refreshControl={
          hasAccess
            ? <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary} />
            : undefined
        }
      >
        <Text style={styles.title}>{t("diet.title")}</Text>

        {dietPlan ? (
          /* ── TIENE PLAN ASIGNADO ── */
          <TouchableOpacity style={styles.planCard} onPress={() => router.push("/diet/plan")}>
            <View style={styles.planCardHeader}>
              <Ionicons name="nutrition" size={24} color={colors.primary} />
              <Text style={styles.planCardTitle}>{t("diet.planTitle")}</Text>
              <View style={styles.planStatusBadge}>
                <Text style={styles.planStatusText}>{dietPlan.status}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.planRow}>
              <Ionicons name="flag" size={16} color={colors.textSecondary} />
              <Text style={styles.planLabel}>{t("diet.goal")}</Text>
              <Text style={styles.planValue}>{dietPlan.goal}</Text>
            </View>
            <View style={styles.planRow}>
              <Ionicons name="calendar" size={16} color={colors.textSecondary} />
              <Text style={styles.planLabel}>{t("diet.duration")}</Text>
              <Text style={styles.planValue}>{dietPlan.duration_days} {t("diet.days")}</Text>
            </View>
            {dietPlan.notes ? (
              <View style={styles.notesBox}>
                <Text style={styles.notesLabel}>{t("diet.nutritionistNotes")}</Text>
                <Text style={styles.notesText}>{dietPlan.notes}</Text>
              </View>
            ) : null}
            <View style={styles.seeDetailRow}>
              <Text style={styles.seeDetailText}>{t("diet.seeDetail")}</Text>
              <Ionicons name="arrow-forward" size={16} color={colors.primary} />
            </View>
          </TouchableOpacity>
        ) : (
          /* ── SIN PLAN — EMPTY STATE ── */
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBg}>
              <Ionicons name="nutrition" size={40} color={colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>{t("diet.emptyTitle")}</Text>
            <Text style={styles.emptySubtitle}>{t("diet.emptySubtitle")}</Text>
            <TouchableOpacity
              style={styles.chooseBtn}
              onPress={() => router.push("/diet/nutritionists")}
            >
              <Ionicons name="person-add" size={18} color="white" />
              <Text style={styles.chooseBtnText}>{t("diet.chooseNutritionist")}</Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>

      {/* BLUR si no tiene acceso */}
      {!hasAccess && (
        <BlurView intensity={55} tint="dark" style={StyleSheet.absoluteFill} pointerEvents="box-none" />
      )}

      {!hasAccess && !showUpgradeModal && (
        <View style={styles.unlockBar}>
          <TouchableOpacity style={styles.unlockButton} onPress={() => setShowUpgradeModal(true)}>
            <Ionicons name="lock-closed" size={16} color="white" />
            <Text style={styles.unlockText}>{t("diet.unlockBtn")}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* MODAL UPGRADE */}
      <Modal visible={showUpgradeModal} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowUpgradeModal(false)}>
          <TouchableOpacity activeOpacity={1} style={styles.modalContent} onPress={() => {}}>
            <TouchableOpacity style={styles.modalClose} onPress={() => setShowUpgradeModal(false)}>
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </TouchableOpacity>
            <View style={styles.modalIcon}>
              <Ionicons name="nutrition" size={32} color={colors.primary} />
            </View>
            <Text style={styles.modalTitle}>{t("diet.upgradeTitle")}</Text>
            <Text style={styles.modalSubtitle}>{t("diet.upgradeSubtitle")}</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {PLAN_OPTIONS.map((plan) => (
                <TouchableOpacity
                  key={plan.name}
                  style={[styles.planOptionCard, plan.highlighted && { borderColor: plan.color, borderWidth: 2 }]}
                  onPress={() => { setShowUpgradeModal(false); router.push("/settings/plans"); }}
                >
                  {plan.highlighted && (
                    <View style={[styles.planBadge, { backgroundColor: plan.color }]}>
                      <Text style={styles.planBadgeText}>{t("diet.recommended")}</Text>
                    </View>
                  )}
                  <View style={styles.planHeader}>
                    <Text style={[styles.planName, { color: plan.color }]}>{plan.name}</Text>
                    <Text style={styles.planPrice}>{plan.price}</Text>
                  </View>
                  {plan.features.map((f, i) => (
                    <View key={i} style={styles.planFeature}>
                      <Ionicons name="checkmark-circle" size={16} color={plan.color} />
                      <Text style={styles.planFeatureText}>{f}</Text>
                    </View>
                  ))}
                </TouchableOpacity>
              ))}
              <Text style={styles.modalNote}>{t("diet.upgradeNote")}</Text>
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {Toast}
    </View>
  );
}

const styles = StyleSheet.create({

  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    padding: spacing.screenPadding,
    paddingTop: 60,
    paddingBottom: 100,
    flexGrow: 1,
  },

  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 24,
  },

  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 24,
    gap: 12,
    backgroundColor: "#1C1C1E",
    borderRadius: 18,
    marginTop: "auto",
    marginBottom: "auto",
  },

  emptyIconBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(59,130,246,0.12)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },

  emptyTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },

  emptySubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },

  chooseBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: spacing.borderRadius,
    marginTop: 8,
  },

  chooseBtnText: {
    color: "white",
    fontSize: 15,
    fontWeight: "700",
  },

  planCard: {
    backgroundColor: "#1C1C1E",
    borderRadius: 18,
    padding: 20,
  },

  planCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },

  planCardTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    flex: 1,
  },

  planStatusBadge: {
    backgroundColor: "rgba(22,163,74,0.15)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#16a34a",
  },

  planStatusText: {
    color: "#16a34a",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },

  divider: {
    height: 1,
    backgroundColor: "#2A2A2A",
    marginBottom: 14,
  },

  planRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },

  planLabel: {
    color: colors.textSecondary,
    fontSize: 14,
    flex: 1,
  },

  planValue: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },

  notesBox: {
    backgroundColor: "#2C2C2E",
    borderRadius: 12,
    padding: 14,
    marginTop: 6,
    gap: 6,
  },

  notesLabel: {
    color: colors.textSecondary,
    fontSize: 12,
  },

  notesText: {
    color: "white",
    fontSize: 14,
    lineHeight: 20,
  },

  seeDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 4,
    marginTop: 12,
  },

  seeDetailText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },

  unlockBar: {
    position: "absolute",
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: "center",
  },

  unlockButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: spacing.borderRadius,
    gap: 8,
  },

  unlockText: {
    color: "white",
    fontWeight: "700",
    fontSize: 15,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },

  modalContent: {
    backgroundColor: "#1C1C1E",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 48,
    maxHeight: SCREEN_HEIGHT * 0.85,
  },

  modalClose: {
    alignSelf: "flex-end",
    padding: 4,
  },

  modalIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(59,130,246,0.15)",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 16,
  },

  modalTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },

  modalSubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },

  planOptionCard: {
    backgroundColor: "#2C2C2E",
    borderRadius: spacing.borderRadius,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "transparent",
  },

  planBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 8,
  },

  planBadgeText: {
    color: "white",
    fontSize: 11,
    fontWeight: "700",
  },

  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  planName: {
    fontSize: 18,
    fontWeight: "700",
  },

  planPrice: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  planFeature: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },

  planFeatureText: {
    color: colors.textSecondary,
    fontSize: 13,
  },

  modalNote: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
  },

});
