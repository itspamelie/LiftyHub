import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing } from "@/src/styles/globalstyles";
import {
  getRoutineExercises,
  getUserRoutineExercises,
  getUserStreak,
  createUserStreak,
  updateUserStreak,
  createUserRoutineSession,
  updateUserRoutineSession,
  createExerciseLog,
} from "@/src/services/api";

type ExerciseEntry = {
  id: number;
  sets?: number;
  repetitions?: number;
  seconds_rest?: number;
  exercise?: { id: number; name: string; muscle: string };
  name?: string;
  muscle?: string;
};

type Phase = "exercise" | "rest" | "done";

const toMySQLDate = (d: Date) => {
  const p = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
};

export default function SessionScreen() {
  const { id, name, isUserRoutine } = useLocalSearchParams<{
    id: string;
    name: string;
    isUserRoutine: string;
  }>();

  const [exercises, setExercises] = useState<ExerciseEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // session
  const [sessionId, setSessionId] = useState<number | null>(null);
  const startedAt = useRef<string>("");

  // navigation
  const [exIndex, setExIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [phase, setPhase] = useState<Phase>("exercise");
  const [restLeft, setRestLeft] = useState(0);

  // timers
  const [elapsedSecs, setElapsedSecs] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsedRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // weight tracking: setWeights[exIndex][setIndex] = weight string
  const [setWeights, setSetWeights] = useState<string[][]>([]);
  const [currentWeight, setCurrentWeight] = useState("0");

  // elapsed clock
  useEffect(() => {
    elapsedRef.current = setInterval(() => setElapsedSecs((s) => s + 1), 1000);
    return () => { if (elapsedRef.current) clearInterval(elapsedRef.current); };
  }, []);

  // rest countdown
  useEffect(() => {
    if (phase !== "rest") {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setRestLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          advanceAfterRest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  // load exercises + create session
  useEffect(() => {
    const load = async () => {
      startedAt.current = toMySQLDate(new Date());
      try {
        const token = await AsyncStorage.getItem("token");
        const userRaw = await AsyncStorage.getItem("user");
        if (!token || !id) return;

        const isUser = isUserRoutine === "true";
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

        // initialize weight matrix: exs.length x sets (filled with "0")
        setSetWeights(exs.map((ex) => Array(ex.sets ?? 3).fill("0")));

        // try to create session (route may not be registered yet)
        if (userRaw) {
          const user = JSON.parse(userRaw);
          try {
            const sessionRes = await createUserRoutineSession(
              {
                user_id: user.id,
                routine_id: isUser ? null : Number(id),
                user_routine_id: isUser ? Number(id) : null,
                started_at: startedAt.current,
              },
              token
            );
            if (sessionRes?.data?.id) setSessionId(sessionRes.data.id);
          } catch {
            // route not available — continue in local mode
          }
        }
      } catch {}
      finally { setLoading(false); }
    };
    load();
  }, [id]);

  // ── helpers ──────────────────────────────────────────────────────────────

  const currentEx  = exercises[exIndex];
  const totalSets  = currentEx?.sets ?? 3;
  const reps       = currentEx?.repetitions ?? 12;
  const restSecs   = currentEx?.seconds_rest ?? 60;
  const exName     = currentEx?.exercise?.name ?? currentEx?.name ?? "Ejercicio";
  const exMuscle   = currentEx?.exercise?.muscle ?? currentEx?.muscle ?? "";

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const today = () => new Date().toISOString().split("T")[0];

  const saveWeightForSet = () => {
    setSetWeights((prev) => {
      const next = prev.map((row) => [...row]);
      if (next[exIndex]) next[exIndex][currentSet - 1] = currentWeight;
      return next;
    });
  };

  const getNextWeight = (nextExIdx: number, nextSet: number) => {
    return setWeights[nextExIdx]?.[nextSet - 1] ?? "0";
  };

  const advanceAfterRest = () => {
    const nextSet = currentSet + 1;
    if (nextSet > totalSets) {
      const nextEx = exIndex + 1;
      if (nextEx >= exercises.length) {
        if (elapsedRef.current) clearInterval(elapsedRef.current);
        setPhase("done");
      } else {
        setExIndex(nextEx);
        setCurrentSet(1);
        setCurrentWeight(getNextWeight(nextEx, 1));
        setPhase("exercise");
      }
    } else {
      setCurrentSet(nextSet);
      setCurrentWeight(getNextWeight(exIndex, nextSet));
      setPhase("exercise");
    }
  };

  const handleCompleteSet = () => {
    saveWeightForSet();

    const isLastSet = currentSet >= totalSets;
    const isLastEx  = exIndex >= exercises.length - 1;

    if (isLastSet && isLastEx) {
      if (elapsedRef.current) clearInterval(elapsedRef.current);
      setPhase("done");
      return;
    }

    if (restSecs > 0) {
      setRestLeft(restSecs);
      setPhase("rest");
    } else {
      advanceAfterRest();
    }
  };

  const handleSkipRest = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    advanceAfterRest();
  };

  // ── finish: save logs + streak ───────────────────────────────────────────

  const handleFinish = async () => {
    setSaving(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const userRaw = await AsyncStorage.getItem("user");
      if (!token || !userRaw) { router.back(); return; }
      const user = JSON.parse(userRaw);
      const finishedAt = toMySQLDate(new Date());

      // 1) close session
      if (sessionId) {
        await updateUserRoutineSession(sessionId, { finished_at: finishedAt }, token).catch(() => {});
      }

      // 2) save exercise logs
      if (sessionId) {
        const workoutDate = today();
        for (let i = 0; i < exercises.length; i++) {
          const ex = exercises[i];
          const weights = setWeights[i] ?? [];
          const avgWeight = weights.reduce((sum, w) => sum + (parseFloat(w) || 0), 0) / (weights.length || 1);
          const exId = ex.exercise?.id;
          if (!exId) continue;
          try {
            await createExerciseLog(
              {
                user_id: user.id,
                exercise_id: exId,
                weight_lifted: parseFloat(avgWeight.toFixed(2)),
                repetitions: ex.repetitions ?? 12,
                sets: ex.sets ?? 3,
                exercise_routine_id: ex.id,
                user_routine_session_id: sessionId,
                workout_date: workoutDate,
              },
              token
            );
          } catch {}
        }
      }

      // 2) update streak
      const streakRes = await getUserStreak(user.id, token).catch(() => null);
      const streak = streakRes?.data;
      const todayStr = today();

      if (streak && streak.last_training_date !== todayStr) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];

        let newCurrent = streak.last_training_date === yesterdayStr
          ? (streak.current_streak ?? 0) + 1
          : 1;
        let newLongest = Math.max(newCurrent, streak.longest_streak ?? 0);

        await updateUserStreak(
          streak.id,
          { user_id: user.id, current_streak: newCurrent, longest_streak: newLongest, last_training_date: todayStr },
          token
        ).catch(() => {});
      } else if (!streak) {
        // first time
        await createUserStreak(
          { user_id: user.id, current_streak: 1, longest_streak: 1, last_training_date: todayStr },
          token
        ).catch(() => {});
      }

    } catch {}
    finally {
      setSaving(false);
      router.back();
    }
  };

  // ── renders ──────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (exercises.length === 0) {
    return (
      <View style={styles.centered}>
        <Ionicons name="barbell-outline" size={44} color={colors.textSecondary} />
        <Text style={styles.emptyText}>Esta rutina no tiene ejercicios.</Text>
        <TouchableOpacity style={styles.solidBtn} onPress={() => router.back()}>
          <Text style={styles.solidBtnText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  /* ── DONE ── */
  if (phase === "done") {
    const totalExercises = exercises.length;
    const totalSetsAll = exercises.reduce((s, ex) => s + (ex.sets ?? 3), 0);

    return (
      <View style={styles.doneRoot}>
        <View style={styles.doneCard}>
          <View style={styles.doneIconBg}>
            <Ionicons name="trophy" size={44} color="#F59E0B" />
          </View>
          <Text style={styles.doneTitle}>¡Entrenamiento completado!</Text>
          <Text style={styles.doneSub}>{name}</Text>

          <View style={styles.doneStat}>
            <Ionicons name="time-outline" size={20} color={colors.primary} />
            <Text style={styles.doneStatText}>Duración: {formatTime(elapsedSecs)}</Text>
          </View>
          <View style={styles.doneStat}>
            <Ionicons name="barbell-outline" size={20} color={colors.primary} />
            <Text style={styles.doneStatText}>{totalExercises} ejercicios · {totalSetsAll} series</Text>
          </View>
          <View style={styles.doneStat}>
            <Ionicons name="flame-outline" size={20} color="#F59E0B" />
            <Text style={styles.doneStatText}>¡Racha diaria completada!</Text>
          </View>

          {/* weight summary */}
          <ScrollView style={{ width: "100%", maxHeight: 180 }} showsVerticalScrollIndicator={false}>
            {exercises.map((ex, i) => {
              const n = ex.exercise?.name ?? ex.name ?? "Ejercicio";
              const weights = setWeights[i] ?? [];
              const maxW = Math.max(...weights.map((w) => parseFloat(w) || 0));
              return (
                <View key={ex.id} style={styles.doneExRow}>
                  <Text style={styles.doneExName}>{n}</Text>
                  <Text style={styles.doneExWeight}>{maxW > 0 ? `${maxW} kg` : "—"}</Text>
                </View>
              );
            })}
          </ScrollView>

          <TouchableOpacity
            style={[styles.solidBtn, { width: "100%", marginTop: 8 }, saving && { opacity: 0.6 }]}
            onPress={handleFinish}
            disabled={saving}
          >
            {saving
              ? <ActivityIndicator color="white" />
              : <Text style={styles.solidBtnText}>Guardar y finalizar</Text>
            }
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  /* ── REST ── */
  if (phase === "rest") {
    const progress = restSecs > 0 ? restLeft / restSecs : 0;
    const isLastSetOfEx = currentSet >= totalSets;
    const nextName = isLastSetOfEx
      ? (exercises[exIndex + 1]?.exercise?.name ?? exercises[exIndex + 1]?.name ?? "")
      : null;

    return (
      <View style={styles.restRoot}>
        <Text style={styles.restLabel}>Descanso</Text>
        <Text style={styles.restTimer}>{formatTime(restLeft)}</Text>

        <View style={styles.restProgressBar}>
          <View style={[styles.restProgressFill, { width: `${progress * 100}%` }]} />
        </View>

        <Text style={styles.restNext}>
          {nextName
            ? `Siguiente: ${nextName}`
            : `Siguiente: serie ${currentSet + 1} de ${totalSets}`}
        </Text>

        <TouchableOpacity style={styles.skipBtn} onPress={handleSkipRest}>
          <Text style={styles.skipBtnText}>Saltar descanso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  /* ── EXERCISE ── */
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.root}>

        {/* header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
            <Ionicons name="close" size={20} color="white" />
          </TouchableOpacity>
          <Text style={styles.elapsed}>{formatTime(elapsedSecs)}</Text>
          <Text style={styles.progress}>{exIndex + 1} / {exercises.length}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          {/* exercise name */}
          <View style={styles.exCard}>
            <Text style={styles.exName}>{exName}</Text>
            {!!exMuscle && <Text style={styles.exMuscle}>{exMuscle}</Text>}
          </View>

          {/* set dots */}
          <Text style={styles.setLabel}>Serie {currentSet} de {totalSets}</Text>
          <View style={styles.setDots}>
            {Array.from({ length: totalSets }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.setDot,
                  i < currentSet - 1 && styles.setDotDone,
                  i === currentSet - 1 && styles.setDotActive,
                ]}
              >
                {i < currentSet - 1 && (
                  <Ionicons name="checkmark" size={14} color="white" />
                )}
              </View>
            ))}
          </View>

          {/* reps */}
          <View style={styles.repsCard}>
            <Text style={styles.repsNum}>{reps}</Text>
            <Text style={styles.repsLabel}>repeticiones</Text>
          </View>

          {/* weight input */}
          <View style={styles.weightCard}>
            <Ionicons name="barbell-outline" size={18} color={colors.textSecondary} />
            <Text style={styles.weightLabel}>Peso (kg)</Text>
            <TextInput
              style={styles.weightInput}
              value={currentWeight}
              onChangeText={setCurrentWeight}
              keyboardType="decimal-pad"
              selectTextOnFocus
              placeholder="0"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          {/* rest info */}
          {restSecs > 0 && (
            <View style={styles.restInfo}>
              <Ionicons name="timer-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.restInfoText}>{restSecs}s de descanso al completar</Text>
            </View>
          )}

          {/* mini exercise list */}
          <View style={styles.miniList}>
            {exercises.map((ex, i) => {
              const n = ex.exercise?.name ?? ex.name ?? "Ejercicio";
              const done = i < exIndex;
              const active = i === exIndex;
              return (
                <View key={ex.id} style={[styles.miniRow, active && styles.miniRowActive]}>
                  <View style={[styles.miniDot, done && styles.miniDotDone, active && styles.miniDotActive]}>
                    {done && <Ionicons name="checkmark" size={10} color="white" />}
                    {active && !done && <View style={styles.miniDotInner} />}
                  </View>
                  <Text style={[styles.miniName, done && styles.miniNameDone, active && styles.miniNameActive]}>
                    {n}
                  </Text>
                  {done && setWeights[i] && (
                    <Text style={styles.miniWeight}>
                      {Math.max(...(setWeights[i]?.map((w) => parseFloat(w) || 0) ?? [0]))} kg
                    </Text>
                  )}
                </View>
              );
            })}
          </View>

        </ScrollView>

        {/* CTA */}
        <View style={styles.ctaWrapper}>
          <TouchableOpacity style={styles.ctaBtn} onPress={handleCompleteSet}>
            <Ionicons name="checkmark-circle" size={22} color="white" />
            <Text style={styles.ctaBtnText}>
              {currentSet >= totalSets && exIndex >= exercises.length - 1
                ? "Finalizar entrenamiento"
                : "Completar serie"}
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({

  root: { flex: 1, backgroundColor: colors.background },

  centered: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    gap: 14,
    padding: 24,
  },

  emptyText: { color: colors.textSecondary, fontSize: 15, textAlign: "center" },

  solidBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: spacing.borderRadius,
    alignItems: "center",
  },

  solidBtnText: { color: "white", fontWeight: "700", fontSize: 15 },

  /* header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 16,
    paddingHorizontal: spacing.screenPadding,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },

  closeBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "#2C2C2E",
    justifyContent: "center", alignItems: "center",
  },

  elapsed: { color: colors.text, fontSize: 18, fontWeight: "700", fontVariant: ["tabular-nums"] },
  progress: { color: colors.textSecondary, fontSize: 14, fontWeight: "600" },

  /* content */
  content: { padding: spacing.screenPadding, paddingBottom: 120, gap: 20 },

  exCard: {
    backgroundColor: "#1C1C1E",
    borderRadius: 18,
    padding: 24,
    alignItems: "center",
    gap: 6,
  },

  exName: { color: colors.text, fontSize: 26, fontWeight: "800", textAlign: "center" },
  exMuscle: { color: colors.textSecondary, fontSize: 14 },

  setLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  setDots: { flexDirection: "row", justifyContent: "center", gap: 10 },

  setDot: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: "#2C2C2E",
    borderWidth: 2, borderColor: "#3A3A3E",
    justifyContent: "center", alignItems: "center",
  },
  setDotDone: { backgroundColor: "#16a34a", borderColor: "#16a34a" },
  setDotActive: { borderColor: colors.primary, borderWidth: 3 },

  repsCard: {
    backgroundColor: `${colors.primary}18`,
    borderRadius: 18,
    paddingVertical: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: `${colors.primary}30`,
    gap: 4,
  },

  repsNum: { color: colors.primary, fontSize: 56, fontWeight: "800", lineHeight: 60 },
  repsLabel: { color: colors.textSecondary, fontSize: 14 },

  /* weight */
  weightCard: {
    backgroundColor: "#1C1C1E",
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  weightLabel: { color: colors.textSecondary, fontSize: 14, flex: 1 },

  weightInput: {
    backgroundColor: "#2C2C2E",
    color: colors.text,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 20,
    fontWeight: "700",
    width: 90,
    textAlign: "center",
  },

  restInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  restInfoText: { color: colors.textSecondary, fontSize: 13 },

  /* mini list */
  miniList: { backgroundColor: "#1C1C1E", borderRadius: 14, padding: 16, gap: 10 },

  miniRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    opacity: 0.45,
  },

  miniRowActive: { opacity: 1 },

  miniDot: {
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: "#2C2C2E",
    borderWidth: 1, borderColor: "#3A3A3E",
    justifyContent: "center", alignItems: "center",
  },
  miniDotDone: { backgroundColor: "#16a34a", borderColor: "#16a34a" },
  miniDotActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  miniDotInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: "white" },

  miniName: { color: colors.textSecondary, fontSize: 14, flex: 1 },
  miniNameDone: { color: "#16a34a" },
  miniNameActive: { color: colors.text, fontWeight: "600" },

  miniWeight: { color: colors.textSecondary, fontSize: 12, fontWeight: "600" },

  /* CTA */
  ctaWrapper: {
    position: "absolute",
    bottom: 0, left: 0, right: 0,
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
    paddingTop: 12,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: "#2A2A2A",
  },

  ctaBtn: {
    backgroundColor: colors.primary,
    borderRadius: spacing.borderRadius,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  ctaBtnText: { color: "white", fontSize: 16, fontWeight: "700" },

  /* REST screen */
  restRoot: {
    flex: 1,
    backgroundColor: "#06060F",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    padding: 32,
  },

  restLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },

  restTimer: {
    color: "white",
    fontSize: 80,
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
    lineHeight: 88,
  },

  restProgressBar: {
    width: "100%", height: 6,
    backgroundColor: "#2C2C2E",
    borderRadius: 3, overflow: "hidden",
  },

  restProgressFill: { height: 6, backgroundColor: colors.primary, borderRadius: 3 },

  restNext: { color: colors.textSecondary, fontSize: 14, textAlign: "center" },

  skipBtn: {
    marginTop: 12,
    paddingVertical: 12, paddingHorizontal: 28,
    borderRadius: spacing.borderRadius,
    backgroundColor: "#2C2C2E",
  },

  skipBtnText: { color: colors.textSecondary, fontSize: 15, fontWeight: "600" },

  /* DONE screen */
  doneRoot: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    padding: 24,
  },

  doneCard: {
    backgroundColor: "#1C1C1E",
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    gap: 12,
  },

  doneIconBg: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: "rgba(245,158,11,0.15)",
    justifyContent: "center", alignItems: "center",
    marginBottom: 4,
  },

  doneTitle: { color: "white", fontSize: 22, fontWeight: "800", textAlign: "center" },
  doneSub: { color: colors.textSecondary, fontSize: 14, textAlign: "center", marginBottom: 4 },

  doneStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    alignSelf: "stretch",
    backgroundColor: "#2C2C2E",
    borderRadius: 12,
    padding: 14,
  },

  doneStatText: { color: colors.text, fontSize: 14, fontWeight: "600" },

  doneExRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },

  doneExName: { color: colors.textSecondary, fontSize: 13, flex: 1 },
  doneExWeight: { color: colors.text, fontSize: 13, fontWeight: "700" },

});
