import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing } from "@/src/styles/globalstyles";
import { useSubscription } from "@/src/context/SubscriptionContext";
import { useLanguage } from "@/src/context/LanguageContext";
import HapticButton from "@/src/components/buttons/HapticButton";
import * as Storage from "@/src/utils/storage";
import { getExercises, createUserRoutine, createUserRoutineExercise } from "@/src/services/api";

const GEMINI_KEY = process.env.EXPO_PUBLIC_GEMINI_KEY ?? "";

const OBJECTIVE_LABELS_ES: Record<string, string> = {
  muscle: "Ganar músculo (hipertrofia)",
  fat_loss: "Perder peso (quema grasa)",
  endurance: "Resistencia cardiovascular",
  flexibility: "Flexibilidad y movilidad",
};

const CATEGORY_MAP: Record<string, string> = {
  muscle: "Fuerza",
  fat_loss: "Cardio",
  endurance: "Resistencia",
  flexibility: "Flexibilidad",
};

const EQUIPMENT_LABELS_ES: Record<string, string> = {
  gym: "Gimnasio completo (mancuernas, barras, máquinas, cables)",
  home_equipment: "Casa con equipo básico (mancuernas, bandas, banco)",
  home_no_equipment: "Casa sin equipo (solo peso corporal)",
};

export default function GenerateRoutine() {
  const insets = useSafeAreaInsets();
  const { plan } = useSubscription();
  const { t } = useLanguage();
  const isPro = plan?.name === "Pro";
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  const STEPS = [
    {
      key: "objetivo",
      label: t("generate.step1Q"),
      options: [
        { value: "muscle", label: t("generate.step1Muscle"), icon: "barbell" },
        { value: "fat_loss", label: t("generate.step1FatLoss"), icon: "flame" },
        { value: "endurance", label: t("generate.step1Endurance"), icon: "heart" },
        { value: "flexibility", label: t("generate.step1Flexibility"), icon: "body" },
      ],
    },
    {
      key: "dias",
      label: t("generate.step2Q"),
      options: [
        { value: "3", label: t("generate.step2Days", { n: "3" }), icon: "calendar" },
        { value: "4", label: t("generate.step2Days", { n: "4" }), icon: "calendar" },
        { value: "5", label: t("generate.step2Days", { n: "5" }), icon: "calendar" },
        { value: "6", label: t("generate.step2Days", { n: "6" }), icon: "calendar" },
      ],
    },
    {
      key: "nivel",
      label: t("generate.step3Q"),
      options: [
        { value: "beginner", label: t("generate.step3Beginner"), icon: "star-outline" },
        { value: "intermediate", label: t("generate.step3Intermediate"), icon: "star-half" },
        { value: "advanced", label: t("generate.step3Advanced"), icon: "star" },
      ],
    },
    {
      key: "equipo",
      label: t("generate.step4Q"),
      options: [
        { value: "gym", label: t("generate.step4Gym"), icon: "fitness" },
        { value: "home_equipment", label: t("generate.step4HomeEquipment"), icon: "home" },
        { value: "home_no_equipment", label: t("generate.step4HomeNoEquipment"), icon: "body" },
      ],
    },
  ];

  const allAnswered = STEPS.every((s) => answers[s.key]);

  if (!isPro) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.header}>
          <HapticButton onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color="white" />
          </HapticButton>
          <Text style={styles.headerTitle}>{t("generate.title")}</Text>
        </View>
        <View style={styles.upgradeContainer}>
          <View style={styles.upgradeIcon}>
            <MaterialCommunityIcons name="robot-outline" size={36} color="#8B5CF6" />
          </View>
          <Text style={styles.upgradeTitle}>{t("generate.proTitle")}</Text>
          <Text style={styles.upgradeText}>{t("generate.proText")}</Text>
          <HapticButton
            style={styles.upgradeBtn}
            onPress={() => {
              router.back();
              router.push("/settings/plans" as any);
            }}
          >
            <Text style={styles.upgradeBtnText}>{t("generate.viewProBtn")}</Text>
          </HapticButton>
        </View>
      </View>
    );
  }

  const handleGenerate = async () => {
    if (!allAnswered || generating) return;
    if (!GEMINI_KEY) {
      Alert.alert(t("generate.configMissing"), t("generate.configMissingText"));
      return;
    }

    setGenerating(true);
    setGenError(null);

    try {
      const token = await Storage.getItem("token");
      const userStorage = await Storage.getItem("user");
      if (!token || !userStorage) throw new Error("Sesión no encontrada");
      const user = JSON.parse(userStorage);

      // Fetch available exercises
      const exercisesRes = await getExercises(token);
      const exercises: any[] = exercisesRes?.data ?? exercisesRes ?? [];
      if (exercises.length === 0) throw new Error("No hay ejercicios disponibles");

      // Build Gemini prompt
      const exerciseList = exercises
        .map((e: any) => `ID:${e.id} | ${e.name} | Músculo: ${e.muscle ?? "-"} | Categoría: ${e.categorie ?? "-"}`)
        .join("\n");

      const prompt = `Eres un entrenador personal profesional. Crea una rutina de entrenamiento personalizada.

Usuario:
- Objetivo: ${OBJECTIVE_LABELS_ES[answers.objetivo]}
- Nivel: ${answers.nivel}
- Días por semana: ${answers.dias}
- Equipo disponible: ${EQUIPMENT_LABELS_ES[answers.equipo]}

Ejercicios disponibles:
${exerciseList}

Selecciona entre 5 y 8 ejercicios de la lista que sean adecuados para el objetivo y el equipo del usuario. Define series, repeticiones y segundos de descanso según el objetivo y nivel.

IMPORTANTE: Responde ÚNICAMENTE con un JSON array válido, sin texto adicional, sin markdown, sin explicaciones:
[{"exercise_id": <ID exacto de la lista>, "sets": <número>, "repetitions": <número>, "seconds_rest": <número>}]`;

      // Call Gemini API
      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
          }),
        }
      );

      const geminiData = await geminiRes.json();
      if (geminiData.error) throw new Error(geminiData.error.message ?? "Error de Gemini");

      const rawText: string =
        geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

      // Extract JSON array from response (handles markdown code blocks)
      const jsonMatch = rawText.match(/\[[\s\S]*?\]/);
      if (!jsonMatch) throw new Error("La IA no devolvió un formato válido");

      const recommendations: Array<{
        exercise_id: number;
        sets: number;
        repetitions: number;
        seconds_rest: number;
      }> = JSON.parse(jsonMatch[0]);

      if (!Array.isArray(recommendations) || recommendations.length === 0)
        throw new Error("La IA no generó ejercicios");

      // Create the UserRoutine
      const routineRes = await createUserRoutine(
        {
          user_id: user.id,
          name: `Rutina IA — ${CATEGORY_MAP[answers.objetivo] ?? "General"}`,
          objective: answers.objetivo,
          level: answers.nivel,
          category: CATEGORY_MAP[answers.objetivo] ?? "General",
          duration: parseInt(answers.dias) * 4,
        },
        token
      );

      const routineId = routineRes?.data?.id ?? routineRes?.id;
      if (!routineId) throw new Error("No se pudo crear la rutina");

      // Add exercises sequentially
      for (const ex of recommendations) {
        await createUserRoutineExercise(
          {
            user_routine_id: routineId,
            exercise_id: ex.exercise_id,
            sets: Math.max(1, ex.sets),
            repetitions: Math.max(1, ex.repetitions),
            seconds_rest: Math.max(0, ex.seconds_rest),
          },
          token
        );
      }

      Alert.alert(
        t("generate.routineCreated"),
        t("generate.routineCreatedMessage", { count: recommendations.length }),
        [{ text: t("generate.viewMyRoutines"), onPress: () => router.back() }]
      );
    } catch (err: any) {
      setGenError(err.message ?? "Error al generar la rutina");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <HapticButton onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="white" />
        </HapticButton>
        <Text style={styles.headerTitle}>{t("generate.title")}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.badge}>
          <MaterialCommunityIcons name="robot-outline" size={13} color="#8B5CF6" />
          <Text style={styles.badgeText}>{t("generate.poweredByAI")}</Text>
        </View>
        <Text style={styles.subtitle}>{t("generate.subtitle")}</Text>

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
                    onPress={() =>
                      setAnswers((prev) => ({ ...prev, [step.key]: opt.value }))
                    }
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

        {genError && (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle-outline" size={16} color="#f87171" />
            <Text style={styles.errorText}>{genError}</Text>
          </View>
        )}

        <HapticButton
          style={[styles.generateBtn, (!allAnswered || generating) && styles.generateBtnDisabled]}
          disabled={!allAnswered || generating}
          onPress={handleGenerate}
        >
          {generating ? (
            <>
              <ActivityIndicator size="small" color="white" />
              <Text style={styles.generateBtnText}>{t("generate.generatingBtn")}</Text>
            </>
          ) : (
            <>
              <MaterialCommunityIcons name="robot-outline" size={18} color="white" />
              <Text style={styles.generateBtnText}>{t("generate.generateBtn")}</Text>
            </>
          )}
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
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(248,113,113,0.1)",
    borderWidth: 1,
    borderColor: "rgba(248,113,113,0.25)",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: "#f87171",
    fontSize: 13,
    flex: 1,
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
