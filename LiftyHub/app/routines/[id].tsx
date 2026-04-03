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
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing } from "@/src/styles/globalstyles";
import { getRoutineExercises, getUserRoutineExercises } from "@/src/services/api";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const HERO_HEIGHT = 300;

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
  Principiante: "leaf-outline",
  Intermedio:   "flame-outline",
  Avanzado:     "skull-outline",
};

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Fuerza:    "barbell-outline",
  Movilidad: "body-outline",
  Cardio:    "heart-outline",
  HIIT:      "flash-outline",
  "Full Body": "fitness-outline",
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

  const [exercises, setExercises] = useState<ExerciseEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token || !id) return;
        const isUser = isUserRoutine === "true";
        const res = isUser
          ? await getUserRoutineExercises(Number(id), token)
          : await getRoutineExercises(Number(id), token);
        if (res?.data) setExercises(res.data);
      } catch (e) {
        console.log("Error cargando ejercicios de rutina:", e);
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

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} bounces contentContainerStyle={{ paddingBottom: 110 }}>

        {/* ── HERO ── */}
        <View style={styles.heroWrapper}>
          <Image source={{ uri: image ?? "" }} style={styles.heroImage} resizeMode="cover" />

          {/* gradient overlay */}
          <View style={styles.heroOverlay} />

          {/* back button */}
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color="white" />
          </TouchableOpacity>

          {/* title + chips at bottom of hero */}
          <View style={styles.heroFooter}>
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
        </View>

        <View style={styles.body}>

          {/* ── STAT CARDS ── */}
          <View style={styles.statRow}>
            <View style={styles.statCard}>
              <View style={[styles.statIconBg, { backgroundColor: "rgba(59,130,246,0.15)" }]}>
                <Ionicons name="time-outline" size={20} color={colors.primary} />
              </View>
              <Text style={styles.statValue}>{durationNum}</Text>
              <Text style={styles.statLabel}>minutos</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIconBg, { backgroundColor: `${levelColor}20` }]}>
                <Ionicons name={levelIcon} size={20} color={levelColor} />
              </View>
              <Text style={[styles.statValue, { color: levelColor }]}>{level}</Text>
              <Text style={styles.statLabel}>nivel</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIconBg, { backgroundColor: "rgba(167,139,250,0.15)" }]}>
                <Ionicons name="barbell-outline" size={20} color="#A78BFA" />
              </View>
              <Text style={[styles.statValue, { color: "#A78BFA" }]}>
                {loading ? "—" : exercises.length}
              </Text>
              <Text style={styles.statLabel}>ejercicios</Text>
            </View>
          </View>

          {/* ── OBJETIVO ── */}
          {!!objective && (
            <>
              <SectionHeader title="Objetivo" />
              <View style={styles.objectiveBox}>
                <Ionicons name="flag-outline" size={18} color={colors.primary} />
                <Text style={styles.objectiveText}>{objective}</Text>
              </View>
            </>
          )}

          {/* ── EJERCICIOS ── */}
          <SectionHeader title="Ejercicios" style={{ marginTop: 28 }} />

          {loading ? (
            <ActivityIndicator color={colors.primary} style={{ marginTop: 20, marginBottom: 20 }} />
          ) : exercises.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="barbell-outline" size={44} color={colors.textSecondary} />
              <Text style={styles.emptyText}>No hay ejercicios en esta rutina</Text>
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

                return (
                  <View key={item.id} style={styles.exerciseRow}>
                    {/* timeline line */}
                    {!isLast && <View style={styles.timelineLine} />}

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
                              <MetaChip icon="repeat-outline" label={`${item.sets} series`} />
                              <MetaChip icon="return-down-forward-outline" label={`${item.repetitions} reps`} />
                              <MetaChip icon="timer-outline" label={`${item.seconds_rest}s`} />
                            </View>
                          )}
                        </View>
                        {canNavigate && (
                          <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
                        )}
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          )}

        </View>
      </ScrollView>

      {/* ── CTA STICKY ── */}
      <View style={styles.ctaWrapper}>
        <TouchableOpacity style={styles.ctaButton} activeOpacity={0.85}>
          <Ionicons name="play-circle-outline" size={22} color="white" />
          <Text style={styles.ctaText}>Iniciar Entrenamiento</Text>
        </TouchableOpacity>
      </View>
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

  heroFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.screenPadding,
    paddingVertical: 18,
    backgroundColor: "rgba(0,0,0,0.5)",
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
    paddingTop: 24,
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

});
