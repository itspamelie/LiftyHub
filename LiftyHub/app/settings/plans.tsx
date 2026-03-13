import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Stack } from "expo-router";
import PlanCard from "@/src/components/PlanCard";
import BackButton from "@/src/components/buttons/backButton";

export default function Plans() {

  return (

    <View style={styles.container}>

      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView contentContainerStyle={styles.content}>

        <Text style={styles.title}>Planes LiftyHub</Text>
<BackButton />
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