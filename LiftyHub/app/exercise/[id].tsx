import { View, Text, StyleSheet, ScrollView, FlatList, Image, ActivityIndicator, Platform, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import * as Storage from "@/src/utils/storage";
import { Ionicons } from "@expo/vector-icons";
import { getExerciseFiles } from "@/src/services/api";
import { colors, spacing } from "@/src/styles/globalstyles";
import { useLanguage } from "@/src/context/LanguageContext";
import HapticButton from "@/src/components/buttons/HapticButton";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const HERO_HEIGHT = 300;

type ExerciseFile = {
  id: number;
  exercise_id: number;
  file_path: string;
  type: "image" | "video" | "pdf";
};

const getFileUrl = (path: string) => {
  if (path.startsWith("http")) return path;
  const base = (process.env.EXPO_PUBLIC_API_URL ?? "").replace(/\/api$/, "");
  return `${base}/exercises/${path}`;
};

const FALLBACK = "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80";

const MUSCLE_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  "Pecho":       "body-outline",
  "Espalda":     "body-outline",
  "Cuádriceps":  "walk-outline",
  "Glúteos":     "walk-outline",
  "Hombro":      "body-outline",
  "Bíceps":      "barbell-outline",
  "Tríceps":     "barbell-outline",
  "Antebrazo":   "barbell-outline",
  "Abdomen":     "body-outline",
  "Core":        "body-outline",
  "Pantorrilla": "walk-outline",
  "Cardio":      "heart-outline",
};

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  "Fuerza":       "barbell-outline",
  "Hipertrofia":  "trending-up-outline",
  "Cardio":       "heart-outline",
  "Flexibilidad": "body-outline",
  "Resistencia":  "timer-outline",
};

export default function ExerciseDetail() {
  const { id, name, muscle, technique, categorie } = useLocalSearchParams<{
    id: string; name: string; muscle: string; technique: string; categorie: string;
  }>();

  const { t } = useLanguage();
  const [files, setFiles] = useState<ExerciseFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const token = await Storage.getItem("token");
        if (!token || !id) return;
        const res = await getExerciseFiles(Number(id), token);
        if (res?.data) setFiles(res.data);
      } catch {
        // Los archivos son opcionales, el ejercicio igual se muestra
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, [id]);

  const images = files.filter(f => f.type === "image");
  // Si no hay imágenes del API usamos el fallback como único slide
  const slides = images.length > 0
    ? images.map(img => getFileUrl(img.file_path))
    : [FALLBACK];

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setActiveSlide(index);
  };

  const steps = technique
    ? technique.split(/\n|\.(?=\s)/).map(s => s.trim()).filter(Boolean)
    : [];

  const muscleIcon   = MUSCLE_ICONS[muscle ?? ""]   ?? "body-outline";
  const categoryIcon = CATEGORY_ICONS[categorie ?? ""] ?? "pricetag-outline";

  return (
    <View style={styles.root}>

      {/* ── CARRUSEL (fuera del ScrollView) ── */}
      <View style={styles.carouselWrapper}>
        <FlatList
          data={slides}
          keyExtractor={(_, i) => String(i)}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={styles.slide} resizeMode="cover" />
          )}
        />

        <View style={styles.carouselOverlay} />

        <HapticButton style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="white" />
        </HapticButton>

        {slides.length > 1 && (
          <View style={styles.dots}>
            {slides.map((_, i) => (
              <View key={i} style={[styles.dot, i === activeSlide && styles.dotActive]} />
            ))}
          </View>
        )}

        <View style={styles.carouselFooter}>
          <Text style={styles.heroName}>{name}</Text>
          <View style={styles.chipsRow}>
            {muscle ? (
              <View style={styles.chip}>
                <Ionicons name={muscleIcon} size={12} color="white" />
                <Text style={styles.chipText}>{muscle}</Text>
              </View>
            ) : null}
            {categorie ? (
              <View style={[styles.chip, styles.chipBlue]}>
                <Ionicons name={categoryIcon} size={12} color={colors.primary} />
                <Text style={[styles.chipText, styles.chipTextBlue]}>{categorie}</Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} bounces>
        {/* ── CONTENIDO ── */}
        <View style={styles.body}>

          {/* GRID DE INFO */}
          <View style={styles.infoGrid}>
            <View style={styles.infoCard}>
              <Ionicons name={muscleIcon} size={24} color={colors.primary} />
              <Text style={styles.infoLabel}>{t("exerciseDetail.muscle")}</Text>
              <Text style={styles.infoValue}>{muscle || "—"}</Text>
            </View>
            <View style={styles.infoCard}>
              <Ionicons name={categoryIcon} size={24} color={colors.primary} />
              <Text style={styles.infoLabel}>{t("exerciseDetail.category")}</Text>
              <Text style={styles.infoValue}>{categorie || "—"}</Text>
            </View>
          </View>

          {/* TÉCNICA */}
          <View style={styles.sectionHeader}>
            <View style={styles.sectionAccent} />
            <Text style={styles.sectionTitle}>{t("exerciseDetail.howTo")}</Text>
          </View>

          {loading ? (
            <ActivityIndicator color={colors.primary} style={{ marginTop: 20, marginBottom: 20 }} />
          ) : technique ? (
            steps.length > 1 ? (
              <View style={styles.steps}>
                {steps.map((step, i) => (
                  <View key={i} style={styles.step}>
                    <View style={styles.stepLeft}>
                      <View style={styles.stepBadge}>
                        <Text style={styles.stepBadgeText}>{i + 1}</Text>
                      </View>
                      {i < steps.length - 1 && <View style={styles.stepLine} />}
                    </View>
                    <View style={styles.stepContent}>
                      <Text style={styles.stepText}>{step}</Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.techniqueBox}>
                <Ionicons name="information-circle-outline" size={22} color={colors.primary} />
                <Text style={styles.techniqueText}>{technique}</Text>
              </View>
            )
          ) : (
            <View style={styles.emptyBox}>
              <Ionicons name="clipboard-outline" size={40} color={colors.textSecondary} />
              <Text style={styles.emptyText}>{t("exerciseDetail.noDescription")}</Text>
            </View>
          )}

          {/* CONSEJOS */}
          <View style={[styles.sectionHeader, { marginTop: 28 }]}>
            <View style={styles.sectionAccent} />
            <Text style={styles.sectionTitle}>{t("exerciseDetail.tipsSection")}</Text>
          </View>

          <View style={styles.tipsGrid}>
            <View style={styles.tipCard}>
              <Ionicons name="checkmark-circle-outline" size={22} color="#22C55E" />
              <Text style={styles.tipTitle}>{t("exerciseDetail.tip1Title")}</Text>
              <Text style={styles.tipText}>{t("exerciseDetail.tip1Text")}</Text>
            </View>
            <View style={styles.tipCard}>
              <Ionicons name="checkmark-circle-outline" size={22} color="#22C55E" />
              <Text style={styles.tipTitle}>{t("exerciseDetail.tip2Title")}</Text>
              <Text style={styles.tipText}>{t("exerciseDetail.tip2Text")}</Text>
            </View>
            <View style={styles.tipCard}>
              <Ionicons name="alert-circle-outline" size={22} color="#F59E0B" />
              <Text style={styles.tipTitle}>{t("exerciseDetail.tip3Title")}</Text>
              <Text style={styles.tipText}>{t("exerciseDetail.tip3Text")}</Text>
            </View>
          </View>

          {/* MÚSCULOS TRABAJADOS */}
          <View style={[styles.sectionHeader, { marginTop: 28 }]}>
            <View style={styles.sectionAccent} />
            <Text style={styles.sectionTitle}>{t("exerciseDetail.musclesWorked")}</Text>
          </View>

          <View style={styles.muscleRow}>
            <View style={styles.muscleTag}>
              <Ionicons name="star" size={13} color={colors.primary} />
              <Text style={styles.muscleTagText}>{t("exerciseDetail.primaryMuscle")} {muscle || "—"}</Text>
            </View>
            <View style={[styles.muscleTag, styles.muscleTagSecondary]}>
              <Ionicons name="star-outline" size={13} color={colors.textSecondary} />
              <Text style={[styles.muscleTagText, { color: colors.textSecondary }]}>{t("exerciseDetail.secondaryMuscles")}</Text>
            </View>
          </View>

        </View>
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({

  root: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // ── CARRUSEL ──
  carouselWrapper: {
    height: HERO_HEIGHT,
    position: "relative",
  },

  slide: {
    width: SCREEN_WIDTH,
    height: HERO_HEIGHT,
  },

  carouselOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  backButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 56 : 38,
    left: 20,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },

  dots: {
    position: "absolute",
    bottom: 56,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.4)",
  },

  dotActive: {
    width: 18,
    backgroundColor: "white",
  },

  carouselFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "rgba(0,0,0,0.55)",
  },

  heroName: {
    color: "white",
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.3,
    marginBottom: 8,
  },

  chipsRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },

  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },

  chipBlue: {
    backgroundColor: "rgba(59,130,246,0.15)",
    borderColor: "rgba(59,130,246,0.4)",
  },

  chipText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },

  chipTextBlue: {
    color: colors.primary,
  },

  // ── BODY ──
  body: {
    paddingHorizontal: 20,
    paddingBottom: 60,
    paddingTop: 20,
  },

  // ── GRID INFO ──
  infoGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 28,
  },

  infoCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: spacing.borderRadius,
    padding: 16,
    alignItems: "center",
    gap: 6,
  },

  infoLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },

  infoValue: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },

  // ── SECTION HEADER ──
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },

  sectionAccent: {
    width: 4,
    height: 20,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },

  sectionTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "700",
  },

  // ── STEPS ──
  steps: {
    gap: 0,
  },

  step: {
    flexDirection: "row",
    gap: 14,
    minHeight: 60,
  },

  stepLeft: {
    alignItems: "center",
    width: 32,
  },

  stepBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },

  stepBadgeText: {
    color: "white",
    fontWeight: "700",
    fontSize: 13,
  },

  stepLine: {
    flex: 1,
    width: 2,
    backgroundColor: "#2C2C2E",
    marginTop: 4,
    marginBottom: 4,
  },

  stepContent: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
  },

  stepText: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 21,
  },

  techniqueBox: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 18,
    gap: 10,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },

  techniqueText: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 22,
  },

  emptyBox: {
    alignItems: "center",
    paddingVertical: 48,
    gap: 12,
  },

  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
  },

  // ── TIPS ──
  tipsGrid: {
    gap: 10,
  },

  tipCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    gap: 6,
  },

  tipTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
  },

  tipText: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },

  // ── MÚSCULOS ──
  muscleRow: {
    gap: 8,
  },

  muscleTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(59,130,246,0.1)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(59,130,246,0.25)",
  },

  muscleTagSecondary: {
    backgroundColor: "rgba(156,163,175,0.08)",
    borderColor: "rgba(156,163,175,0.2)",
  },

  muscleTagText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "600",
  },

});
