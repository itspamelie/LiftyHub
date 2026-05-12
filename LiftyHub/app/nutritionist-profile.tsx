import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { colors, spacing } from "@/src/styles/globalstyles";
import * as Storage from "@/src/utils/storage";
import { getStorageUrl, createDietRequest, getDietRequestByUser } from "@/src/services/api";
import HapticButton from "@/src/components/buttons/HapticButton";

const apiFetch = async (path: string, token: string) => {
  const base = process.env.EXPO_PUBLIC_API_URL;
  const res = await fetch(`${base}${path}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  });
  return res.json();
};

type Profile = {
  id: number;
  license_number: string;
  profile_pic: string;
  specialty: string;
  location: string;
  bio: string;
  rating: string;
  reviews_count: number;
  user: { id: number; name: string };
  education: { id: number; degree: string; institution: string; year: string }[];
  experience: { id: number; title: string; company: string; start_year: string; end_year: string | null }[];
  specialties: { id: number; name: string }[];
  reviews: { id: number; rating: number; comment: string; user: { name: string } }[];
};

export default function NutritionistProfileScreen() {
  const { profileId } = useLocalSearchParams<{ profileId: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [hasActiveRequest, setHasActiveRequest] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const token = await Storage.getItem("token");
        const userStorage = await Storage.getItem("user");
        if (!token || !profileId) return;
        const [profileRes, reqRes] = await Promise.all([
          apiFetch(`/nutritionistProfiles/${profileId}`, token),
          userStorage
            ? getDietRequestByUser(JSON.parse(userStorage).id, token)
            : Promise.resolve(null),
        ]);
        setProfile(profileRes.data ?? null);
        setHasActiveRequest(!!reqRes?.data);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [profileId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.center}>
        <Ionicons name="person-outline" size={48} color={colors.textSecondary} />
        <Text style={{ color: colors.textSecondary, marginTop: 12 }}>Perfil no encontrado</Text>
      </View>
    );
  }

  const handleRequest = () => {
    Alert.alert(
      "Solicitar nutriólogo",
      `¿Quieres enviar una solicitud a ${profile.user?.name ?? "este nutriólogo"}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, solicitar",
          onPress: async () => {
            setRequesting(true);
            try {
              const token = await Storage.getItem("token");
              const userStorage = await Storage.getItem("user");
              if (!token || !userStorage) return;
              const user = JSON.parse(userStorage);
              const now = new Date();
              await createDietRequest(
                {
                  user_id: user.id,
                  nutritionist_id: profile.user.id,
                  year: now.getFullYear(),
                  month: now.getMonth() + 1,
                  status: "pending",
                },
                token
              );
              router.replace("/(tabs)/diet" as any);
            } catch {
              Alert.alert(
                "No se pudo enviar",
                "Ya tienes una solicitud activa este mes o hubo un error. Intenta más tarde."
              );
            } finally {
              setRequesting(false);
            }
          },
        },
      ]
    );
  };

  const avatarUrl = profile.profile_pic
    ? getStorageUrl(profile.profile_pic, "nutritionists")
    : null;
  const rating = parseFloat(profile.rating ?? "0");

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

      {/* PORTADA */}
      <ImageBackground
        source={{ uri: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=900&q=80" }}
        style={styles.cover}
      >
        <HapticButton style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="white" />
        </HapticButton>
      </ImageBackground>

      {/* CARD PRINCIPAL */}
      <View style={styles.mainCard}>
        <View style={styles.avatarWrapper}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarFallback]}>
              <Ionicons name="person" size={36} color={colors.textSecondary} />
            </View>
          )}
        </View>

        <Text style={styles.name}>{profile.user?.name ?? "Nutriólogo"}</Text>
        <Text style={styles.specialty}>{profile.specialty}</Text>

        {profile.location ? (
          <View style={styles.inlineRow}>
            <Ionicons name="location-outline" size={13} color={colors.textSecondary} />
            <Text style={styles.meta}>{profile.location}</Text>
          </View>
        ) : null}

        {profile.license_number ? (
          <View style={styles.inlineRow}>
            <Ionicons name="ribbon-outline" size={13} color={colors.textSecondary} />
            <Text style={styles.meta}>Cédula: {profile.license_number}</Text>
          </View>
        ) : null}

        {/* RATING */}
        <View style={styles.ratingRow}>
          {[1, 2, 3, 4, 5].map((s) => (
            <Ionicons
              key={s}
              name={s <= Math.floor(rating) ? "star" : "star-outline"}
              size={15}
              color="#F59E0B"
            />
          ))}
          <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
          <Text style={styles.reviewsText}>· {profile.reviews_count} reseñas</Text>
        </View>

        {/* ESPECIALIDADES CHIPS */}
        {profile.specialties?.length > 0 && (
          <View style={styles.chipsRow}>
            {profile.specialties.map((s) => (
              <View key={s.id} style={styles.chip}>
                <Text style={styles.chipText}>{s.name}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* BIO */}
      {profile.bio ? (
        <Section title="Acerca de">
          <Text style={styles.bioText}>{profile.bio}</Text>
        </Section>
      ) : null}

      {/* EDUCACIÓN */}
      {profile.education?.length > 0 && (
        <Section title="Educación">
          {profile.education.map((e) => (
            <View key={e.id} style={styles.itemRow}>
              <View style={styles.itemIcon}>
                <Ionicons name="school-outline" size={16} color={colors.primary} />
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>{e.degree}</Text>
                <Text style={styles.itemSub}>{e.institution}</Text>
                <Text style={styles.itemMeta}>{e.year}</Text>
              </View>
            </View>
          ))}
        </Section>
      )}

      {/* EXPERIENCIA */}
      {profile.experience?.length > 0 && (
        <Section title="Experiencia">
          {profile.experience.map((e) => (
            <View key={e.id} style={styles.itemRow}>
              <View style={styles.itemIcon}>
                <Ionicons name="briefcase-outline" size={16} color={colors.primary} />
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>{e.title}</Text>
                <Text style={styles.itemSub}>{e.company}</Text>
                <Text style={styles.itemMeta}>
                  {e.start_year} — {e.end_year ?? "Presente"}
                </Text>
              </View>
            </View>
          ))}
        </Section>
      )}

      {/* RESEÑAS */}
      {profile.reviews?.length > 0 && (
        <Section title="Reseñas">
          {profile.reviews.map((r) => (
            <View key={r.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewAvatar}>
                  <Text style={styles.reviewAvatarText}>{r.user?.name?.[0] ?? "?"}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.reviewName}>{r.user?.name ?? "Usuario"}</Text>
                  <View style={styles.reviewStars}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Ionicons
                        key={s}
                        name={s <= r.rating ? "star" : "star-outline"}
                        size={12}
                        color="#F59E0B"
                      />
                    ))}
                  </View>
                </View>
              </View>
              {r.comment ? <Text style={styles.reviewComment}>{r.comment}</Text> : null}
            </View>
          ))}
        </Section>
      )}

      {/* BOTÓN SOLICITAR */}
      <TouchableOpacity
        style={[
          styles.requestBtn,
          (requesting || hasActiveRequest) && styles.requestBtnDisabled,
        ]}
        onPress={hasActiveRequest ? undefined : handleRequest}
        disabled={requesting || hasActiveRequest}
        activeOpacity={hasActiveRequest ? 1 : 0.85}
      >
        {requesting ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Ionicons
            name={hasActiveRequest ? "time-outline" : "send-outline"}
            size={18}
            color={hasActiveRequest ? "#888" : "white"}
          />
        )}
        <Text style={[styles.requestBtnText, hasActiveRequest && styles.requestBtnTextDisabled]}>
          {requesting ? "Enviando..." : hasActiveRequest ? "Solicitud en curso" : "Solicitar este nutriólogo"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: {
    flex: 1, backgroundColor: colors.background,
    justifyContent: "center", alignItems: "center",
  },
  cover: { width: "100%", height: 200, justifyContent: "flex-start" },
  backBtn: {
    marginTop: 54, marginLeft: 16,
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center", alignItems: "center",
  },
  mainCard: {
    backgroundColor: colors.card,
    marginHorizontal: spacing.screenPadding,
    marginTop: -50,
    borderRadius: spacing.borderRadius,
    padding: 16,
    paddingTop: 64,
    marginBottom: 16,
  },
  avatarWrapper: { position: "absolute", top: -50, left: 20 },
  avatar: {
    width: 100, height: 100, borderRadius: 50,
    borderWidth: 3, borderColor: colors.card,
  },
  avatarFallback: {
    backgroundColor: "#2C2C2E",
    justifyContent: "center", alignItems: "center",
  },
  name: { color: "white", fontSize: 22, fontWeight: "700", marginBottom: 2 },
  specialty: { color: colors.textSecondary, fontSize: 14, marginBottom: 8 },
  inlineRow: { flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 4 },
  meta: { color: colors.textSecondary, fontSize: 13 },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 3, marginTop: 8, marginBottom: 12 },
  ratingText: { color: "#F59E0B", fontSize: 13, fontWeight: "600", marginLeft: 4 },
  reviewsText: { color: colors.textSecondary, fontSize: 12 },
  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    backgroundColor: "rgba(59,130,246,0.1)",
    borderWidth: 1, borderColor: "rgba(59,130,246,0.25)",
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5,
  },
  chipText: { color: colors.primary, fontSize: 12, fontWeight: "600" },
  section: {
    backgroundColor: colors.card,
    marginHorizontal: spacing.screenPadding,
    borderRadius: spacing.borderRadius,
    padding: 16, marginBottom: 14,
  },
  sectionTitle: { color: "white", fontSize: 16, fontWeight: "700", marginBottom: 14 },
  bioText: { color: colors.textSecondary, fontSize: 14, lineHeight: 22 },
  itemRow: { flexDirection: "row", gap: 12, marginBottom: 14, alignItems: "flex-start" },
  itemIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: "rgba(59,130,246,0.1)",
    justifyContent: "center", alignItems: "center",
  },
  itemInfo: { flex: 1 },
  itemTitle: { color: "white", fontSize: 14, fontWeight: "600" },
  itemSub: { color: colors.textSecondary, fontSize: 13, marginTop: 2 },
  itemMeta: { color: "#555", fontSize: 12, marginTop: 2 },
  reviewCard: {
    backgroundColor: "#0F0F10",
    borderRadius: 12, padding: 12, marginBottom: 10,
  },
  reviewHeader: { flexDirection: "row", gap: 10, alignItems: "center", marginBottom: 8 },
  reviewAvatar: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: "rgba(59,130,246,0.15)",
    justifyContent: "center", alignItems: "center",
  },
  reviewAvatarText: { color: colors.primary, fontSize: 13, fontWeight: "700" },
  reviewName: { color: "white", fontSize: 13, fontWeight: "600" },
  reviewStars: { flexDirection: "row", gap: 2, marginTop: 2 },
  reviewComment: { color: colors.textSecondary, fontSize: 13, lineHeight: 19 },
  requestBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, backgroundColor: colors.primary,
    borderRadius: spacing.borderRadius, paddingVertical: 15,
    marginHorizontal: spacing.screenPadding, marginTop: 6,
  },
  requestBtnDisabled: {
    backgroundColor: "#1C1C1E",
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  requestBtnText: { color: "white", fontSize: 15, fontWeight: "700" },
  requestBtnTextDisabled: { color: "#555" },
});
