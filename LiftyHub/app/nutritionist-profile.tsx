import { ScrollView, View, Text, StyleSheet, Image, ImageBackground,  } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { colors, spacing } from "@/src/styles/globalstyles";
import { useLanguage } from "@/src/context/LanguageContext";
import HapticButton from "@/src/components/buttons/HapticButton";

const COVER_URL = "https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=900&q=80";

export default function NutritionistProfileScreen() {
  const params = useLocalSearchParams<{
    name: string;
    specialty: string;
    bio: string;
    rating: string;
    location: string;
    profile_pic: string;
  }>();

  const { t } = useLanguage();
  const name = params.name ?? t("nutritionistProfile.fallbackName");
  const specialty = params.specialty ?? "";
  const bio = params.bio ?? "";
  const rating = parseFloat(params.rating ?? "0");
  const location = params.location ?? "";
  const profile_pic = params.profile_pic ?? "";

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* PORTADA */}
      <ImageBackground
        source={{ uri: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=900&q=80" }}
        style={styles.cover}
      >
        <HapticButton style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="white" />
        </HapticButton>
      </ImageBackground>

      {/* SECCIÓN PRINCIPAL */}
      <View style={styles.mainCard}>

        {/* AVATAR FLOTANTE */}
        <View style={styles.avatarWrapper}>
          {profile_pic ? (
            <Image source={{ uri: profile_pic }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarFallback]}>
              <Ionicons name="person" size={36} color={colors.textSecondary} />
            </View>
          )}
        </View>

        {/* NOMBRE E INFO */}
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.specialty}>{specialty}</Text>

        {location ? (
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.location}>{location}</Text>
          </View>
        ) : null}

        {/* RATING */}
        <View style={styles.ratingRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Ionicons
              key={star}
              name={star <= Math.floor(rating) ? "star" : "star-outline"}
              size={16}
              color="#F59E0B"
            />
          ))}
          <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
        </View>

      </View>

      {/* ACERCA DE */}
      {bio ? (
        <View style={[styles.section, { marginBottom: 40 }]}>
          <Text style={styles.sectionTitle}>{t("nutritionistProfile.about")}</Text>
          <Text style={styles.aboutText}>{bio}</Text>
        </View>
      ) : null}

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  cover: {
    width: "100%",
    height: 200,
    justifyContent: "flex-start",
  },

  backBtn: {
    marginTop: 54,
    marginLeft: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  mainCard: {
    backgroundColor: colors.card,
    marginHorizontal: spacing.screenPadding,
    marginTop: -50,
    borderRadius: spacing.borderRadius,
    padding: 16,
    paddingTop: 60,
    marginBottom: 16,
  },

  avatarWrapper: {
    position: "absolute",
    top: -50,
    left: 20,
  },

  avatarFallback: {
    backgroundColor: "#2C2C2E",
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: colors.card,
  },

  onlineDot: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#10B981",
    borderWidth: 2,
    borderColor: colors.card,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginBottom: 12,
  },

  btnPrimary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },

  btnPrimaryText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },

  btnSecondary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1.5,
    borderColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },

  btnSecondaryText: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: 14,
  },

  name: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "bold",
  },

  specialty: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 2,
    marginBottom: 6,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
  },

  location: {
    color: colors.textSecondary,
    fontSize: 13,
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 14,
  },

  ratingText: {
    color: colors.textSecondary,
    fontSize: 13,
    marginLeft: 4,
  },

  followRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#2A2A2A",
    paddingTop: 14,
    gap: 0,
  },

  followItem: {
    flex: 1,
    alignItems: "center",
  },

  followDivider: {
    width: 1,
    backgroundColor: "#2A2A2A",
  },

  followNumber: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "bold",
  },

  followLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },

  section: {
    backgroundColor: colors.card,
    marginHorizontal: spacing.screenPadding,
    borderRadius: spacing.borderRadius,
    padding: 16,
    marginBottom: 16,
  },

  sectionTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 12,
  },

  aboutText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
  },

  expCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 14,
  },

  expIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#0F0F10",
    justifyContent: "center",
    alignItems: "center",
  },

  expInfo: {
    flex: 1,
  },

  expRole: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
  },

  expCompany: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },

  expPeriod: {
    color: "#6B7280",
    fontSize: 12,
    marginTop: 2,
  },

  skillsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  skillChip: {
    backgroundColor: "#0F1B2D",
    borderWidth: 1,
    borderColor: "#1D4ED8",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },

  skillText: {
    color: "#60A5FA",
    fontSize: 13,
    fontWeight: "500",
  },

});
