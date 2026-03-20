import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Stack, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import PlanCard from "@/src/components/plans/PlanCard";


export default function Plans() {

  return (

    <View style={styles.container}>

      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Planes LiftyHub</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>

        <Text style={styles.subtitle}>
          Mejora tu entrenamiento con funciones premium
        </Text>

        <PlanCard
          title="Pro"
          description="Entrena sin límites"
          price="$50 MXN / mes"
          recommended
          features={[
            "Rutinas premium",
            "Estadísticas avanzadas",
            "Seguimiento mensual",
            "Progreso detallado"
          ]}
        />

        <PlanCard
          title="Elite"
          description="Entrenamiento completo"
          price="$50 MXN / mes"
          features={[
            "Todo lo del plan Pro",
            "Acceso a nutricionistas",
            "Planes de dieta personalizados",
            "Prioridad en nuevas funciones"
          ]}
        />

      </ScrollView>

    </View>

  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#0F0F10"
  },

  content: {
    padding: 20,
    paddingTop: 80,
    paddingBottom: 80
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: "#0F0F10",
    gap: 14
  },

  backBtn: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center"
  },

  headerTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "700"
  },

  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "700"
  },

  subtitle: {
    color: "#A1A1A1",
    marginTop: 6,
    marginBottom: 30
  }

});