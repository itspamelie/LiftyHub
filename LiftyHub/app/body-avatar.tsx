import { View, Text, StyleSheet, ActivityIndicator, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import Body, { ExtendedBodyPart, Slug } from "react-native-body-highlighter";
import { colors, spacing } from "@/src/styles/globalstyles";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Storage from "@/src/utils/storage";
import HapticButton from "@/src/components/buttons/HapticButton";
import { getExerciseLogs } from "@/src/services/api";
import { useLanguage } from "@/src/context/LanguageContext";
import { useSubscription } from "@/src/context/SubscriptionContext";

// Mapeo de grupos musculares del DB → slugs del highlighter
const MUSCLE_MAP: Record<string, Slug[]> = {
  "Bíceps":         ["biceps"],
  "Cuádriceps":     ["quadriceps"],
  "Espalda":        ["trapezius", "upper-back"],
  "Hombro":         ["deltoids"],
  "Tríceps":        ["triceps"],
  "Pecho":          ["chest"],
  "Abdomen":        ["abs"],
  "Glúteos":        ["gluteal"],
  "Isquiotibiales": ["hamstring"],
  "Gemelos":        ["calves"],
};

function getWeekDates(): Set<string> {
  const now = new Date();
  const dow = now.getDay();
  const diffToMon = dow === 0 ? -6 : 1 - dow;
  const dates = new Set<string>();
  for (let i = 0; i < 7; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diffToMon + i);
    dates.add(d.toISOString().split("T")[0]);
  }
  return dates;
}

function buildBodyData(logs: any[], userId: number): ExtendedBodyPart[] {
  const weekDates = getWeekDates();
  const counts: Record<string, number> = {};

  for (const log of logs) {
    if (Number(log.user_id) !== userId) continue;
    const date = log.workout_date?.split("T")[0] ?? log.workout_date;
    if (!weekDates.has(date)) continue;

    const muscle = log.exercise?.muscle;
    if (!muscle) continue;

    const slugs = MUSCLE_MAP[muscle] ?? [];
    for (const slug of slugs) {
      counts[slug] = (counts[slug] ?? 0) + 1;
    }
  }

  return Object.entries(counts).map(([slug, count]) => ({
    slug: slug as Slug,
    intensity: (count >= 4 ? 3 : count >= 2 ? 2 : 1) as 1 | 2 | 3,
  }));
}

const FIRST_VISIT_KEY  = "@liftyhub_body_first_visit";
const WARNED_KEY       = "@liftyhub_body_warned";

export default function BodyAvatarScreen() {
  const { t } = useLanguage();
  const { plan } = useSubscription();
  const [side, setSide] = useState<"front" | "back">("front");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [bodyData, setBodyData] = useState<ExtendedBodyPart[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showTrialModal, setShowTrialModal] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const raw = await Storage.getItem("user");
        const token = await Storage.getItem("token");
        if (!raw || !token) return;

        // Bloquear Free después de 7 días
        if (plan?.name === "Free" || !plan) {
          const firstVisit = await AsyncStorage.getItem(FIRST_VISIT_KEY);
          if (!firstVisit) {
            await AsyncStorage.setItem(FIRST_VISIT_KEY, new Date().toISOString());
            const warned = await AsyncStorage.getItem(WARNED_KEY);
            if (!warned) {
              await AsyncStorage.setItem(WARNED_KEY, "true");
              setShowTrialModal(true);
            }
          } else {
            const daysSince = (Date.now() - new Date(firstVisit).getTime()) / (1000 * 60 * 60 * 24);
            if (daysSince > 7) {
              setShowUpgrade(true);
              setLoading(false);
              return;
            }
          }
        }

        const u = JSON.parse(raw);
        setGender(u.gender === "Femenino" || u.gender === "femenino" ? "female" : "male");

        const res = await getExerciseLogs(token);
        const logs = res?.data ?? [];
        setBodyData(buildBodyData(logs, u.id));
      } catch {
        setBodyData([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [plan]);

  const workedMuscles = [...new Set(
    bodyData.map(b => {
      const entry = Object.entries(MUSCLE_MAP).find(([, slugs]) => b.slug && slugs.includes(b.slug));
      return entry?.[0] ?? b.slug ?? "";
    }).filter(Boolean)
  )];

  if (showUpgrade) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.header}>
          <HapticButton style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color="white" />
          </HapticButton>
          <Text style={styles.headerTitle}>{t("bodyAvatar.title")}</Text>
        </View>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 32 }}>
          <Ionicons name="lock-closed" size={48} color={colors.primary} style={{ marginBottom: 20 }} />
          <Text style={{ color: "white", fontSize: 20, fontWeight: "700", textAlign: "center", marginBottom: 12 }}>
            {t("bodyAvatar.premiumTitle")}
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: 14, textAlign: "center", lineHeight: 21, marginBottom: 32 }}>
            {t("bodyAvatar.premiumDesc")}
          </Text>
          <HapticButton
            style={{ backgroundColor: colors.primary, borderRadius: spacing.borderRadius, paddingVertical: 14, paddingHorizontal: 32, width: "100%", alignItems: "center" }}
            onPress={() => router.push("/settings/plans" as any)}
          >
            <Text style={{ color: "white", fontSize: 15, fontWeight: "700" }}>{t("bodyAvatar.viewPlans")}</Text>
          </HapticButton>
          <HapticButton style={{ marginTop: 14 }} onPress={() => router.back()}>
            <Text style={{ color: colors.textSecondary, fontSize: 14 }}>{t("bodyAvatar.goBack")}</Text>
          </HapticButton>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <HapticButton style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="white" />
        </HapticButton>
        <Text style={styles.headerTitle}>{t("bodyAvatar.title")}</Text>
      </View>

      {/* Toggle */}
      <View style={styles.toggle}>
        <HapticButton
          style={[styles.toggleBtn, side === "front" && styles.toggleBtnActive]}
          onPress={() => setSide("front")}
        >
          <Text style={[styles.toggleText, side === "front" && styles.toggleTextActive]}>{t("bodyAvatar.front")}</Text>
        </HapticButton>
        <HapticButton
          style={[styles.toggleBtn, side === "back" && styles.toggleBtnActive]}
          onPress={() => setSide("back")}
        >
          <Text style={[styles.toggleText, side === "back" && styles.toggleTextActive]}>{t("bodyAvatar.back")}</Text>
        </HapticButton>
      </View>

      {/* Avatar */}
      <View style={styles.bodyContainer} pointerEvents="none">
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <Body
            data={bodyData}
            gender={gender}
            side={side}
            scale={1.5}
            border="#3A3A3C"
            defaultFill="#2A2A2C"
            colors={["#3B82F6", "#6366F1", "#8B5CF6"]}
          />
        )}
      </View>

      {/* Info */}
      <View style={styles.infoCard}>
        {bodyData.length === 0 ? (
          <>
            <Ionicons name="trophy-outline" size={22} color={colors.textSecondary} />
            <Text style={styles.infoText}>{t("bodyAvatar.noData")}</Text>
          </>
        ) : (
          <>
            <Ionicons name="flash" size={22} color={colors.primary} />
            <Text style={styles.infoText}>
              {t("bodyAvatar.thisWeek")}{" "}
              <Text style={{ color: colors.primary, fontWeight: "700" }}>
                {workedMuscles.join(", ")}
              </Text>
            </Text>
          </>
        )}
      </View>

      {/* MODAL AVISO PRUEBA GRATUITA */}
      <Modal visible={showTrialModal} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center", padding: 32 }}>
          <View style={{ backgroundColor: "#1C1C1E", borderRadius: 20, padding: 24, width: "100%", alignItems: "center" }}>
            <Ionicons name="time-outline" size={40} color={colors.primary} style={{ marginBottom: 16 }} />
            <Text style={{ color: "white", fontSize: 18, fontWeight: "700", textAlign: "center", marginBottom: 10 }}>
              {t("bodyAvatar.trialTitle")}
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 14, textAlign: "center", lineHeight: 21, marginBottom: 24 }}>
              {t("bodyAvatar.trialDesc", { days: t("bodyAvatar.trialDays") })}
            </Text>
            <HapticButton
              style={{ backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 13, width: "100%", alignItems: "center" }}
              onPress={() => setShowTrialModal(false)}
            >
              <Text style={{ color: "white", fontSize: 15, fontWeight: "700" }}>{t("bodyAvatar.understood")}</Text>
            </HapticButton>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
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
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.card,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "700",
  },
  toggle: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 4,
    marginHorizontal: 24,
    marginTop: 12,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 12,
  },
  toggleBtnActive: {
    backgroundColor: colors.primary,
  },
  toggleText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: "600",
  },
  toggleTextActive: {
    color: "white",
  },
  bodyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.card,
    borderRadius: 16,
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 16,
  },
  infoText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
});
