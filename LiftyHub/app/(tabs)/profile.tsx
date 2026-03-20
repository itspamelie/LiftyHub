import { ScrollView, View, Text, StyleSheet, Image, ImageBackground, TouchableOpacity, RefreshControl } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing } from "@/src/styles/globalstyles";
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
  const [profile, setProfile] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"perfil" | "stats">("perfil");
  const [stats, setStats] = useState<any>(null);
  const [animationTrigger, setAnimationTrigger] = useState(0);

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
              style={styles.avatar}
            />

            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.subtitle}>{profile.age} {t("profile.years")}</Text>

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
              onPress={() => setActiveTab("stats")}
            >
              <Text style={[styles.tabBtnText, activeTab === "stats" && styles.tabBtnTextActive]}>{t("profile.tabStats")}</Text>
            </TouchableOpacity>
          </View>

          {activeTab === "stats" ? (
            <View style={{ marginTop: 20 }}>
              {stats && <StatsSummaryGrid stats={stats} trigger={animationTrigger} />}
              <WeeklyActivityChart />
              <PersonalRecords />
            </View>
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
            </>
          )}

        </View>

      </ScrollView>

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
    marginTop: 4
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
  }

});

// -------- ESTILOS ---------
// -------- ESTILOS ---------
// -------- ESTILOS ---------