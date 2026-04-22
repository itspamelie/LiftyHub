import { View, Text, StyleSheet, ActivityIndicator, ImageBackground } from "react-native";
import { ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { colors, spacing } from "@/src/styles/globalstyles";
import HapticButton from "@/src/components/buttons/HapticButton";
import { useLanguage } from "@/src/context/LanguageContext";
import * as Storage from "@/src/utils/storage";
import { getUser, getUserProperties, getUserStreak, getUserRoutinesCount } from "@/src/services/api";

type UserProfile = {
  name: string;
  streak: number;
  workouts: number;
  weight: string;
  height: string;
  goal: string;
};

export default function UserProfileScreen() {
  const { t } = useLanguage();
  const params = useLocalSearchParams<{ id: string; name: string; streak: string; workouts: string }>();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const token = await Storage.getItem("token");
        if (!token) { router.replace("/auth/login"); return; }

        const id = Number(params.id);
        const [userRes, propsRes, streakRes, countRes] = await Promise.allSettled([
          getUser(id, token),
          getUserProperties(id, token),
          getUserStreak(id, token),
          getUserRoutinesCount(id, token),
        ]);

        const props = propsRes.status === "fulfilled" ? propsRes.value?.data : null;
        const streak = streakRes.status === "fulfilled" ? streakRes.value?.data : null;
        const count = countRes.status === "fulfilled" ? countRes.value : null;

        setProfile({
          name: params.name ?? (userRes.status === "fulfilled" ? userRes.value?.data?.name : "—"),
          streak: streak?.current_streak ?? Number(params.streak ?? 0),
          workouts: count?.count ?? Number(params.workouts ?? 0),
          weight: props?.weight ? parseFloat(props.weight).toString() : "—",
          height: props?.stature ? parseFloat(props.stature).toString() : "—",
          goal: props?.objective ?? "—",
        });
      } catch {
        setProfile({
          name: params.name ?? "—",
          streak: Number(params.streak ?? 0),
          workouts: Number(params.workouts ?? 0),
          weight: "—",
          height: "—",
          goal: "—",
        });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!profile) return null;

  const initials = profile.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ImageBackground
        source={{ uri: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61" }}
        style={styles.cover}
      >
        <HapticButton style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="white" />
        </HapticButton>
      </ImageBackground>

      <View style={styles.content}>
        <View style={styles.avatarWrapper}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitials}>{initials}</Text>
          </View>
        </View>

        <Text style={styles.name}>{profile.name}</Text>

        {/* STATS */}
        <View style={styles.statsCard}>
          <View style={styles.stat}>
            <Ionicons name="barbell" size={22} color={colors.text} />
            <Text style={styles.statNumber}>{profile.workouts > 0 ? profile.workouts : "—"}</Text>
            <Text style={styles.statLabel}>{t("friends.workouts")}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Ionicons name="flame" size={22} color="#F59E0B" />
            <Text style={styles.statNumber}>{profile.streak > 0 ? profile.streak : "—"}</Text>
            <Text style={styles.statLabel}>{t("friends.streak")}</Text>
          </View>
        </View>

        {/* INFO FÍSICA */}
        <Text style={styles.sectionTitle}>{t("profile.physicalInfo")}</Text>
        <View style={styles.infoGrid}>
          <View style={styles.infoCard}>
            <Ionicons name="resize" size={20} color={colors.primary} />
            <Text style={styles.infoLabel}>{t("profile.height")}</Text>
            <Text style={styles.infoValue}>{profile.height !== "—" ? `${profile.height} cm` : "—"}</Text>
          </View>
          <View style={styles.infoCard}>
            <Ionicons name="scale" size={20} color={colors.primary} />
            <Text style={styles.infoLabel}>{t("profile.weight")}</Text>
            <Text style={styles.infoValue}>{profile.weight !== "—" ? `${profile.weight} kg` : "—"}</Text>
          </View>
          <View style={[styles.infoCard, { width: "100%" }]}>
            <Ionicons name="flag" size={20} color={colors.primary} />
            <Text style={styles.infoLabel}>{t("profile.goal")}</Text>
            <Text style={styles.infoValue}>{profile.goal}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  cover: { width: "100%", height: 200 },
  backBtn: {
    position: "absolute",
    top: 50,
    left: 16,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 20,
    padding: 8,
  },
  content: { padding: spacing.screenPadding, paddingBottom: 48, marginTop: -40 },
  avatarWrapper: { alignItems: "center", marginBottom: 12 },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: colors.background,
  },
  avatarInitials: { color: "white", fontSize: 32, fontWeight: "700" },
  name: { color: colors.text, fontSize: 24, fontWeight: "700", textAlign: "center", marginBottom: 20 },
  statsCard: {
    backgroundColor: colors.card,
    borderRadius: spacing.borderRadius,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 24,
  },
  stat: { alignItems: "center", gap: 4, flex: 1 },
  statDivider: { width: 1, height: 40, backgroundColor: "#2A2A2A" },
  statNumber: { color: colors.text, fontSize: 20, fontWeight: "700" },
  statLabel: { color: colors.textSecondary, fontSize: 13 },
  sectionTitle: { color: colors.text, fontSize: 18, fontWeight: "700", marginBottom: 12 },
  infoGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: spacing.borderRadius,
    padding: 16,
    alignItems: "center",
    gap: 6,
    width: "47%",
  },
  infoLabel: { color: colors.textSecondary, fontSize: 12 },
  infoValue: { color: colors.text, fontSize: 16, fontWeight: "600" },
});
