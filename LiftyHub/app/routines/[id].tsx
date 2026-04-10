import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Platform,
  Modal,
  Share,
  Alert,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing } from "@/src/styles/globalstyles";
import { getRoutineExercises, getUserRoutineExercises } from "@/src/services/api";
import { useLanguage } from "@/src/context/LanguageContext";
import { useNetworkStatus } from "@/src/hooks/useNetworkStatus";
import { saveCache, loadCache } from "@/src/utils/cache";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const HERO_HEIGHT = 240;

type ExerciseEntry = {
  id: number;
  sets?: number;
  repetitions?: number;
  seconds_rest?: number;
  exercise?: {
    id: number;
    name: string;
    muscle: string;
    technique?: string;
    categorie?: string;
  };
  // app routine exercises may have flattened fields
  name?: string;
  muscle?: string;
};

const LEVEL_COLORS: Record<string, string> = {
  Principiante: "#22C55E",
  Intermedio:   "#F59E0B",
  Avanzado:     "#EF4444",
};

const LEVEL_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Principiante: "leaf",
  Intermedio:   "flame",
  Avanzado:     "trending-up",
};

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Fuerza:      "barbell",
  Movilidad:   "body",
  Cardio:      "heart",
  HIIT:        "flash",
  "Full Body": "fitness",
};

export default function RoutineDetail() {
  const { id, name, duration, level, category, objective, image, isUserRoutine } =
    useLocalSearchParams<{
      id: string;
      name: string;
      duration: string;
      level: string;
      category: string;
      objective: string;
      image: string;
      isUserRoutine: string;
    }>();

  const { t } = useLanguage();
  const isConnected = useNetworkStatus();
  const [exercises, setExercises] = useState<ExerciseEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);

  const handleStartWorkout = () => {
    if (!isConnected) {
      Alert.alert(
        t("offline.workoutTitle"),
        t("offline.workoutMsg"),
        [
          { text: t("offline.cancel"), style: "cancel" },
          {
            text: t("offline.continueAnyway"),
            onPress: () => router.push({ pathname: "/routines/session", params: { id, name, isUserRoutine } }),
          },
        ]
      );
      return;
    }
    router.push({ pathname: "/routines/session", params: { id, name, isUserRoutine } });
  };

  useEffect(() => {
    const load = async () => {
      const isUser = isUserRoutine === "true";
      const cacheKey = `exercises_${isUser ? "user" : "app"}_${id}`;
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token || !id) return;
        const res = isUser
          ? await getUserRoutineExercises(Number(id), token)
          : await getRoutineExercises(Number(id), token);
        let exs: ExerciseEntry[] = [];
        if (isUser) {
          if (Array.isArray(res?.data)) exs = res.data;
        } else {
          if (Array.isArray(res?.exercises)) exs = res.exercises;
          else if (Array.isArray(res?.data)) exs = res.data;
        }
        setExercises(exs);
        await saveCache(cacheKey, exs);
      } catch {
        const cached = await loadCache<ExerciseEntry[]>(cacheKey);
        if (cached && cached.length > 0) {
          setExercises(cached);
        } else {
          Alert.alert("Error", t("routineDetail.errorLoad"));
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const levelColor  = LEVEL_COLORS[level ?? ""]  ?? colors.primary;
  const levelIcon   = LEVEL_ICONS[level ?? ""]   ?? "barbell-outline";
  const categoryIcon = CATEGORY_ICONS[category ?? ""] ?? "pricetag-outline";
  const durationNum  = duration?.replace(" min", "") ?? "—";

  const buildQrData = () => JSON.stringify({
    app: "liftyhub",
    v: 1,
    name,
    objective,
    level,
    category,
    duration,
    exercises: exercises.map((ex) => ({
      name: ex.exercise?.name ?? ex.name ?? "",
      muscle: ex.exercise?.muscle ?? ex.muscle ?? "",
      sets: ex.sets ?? 0,
      reps: ex.repetitions ?? 0,
      rest: ex.seconds_rest ?? 0,
    })),
  });

  const handleShareText = async () => {
    const exList = exercises
      .map((ex, i) => {
        const n = ex.exercise?.name ?? ex.name ?? "Ejercicio";
        return `${i + 1}. ${n} — ${ex.sets ?? 0} series × ${ex.repetitions ?? 0} reps`;
      })
      .join("\n");
    await Share.share({
      message: `🏋️ ${name}\n📋 ${category} · ${level} · ${durationNum} min\n\n${exList}`,
      title: name ?? "Rutina",
    });
  };

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} bounces contentContainerStyle={{ paddingBottom: 110 }}>

        {/* ── HERO IMAGE ── */}
        <View style={styles.heroWrapper}>
          <Image source={{ uri: image ?? "" }} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.heroOverlay} />
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color="white" />
          </TouchableOpacity>
          {isUserRoutine === "true" && (
            <TouchableOpacity
              style={[styles.shareButton, { right: 70 }]}
              onPress={() => router.push({
                pathname: "/routines/edit/[id]",
                params: { id, name, objective, level, category, duration: duration.replace(" min", ""), img: image ?? "" },
              })}
            >
              <Ionicons name="pencil" size={20} color="white" />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.shareButton} onPress={() => setShowQR(true)}>
            <Ionicons name="qr-code" size={20} color="white" />
          </TouchableOpacity>
          {/* arco inferior para transición suave */}
          <View style={styles.heroArc} />
        </View>

        {/* ── CARD que sube sobre la imagen ── */}
        <View style={styles.headerCard}>
          <View style={styles.chipsRow}>
            <View style={styles.chip}>
              <Ionicons name={categoryIcon} size={11} color="white" />
              <Text style={styles.chipText}>{category}</Text>
            </View>
            <View style={[styles.chip, { backgroundColor: `${levelColor}22`, borderColor: `${levelColor}55` }]}>
              <Ionicons name={levelIcon} size={11} color={levelColor} />
              <Text style={[styles.chipText, { color: levelColor }]}>{level}</Text>
            </View>
          </View>
          <Text style={styles.heroTitle}>{name}</Text>
        </View>

        <View style={styles.body}>

          {/* ── STAT CARDS ── */}
          <View style={styles.statRow}>
            <View style={styles.statCard}>
              <View style={[styles.statIconBg, { backgroundColor: "rgba(59,130,246,0.15)" }]}>
                <Ionicons name="time" size={20} color={colors.primary} />
              </View>
              <Text style={styles.statValue}>{durationNum}</Text>
              <Text style={styles.statLabel}>{t("routineDetail.minutes")}</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIconBg, { backgroundColor: `${levelColor}20` }]}>
                <Ionicons name={levelIcon} size={20} color={levelColor} />
              </View>
              <Text style={[styles.statValue, { color: levelColor }]}>{level}</Text>
              <Text style={styles.statLabel}>{t("routineDetail.level")}</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIconBg, { backgroundColor: "rgba(59,130,246,0.15)" }]}>
                <Ionicons name="barbell" size={20} color={colors.primary} />
              </View>
              <Text style={styles.statValue}>
                {loading ? "—" : exercises.length}
              </Text>
              <Text style={styles.statLabel}>{t("routineDetail.exercises")}</Text>
            </View>
          </View>

          {/* ── OBJETIVO ── */}
          {!!objective && (
            <>
              <SectionHeader title={t("routineDetail.objective")} />
              <View style={styles.objectiveBox}>
                <Ionicons name="flag" size={18} color={colors.primary} />
                <Text style={styles.objectiveText}>{objective}</Text>
              </View>
            </>
          )}

          {/* ── EJERCICIOS ── */}
          <SectionHeader title={t("routineDetail.exercisesSection")} style={{ marginTop: 28 }} />

          {loading ? (
            <ActivityIndicator color={colors.primary} style={{ marginTop: 20, marginBottom: 20 }} />
          ) : exercises.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="barbell" size={44} color={colors.textSecondary} />
              <Text style={styles.emptyText}>{t("routineDetail.noExercises")}</Text>
            </View>
          ) : (
            <View style={styles.exerciseList}>
              {exercises.map((item, index) => {
                const exName    = item.exercise?.name   ?? item.name   ?? "Ejercicio";
                const exMuscle  = item.exercise?.muscle ?? item.muscle ?? "";
                const exCat     = item.exercise?.categorie ?? "";
                const hasSets   = item.sets !== undefined && item.sets !== null;
                const isLast    = index === exercises.length - 1;
                const canNavigate = !!item.exercise;
                const restSecs  = item.seconds_rest ?? 0;
                const showRest  = !isLast && restSecs > 0;

                return (
                  <View key={item.id}>
                    <View style={styles.exerciseRow}>
                      {/* timeline line — se extiende más si hay descanso */}
                      {!isLast && (
                        <View style={[styles.timelineLine, showRest && { bottom: -44 }]} />
                      )}

                      {/* number badge */}
                      <View style={styles.indexBadge}>
                        <Text style={styles.indexBadgeText}>{index + 1}</Text>
                      </View>

                      <TouchableOpacity
                        style={styles.exerciseCard}
                        activeOpacity={canNavigate ? 0.75 : 1}
                        onPress={() => {
                          if (!canNavigate) return;
                          router.push({
                            pathname: "/exercise/[id]",
                            params: {
                              id: item.exercise!.id,
                              name: item.exercise!.name,
                              muscle: item.exercise!.muscle,
                              technique: item.exercise!.technique ?? "",
                              categorie: item.exercise!.categorie ?? "",
                            },
                          });
                        }}
                      >
                        <View style={styles.exerciseCardInner}>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.exerciseName}>{exName}</Text>
                            {(exMuscle || exCat) && (
                              <Text style={styles.exerciseMuscle}>
                                {[exMuscle, exCat].filter(Boolean).join(" · ")}
                              </Text>
                            )}
                            {hasSets && (
                              <View style={styles.metaRow}>
                                <MetaChip icon="layers" label={`${item.sets} series`} />
                                <MetaChip icon="repeat" label={`${item.repetitions} reps`} />
                                <MetaChip icon="timer" label={`${item.seconds_rest}s`} />
                              </View>
                            )}
                          </View>
                          {canNavigate && (
                            <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
                          )}
                        </View>
                      </TouchableOpacity>
                    </View>

                    {/* DESCANSO entre ejercicios */}
                    {showRest && (
                      <View style={styles.restRow}>
                        <Ionicons name="timer" size={13} color={colors.textSecondary} />
                        <Text style={styles.restText}>{restSecs}{t("routineDetail.restSeconds")}</Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          )}

        </View>
      </ScrollView>

      {/* ── CTA STICKY ── */}
      <View style={styles.ctaWrapper}>
        <TouchableOpacity
          style={styles.ctaButton}
          activeOpacity={0.85}
          onPress={handleStartWorkout}
        >
          <Ionicons name="play-circle" size={22} color="white" />
          <Text style={styles.ctaText}>{t("routineDetail.startWorkout")}</Text>
        </TouchableOpacity>
      </View>

      {/* ── MODAL QR ── */}
      <Modal visible={showQR} transparent animationType="fade">
        <View style={styles.qrOverlay}>
          <View style={styles.qrCard}>
            <Text style={styles.qrTitle}>{name}</Text>
            <Text style={styles.qrSubtitle}>{category} · {level} · {durationNum} min</Text>

            <View style={styles.qrBox}>
              <QRCode
                value={buildQrData()}
                size={220}
                backgroundColor="#FFFFFF"
                color="#000000"
              />
            </View>

            <Text style={styles.qrHint}>{t("routineDetail.qrHint")}</Text>

            <TouchableOpacity style={styles.qrShareButton} onPress={handleShareText}>
              <Ionicons name="share" size={18} color="white" />
              <Text style={styles.qrShareText}>{t("routineDetail.shareAsText")}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.qrCloseButton} onPress={() => setShowQR(false)}>
              <Text style={styles.qrCloseText}>{t("routineDetail.close")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ── SMALL COMPONENTS ──

function SectionHeader({ title, style }: { title: string; style?: object }) {
  return (
    <View style={[sectionHeaderStyle.row, style]}>
      <View style={sectionHeaderStyle.accent} />
      <Text style={sectionHeaderStyle.title}>{title}</Text>
    </View>
  );
}

const sectionHeaderStyle = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  accent: {
    width: 4,
    height: 20,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  title: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "700",
  },
});

function MetaChip({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  return (
    <View style={metaChipStyle.chip}>
      <Ionicons name={icon} size={11} color={colors.primary} />
      <Text style={metaChipStyle.text}>{label}</Text>
    </View>
  );
}

const metaChipStyle = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(59,130,246,0.12)",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "rgba(59,130,246,0.25)",
  },
  text: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "600",
  },
});

// ── STYLES ──

const styles = StyleSheet.create({

  root: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // HERO
  heroWrapper: {
    height: HERO_HEIGHT,
    position: "relative",
  },

  heroImage: {
    width: SCREEN_WIDTH,
    height: HERO_HEIGHT,
  },

  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  backButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 58 : 38,
    left: 20,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },

  heroArc: {
    position: "absolute",
    bottom: -1,
    left: 0,
    right: 0,
    height: 28,
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },

  headerCard: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: 20,
    paddingBottom: 4,
    marginTop: -28,
    backgroundColor: colors.background,
  },

  chipsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
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

  chipText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },

  heroTitle: {
    color: "white",
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.3,
  },

  // BODY
  body: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: 16,
  },

  // STAT CARDS
  statRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 28,
  },

  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: spacing.borderRadius,
    padding: 16,
    alignItems: "center",
    gap: 6,
  },

  statIconBg: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 2,
  },

  statValue: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },

  statLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    textAlign: "center",
  },

  // OBJETIVO
  objectiveBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: colors.card,
    borderRadius: spacing.borderRadius,
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },

  objectiveText: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    lineHeight: 22,
  },

  // EXERCISE LIST
  exerciseList: {
    gap: 0,
  },

  exerciseRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 12,
    position: "relative",
  },

  timelineLine: {
    position: "absolute",
    left: 17,
    top: 36,
    bottom: -12,
    width: 2,
    backgroundColor: "#2C2C2E",
    zIndex: 0,
  },

  indexBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
    zIndex: 1,
  },

  indexBadgeText: {
    color: "white",
    fontWeight: "700",
    fontSize: 14,
  },

  exerciseCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: spacing.borderRadius,
    padding: 14,
  },

  exerciseCardInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  exerciseName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
  },

  exerciseMuscle: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: 8,
  },

  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },

  // DESCANSO
  restRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingLeft: 48,
    marginTop: -4,
    marginBottom: 12,
  },

  restText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "500",
  },

  // EMPTY
  emptyBox: {
    alignItems: "center",
    paddingVertical: 48,
    gap: 12,
  },

  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
  },

  // CTA
  ctaWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
    paddingTop: 12,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.card,
  },

  ctaButton: {
    backgroundColor: colors.primary,
    borderRadius: spacing.borderRadius,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  ctaText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },

  // SHARE BUTTON (hero)
  shareButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 58 : 38,
    right: 20,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },

  // QR MODAL
  qrOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  qrCard: {
    backgroundColor: "#1C1C1E",
    borderRadius: 24,
    padding: 28,
    width: "100%",
    alignItems: "center",
    gap: 12,
  },

  qrTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },

  qrSubtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: "center",
  },

  qrBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
  },

  qrHint: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: "center",
  },

  qrShareButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: spacing.borderRadius,
    paddingVertical: 13,
    paddingHorizontal: 24,
    marginTop: 4,
    width: "100%",
    justifyContent: "center",
  },

  qrShareText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },

  qrCloseButton: {
    paddingVertical: 10,
  },

  qrCloseText: {
    color: colors.textSecondary,
    fontSize: 14,
  },

});
