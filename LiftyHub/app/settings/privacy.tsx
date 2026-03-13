import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import { colors, spacing } from "@/src/styles/globalstyles";

export default function PrivacyScreen() {

  return (

    <View style={styles.container}>

      <Stack.Screen options={{ headerShown: false }} />

      {/* BOTÓN BACK */}

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={20} color="white" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.content}>

        <Text style={styles.title}>Política de privacidad</Text>

        <Text style={styles.text}>
          En LiftyHub respetamos tu privacidad. La información que recopilamos
          se utiliza únicamente para mejorar tu experiencia dentro de la
          aplicación.
        </Text>

        <Text style={styles.text}>
          Los datos que puedes registrar incluyen información de entrenamiento,
          progreso físico y configuraciones de tu cuenta.
        </Text>

        <Text style={styles.text}>
          LiftyHub no comparte tu información personal con terceros sin tu
          consentimiento.
        </Text>

        <Text style={styles.text}>
          Si deseas eliminar tu cuenta o tus datos, puedes hacerlo desde la
          configuración de tu perfil o contactando con soporte.
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
  }

});