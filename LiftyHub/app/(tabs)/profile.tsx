import { ScrollView, View, Text, StyleSheet, Image, ImageBackground, TouchableOpacity, RefreshControl, Modal, Dimensions } from "react-native";
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
import { getUser, getUserProperties, getUserStreak, getUserRoutinesCount } from "@/src/services/api";
import { useLanguage } from "@/src/context/LanguageContext";
import { useSubscription } from "@/src/context/SubscriptionContext";
import { BlurView } from "expo-blur";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const STATS_PLAN_OPTIONS = [
  {
    name: "Basic",
    price: "$99/mes",
    color: "#3B82F6",
    features: ["Estadísticas avanzadas", "Actividad semanal", "Records personales", "Hasta 20 rutinas propias"],
  },
  {
    name: "Pro",
    price: "$600/mes",
    color: "#F59E0B",
    features: ["Todo lo de Basic", "Rutinas ilimitadas", "Nutriólogo personal", "Plan de dieta personalizado"],
    highlighted: true,
  },
];



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

  const [profile, setProfile] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"perfil" | "stats">("perfil");
  const [stats, setStats] = useState<any>(null);
  const [animationTrigger, setAnimationTrigger] = useState(0);
  const [showStatsModal, setShowStatsModal] = useState(false);

  const loadUser = async (isRefresh = false) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userStorage = await AsyncStorage.getItem("user");

      if (!token || !userStorage) return;

      const userParsed = JSON.parse(userStorage);

      const userData         = await getUser(userParsed.id, token);
      const propsData        = await getUserProperties(userParsed.id, token);
      const streakData       = await getUserStreak(userParsed.id, token);
      const routinesCountData = await getUserRoutinesCount(userParsed.id, token);

      const user   = userData.data ?? userData;
      const props  = propsData.data ?? propsData;
      const streak = streakData.data ?? streakData;

      setProfile({
        name:          user.name,
        age:           user.birthdate ? calculateAge(user.birthdate) : "N/A",
        avatar:        require("@/src/assets/defaultd.png"),
        routinesCount: routinesCountData?.count ?? 0,
        streak:        streak?.current_streak ?? 0,
        weight:        props?.weight ? parseFloat(props.weight).toString() : "0",
        height:        props?.stature ? parseFloat(props.stature).toString() : "0",
        somatotype:    props?.somatotype?.type ?? "N/A",
        goal:          props?.objective ?? "N/A",
      });
    } catch (error) {
      console.log("ERROR:", error);
    } finally {
      if (isRefresh) setRefreshing(false);
    }
  };

  useEffect(() => { loadUser(); }, []);

  const loadStats = async () => {
    setStats({ workouts: 24, streak: 5, totalTime: 18, totalWeight: 12450 });
  };

  useEffect(() => { loadStats(); }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setAnimationTrigger(prev => prev + 1);
    loadUser(true);
    loadStats();
  }, []);


  if (!profile) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "white" }}>{t("profile.loading")}</Text>
      </View>
    );
  }
  return (

    <View style={styles.container}>



      {/* BOTÓN EDITAR */}
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => router.push("/edit-profile")}
      >
        <Ionicons name="pencil" size={20} color="white" />
      </TouchableOpacity>

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
            <TouchableOpacity
              style={[styles.tabBtn, activeTab === "perfil" && styles.tabBtnActive]}
              onPress={() => setActiveTab("perfil")}
            >
              <Text style={[styles.tabBtnText, activeTab === "perfil" && styles.tabBtnTextActive]}>{t("profile.tabProfile")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabBtn, activeTab === "stats" && styles.tabBtnActive]}
              onPress={() => hasStatsAccess ? setActiveTab("stats") : setShowStatsModal(true)}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                {!hasStatsAccess && (
                  <Ionicons name="lock-closed" size={11} color={activeTab === "stats" ? "white" : "#A1A1A1"} />
                )}
                <Text style={[styles.tabBtnText, activeTab === "stats" && styles.tabBtnTextActive]}>{t("profile.tabStats")}</Text>
              </View>
            </TouchableOpacity>
          </View>

          {activeTab === "stats" ? (
            hasStatsAccess ? (
              <View style={{ marginTop: 20 }}>
                {stats && <StatsSummaryGrid stats={stats} trigger={animationTrigger} />}
                <WeeklyActivityChart />
                <PersonalRecords />
              </View>
            ) : null
          ) : (
            <>
              {/* TARJETA DE ESTADÍSTICAS */}
              <View style={styles.statsCard}>
                <View style={styles.stat}>
                  <Ionicons name="barbell" size={24} color={colors.text} />
                  <Text style={styles.statNumber}>{profile.routinesCount}</Text>
                  <Text style={styles.statLabel}>{t("profile.routines")}</Text>
                </View>
                <View style={styles.stat}>
                  <Ionicons name="scale" size={24} color={colors.text} />
                  <Text style={styles.statNumber}>{profile.weight} kg</Text>
                  <Text style={styles.statLabel}>{t("profile.weight")}</Text>
                </View>
                <View style={styles.stat}>
                  <Ionicons name="flame" size={24} color={colors.text} />
                  <Text style={styles.statNumber}>{profile.streak}</Text>
                  <Text style={styles.statLabel}>{t("profile.streak")}</Text>
                </View>
              </View>

              {/* PROGRESO */}
              <ProgressCard progress={75} workouts={6} reps={420} sets={45} />

              {/* INFORMACIÓN FÍSICA */}
              <Text style={styles.title}>{t("profile.physicalInfo")}</Text>
              <View style={styles.infoGrid}>
                <InfoStatCard icon="resize" label={t("profile.height")} value={`${profile.height} cm`} />
                <InfoStatCard icon="scale" label={t("profile.weight")} value={`${profile.weight} kg`} />
                <InfoStatCard icon="body" label={t("profile.somatotype")} value={profile.somatotype} />
                <InfoStatCard icon="flag" label={t("profile.goal")} value={profile.goal} />
              </View>

              {/* BOTÓN CONFIGURACIÓN */}
              <TouchableOpacity
                style={styles.settingsButton}
                onPress={() => router.push("/settings")}
              >
                <Ionicons name="settings-outline" size={20} color={colors.textSecondary} />
                <Text style={styles.settingsButtonText}>{t("profile.settings")}</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            </>
          )}

        </View>

      </ScrollView>

      {/* MODAL UPGRADE STATS */}
      <Modal visible={showStatsModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalClose} onPress={() => setShowStatsModal(false)}>
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </TouchableOpacity>
            <View style={styles.modalIcon}>
              <Ionicons name="bar-chart-outline" size={32} color={colors.primary} />
            </View>
            <Text style={styles.modalTitle}>Desbloquea Estadísticas</Text>
            <Text style={styles.modalSubtitle}>
              Accede a tus estadísticas detalladas, actividad semanal y records personales.
            </Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {STATS_PLAN_OPTIONS.map((p) => (
                <TouchableOpacity
                  key={p.name}
                  style={[styles.planCard, p.highlighted && { borderColor: p.color, borderWidth: 2 }]}
                  onPress={() => { setShowStatsModal(false); router.push("/settings/plans"); }}
                >
                  {p.highlighted && (
                    <View style={[styles.planBadge, { backgroundColor: p.color }]}>
                      <Text style={styles.planBadgeText}>Recomendado</Text>
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
                </TouchableOpacity>
              ))}
              <Text style={styles.modalNote}>Contacta a un administrador para actualizar tu plan.</Text>
            </ScrollView>
          </View>
        </View>
      </Modal>

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

  editButton: {
    position: "absolute",
    top: 60,
    right: 20,
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20
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
    backgroundColor: "#1C1C1E",
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
    backgroundColor: "#3B82F6"
  },

  tabBtnText: {
    color: "#A1A1A1",
    fontSize: 14,
    fontWeight: "600"
  },

  tabBtnTextActive: {
    color: "white"
  },

  settingsSection: {
    color: "#A1A1A1",
    marginTop: 20,
    marginBottom: 10,
    fontSize: 14
  },

  settingsCard: {
    backgroundColor: "#1C1C1E",
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

});

// -------- ESTILOS ---------
// -------- ESTILOS ---------
// -------- ESTILOS ---------