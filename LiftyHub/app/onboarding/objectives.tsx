import { View, Text, StyleSheet, ScrollView,  } from "react-native";

import { useRouter, Stack } from "expo-router";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BackButton from "@/src/components/buttons/backButton";
import { colors, spacing } from "@/src/styles/globalstyles";
import { useLanguage } from "@/src/context/LanguageContext";
import HapticButton from "@/src/components/buttons/HapticButton";

export default function Objectives() {
  const router = useRouter();
  const { t } = useLanguage();
  const [selected, setSelected] = useState<string | null>(null);

  const objectives = [
    { key: "Perder grasa", label: t("onboarding.fatLoss"), icon: "flame-outline" },
    { key: "Ganar músculo", label: t("onboarding.muscle"), icon: "barbell-outline" },
    { key: "Recomposición corporal", label: t("onboarding.recomposition"), icon: "repeat-outline" },
    { key: "Mejorar resistencia", label: t("onboarding.endurance"), icon: "heart-outline" },
    { key: "Mejorar fuerza", label: t("onboarding.strength"), icon: "fitness-outline" },
  ];

  const handleNext = async () => {
    if (!selected) return;
    await AsyncStorage.setItem("@register_objective", selected);
    router.push("/onboarding/personal" as any);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <BackButton />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t("onboarding.objectivesTitle")}</Text>
        <Text style={styles.subtitle}>{t("onboarding.objectivesSubtitle")}</Text>

        <View style={styles.card}>
          {objectives.map((item) => {
            const isActive = selected === item.key;
            return (
              <HapticButton
                key={item.key}
                style={[styles.option, isActive && styles.optionActive]}
                onPress={() => setSelected(item.key)}
              >
                <Ionicons
                  name={item.icon as any}
                  size={22}
                  color={isActive ? colors.primary : colors.textSecondary}
                />
                <Text style={[styles.optionText, isActive && styles.optionTextActive]}>
                  {item.label}
                </Text>
              </HapticButton>
            );
          })}
        </View>

        <HapticButton
          style={[styles.button, !selected && styles.disabled]}
          onPress={handleNext}
          disabled={!selected}
        >
          <Text style={styles.buttonText}>{t("onboarding.objectiveContinue")}</Text>
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

  content: {
    flexGrow: 1,
    justifyContent: "center",
    padding: spacing.screenPadding,
    paddingTop: 100,
  },

  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 6,
  },

  subtitle: {
    color: colors.textSecondary,
    marginBottom: 24,
  },

  card: {
    backgroundColor: colors.card,
    borderRadius: spacing.borderRadius,
    padding: 16,
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2C2C2E",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },

  optionActive: {
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: "#1E3A8A33",
  },

  optionText: {
    color: colors.text,
    marginLeft: 10,
    fontSize: 15,
  },

  optionTextActive: {
    color: colors.primary,
    fontWeight: "600",
  },

  button: {
    backgroundColor: colors.primary,
    borderRadius: 30,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  buttonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
  },

  disabled: {
    opacity: 0.5,
  },
});
