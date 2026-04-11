import { ScrollView, View, Text, StyleSheet, Image, ImageBackground, RefreshControl, Modal, Dimensions, TextInput, ActivityIndicator } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, planColors } from "@/src/styles/globalstyles";
import ProgressCard from "@/src/components/profile/ProgressCard";
import InfoStatCard from "@/src/components/profile/InfoStatCard";
import StatsSummaryGrid from "@/src/components/stats/StatsSummaryGrid";
import WeeklyActivityChart from "@/src/components/stats/WeeklyActivityChart";
import PersonalRecords from "@/src/components/stats/PersonalRecords";
import { router } from "expo-router";
import { useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Storage from "@/src/utils/storage";
import { getUser, getUserProperties, getUserStreak, getUserRoutinesCount, getUserRoutineSessions, getExerciseLogs, updateUserProperties } from "@/src/services/api";
import { useLanguage } from "@/src/context/LanguageContext";
import { useSubscription } from "@/src/context/SubscriptionContext";
import { useToast } from "@/src/hooks/useToast";
import { useNetworkStatus } from "@/src/hooks/useNetworkStatus";
import { saveCache, loadCache } from "@/src/utils/cache";
import OfflineBanner from "@/src/components/OfflineBanner";
import { loadWeekPlan } from "@/src/utils/calendarPlan";
import { BlurView } from "expo-blur";
import HapticButton from "@/src/components/buttons/HapticButton";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");


// función para calcular la edad
const calculateAge = (birthdate: string) => {
  const today = new Date();
  const birth = new Date(birthdate);

  let age = today.getFullYear() - birth.getFullYear();

  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};

export default function ProfileScreen() {

  const { t } = useLanguage();
  const { plan } = useSubscription();
  const planColor = planColors[plan?.name ?? "Free"] ?? "#A1A1A1";
  const hasStatsAccess = plan?.name === "Basic" || plan?.name === "Pro";

  const STATS_PLAN_OPTIONS = [
    {
      name: "Basic",
      price: "$99/mes",
      color: colors.primary,
      features: [t("plans.features.stats"), t("stats.weeklyActivity"), t("stats.personalRecords"), t("plans.features.routines20")],
    },
    {
      name: "Pro",
      price: "$600/mes",
      color: "#F59E0B",
      features: [t("plans.features.routinesUnlimited"), t("plans.features.nutritionist"), t("plans.features.dietPlan")],
      highlighted: true,
    },
  ];

  const { showToast, Toast } = useToast();
  const isConnected = useNetworkStatus();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"perfil" | "stats">("perfil");
  const [stats, setStats] = useState<any>(null);
  const [allSessions, setAllSessions] = useState<any[]>([]);
  const [allLogs, setAllLogs] = useState<any[]>([]);
  const [animationTrigger, setAnimationTrigger] = useState(0);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showConverterModal, setShowConverterModal] = useState(false);

  const [profileToken, setProfileToken] = useState<string | null>(null);
  const [profileUserId, setProfileUserId] = useState<number | null>(null);
  const [profilePropertiesId, setProfilePropertiesId] = useState<number | null>(null);
  const [showHeightEdit, setShowHeightEdit] = useState(false);
  const [showWeightEdit, setShowWeightEdit] = useState(false);
  const [tempHeightEdit, setTempHeightEdit] = useState(170);
  const [tempWeightEdit, setTempWeightEdit] = useState(70);

  const HEIGHT_VALUES = Array.from({ length: 151 }, (_, i) => i + 100);
  const WEIGHT_VALUES = Array.from({ length: 221 }, (_, i) => i + 30);
  const [converterValue, setConverterValue] = useState("");
  const [converterMode, setConverterMode] = useState<"kg" | "lbs">("kg");

  const convertedValue = (() => {
    const num = parseFloat(converterValue);
    if (isNaN(num)) return "";
    if (converterMode === "kg") return (num * 2.20462).toFixed(2);
    return (num / 2.20462).toFixed(2);
  })();

  const loadUser = async (isRefresh = false) => {
    try {
      const token = await Storage.getItem("token");
      const userStorage = await Storage.getItem("user");

      if (!token || !userStorage) { setLoading(false); return; }

      const userParsed = JSON.parse(userStorage);

      const [userData, propsData, streakData, routinesCountData, sessionsData, logsData] = await Promise.all([
        getUser(userParsed.id, token),
        getUserProperties(userParsed.id, token),
        getUserStreak(userParsed.id, token),
        getUserRoutinesCount(userParsed.id, token),
        getUserRoutineSessions(token),
        getExerciseLogs(token),
      ]);

      const user   = userData.data ?? userData;
      const props  = propsData.data ?? propsData;
      const streak = streakData.data ?? streakData;

      setProfileToken(token);
      setProfileUserId(userParsed.id);
      setProfilePropertiesId(props?.id ?? null);

      const routinesCount = routinesCountData?.count ?? 0;
      const currentStreak = streak?.current_streak ?? 0;

      // Helper: parse "YYYY-MM-DD HH:mm:ss" or ISO string as local date (no timezone shift)
      const parseLocalDate = (str: string): Date => {
        const datePart = str.split(" ")[0].split("T")[0];
        const [y, m, d] = datePart.split("-").map(Number);
        return new Date(y, m - 1, d);
      };

      // Semana actual (lunes–domingo) en fecha local
      const now = new Date();
      const dow = now.getDay();
      const diffToMon = dow === 0 ? -6 : 1 - dow;
      const weekDates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diffToMon + i);
        return d;
      });
      const weekDateStrings = new Set(weekDates.map(d => d.toDateString()));

      // Sesiones completadas del usuario (solo las que tienen finished_at)
      const rawSessions: any[] = (sessionsData?.data ?? []).filter(
        (s: any) => Number(s.user_id) === Number(userParsed.id)
      );
      const completedApiDates = rawSessions
        .filter((s: any) => s.finished_at && s.started_at)
        .map((s: any) => parseLocalDate(s.started_at));

      // Merge con fechas locales guardadas en AsyncStorage
      const localRaw = await AsyncStorage.getItem("completedWorkoutDates");
      const localDates: Date[] = localRaw
        ? (JSON.parse(localRaw) as string[]).map(s => parseLocalDate(s))
        : [];
      const seen = new Set<string>();
      const allCompletedDates = [...completedApiDates, ...localDates].filter(d => {
        const key = d.toDateString();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      // Sesiones completadas esta semana
      const completedThisWeek = allCompletedDates.filter(d => weekDateStrings.has(d.toDateString()));
      const weeklyWorkouts = completedThisWeek.length;

      // Progreso basado en el plan del calendario
      const calendarPlan = await loadWeekPlan();
      const plannedDays = Object.values(calendarPlan).filter(p => p?.type === "routine").length;
      const completedPlannedDays = weekDates.filter((date, i) => {
        if (calendarPlan[i]?.type !== "routine") return false;
        return allCompletedDates.some(cd => cd.toDateString() === date.toDateString());
      }).length;

      const weeklyProgress = plannedDays > 0
        ? Math.min(Math.round((completedPlannedDays / plannedDays) * 100), 100)
        : weeklyWorkouts > 0 ? Math.min(Math.round((weeklyWorkouts / 5) * 100), 100) : 0;

      // Logs de ejercicio de esta semana del usuario
      const rawLogs: any[] = (logsData?.data ?? []).filter(
        (l: any) => Number(l.user_id) === Number(userParsed.id)
      );
      const weeklyLogs = rawLogs.filter((l: any) => {
        if (!l.workout_date) return false;
        const d = parseLocalDate(l.workout_date);
        return weekDateStrings.has(d.toDateString());
      });
      const weeklyReps = weeklyLogs.reduce((sum: number, l: any) => sum + (l.repetitions ?? 0), 0);
      const weeklySets = weeklyLogs.reduce((sum: number, l: any) => sum + (l.sets ?? 0), 0);

      setAllSessions(rawSessions);
      setAllLogs(rawLogs);

      setProfile({
        name:            user.name,
        age:             user.birthdate ? calculateAge(user.birthdate) : t("profile.na"),
        avatar:          require("@/src/assets/defaultd.png"),
        routinesCount,
        streak:          currentStreak,
        weight:          props?.weight ? parseFloat(props.weight).toString() : "0",
        height:          props?.stature ? parseFloat(props.stature).toString() : "0",
        somatotype:      props?.somatotype?.type ?? t("profile.na"),
        goal:            props?.objective ?? t("profile.na"),
        weeklyWorkouts,
        weeklyProgress,
        weeklyReps,
        weeklySets,
      });

      const statsData = { workouts: routinesCount, streak: currentStreak, totalTime: 0, totalWeight: 0 };
      setStats(statsData);
      await saveCache("profile", { profile: { name: user.name, age: user.birthdate ? calculateAge(user.birthdate) : t("profile.na"), routinesCount, streak: currentStreak, weight: props?.weight ? parseFloat(props.weight).toString() : "0", height: props?.stature ? parseFloat(props.stature).toString() : "0", somatotype: props?.somatotype?.type ?? t("profile.na"), goal: props?.objective ?? t("profile.na"), weeklyWorkouts, weeklyProgress, weeklyReps, weeklySets }, stats: statsData, sessions: rawSessions, logs: rawLogs });
    } catch {
      const cached = await loadCache<any>("profile");
      if (cached) { setProfile({ ...cached.profile, avatar: require("@/src/assets/defaultd.png") }); setStats(cached.stats); setAllSessions(cached.sessions); setAllLogs(cached.logs); }
      showToast(t("profile.errorLoad"), "error");
    } finally {
      setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  };

  useEffect(() => { loadUser(); }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setAnimationTrigger(prev => prev + 1);
    loadUser(true);
  }, []);

  const handleSaveHeight = async (val: number) => {
    if (!profileToken || !profilePropertiesId || !profileUserId) return;
    try {
      await updateUserProperties(profilePropertiesId, { user_id: profileUserId, stature: val }, profileToken);
      setProfile((prev: any) => prev ? { ...prev, height: val.toString() } : prev);
      showToast(t("editProfile.successTitle"), "success");
    } catch { showToast(t("profile.errorLoad"), "error"); }
  };

  const handleSaveWeight = async (val: number) => {
    if (!profileToken || !profilePropertiesId || !profileUserId) return;
    try {
      await updateUserProperties(profilePropertiesId, { user_id: profileUserId, weight: val }, profileToken);
      setProfile((prev: any) => prev ? { ...prev, weight: val.toString() } : prev);
      showToast(t("editProfile.successTitle"), "success");
    } catch { showToast(t("profile.errorLoad"), "error"); }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (

    <View style={styles.container}>
      {!isConnected && <OfflineBanner />}

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary} />
        }
      >

        {/* PORTADA */}
        <ImageBackground
          source={{
            uri: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61"
          }}
          style={styles.cover}
        />

        {/* CONTENIDO */}
        <View style={styles.content}>

          {/* HEADER */}
          <View style={styles.header}>

            <Image
              source={profile.avatar}
              style={[styles.avatar, { borderColor: planColor }]}
            />

            <Text style={styles.name}>{profile.name}</Text>
            <View style={styles.subtitleRow}>
              <Text style={styles.subtitle}>{profile.age} {t("profile.years")}</Text>
              <View style={[styles.planBadgeInline, { backgroundColor: `${planColor}20`, borderColor: `${planColor}55` }]}>
                <View style={[styles.planDot, { backgroundColor: planColor }]} />
                <Text style={[styles.planBadgeInlineText, { color: planColor }]}>{plan?.name ?? "Free"}</Text>
              </View>
            </View>

          </View>

          {/* TABS INTERNOS */}
          <View style={styles.tabRow}>
            <HapticButton
              style={[styles.tabBtn, activeTab === "perfil" && styles.tabBtnActive]}
              onPress={() => setActiveTab("perfil")}
            >
              <Text style={[styles.tabBtnText, activeTab === "perfil" && styles.tabBtnTextActive]}>{t("profile.tabProfile")}</Text>
            </HapticButton>
            <HapticButton
              style={[styles.tabBtn, activeTab === "stats" && styles.tabBtnActive]}
              onPress={() => hasStatsAccess ? setActiveTab("stats") : setShowStatsModal(true)}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                {!hasStatsAccess && (
                  <Ionicons name="lock-closed" size={11} color={activeTab === "stats" ? "white" : colors.textSecondary} />
                )}
                <Text style={[styles.tabBtnText, activeTab === "stats" && styles.tabBtnTextActive]}>{t("profile.tabStats")}</Text>
              </View>
            </HapticButton>
          </View>

          {activeTab === "stats" ? (
            hasStatsAccess ? (
              <View style={{ marginTop: 20 }}>
                {stats && <StatsSummaryGrid stats={stats} trigger={animationTrigger} />}
                <WeeklyActivityChart sessions={allSessions} />
                <PersonalRecords logs={allLogs} />
              </View>
            ) : null
          ) : (
            <>
              {/* TARJETA DE ESTADÍSTICAS */}
              <View style={styles.statsCard}>
                <View style={styles.stat}>
                  <Ionicons name="barbell" size={24} color={colors.text} />
                  <Text style={styles.statNumber}>{profile.routinesCount > 0 ? profile.routinesCount : "—"}</Text>
                  <Text style={styles.statLabel}>{t("profile.routines")}</Text>
                </View>
                <View style={styles.stat}>
                  <Ionicons name="scale" size={24} color={colors.text} />
                  <Text style={styles.statNumber}>{profile.weight !== "0" ? `${profile.weight} kg` : "—"}</Text>
                  <Text style={styles.statLabel}>{t("profile.weight")}</Text>
                </View>
                <View style={styles.stat}>
                  <Ionicons name="flame" size={24} color={colors.text} />
                  <Text style={styles.statNumber}>{profile.streak > 0 ? profile.streak : "—"}</Text>
                  <Text style={styles.statLabel}>{t("profile.streak")}</Text>
                </View>
              </View>

              {/* PROGRESO */}
              <ProgressCard
                progress={profile.weeklyProgress ?? 0}
                workouts={profile.weeklyWorkouts ?? 0}
                reps={profile.weeklyReps ?? 0}
                sets={profile.weeklySets ?? 0}
              />

              {/* INFORMACIÓN FÍSICA */}
              <Text style={styles.title}>{t("profile.physicalInfo")}</Text>
              <View style={styles.infoGrid}>
                <InfoStatCard
                  icon="resize"
                  label={t("profile.height")}
                  value={profile.height !== "0" ? `${profile.height} cm` : "—"}
                  onPress={() => { setTempHeightEdit(profile.height !== "0" ? parseInt(profile.height) : 170); setShowHeightEdit(true); }}
                />
                <InfoStatCard
                  icon="scale"
                  label={t("profile.weight")}
                  value={profile.weight !== "0" ? `${profile.weight} kg` : "—"}
                  onPress={() => { setTempWeightEdit(profile.weight !== "0" ? parseInt(profile.weight) : 70); setShowWeightEdit(true); }}
                />
                <InfoStatCard icon="body" label={t("profile.somatotype")} value={profile.somatotype} />
                <InfoStatCard icon="flag" label={t("profile.goal")} value={profile.goal} />
              </View>

              {/* BOTÓN CONFIGURACIÓN */}
              <HapticButton
                style={styles.settingsButton}
                onPress={() => router.push("/settings")}
              >
                <Ionicons name="settings-outline" size={20} color={colors.textSecondary} />
                <Text style={styles.settingsButtonText}>{t("profile.settings")}</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
              </HapticButton>

              {/* BOTÓN CALCULADORA */}
              <HapticButton
                style={styles.settingsButton}
                onPress={() => { setConverterValue(""); setShowConverterModal(true); }}
              >
                <Ionicons name="swap-horizontal-outline" size={20} color={colors.textSecondary} />
                <Text style={styles.settingsButtonText}>{t("profile.converterTitle")}</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
              </HapticButton>
            </>
          )}

        </View>

      </ScrollView>

      {/* MODAL CALCULADORA KG/LBS */}
      <Modal visible={showConverterModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <HapticButton style={styles.modalClose} onPress={() => setShowConverterModal(false)}>
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </HapticButton>
            <View style={styles.modalIcon}>
              <Ionicons name="swap-horizontal-outline" size={32} color={colors.primary} />
            </View>
            <Text style={styles.modalTitle}>{t("profile.converterTitle")}</Text>

            {/* TOGGLE MODO */}
            <View style={styles.converterToggle}>
              <HapticButton
                style={[styles.converterToggleBtn, converterMode === "kg" && styles.converterToggleBtnActive]}
                onPress={() => { setConverterMode("kg"); setConverterValue(""); }}
              >
                <Text style={[styles.converterToggleText, converterMode === "kg" && styles.converterToggleTextActive]}>kg → lbs</Text>
              </HapticButton>
              <HapticButton
                style={[styles.converterToggleBtn, converterMode === "lbs" && styles.converterToggleBtnActive]}
                onPress={() => { setConverterMode("lbs"); setConverterValue(""); }}
              >
                <Text style={[styles.converterToggleText, converterMode === "lbs" && styles.converterToggleTextActive]}>lbs → kg</Text>
              </HapticButton>
            </View>

            {/* INPUT */}
            <TextInput
              style={styles.converterInput}
              keyboardType="numeric"
              placeholder={converterMode === "kg" ? t("profile.converterKgPlaceholder") : t("profile.converterLbsPlaceholder")}
              placeholderTextColor={colors.textSecondary}
              value={converterValue}
              onChangeText={setConverterValue}
            />

            {/* RESULTADO */}
            {convertedValue !== "" && (
              <View style={styles.converterResult}>
                <Text style={styles.converterResultLabel}>{converterMode === "kg" ? t("profile.converterLbsLabel") : t("profile.converterKgLabel")}</Text>
                <Text style={styles.converterResultValue}>
                  {convertedValue} {converterMode === "kg" ? "lbs" : "kg"}
                </Text>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* MODAL EDITAR ALTURA */}
      <Modal visible={showHeightEdit} transparent animationType="fade">
        <HapticButton style={styles.pickerOverlay} activeOpacity={1} onPress={() => setShowHeightEdit(false)}>
          <HapticButton activeOpacity={1} onPress={() => {}} style={styles.pickerContent}>
            <View style={styles.pickerHeader}>
              <HapticButton onPress={() => setShowHeightEdit(false)}>
                <Ionicons name="close" size={22} color={colors.textSecondary} />
              </HapticButton>
            </View>
            <Picker
              selectedValue={tempHeightEdit}
              onValueChange={(val) => setTempHeightEdit(val)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              {HEIGHT_VALUES.map((h) => (
                <Picker.Item key={h} label={`${h} cm`} value={h} />
              ))}
            </Picker>
            <HapticButton
              style={styles.confirmButton}
              onPress={() => { handleSaveHeight(tempHeightEdit); setShowHeightEdit(false); }}
            >
              <Text style={styles.confirmText}>{t("onboarding.birthdateConfirm")}</Text>
            </HapticButton>
          </HapticButton>
        </HapticButton>
      </Modal>

      {/* MODAL EDITAR PESO */}
      <Modal visible={showWeightEdit} transparent animationType="fade">
        <HapticButton style={styles.pickerOverlay} activeOpacity={1} onPress={() => setShowWeightEdit(false)}>
          <HapticButton activeOpacity={1} onPress={() => {}} style={styles.pickerContent}>
            <View style={styles.pickerHeader}>
              <HapticButton onPress={() => setShowWeightEdit(false)}>
                <Ionicons name="close" size={22} color={colors.textSecondary} />
              </HapticButton>
            </View>
            <Picker
              selectedValue={tempWeightEdit}
              onValueChange={(val) => setTempWeightEdit(val)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              {WEIGHT_VALUES.map((w) => (
                <Picker.Item key={w} label={`${w} kg`} value={w} />
              ))}
            </Picker>
            <HapticButton
              style={styles.confirmButton}
              onPress={() => { handleSaveWeight(tempWeightEdit); setShowWeightEdit(false); }}
            >
              <Text style={styles.confirmText}>{t("onboarding.birthdateConfirm")}</Text>
            </HapticButton>
          </HapticButton>
        </HapticButton>
      </Modal>

      {/* MODAL UPGRADE STATS */}
      <Modal visible={showStatsModal} transparent animationType="slide">
        <HapticButton style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowStatsModal(false)}>
          <HapticButton activeOpacity={1} style={styles.modalContent} onPress={() => {}}>
            <HapticButton style={styles.modalClose} onPress={() => setShowStatsModal(false)}>
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </HapticButton>
            <View style={styles.modalIcon}>
              <Ionicons name="bar-chart-outline" size={32} color={colors.primary} />
            </View>
            <Text style={styles.modalTitle}>{t("profile.upgradeStatsTitle")}</Text>
            <Text style={styles.modalSubtitle}>{t("profile.upgradeStatsSubtitle")}</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {STATS_PLAN_OPTIONS.map((p) => (
                <HapticButton
                  key={p.name}
                  style={[styles.planCard, p.highlighted && { borderColor: p.color, borderWidth: 2 }]}
                  onPress={() => { setShowStatsModal(false); router.push("/settings/plans"); }}
                >
                  {p.highlighted && (
                    <View style={[styles.planBadge, { backgroundColor: p.color }]}>
                      <Text style={styles.planBadgeText}>{t("profile.recommended")}</Text>
                    </View>
                  )}
                  <View style={styles.planHeader}>
                    <Text style={[styles.planName, { color: p.color }]}>{p.name}</Text>
                    <Text style={styles.planPrice}>{p.price}</Text>
                  </View>
                  {p.features.map((f, i) => (
                    <View key={i} style={styles.planFeature}>
                      <Ionicons name="checkmark-circle" size={16} color={p.color} />
                      <Text style={styles.planFeatureText}>{f}</Text>
                    </View>
                  ))}
                </HapticButton>
              ))}
              <Text style={styles.modalNote}>{t("profile.adminNote")}</Text>
            </ScrollView>
          </HapticButton>
        </HapticButton>
      </Modal>

      {Toast}

    </View>
  );
}

// -------- ESTILOS ---------
// -------- ESTILOS ---------
// -------- ESTILOS ---------

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.background
  },

  cover: {
    width: "100%",
    height: 200
  },

  content: {
    padding: spacing.screenPadding,
    paddingBottom: 40,
    marginTop: -50
  },

  header: {
    alignItems: "center",
    marginBottom: 10
  },

  avatar: {
    width: 180,
    height: 180,
    borderRadius: 90,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: colors.background,
    marginTop: -70
  },

  name: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "bold"
  },

  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
  },

  subtitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  nameRowBadge: {
    position: "absolute",
    right: -80,
  },

  planBadgeInline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },

  planDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  planBadgeInlineText: {
    fontSize: 12,
    fontWeight: "700",
  },

  statsCard: {
    backgroundColor: colors.card,
    borderRadius: spacing.borderRadius,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20
  },

  stat: {
    alignItems: "center",
    gap: 4
  },

  statNumber: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "bold"
  },

  statLabel: {
    color: colors.textSecondary,
    fontSize: 13
  },

  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 5
  },

  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10
  },

  tabRow: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 4,
    marginTop: 16,
    marginBottom: 8
  },

  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10
  },

  tabBtnActive: {
    backgroundColor: colors.primary
  },

  tabBtnText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "600"
  },

  tabBtnTextActive: {
    color: "white"
  },

  settingsSection: {
    color: colors.textSecondary,
    marginTop: 20,
    marginBottom: 10,
    fontSize: 14
  },

  settingsCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingVertical: 6
  },

  divider: {
    height: 1,
    backgroundColor: "#2A2A2A",
    marginHorizontal: 16
  },

  settingsButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: spacing.borderRadius,
    padding: 16,
    marginTop: 24,
    gap: 12
  },

  settingsButtonText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: "600"
  },

  lockedContainer: {
    alignItems: "center",
    paddingVertical: 48,
    paddingHorizontal: 20,
    gap: 12,
  },

  lockedIconBg: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(59,130,246,0.12)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },

  lockedTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },

  lockedSubtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
  },

  lockedButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: spacing.borderRadius,
    marginTop: 8,
  },

  lockedButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "700",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },

  modalContent: {
    backgroundColor: "#1C1C1E",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 48,
    maxHeight: SCREEN_HEIGHT * 0.85,
  },

  modalClose: {
    alignSelf: "flex-end",
    padding: 4,
  },

  modalIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(59,130,246,0.15)",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 16,
  },

  modalTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },

  modalSubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },

  planCard: {
    backgroundColor: "#2C2C2E",
    borderRadius: spacing.borderRadius,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "transparent",
  },

  planBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 8,
  },

  planBadgeText: {
    color: "white",
    fontSize: 11,
    fontWeight: "700",
  },

  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  planName: {
    fontSize: 18,
    fontWeight: "700",
  },

  planPrice: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  planFeature: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },

  planFeatureText: {
    color: colors.textSecondary,
    fontSize: 13,
  },

  modalNote: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
  },

  converterToggle: {
    flexDirection: "row",
    backgroundColor: "#2C2C2E",
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },

  converterToggleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },

  converterToggleBtnActive: {
    backgroundColor: colors.primary,
  },

  converterToggleText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "600",
  },

  converterToggleTextActive: {
    color: "white",
  },

  converterInput: {
    backgroundColor: "#2C2C2E",
    borderRadius: spacing.borderRadius,
    padding: 16,
    color: colors.text,
    fontSize: 18,
    textAlign: "center",
    marginBottom: 16,
  },

  converterResult: {
    backgroundColor: "#2C2C2E",
    borderRadius: spacing.borderRadius,
    padding: 20,
    alignItems: "center",
    gap: 4,
  },

  converterResultLabel: {
    color: colors.textSecondary,
    fontSize: 13,
  },

  converterResultValue: {
    color: colors.primary,
    fontSize: 32,
    fontWeight: "bold",
  },

  pickerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },

  pickerContent: {
    backgroundColor: "#1C1C1E",
    borderRadius: 20,
    padding: 20,
    width: "85%",
    alignItems: "center",
  },

  pickerHeader: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 4,
  },

  picker: {
    width: "100%",
    color: "white",
  },

  pickerItem: {
    color: "white",
    fontSize: 18,
  },

  confirmButton: {
    marginTop: 10,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 20,
  },

  confirmText: {
    color: "white",
    fontWeight: "600",
    fontSize: 15,
  },

});

// -------- ESTILOS ---------
// -------- ESTILOS ---------
// -------- ESTILOS ---------