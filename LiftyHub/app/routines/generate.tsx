import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing } from "@/src/styles/globalstyles";
import { useSubscription } from "@/src/context/SubscriptionContext";
import HapticButton from "@/src/components/buttons/HapticButton";

const STEPS = [
  {
    key: "objetivo",
    label: "¿Cuál es tu objetivo?",
    options: [
      { value: "muscle", label: "Ganar músculo", icon: "barbell" },
      { value: "fat_loss", label: "Perder peso", icon: "flame" },
      { value: "endurance", label: "Resistencia", icon: "heart" },
      { value: "flexibility", label: "Flexibilidad", icon: "body" },
    ],
  },
  {
    key: "dias",
    label: "¿Cuántos días a la semana?",
    options: [
      { value: "3", label: "3 días", icon: "calendar" },
      { value: "4", label: "4 días", icon: "calendar" },
      { value: "5", label: "5 días", icon: "calendar" },
      { value: "6", label: "6 días", icon: "calendar" },
    ],
  },
  {
    key: "nivel",
    label: "¿Cuál es tu nivel?",
    options: [
      { value: "beginner", label: "Principiante", icon: "star-outline" },
      { value: "intermediate", label: "Intermedio", icon: "star-half" },
      { value: "advanced", label: "Avanzado", icon: "star" },
    ],
  },
  {
    key: "equipo",
    label: "¿Con qué equipo cuentas?",
    options: [
      { value: "gym", label: "Gimnasio completo", icon: "fitness" },
      { value: "home_equipment", label: "Casa con equipo", icon: "home" },
      { value: "home_no_equipment", label: "Casa sin equipo", icon: "body" },
    ],
  },
];

export default function GenerateRoutine() {
  const insets = useSafeAreaInsets();
  const { plan } = useSubscription();
  const isPro = plan?.name === "Pro";
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const allAnswered = STEPS.every(s => answers[s.key]);

  if (!isPro) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.header}>
          <HapticButton onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color="white" />
          </HapticButton>
          <Text style={styles.headerTitle}>Generar rutina con IA</Text>
        </View>
        <View style={styles.upgradeContainer}>
          <View style={styles.upgradeIcon}>
            <MaterialCommunityIcons name="robot-outline" size={36} color="#8B5CF6" />
          </View>
          <Text style={styles.upgradeTitle}>Función exclusiva Pro</Text>
          <Text style={styles.upgradeText}>
            La generación de rutinas con IA está disponible únicamente en el plan Pro.
          </Text>
          <HapticButton
            style={styles.upgradeBtn}
            onPress={() => { router.back(); router.push("/settings/plans" as any); }}
          >
            <Text style={styles.upgradeBtnText}>Ver plan Pro</Text>
          </HapticButton>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <HapticButton onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="white" />
        </HapticButton>
        <Text style={styles.headerTitle}>Generar rutina con IA</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.badge}>
          <MaterialCommunityIcons name="robot-outline" size={13} color="#8B5CF6" />
          <Text style={styles.badgeText}>Impulsado por IA</Text>
        </View>
        <Text style={styles.subtitle}>
          Responde 4 preguntas y te generamos una rutina personalizada en segundos.
        </Text>

        {STEPS.map((step) => (
          <View key={step.key} style={styles.stepBlock}>
            <Text style={styles.stepLabel}>{step.label}</Text>
            <View style={styles.optionsGrid}>
              {step.options.map((opt) => {
                const selected = answers[step.key] === opt.value;
                return (
                  <HapticButton
                    key={opt.value}
                    style={[styles.optionBtn, selected && styles.optionBtnSelected]}
                    onPress={() => setAnswers(prev => ({ ...prev, [step.key]: opt.value }))}
                  >
                    <Ionicons
                      name={opt.icon as any}
                      size={20}
                      color={selected ? "#8B5CF6" : colors.textSecondary}
                    />
                    <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>
                      {opt.label}
                    </Text>
                  </HapticButton>
                );
              })}
            </View>
          </View>
        ))}

        <HapticButton
          style={[styles.generateBtn, !allAnswered && styles.generateBtnDisabled]}
          disabled={!allAnswered}
          onPress={() => {
            // TODO: llamar al backend con answers
          }}
        >
          <MaterialCommunityIcons name="robot-outline" size={18} color="white" />
          <Text style={styles.generateBtnText}>Generar mi rutina</Text>
        </HapticButton>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: 16,
    paddingTop: 8,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1C1C1E",
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "700",
  },
  content: {
    padding: spacing.screenPadding,
    paddingBottom: 40,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    alignSelf: "flex-start",
    backgroundColor: "rgba(139,92,246,0.12)",
    borderWidth: 1,
    borderColor: "rgba(139,92,246,0.3)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 12,
  },
  badgeText: {
    color: "#8B5CF6",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 28,
  },
  stepBlock: {
    marginBottom: 24,
  },
  stepLabel: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  optionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#1C1C1E",
    borderWidth: 1,
    borderColor: "#2C2C2E",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  optionBtnSelected: {
    borderColor: "#8B5CF6",
    backgroundColor: "rgba(139,92,246,0.1)",
  },
  optionLabel: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "500",
  },
  optionLabelSelected: {
    color: "white",
    fontWeight: "600",
  },
  generateBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#8B5CF6",
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 8,
  },
  generateBtnDisabled: {
    opacity: 0.4,
  },
  generateBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  upgradeContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  upgradeIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(139,92,246,0.12)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  upgradeTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },
  upgradeText: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 28,
  },
  upgradeBtn: {
    backgroundColor: "#8B5CF6",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  upgradeBtnText: {
    color: "white",
    fontWeight: "700",
    fontSize: 15,
  },
});
