import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Storage from "@/src/utils/storage";
import { getDietPlans, getDietPlanById, getNutritionistProfiles } from "@/src/services/api";
import { useLanguage } from "@/src/context/LanguageContext";
import NutritionistCard from "@/src/components/diet/NutritionistCard";
import DietTipCard from "@/src/components/diet/DietTipCard";
import BackButton from "@/src/components/buttons/backButton";
import { colors } from "@/src/styles/globalstyles";

const DAY_ORDER = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export default function DietPlanScreen() {
  const { t, language } = useLanguage();
  const locale = language === "en" ? "en-US" : "es-MX";
  const DAY_LABELS: Record<string, string> = Object.fromEntries(
    DAY_ORDER.map((key, i) => [
      key,
      new Date(2025, 0, 6 + i).toLocaleDateString(locale, { weekday: "long" })
        .replace(/^\w/, c => c.toUpperCase()),
    ])
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [plan, setPlan] = useState<any>(null);
  const [nutritionist, setNutritionist] = useState<any>(null);
  const [expandedDay, setExpandedDay] = useState<string | null>("monday");

  useEffect(() => {
    const load = async () => {
      try {
        const token = await Storage.getItem("token");
        const userStorage = await Storage.getItem("user");
        if (!token || !userStorage) return;

        const user = JSON.parse(userStorage);

        // Get index to find this user's plan
        const plansData = await getDietPlans(token);
        const plans = plansData?.data ?? [];
        const userPlan = plans.find((p: any) => Number(p.user_id) === Number(user.id)) ?? null;

        if (userPlan) {
          // Get full plan with planDays.meals
          const fullPlanRes = await getDietPlanById(userPlan.id, token);
          const fullPlan = fullPlanRes?.data ?? userPlan;
          setPlan(fullPlan);

          // Get nutritionist profile
          const nutrData = await getNutritionistProfiles(token);
          const all = nutrData?.data ?? [];
          const match = all.find((n: any) => Number(n.id) === Number(fullPlan.nutritionist_id)) ?? null;
          setNutritionist(match);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !plan) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="cloud-offline-outline" size={48} color={colors.textSecondary} />
        <Text style={styles.errorText}>{t("dietPlan.errorLoad")}</Text>
      </View>
    );
  }

  // Sort plan days by week order
  const sortedDays = [...(plan.plan_days ?? [])].sort(
    (a: any, b: any) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day)
  );

  const totalCalories = (meals: any[]) =>
    meals.reduce((sum: number, m: any) => sum + (Number(m.calories) || 0), 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>{t("dietPlan.title")}</Text>
      </View>
      <View style={styles.divider} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* NUTRIÓLOGO */}
        {nutritionist && (
          <NutritionistCard
            name={nutritionist.user?.name ?? t("dietPlan.nutritionistFallback")}
            specialty={nutritionist.specialty}
            imageUrl={nutritionist.profile_pic}
            status="active"
            updatedAt={plan.updated_at?.split("T")[0] ?? ""}
          />
        )}

        {/* DETALLES DEL PLAN */}
        <View style={styles.planCard}>
          <Text style={styles.sectionTitle}>{t("dietPlan.planDetails")}</Text>
          <View style={styles.row}>
            <Ionicons name="flag-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.rowLabel}>{t("dietPlan.goal")}</Text>
            <Text style={styles.rowValue}>{plan.goal}</Text>
          </View>
          <View style={styles.row}>
            <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.rowLabel}>{t("dietPlan.duration")}</Text>
            <Text style={styles.rowValue}>{plan.duration_days} {t("dietPlan.days")}</Text>
          </View>
          <View style={styles.row}>
            <Ionicons name="stats-chart-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.rowLabel}>{t("dietPlan.type")}</Text>
            <Text style={styles.rowValue}>{plan.is_monodiet ? t("dietPlan.monodiet") : t("dietPlan.variedDiet")}</Text>
          </View>
          {plan.notes && plan.notes !== "Sin notas" && (
            <View style={styles.notesBox}>
              <Text style={styles.notesLabel}>{t("dietPlan.nutritionistNotes")}</Text>
              <Text style={styles.notesText}>{plan.notes}</Text>
            </View>
          )}
        </View>

        {/* PLAN DE COMIDAS */}
        <Text style={styles.sectionTitle2}>{t("dietPlan.mealPlan")}</Text>

        {sortedDays.length === 0 ? (
          <View style={styles.emptySection}>
            <Ionicons name="restaurant-outline" size={32} color={colors.textSecondary} />
            <Text style={styles.emptyText}>{t("dietPlan.mealPlanEmpty")}</Text>
          </View>
        ) : (
          sortedDays.map((day: any) => {
            const isOpen = expandedDay === day.day;
            const meals = [...(day.meals ?? [])].sort((a: any, b: any) => a.order - b.order);
            const kcal = totalCalories(meals);

            return (
              <View key={day.id} style={styles.dayCard}>
                <TouchableOpacity
                  style={styles.dayHeader}
                  onPress={() => setExpandedDay(isOpen ? null : day.day)}
                  activeOpacity={0.8}
                >
                  <View style={styles.dayLeft}>
                    <View style={styles.dayDot} />
                    <Text style={styles.dayLabel}>
                      {DAY_LABELS[day.day] ?? day.day}
                    </Text>
                    <View style={styles.mealCountBadge}>
                      <Text style={styles.mealCountText}>{t("dietPlan.mealsCount", { count: meals.length })}</Text>
                    </View>
                  </View>
                  <View style={styles.dayRight}>
                    {kcal > 0 && (
                      <Text style={styles.kcalText}>{kcal} kcal</Text>
                    )}
                    <Ionicons
                      name={isOpen ? "chevron-up" : "chevron-down"}
                      size={16}
                      color={colors.textSecondary}
                    />
                  </View>
                </TouchableOpacity>

                {isOpen && (
                  <View style={styles.mealsContainer}>
                    {/* Comidas */}
                    {meals.length > 0 && (
                      <>
                        <View style={styles.subHeader}>
                          <Ionicons name="restaurant" size={12} color={colors.primary} />
                          <Text style={styles.subHeaderText}>{t("dietPlan.mealsLabel")}</Text>
                        </View>
                        {meals.map((meal: any, idx: number) => (
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

                    {/* Suplementos */}
                    {day.supplements?.length > 0 && (
                      <>
                        <View style={[styles.subHeader, { marginTop: meals.length > 0 ? 10 : 0 }]}>
                          <Ionicons name="flask" size={12} color="#8B5CF6" />
                          <Text style={[styles.subHeaderText, { color: "#8B5CF6" }]}>{t("dietPlan.supplementsLabel")}</Text>
                        </View>
                        {[...(day.supplements ?? [])].sort((a: any, b: any) => a.order - b.order).map((s: any, idx: number) => (
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
                              {s.instructions && (
                                <Text style={styles.suppInstructions}>{s.instructions}</Text>
                              )}
                            </View>
                          </View>
                        ))}
                      </>
                    )}
                  </View>
                )}
              </View>
            );
          })
        )}

        {/* TIPS */}
        <Text style={styles.sectionTitle2}>{t("dietPlan.tipsSection")}</Text>
        <DietTipCard tips={[t("dietPlan.tip1"), t("dietPlan.tip2"), t("dietPlan.tip3"), t("dietPlan.tip4")]} />

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#0F0F10",
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  errorText: {
    color: colors.textSecondary,
    marginTop: 12,
    fontSize: 15,
    textAlign: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#0F0F10",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingLeft: 80,
    paddingRight: 20,
    justifyContent: "flex-end",
    minHeight: 110,
  },
  headerTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: "#2A2A2A",
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  sectionTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 14,
  },
  sectionTitle2: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    marginTop: 24,
  },
  planCard: {
    backgroundColor: "#1C1C1E",
    borderRadius: 18,
    padding: 16,
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  rowLabel: {
    color: colors.textSecondary,
    fontSize: 14,
    flex: 1,
  },
  rowValue: {
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
  emptySection: {
    backgroundColor: "#1C1C1E",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    gap: 10,
    marginBottom: 4,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
  },
  // Day accordion
  dayCard: {
    backgroundColor: "#1C1C1E",
    borderRadius: 14,
    marginBottom: 8,
    overflow: "hidden",
  },
  dayHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dayLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  dayDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  dayLabel: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },
  mealCountBadge: {
    backgroundColor: "rgba(59,130,246,0.12)",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  mealCountText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "600",
  },
  dayRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  kcalText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "500",
  },
  mealsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    gap: 10,
  },
  mealItem: {
    backgroundColor: "#2C2C2E",
    borderRadius: 12,
    padding: 12,
    gap: 6,
  },
  mealTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  mealIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "rgba(59,130,246,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
  mealName: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
  calBadge: {
    backgroundColor: "rgba(34,197,94,0.12)",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  calText: {
    color: "#22c55e",
    fontSize: 11,
    fontWeight: "600",
  },
  mealDesc: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    paddingLeft: 36,
  },
  subHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 8,
  },
  subHeaderText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
  },
  suppItem: {
    backgroundColor: "#2C2C2E",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 6,
  },
  suppDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 4,
    flexShrink: 0,
  },
  suppName: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
  amountBadge: {
    backgroundColor: "rgba(139,92,246,0.15)",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  amountText: {
    color: "#8B5CF6",
    fontSize: 11,
    fontWeight: "600",
  },
  suppInstructions: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
  },
});
