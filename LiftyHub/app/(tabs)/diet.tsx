import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Dimensions,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as Storage from "@/src/utils/storage";
import { getDietRequestByUser, getNutritionProfileByUser, getPlanDaysByPlan, getDietPlans } from "@/src/services/api";
import { colors, spacing } from "@/src/styles/globalstyles";
import { useLanguage } from "@/src/context/LanguageContext";
import { useSubscription } from "@/src/context/SubscriptionContext";
import HapticButton from "@/src/components/buttons/HapticButton";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

type DietRequest = {
  id: number;
  status: "pending" | "paid" | "in_progress" | "completed" | "cancelled";
  year: number;
  month: number;
  created_at: string;
  nutritionist: { id: number; name: string } | null;
  diet_plan: any | null;
};

const PLAN_OPTIONS = [
  {
    name: "Meal",
    price: "$149/mes",
    color: "#10B981",
    featuresEs: ["Plan alimenticio mensual","Suplementación incluida","Asignación de nutriólogo"],
    featuresEn: ["Monthly meal plan","Supplementation included","Nutritionist assignment"],
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$229/mes",
    color: "#F59E0B",
    featuresEs: ["Todo lo del plan Meal","Rutinas ilimitadas","Escaneo QR ilimitado","Plan de entrenamiento"],
    featuresEn: ["Everything in Meal plan","Unlimited routines","Unlimited QR scanning","Training plan"],
    highlighted: true,
  },
];

export default function DietScreen() {
  const { t, language } = useLanguage();
  const { plan } = useSubscription();

  const [loading, setLoading] = useState(true);
  const [request, setRequest] = useState<DietRequest | null>(null);
  const [hasQuestionnaire, setHasQuestionnaire] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [planDays, setPlanDays] = useState<any[]>([]);
  const [planLoading, setPlanLoading] = useState(false);
  const [expandedDay, setExpandedDay] = useState<string | null>("monday");

  const hasDietAccess = plan?.name === "Meal" || plan?.name === "Pro";

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const token = await Storage.getItem("token");
      const userStorage = await Storage.getItem("user");
      if (!token || !userStorage) return;
      const user = JSON.parse(userStorage);
      const [reqRes, qRes] = await Promise.all([
        getDietRequestByUser(user.id, token),
        getNutritionProfileByUser(user.id, token),
      ]);
      const req = reqRes?.data ?? null;
      setRequest(req);
      setHasQuestionnaire(!!qRes?.data);

      if (req?.diet_plan) {
        setPlanLoading(true);
        try {
          // Fetch ALL plans for this user and use the latest (hasOne returns oldest)
          const allPlansRes = await getDietPlans(token);
          const allPlans: any[] = allPlansRes?.data ?? [];
          const latestPlan = allPlans
            .filter((p: any) => Number(p.user_id) === Number(user.id))
            .sort((a: any, b: any) => b.id - a.id)[0] ?? req.diet_plan;

          // Patch the request object so renderContent uses the latest plan
          req.diet_plan = latestPlan;
          setRequest({ ...req });

          const daysRes = await getPlanDaysByPlan(latestPlan.id, token);
          setPlanDays(daysRes?.data ?? []);
        } finally {
          setPlanLoading(false);
        }
      } else {
        setPlanDays([]);
      }
    } catch {
      // silencioso
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
      if (!hasDietAccess) setShowUpgradeModal(true);
    }, [load, hasDietAccess])
  );

  // ─── CONTENIDO SEGÚN ESTADO ──────────────────────────────────
  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }

    if (!request || request.status === "cancelled") {
      return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.heroSection}>
            <View style={styles.heroIcon}>
              <Ionicons name="nutrition" size={44} color={colors.primary} />
            </View>
            <Text style={styles.heroTitle}>{t("diet.heroTitle")}</Text>
            <Text style={styles.heroSubtitle}>{t("diet.heroSubtitle")}</Text>
          </View>

          <View style={styles.featureCard}>
            {[
              { icon: "restaurant-outline" as const, key: "diet.featureMonthly" },
              { icon: "fitness-outline" as const, key: "diet.featureTraining" },
              { icon: "flask-outline" as const, key: "diet.featureSupplementation" },
              { icon: "trending-up-outline" as const, key: "diet.featureFollowUp" },
            ].map((item) => (
              <View key={item.key} style={styles.featureRow}>
                <View style={styles.featureIconBg}>
                  <Ionicons name={item.icon} size={16} color={colors.primary} />
                </View>
                <Text style={styles.featureText}>{t(item.key as any)}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => router.push("/diet/nutritionists" as any)}
            activeOpacity={0.85}
          >
            <Ionicons name="search-outline" size={18} color="white" />
            <Text style={styles.primaryBtnText}>{t("diet.exploreBtn")}</Text>
          </TouchableOpacity>
        </ScrollView>
      );
    }

    if (request.diet_plan) {
      if (planLoading) {
        return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;
      }

      const DAY_KEYS  = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];
      const locale = language === "en" ? "en-US" : "es-MX";
      // Monday = Jan 6 2025, Tuesday = Jan 7, ..., Sunday = Jan 12
      const DAY_SHORT = DAY_KEYS.map((_, i) =>
        new Date(2025, 0, 6 + i).toLocaleDateString(locale, { weekday: "narrow" }).toUpperCase()
      );
      const DAY_FULL: Record<string, string> = Object.fromEntries(
        DAY_KEYS.map((key, i) => [key, new Date(2025, 0, 6 + i).toLocaleDateString(locale, { weekday: "long" }).replace(/^\w/, c => c.toUpperCase())])
      );
      const dayMap: Record<string, any> = {};
      planDays.forEach(d => { dayMap[d.day] = d; });
      const totalKcal = (meals: any[]) => meals.reduce((s, m) => s + (Number(m.calories) || 0), 0);
      const plan = request.diet_plan;
      const activeDay = expandedDay ?? DAY_KEYS.find(k => dayMap[k]?.meals?.length > 0) ?? "monday";
      const activeDayData = dayMap[activeDay];
      const activeMeals = [...(activeDayData?.meals ?? [])].sort((a: any, b: any) => a.order - b.order);
      const activeSupps = [...(activeDayData?.supplements ?? [])].sort((a: any, b: any) => a.order - b.order);
      const activeKcal = totalKcal(activeMeals);

      return (
        <ScrollView style={styles.container} contentContainerStyle={styles.planContent} showsVerticalScrollIndicator={false}>

          {/* Header */}
          <View style={styles.planHeader}>
            <View style={[styles.statusIconBg, { backgroundColor: "rgba(34,197,94,0.12)" }]}>
              <Ionicons name="checkmark-circle" size={36} color="#22c55e" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.planTitle}>{t("diet.planReady")}</Text>
              <Text style={styles.planNutri}>{t("diet.preparedBy", { name: request.nutritionist?.name ?? t("nutritionistProfile.fallbackName") })}</Text>
            </View>
          </View>

          {/* Plan details */}
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="flag-outline" size={15} color={colors.textSecondary} />
              <Text style={styles.infoLabel}>{t("diet.goal")}</Text>
              <Text style={styles.infoValue}>{plan.goal ?? "—"}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={15} color={colors.textSecondary} />
              <Text style={styles.infoLabel}>{t("diet.duration")}</Text>
              <Text style={styles.infoValue}>{plan.duration_days ?? "—"} {t("diet.days")}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Ionicons name="stats-chart-outline" size={15} color={colors.textSecondary} />
              <Text style={styles.infoLabel}>{t("diet.type")}</Text>
              <Text style={styles.infoValue}>{plan.is_monodiet ? t("diet.monodiet") : t("diet.variedDiet")}</Text>
            </View>
            {plan.notes && plan.notes !== "Sin notas" && (
              <>
                <View style={styles.divider} />
                <View style={[styles.infoRow, { alignItems: "flex-start" }]}>
                  <Ionicons name="document-text-outline" size={15} color={colors.textSecondary} style={{ marginTop: 2 }} />
                  <Text style={styles.infoLabel}>{t("diet.notes")}</Text>
                  <Text style={[styles.infoValue, { flex: 2, textAlign: "right" }]}>{plan.notes}</Text>
                </View>
              </>
            )}
          </View>

          {/* Day strip */}
          <Text style={styles.planSectionTitle}>{t("diet.mealPlan")}</Text>

          <View style={styles.stripCard}>
            <View style={styles.stripRow}>
              {DAY_KEYS.map((key, i) => {
                const dayData = dayMap[key];
                const hasMeals = (dayData?.meals?.length ?? 0) > 0;
                const isActive = activeDay === key;
                return (
                  <TouchableOpacity key={key} style={styles.stripCol} onPress={() => setExpandedDay(key)} activeOpacity={0.7}>
                    <Text style={[styles.stripDayLabel, isActive && styles.stripDayLabelActive, !hasMeals && styles.stripDayLabelEmpty]}>
                      {DAY_SHORT[i]}
                    </Text>
                    <View style={[styles.stripDot, isActive && styles.stripDotActive, !hasMeals && styles.stripDotEmpty]}>
                      {hasMeals && !isActive && <View style={styles.stripDotInner} />}
                      {isActive && <Ionicons name="restaurant" size={14} color="white" />}
                      {!hasMeals && <Ionicons name="remove" size={12} color="#475569" />}
                    </View>
                    {hasMeals && (
                      <Text style={[styles.stripMealCount, isActive && { color: colors.primary }]}>
                        {dayData.meals.length}
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Selected day content */}
          <View style={styles.dayContentCard}>
            <View style={styles.dayContentHeader}>
              <Text style={styles.dayContentTitle}>{DAY_FULL[activeDay]}</Text>
              {activeKcal > 0 && (
                <View style={styles.kcalBadge}>
                  <Text style={styles.kcalBadgeText}>{activeKcal} kcal</Text>
                </View>
              )}
            </View>

            {activeMeals.length === 0 && activeSupps.length === 0 ? (
              <View style={{ alignItems: "center", paddingVertical: 20, gap: 8 }}>
                <Ionicons name="moon-outline" size={24} color={colors.textSecondary} />
                <Text style={{ color: colors.textSecondary, fontSize: 13 }}>{t("diet.noMealsDay")}</Text>
              </View>
            ) : (
              <>
                {activeMeals.length > 0 && (
                  <>
                    <View style={styles.subHeader}>
                      <Ionicons name="restaurant" size={12} color={colors.primary} />
                      <Text style={styles.subHeaderText}>{t("diet.mealsLabel")}</Text>
                    </View>
                    {activeMeals.map((meal: any, idx: number) => (
                      <View key={meal.id ?? idx} style={styles.mealItem}>
                        <View style={styles.mealTop}>
                          <View style={styles.mealIcon}>
                            <Ionicons name="restaurant" size={14} color={colors.primary} />
                          </View>
                          <Text style={styles.mealName}>{meal.name}</Text>
                          {Number(meal.calories) > 0 && (
                            <View style={styles.calBadge}>
                              <Text style={styles.calText}>{meal.calories} kcal</Text>
                            </View>
                          )}
                        </View>
                        {meal.description && meal.description !== "Sin descripción" && (
                          <Text style={styles.mealDesc}>{meal.description}</Text>
                        )}
                      </View>
                    ))}
                  </>
                )}
                {activeSupps.length > 0 && (
                  <>
                    <View style={[styles.subHeader, { marginTop: activeMeals.length > 0 ? 10 : 0 }]}>
                      <Ionicons name="flask" size={12} color="#8B5CF6" />
                      <Text style={[styles.subHeaderText, { color: "#8B5CF6" }]}>{t("diet.supplementsLabel")}</Text>
                    </View>
                    {activeSupps.map((s: any, idx: number) => (
                      <View key={s.id ?? idx} style={styles.suppItem}>
                        <View style={[styles.suppDot, { backgroundColor: s.color ?? "#8B5CF6" }]} />
                        <View style={{ flex: 1 }}>
                          <View style={styles.mealTop}>
                            <Text style={styles.suppName}>{s.name}</Text>
                            {s.amount && (
                              <View style={styles.amountBadge}>
                                <Text style={styles.amountText}>{s.amount}</Text>
                              </View>
                            )}
                          </View>
                          {s.instructions && <Text style={styles.suppInstructions}>{s.instructions}</Text>}
                        </View>
                      </View>
                    ))}
                  </>
                )}
              </>
            )}
          </View>

        </ScrollView>
      );
    }

    if (request.status === "pending" || request.status === "paid") {
      return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.statusHeader}>
            <View style={[styles.statusIconBg, { backgroundColor: "rgba(251,191,36,0.12)" }]}>
              <Ionicons name="time-outline" size={40} color="#FBBF24" />
            </View>
            <Text style={styles.statusTitle}>{t("diet.requestSentTitle")}</Text>
            <Text style={styles.statusSubtitle}>{t("diet.requestPendingSubtitle")}</Text>
          </View>
          <View style={styles.infoCard}>
            <InfoRow icon="person-outline" label={t("diet.nutritionistLabel")} value={request.nutritionist?.name ?? "—"} />
            <View style={styles.divider} />
            <InfoRow icon="calendar-outline" label={t("diet.periodLabel")} value={new Date(request.year, (request.month ?? 1) - 1, 1).toLocaleDateString(language === "en" ? "en-US" : "es-MX", { month: "long", year: "numeric" }).replace(/^\w/, c => c.toUpperCase())} />
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Ionicons name="ellipse" size={10} color="#FBBF24" />
              <Text style={styles.infoLabel}>{t("diet.statusLabel")}</Text>
              <Text style={[styles.infoValue, { color: "#FBBF24" }]}>{t("diet.pendingAcceptance")}</Text>
            </View>
          </View>
          <Text style={styles.hintText}>{t("diet.requestHint")}</Text>
        </ScrollView>
      );
    }

    if (request.status === "in_progress") {
      if (!hasQuestionnaire) {
        return (
          <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.statusHeader}>
              <View style={[styles.statusIconBg, { backgroundColor: "rgba(34,197,94,0.12)" }]}>
                <Ionicons name="checkmark-circle-outline" size={40} color="#22c55e" />
              </View>
              <Text style={styles.statusTitle}>{t("diet.requestAccepted")}</Text>
              <Text style={styles.statusSubtitle}>{t("diet.requestAcceptedSubtitle", { name: request.nutritionist?.name ?? t("nutritionistProfile.fallbackName") })}</Text>
            </View>
            <View style={styles.actionCard}>
              <Ionicons name="document-text-outline" size={28} color={colors.primary} style={{ marginBottom: 10 }} />
              <Text style={styles.actionCardTitle}>{t("diet.fillQuestionnaire")}</Text>
              <Text style={styles.actionCardDesc}>{t("diet.fillQuestionnaireDesc")}</Text>
              <TouchableOpacity
                style={[styles.primaryBtn, { marginTop: 16 }]}
                onPress={() => router.push({ pathname: "/diet/questionnaire", params: { requestId: request.id } } as any)}
                activeOpacity={0.85}
              >
                <Ionicons name="create-outline" size={18} color="white" />
                <Text style={styles.primaryBtnText}>{t("diet.fillQuestionnaireBtn")}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        );
      }

      return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.statusHeader}>
            <View style={[styles.statusIconBg, { backgroundColor: "rgba(59,130,246,0.12)" }]}>
              <Ionicons name="hourglass-outline" size={40} color={colors.primary} />
            </View>
            <Text style={styles.statusTitle}>{t("diet.planInProgress")}</Text>
            <Text style={styles.statusSubtitle}>{t("diet.planInProgressSubtitle", { name: request.nutritionist?.name ?? t("nutritionistProfile.fallbackName") })}</Text>
          </View>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="checkmark-circle" size={15} color="#22c55e" />
              <Text style={styles.infoLabel}>{t("diet.questionnaireLabel")}</Text>
              <Text style={[styles.infoValue, { color: "#22c55e" }]}>{t("diet.completedLabel")}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Ionicons name="ellipse" size={10} color={colors.primary} />
              <Text style={styles.infoLabel}>{t("diet.statusLabel")}</Text>
              <Text style={[styles.infoValue, { color: colors.primary }]}>{t("diet.inProgressLabel")}</Text>
            </View>
          </View>
          <Text style={styles.hintText}>{t("diet.planHint")}</Text>
        </ScrollView>
      );
    }

    if (request.status === "completed") {
      // Plan should be accessible via dietPlan check above; this is a fallback
      return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.statusHeader}>
            <View style={[styles.statusIconBg, { backgroundColor: "rgba(34,197,94,0.12)" }]}>
              <Ionicons name="checkmark-circle" size={40} color="#22c55e" />
            </View>
            <Text style={styles.statusTitle}>{t("diet.planCompleted")}</Text>
            <Text style={styles.statusSubtitle}>{t("diet.planCompletedSubtitle", { name: request.nutritionist?.name ?? t("nutritionistProfile.fallbackName") })}</Text>
          </View>
        </ScrollView>
      );
    }

    // fallback: cualquier otro estado muestra el hero
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <View style={styles.heroIcon}>
            <Ionicons name="nutrition" size={44} color={colors.primary} />
          </View>
          <Text style={styles.heroTitle}>{t("diet.heroTitle")}</Text>
          <Text style={styles.heroSubtitle}>{t("diet.heroSubtitle")}</Text>
        </View>
        <View style={styles.featureCard}>
          {[
            { icon: "restaurant-outline" as const, key: "diet.featureMonthly" },
            { icon: "fitness-outline" as const, key: "diet.featureTraining" },
            { icon: "flask-outline" as const, key: "diet.featureSupplementation" },
            { icon: "trending-up-outline" as const, key: "diet.featureFollowUp" },
          ].map((item) => (
            <View key={item.key} style={styles.featureRow}>
              <View style={styles.featureIconBg}>
                <Ionicons name={item.icon} size={16} color={colors.primary} />
              </View>
              <Text style={styles.featureText}>{t(item.key as any)}</Text>
            </View>
          ))}
        </View>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => router.push("/diet/nutritionists" as any)}
          activeOpacity={0.85}
        >
          <Ionicons name="search-outline" size={18} color="white" />
          <Text style={styles.primaryBtnText}>{t("diet.exploreBtn")}</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.pageHeader}>
        <Text style={styles.screenTitle}>{t("tabs.diet")}</Text>
        <Text style={styles.screenSubtitle}>{t("diet.screenSubtitle")}</Text>
      </View>
      <View style={styles.headerDivider} />
      {renderContent()}

      {/* OVERLAY DIFUMINADO — visible cuando no tiene acceso y cerró el modal */}
      {!hasDietAccess && !showUpgradeModal && (
        <>
          <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
          <View style={styles.lockedOverlay}>
            <View style={styles.lockedIconBg}>
              <Ionicons name="lock-closed" size={36} color="white" />
            </View>
            <Text style={styles.lockedTitle}>{t("diet.premiumFeature")}</Text>
            <Text style={styles.lockedSubtitle}>{t("diet.premiumOverlaySubtitle")}</Text>
            <HapticButton style={styles.unlockBtn} onPress={() => setShowUpgradeModal(true)}>
              <Ionicons name="lock-open-outline" size={18} color="white" />
              <Text style={styles.unlockBtnText}>{t("diet.unlockDiet")}</Text>
            </HapticButton>
          </View>
        </>
      )}

      {/* MODAL UPGRADE */}
      <Modal visible={!hasDietAccess && showUpgradeModal} transparent animationType="slide">
        <BlurView intensity={25} tint="dark" style={StyleSheet.absoluteFill} />
        <HapticButton style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowUpgradeModal(false)}>
          <HapticButton activeOpacity={1} style={styles.modalContent} onPress={() => {}}>
            <HapticButton style={styles.modalClose} onPress={() => setShowUpgradeModal(false)}>
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </HapticButton>
            <View style={styles.modalIcon}>
              <Ionicons name="nutrition" size={32} color="#10B981" />
            </View>
            <Text style={styles.modalTitle}>{t("diet.premiumFeature")}</Text>
            <Text style={styles.modalSubtitle}>{t("diet.premiumModalSubtitle")}</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {PLAN_OPTIONS.map((opt) => {
                const features = language === "en" ? opt.featuresEn : opt.featuresEs;
                return (
                  <HapticButton
                    key={opt.name}
                    style={[styles.planCard, opt.highlighted && { borderColor: opt.color, borderWidth: 2 }]}
                    onPress={() => { setShowUpgradeModal(false); router.push("/settings/plans" as any); }}
                  >
                    {opt.highlighted && (
                      <View style={[styles.planBadge, { backgroundColor: opt.color }]}>
                        <Text style={styles.planBadgeText}>{t("diet.recommended")}</Text>
                      </View>
                    )}
                    <View style={styles.planCardHeader}>
                      <Text style={[styles.planName, { color: opt.color }]}>{opt.name}</Text>
                      <Text style={styles.planPrice}>{opt.price}</Text>
                    </View>
                    {features.map((f, i) => (
                      <View key={i} style={styles.planFeature}>
                        <Ionicons name="checkmark-circle" size={16} color={opt.color} />
                        <Text style={styles.planFeatureText}>{f}</Text>
                      </View>
                    ))}
                  </HapticButton>
                );
              })}
              <Text style={styles.modalNote}>{t("diet.contactAdmin")}</Text>
            </ScrollView>
          </HapticButton>
        </HapticButton>
      </Modal>
    </View>
  );
}

function InfoRow({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={15} color={colors.textSecondary} />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: {
    flex: 1, backgroundColor: colors.background,
    justifyContent: "center", alignItems: "center", padding: 24,
  },
  content: { padding: spacing.screenPadding, paddingTop: 32, paddingBottom: 100, flexGrow: 1, justifyContent: "center" },
  pageHeader: { paddingTop: 54, paddingBottom: 16, paddingHorizontal: spacing.screenPadding, gap: 2 },
  screenTitle: { color: "white", fontSize: 28, fontWeight: "bold" },
  screenSubtitle: { color: colors.textSecondary, fontSize: 14 },
  headerDivider: { height: 1, backgroundColor: "#1C1C1E" },

  heroSection: { alignItems: "center", marginBottom: 24 },
  heroIcon: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: "rgba(59,130,246,0.12)",
    justifyContent: "center", alignItems: "center", marginBottom: 16,
  },
  heroTitle: { color: "white", fontSize: 24, fontWeight: "700", textAlign: "center", marginBottom: 10 },
  heroSubtitle: { color: colors.textSecondary, fontSize: 14, textAlign: "center", lineHeight: 21 },

  featureCard: { backgroundColor: "#1C1C1E", borderRadius: 18, padding: 18, marginBottom: 20, gap: 14 },
  featureRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  featureIconBg: {
    width: 32, height: 32, borderRadius: 8,
    backgroundColor: "rgba(59,130,246,0.1)",
    justifyContent: "center", alignItems: "center",
  },
  featureText: { color: colors.textSecondary, fontSize: 14 },

  primaryBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, backgroundColor: colors.primary,
    borderRadius: spacing.borderRadius, paddingVertical: 15, paddingHorizontal: 24,
  },
  primaryBtnText: { color: "white", fontSize: 15, fontWeight: "700" },

  statusHeader: { alignItems: "center", marginBottom: 24 },
  statusIconBg: {
    width: 88, height: 88, borderRadius: 44,
    justifyContent: "center", alignItems: "center", marginBottom: 16,
  },
  statusTitle: { color: "white", fontSize: 24, fontWeight: "700", textAlign: "center", marginBottom: 8 },
  statusSubtitle: { color: colors.textSecondary, fontSize: 14, textAlign: "center", lineHeight: 21 },

  infoCard: { backgroundColor: "#1C1C1E", borderRadius: 18, padding: 16, marginBottom: 16 },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 12 },
  infoLabel: { color: colors.textSecondary, fontSize: 14, flex: 1 },
  infoValue: { color: "white", fontSize: 14, fontWeight: "600" },
  divider: { height: 1, backgroundColor: "#2A2A2A" },

  hintText: { color: colors.textSecondary, fontSize: 13, textAlign: "center", lineHeight: 19, paddingHorizontal: 16 },

  actionCard: { backgroundColor: "#1C1C1E", borderRadius: 18, padding: 20, alignItems: "center", marginBottom: 16 },
  actionCardTitle: { color: "white", fontSize: 16, fontWeight: "700", textAlign: "center", marginBottom: 8 },
  actionCardDesc: { color: colors.textSecondary, fontSize: 13, textAlign: "center", lineHeight: 19 },

  // Modal
  modalOverlay: { flex: 1, justifyContent: "flex-end" },
  modalContent: {
    backgroundColor: "#1C1C1E",
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingBottom: 48,
    maxHeight: SCREEN_HEIGHT * 0.85,
  },
  modalClose: { alignSelf: "flex-end", padding: 4 },
  modalIcon: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: "rgba(16,185,129,0.15)",
    justifyContent: "center", alignItems: "center",
    alignSelf: "center", marginBottom: 16,
  },
  modalTitle: { color: "white", fontSize: 22, fontWeight: "700", textAlign: "center", marginBottom: 8 },
  modalSubtitle: { color: colors.textSecondary, fontSize: 14, textAlign: "center", marginBottom: 24, lineHeight: 20 },
  planCard: {
    backgroundColor: "#2C2C2E", borderRadius: spacing.borderRadius,
    padding: 16, marginBottom: 12, borderWidth: 1, borderColor: "transparent",
  },
  planBadge: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, marginBottom: 8 },
  planBadgeText: { color: "white", fontSize: 11, fontWeight: "700" },
  planCardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  planName: { fontSize: 18, fontWeight: "700" },
  planPrice: { color: "white", fontSize: 16, fontWeight: "600" },
  planFeature: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 },
  planFeatureText: { color: colors.textSecondary, fontSize: 13 },
  modalNote: { color: colors.textSecondary, fontSize: 12, textAlign: "center", marginTop: 8 },

  // Locked overlay
  lockedOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    gap: 12,
  },
  lockedIconBg: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center", alignItems: "center",
    marginBottom: 8,
  },
  lockedTitle: { color: "white", fontSize: 22, fontWeight: "700", textAlign: "center" },
  lockedSubtitle: { color: colors.textSecondary, fontSize: 14, textAlign: "center", lineHeight: 20, marginBottom: 8 },
  unlockBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, backgroundColor: colors.primary,
    borderRadius: spacing.borderRadius, paddingVertical: 14, paddingHorizontal: 28,
    marginTop: 4,
  },
  unlockBtnText: { color: "white", fontSize: 15, fontWeight: "700" },

  // Inline plan view
  planContent: { padding: 20, paddingBottom: 100 },
  planHeader: { flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 20 },
  planTitle: { color: "white", fontSize: 20, fontWeight: "700" },
  planNutri: { color: colors.textSecondary, fontSize: 13, marginTop: 2 },
  planSectionTitle: { color: "white", fontSize: 18, fontWeight: "bold", marginBottom: 12, marginTop: 20 },

  // Day strip (calendar-style)
  stripCard: { backgroundColor: "#1C1C1E", borderRadius: 18, padding: 16, marginBottom: 12 },
  stripRow: { flexDirection: "row", justifyContent: "space-between" },
  stripCol: { flex: 1, alignItems: "center", gap: 5 },
  stripDayLabel: { color: colors.textSecondary, fontSize: 11, fontWeight: "600" },
  stripDayLabelActive: { color: colors.primary },
  stripDayLabelEmpty: { color: "#334155" },
  stripDot: { width: 34, height: 34, borderRadius: 17, justifyContent: "center", alignItems: "center", backgroundColor: "#2C2C2E" },
  stripDotActive: { backgroundColor: colors.primary },
  stripDotEmpty: { backgroundColor: "#1A1A1C" },
  stripDotInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
  stripMealCount: { color: colors.textSecondary, fontSize: 9, fontWeight: "600" },

  // Day content panel
  dayContentCard: { backgroundColor: "#1C1C1E", borderRadius: 18, padding: 16, gap: 10 },
  dayContentHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 },
  dayContentTitle: { color: "white", fontSize: 16, fontWeight: "700" },
  kcalBadge: { backgroundColor: "rgba(34,197,94,0.12)", borderRadius: 10, paddingHorizontal: 10, paddingVertical: 3 },
  kcalBadgeText: { color: "#22c55e", fontSize: 12, fontWeight: "600" },

  mealItem: { backgroundColor: "#2C2C2E", borderRadius: 12, padding: 12, gap: 6 },
  mealTop: { flexDirection: "row", alignItems: "center", gap: 8 },
  mealIcon: { width: 28, height: 28, borderRadius: 8, backgroundColor: "rgba(59,130,246,0.12)", justifyContent: "center", alignItems: "center" },
  mealName: { color: "white", fontSize: 14, fontWeight: "600", flex: 1 },
  calBadge: { backgroundColor: "rgba(34,197,94,0.12)", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 },
  calText: { color: "#22c55e", fontSize: 11, fontWeight: "600" },
  mealDesc: { color: colors.textSecondary, fontSize: 13, lineHeight: 18, paddingLeft: 36 },
  subHeader: { flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 4 },
  subHeaderText: { color: colors.primary, fontSize: 10, fontWeight: "700", letterSpacing: 1 },
  suppItem: { backgroundColor: "#2C2C2E", borderRadius: 12, padding: 12, flexDirection: "row", alignItems: "flex-start", gap: 10, marginBottom: 6 },
  suppDot: { width: 10, height: 10, borderRadius: 5, marginTop: 4, flexShrink: 0 },
  suppName: { color: "white", fontSize: 14, fontWeight: "600", flex: 1 },
  amountBadge: { backgroundColor: "rgba(139,92,246,0.15)", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 },
  amountText: { color: "#8B5CF6", fontSize: 11, fontWeight: "600" },
  suppInstructions: { color: colors.textSecondary, fontSize: 12, lineHeight: 17, marginTop: 4 },
});
