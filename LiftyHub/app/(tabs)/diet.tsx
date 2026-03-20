import { Text, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { useState } from "react";
import NutritionistCard from "@/src/components/diet/NutritionistCard";
import DietMealCard from "@/src/components/diet/DietMealCard";
import DietTipCard from "@/src/components/diet/DietTipCard";
import SupplementCard from "@/src/components/diet/SupplementCard";

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
    items: [
      "Avena con frutas y miel",
      "2 huevos revueltos",
      "1 vaso de leche descremada"
    ]
  },
  {
    emoji: "🥗",
    name: "Comida",
    calories: "650 kcal",
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
    items: [
      "Pechuga de pollo a la plancha (200g)",
      "Arroz integral (1 taza)",
      "Ensalada verde con aceite de oliva",
      "1 fruta de temporada"
    ]
  },
  {
    emoji: "🍎",
    name: "Snack",
    calories: "180 kcal",
    imageUrl: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=600&q=80",
    items: [
      "Yogur natural sin azúcar",
      "Un puño de nueces o almendras"
    ]
  },
  {
    emoji: "🍽️",
    name: "Cena",
    calories: "520 kcal",
    imageUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80",
    items: [
      "Salmón al horno (150g)",
      "Verduras al vapor",
      "Tortillas integrales (2)"
    ]
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

export default function DietScreen() {

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#3B82F6" />
      }
    >

      <Text style={styles.title}>Mi Dieta</Text>

      <NutritionistCard {...NUTRITIONIST} />

      <Text style={styles.section}>Plan alimenticio</Text>
      {MEALS.map((meal, index) => (
        <DietMealCard key={index} meal={meal} />
      ))}

      <Text style={styles.section}>Suplementos</Text>
      {SUPPLEMENTS.map((supplement, index) => (
        <SupplementCard key={index} supplement={supplement} />
      ))}

      <Text style={styles.section}>Recomendaciones</Text>
      <DietTipCard tips={TIPS} />

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#0F0F10"
  },

  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 100
  },

  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20
  },

  section: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    marginTop: 20
  }

});
