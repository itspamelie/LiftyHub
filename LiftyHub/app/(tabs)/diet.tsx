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
import { useState, useEffect } from "react";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { useLanguage } from "@/src/context/LanguageContext";
import { useSubscription } from "@/src/context/SubscriptionContext";
import NutritionistCard from "@/src/components/diet/NutritionistCard";
import DietMealCard from "@/src/components/diet/DietMealCard";
import DietTipCard from "@/src/components/diet/DietTipCard";
import SupplementCard from "@/src/components/diet/SupplementCard";
import { colors, spacing } from "@/src/styles/globalstyles";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const NUTRITIONIST = {
  name: "Dra. Laura Pérez",
  specialty: "Nutrición deportiva",
  imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&q=80",
  status: "active" as const,
  updatedAt: "2026-03-15"
};

const MEALS = [
  {
    emoji: "🥣",
    name: "Desayuno",
    calories: "450 kcal",
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
    items: ["Avena con frutas y miel", "2 huevos revueltos", "1 vaso de leche descremada"]
  },
  {
    emoji: "🥗",
    name: "Comida",
    calories: "650 kcal",
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
    items: ["Pechuga de pollo a la plancha (200g)", "Arroz integral (1 taza)", "Ensalada verde con aceite de oliva"]
  },
  {
    emoji: "🍎",
    name: "Snack",
    calories: "180 kcal",
    imageUrl: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=600&q=80",
    items: ["Yogur natural sin azúcar", "Un puño de nueces o almendras"]
  },
  {
    emoji: "🍽️",
    name: "Cena",
    calories: "520 kcal",
    imageUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80",
    items: ["Salmón al horno (150g)", "Verduras al vapor", "Tortillas integrales (2)"]
  }
];

const SUPPLEMENTS = [
  {
    name: "Proteína Whey",
    dose: "30g — 1 scoop post-entrenamiento",
    timing: "Después de entrenar",
    imageUrl: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600&q=80",
    color: "#3B82F6"
  },
  {
    name: "Creatina",
    dose: "5g — disuelto en agua",
    timing: "Con el desayuno",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80",
    color: "#F59E0B"
  },
  {
    name: "Omega 3",
    dose: "2 cápsulas al día",
    timing: "Con la comida",
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80",
    color: "#10B981"
  }
];

const TIPS = [
  "Come cada 3-4 horas para mantener tu metabolismo activo",
  "No te saltes el desayuno, es la comida más importante",
  "Cena al menos 2 horas antes de dormir",
  "Mantente bien hidratado durante el entrenamiento"
];

const PLAN_OPTIONS = [
  {
    name: "Basic",
    price: "$99/mes",
    level: 1,
    color: "#3B82F6",
    features: ["Rutinas ilimitadas", "Seguimiento de progreso", "Estadísticas avanzadas"],
  },
  {
    name: "Pro",
    price: "$199/mes",
    level: 2,
    color: colors.primary,
    features: ["Todo lo de Basic", "Nutriólogo personal", "Plan de dieta personalizado", "Suplementos recomendados"],
    highlighted: true,
  },
];

export default function DietScreen() {

  const { t } = useLanguage();
  const { planLevel, loading: subLoading } = useSubscription();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const hasAccess = planLevel >= 2;

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // Mostrar modal automáticamente si no tiene acceso
  useEffect(() => {
    if (!subLoading && !hasAccess) {
      setShowUpgradeModal(true);
    }
  }, [subLoading, hasAccess]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
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

      {/* CONTENIDO (siempre renderizado, puede estar bloqueado) */}
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
        <NutritionistCard {...NUTRITIONIST} />
        <Text style={styles.section}>{t("diet.mealPlan")}</Text>
        {MEALS.map((meal, index) => (
          <DietMealCard key={index} meal={meal} />
        ))}
        <Text style={styles.section}>{t("diet.supplements")}</Text>
        {SUPPLEMENTS.map((supplement, index) => (
          <SupplementCard key={index} supplement={supplement} />
        ))}
        <Text style={styles.section}>{t("diet.tips")}</Text>
        <DietTipCard tips={TIPS} />
      </ScrollView>

      {/* BLUR OVERLAY si no tiene acceso */}
      {!hasAccess && (
        <BlurView
          intensity={55}
          tint="dark"
          style={StyleSheet.absoluteFill}
          pointerEvents="box-none"
        />
      )}

      {/* BOTÓN para reabrir el modal si lo cerró */}
      {!hasAccess && !showUpgradeModal && (
        <View style={styles.unlockBar}>
          <TouchableOpacity
            style={styles.unlockButton}
            onPress={() => setShowUpgradeModal(true)}
          >
            <Ionicons name="lock-closed" size={16} color="white" />
            <Text style={styles.unlockText}>Desbloquear Nutrición</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* MODAL UPGRADE */}
      <Modal visible={showUpgradeModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>

            {/* Header */}
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setShowUpgradeModal(false)}
            >
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </TouchableOpacity>

            <View style={styles.modalIcon}>
              <Ionicons name="nutrition" size={32} color={colors.primary} />
            </View>
            <Text style={styles.modalTitle}>Desbloquea Nutrición</Text>
            <Text style={styles.modalSubtitle}>
              Accede a tu nutriólogo personal, plan de dieta y suplementos recomendados.
            </Text>

            {/* Planes */}
            {PLAN_OPTIONS.map((plan) => (
              <View
                key={plan.name}
                style={[
                  styles.planCard,
                  plan.highlighted && { borderColor: plan.color, borderWidth: 2 }
                ]}
              >
                {plan.highlighted && (
                  <View style={[styles.planBadge, { backgroundColor: plan.color }]}>
                    <Text style={styles.planBadgeText}>Recomendado</Text>
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
              </View>
            ))}

            <Text style={styles.modalNote}>
              Contacta a un administrador para actualizar tu plan.
            </Text>

          </View>
        </View>
      </Modal>

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

  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 100,
  },

  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
  },

  section: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    marginTop: 20,
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
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
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

  planCard: {
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
