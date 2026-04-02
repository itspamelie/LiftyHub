import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Stack, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import PlanCard from "@/src/components/plans/PlanCard";
import { useLanguage } from "@/src/context/LanguageContext";
import { useSubscription } from "@/src/context/SubscriptionContext";
import { colors, planColors } from "@/src/styles/globalstyles";

export default function Plans() {

  const { t } = useLanguage();
  const { plan: currentPlan } = useSubscription();

  const planList = [
    {
      id: 1,
      title: "Free",
      description: t("plans.free"),
      price: "$0",
      accentColor: planColors.Free,
      features: [
        { label: t("plans.features.routines7"),       included: true  },
        { label: t("plans.features.exercises"),        included: true  },
        { label: t("plans.features.stats"),            included: false },
        { label: t("plans.features.nutritionist"),     included: false },
        { label: t("plans.features.dietPlan"),         included: false },
        { label: t("plans.features.supplements"),      included: false },
      ],
    },
    {
      id: 2,
      title: "Basic",
      description: "Más rutinas y seguimiento",
      price: "$99 " + t("plans.month"),
      accentColor: planColors.Basic,
      features: [
        { label: t("plans.features.routines20"),       included: true  },
        { label: t("plans.features.exercises"),        included: true  },
        { label: t("plans.features.stats"),            included: true  },
        { label: t("plans.features.nutritionist"),     included: false },
        { label: t("plans.features.dietPlan"),         included: false },
        { label: t("plans.features.supplements"),      included: false },
      ],
    },
    {
      id: 4,
      title: "Meal",
      description: "Solo dieta",
      price: "$400 " + t("plans.month"),
      accentColor: planColors.Meal,
      features: [
        { label: t("plans.features.routines7"),        included: true  },
        { label: t("plans.features.exercises"),        included: true  },
        { label: t("plans.features.nutritionist"),     included: true  },
        { label: t("plans.features.dietPlan"),         included: true  },
        { label: t("plans.features.supplements"),      included: true  },
        { label: t("plans.features.stats"),            included: false },
      ],
    },
    {
      id: 3,
      title: "Pro",
      description: "Acceso completo + nutriólogo",
      price: "$600 " + t("plans.month"),
      accentColor: planColors.Pro,
      recommended: true,
      features: [
        { label: t("plans.features.routinesUnlimited"), included: true },
        { label: t("plans.features.exercises"),          included: true },
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
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("plans.title")}</Text>
      </View>

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
              params: { title: plan.title, price: plan.price, accentColor: plan.accentColor },
            }) : undefined}
          />
        ))}

        <Text style={styles.note}>{t("plans.contact")}</Text>

      </ScrollView>

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
    marginTop: 4,
  },

});
