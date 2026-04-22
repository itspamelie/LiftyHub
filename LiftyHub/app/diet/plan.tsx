import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Storage from "@/src/utils/storage";
import { getDietPlans, getNutritionistProfiles } from "@/src/services/api";
import { useLanguage } from "@/src/context/LanguageContext";
import NutritionistCard from "@/src/components/diet/NutritionistCard";
import DietTipCard from "@/src/components/diet/DietTipCard";
import BackButton from "@/src/components/buttons/backButton";
import { colors } from "@/src/styles/globalstyles";

export default function DietPlanScreen() {

  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [plan, setPlan] = useState<any>(null);
  const [nutritionist, setNutritionist] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const token = await Storage.getItem("token");
        const userStorage = await Storage.getItem("user");
        if (!token || !userStorage) return;

        const user = JSON.parse(userStorage);
        const plansData = await getDietPlans(token);
        const plans = plansData?.data ?? [];
        const userPlan = plans.find((p: any) => p.user_id === user.id) ?? null;
        setPlan(userPlan);

        if (userPlan?.nutritionist_id) {
          const nutrData = await getNutritionistProfiles(token);
          const all = nutrData?.data ?? [];
          const match = all.find((n: any) => n.user_id === userPlan.nutritionist_id) ?? null;
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

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="cloud-offline-outline" size={48} color={colors.textSecondary} />
        <Text style={{ color: colors.textSecondary, marginTop: 12, fontSize: 15, textAlign: "center" }}>
          {t("dietPlan.errorLoad")}
        </Text>
      </View>
    );
  }

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
            name={nutritionist.user?.name ?? "Nutriólogo"}
            specialty={nutritionist.specialty}
            imageUrl={nutritionist.profile_pic}
            status="active"
            updatedAt={plan?.updated_at?.split("T")[0] ?? ""}
          />
        )}

        {/* DETALLES DEL PLAN */}
        {plan && (
          <View style={styles.planCard}>
            <Text style={styles.section}>{t("dietPlan.planDetails")}</Text>
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
            {plan.notes ? (
              <View style={styles.notesBox}>
                <Text style={styles.notesLabel}>{t("dietPlan.nutritionistNotes")}</Text>
                <Text style={styles.notesText}>{plan.notes}</Text>
              </View>
            ) : null}
          </View>
        )}

        {/* PLAN DE COMIDAS — pendiente de backend */}
        <Text style={styles.section}>{t("dietPlan.mealPlan")}</Text>
        <View style={styles.emptySection}>
          <Ionicons name="restaurant-outline" size={32} color={colors.textSecondary} />
          <Text style={styles.emptyText}>{t("dietPlan.mealPlanEmpty")}</Text>
        </View>

        {/* SUPLEMENTOS — pendiente de backend */}
        <Text style={styles.section}>{t("dietPlan.supplements")}</Text>
        <View style={styles.emptySection}>
          <Ionicons name="flask-outline" size={32} color={colors.textSecondary} />
          <Text style={styles.emptyText}>{t("dietPlan.supplementsEmpty")}</Text>
        </View>

        {/* TIPS */}
        <Text style={styles.section}>{t("dietPlan.tipsSection")}</Text>
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

  section: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    marginTop: 20,
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

});
