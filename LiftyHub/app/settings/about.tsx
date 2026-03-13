import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import { colors, spacing } from "@/src/styles/globalstyles";
import BackButton from "@/src/components/buttons/backButton";

export default function AboutScreen() {

  return (

    <View style={styles.container}>

      <Stack.Screen options={{ headerShown: false }} />

      {/* BOTÓN BACK */}

      <BackButton />

      <ScrollView contentContainerStyle={styles.content}>

        <Text style={styles.title}>Sobre LiftyHub</Text>

        <Text style={styles.text}>
          LiftyHub es una aplicación diseñada para ayudarte a mejorar tu
          entrenamiento. Puedes crear rutinas personalizadas, registrar
          ejercicios y seguir tu progreso.
        </Text>

        <Text style={styles.text}>
          Nuestro objetivo es ofrecer una plataforma simple para que puedas
          organizar tus entrenamientos y mantenerte constante.
        </Text>

        <Text style={styles.version}>
          Versión 1.0.0
        </Text>

        <Text style={styles.footer}>
          © 2026 LiftyHub
        </Text>

      </ScrollView>

    </View>

  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.background
  },

  content: {
    padding: spacing.screenPadding,
    paddingTop: 120
  },

  editButton: {
    position: "absolute",
    top: 60,
    left: 20,
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20
  },

  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20
  },

  text: {
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16
  },

  version: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 20
  },

  footer: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 6
  }

});