import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import { colors, spacing } from "@/src/styles/globalstyles";

export default function AboutScreen() {

  return (

    <View style={styles.container}>

      <Stack.Screen options={{ headerShown: false }} />

      {/* HEADER ESTÁTICO */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sobre LiftyHub</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>

        <Text style={styles.section}>Nuestra misión</Text>
        <Text style={styles.text}>
          LiftyHub nació con una sola idea: hacer que el entrenamiento sea más
          inteligente. Creemos que cada persona merece herramientas reales para
          planificar, registrar y visualizar su progreso físico — sin
          complicaciones.
        </Text>

        <Text style={styles.section}>¿Qué es LiftyHub?</Text>
        <Text style={styles.text}>
          LiftyHub es una plataforma fitness completa que te permite crear tus
          propias rutinas, registrar tus entrenamientos, llevar el control de tu
          progreso y acceder a planes y rutinas diseñados por expertos.
        </Text>

        <Text style={styles.section}>El equipo</Text>

        <View style={styles.memberCard}>
          <Ionicons name="person-circle-outline" size={40} color="#3B82F6" />
          <View style={styles.memberInfo}>
            <Text style={styles.memberName}>Pamela Martinez Moreno</Text>
            <Text style={styles.memberRole}>Desarrolladora</Text>
          </View>
        </View>

        <View style={styles.memberCard}>
          <Ionicons name="person-circle-outline" size={40} color="#3B82F6" />
          <View style={styles.memberInfo}>
            <Text style={styles.memberName}>Angel David Hinojos Vega</Text>
            <Text style={styles.memberRole}>Desarrollador</Text>
          </View>
        </View>

        <Text style={styles.section}>Contacto</Text>
        <Text style={styles.text}>support@liftyhub.app</Text>

        <Text style={styles.version}>Versión 1.0.0</Text>
        <Text style={styles.footer}>© 2026 LiftyHub. Todos los derechos reservados.</Text>

      </ScrollView>

    </View>

  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.background
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: colors.background,
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
    alignItems: "center"
  },

  headerTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "700"
  },

  scroll: {
    flex: 1
  },

  content: {
    padding: spacing.screenPadding,
    paddingTop: 10
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

  section: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "600",
    marginTop: 24,
    marginBottom: 10
  },

  memberCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1C1E",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    gap: 12
  },

  memberInfo: {
    flex: 1
  },

  memberName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600"
  },

  memberRole: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 2
  },

  version: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 24
  },

  footer: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 6,
    marginBottom: 20
  }

});