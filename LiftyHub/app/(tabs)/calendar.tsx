import { View, Text, StyleSheet, ScrollView, Modal, FlatList, ActivityIndicator, Alert,  } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import * as Storage from "@/src/utils/storage";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { colors, spacing } from "@/src/styles/globalstyles";
import { useLanguage } from "@/src/context/LanguageContext";
import { getUserRoutines, getRoutines, getUserRoutineSessions, getUserWeekPlan, updateUserWeekPlan } from "@/src/services/api";
import { WeekPlan, DayPlan } from "@/src/utils/calendarPlan";
import OfflineBanner from "@/src/components/OfflineBanner";
import { useNetworkStatus } from "@/src/hooks/useNetworkStatus";
import HapticButton from "@/src/components/buttons/HapticButton";

type Routine = { id: number; name: string; isUserRoutine: boolean };

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function buildMonthGrid(year: number, month: number): (Date | null)[][] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
  const days: (Date | null)[] = [];
  for (let i = 0; i < startOffset; i++) days.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(year, month, d));
  while (days.length % 7 !== 0) days.push(null);
  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
  return weeks;
}

function dayOfWeekIndex(date: Date): number {
  const dow = date.getDay();
  return dow === 0 ? 6 : dow - 1;
}

const MONTH_NAMES_ES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const MONTH_NAMES_EN = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_KEYS_SHORT = ["L","M","X","J","V","S","D"];
const DAY_FULL_ES = ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábados","Domingos"];
const DAY_FULL_EN = ["Mondays","Tuesdays","Wednesdays","Thursdays","Fridays","Saturdays","Sundays"];

export default function CalendarScreen() {
  const { t, language } = useLanguage();
  const isConnected = useNetworkStatus();

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const [weekPlan, setWeekPlanState] = useState<WeekPlan>({});
  const [completedDates, setCompletedDates] = useState<Date[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDayIdx, setSelectedDayIdx] = useState<number | null>(null);

  const [startModalVisible, setStartModalVisible] = useState(false);
  const [startModalRoutine, setStartModalRoutine] = useState<{ id: string; name: string; isUserRoutine: boolean } | null>(null);
  const [startModalDate, setStartModalDate] = useState<Date | null>(null);

  const monthNames = language === "es" ? MONTH_NAMES_ES : MONTH_NAMES_EN;
  const dayFullNames = language === "es" ? DAY_FULL_ES : DAY_FULL_EN;
  const grid = buildMonthGrid(viewYear, viewMonth);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const tok = await Storage.getItem("token");
      const userRaw = await Storage.getItem("user");
      if (!tok || !userRaw) return;
      const user = JSON.parse(userRaw);

      const [weekPlanResult, userRoutinesResult, appRoutinesResult, sessionsResult] = await Promise.allSettled([
        getUserWeekPlan(tok),
        getUserRoutines(user.id, tok),
        getRoutines(tok),
        getUserRoutineSessions(tok),
      ]);

      const weekPlanRes     = weekPlanResult.status     === "fulfilled" ? weekPlanResult.value     : null;
      const userRoutinesRes = userRoutinesResult.status === "fulfilled" ? userRoutinesResult.value : null;
      const appRoutinesRes  = appRoutinesResult.status  === "fulfilled" ? appRoutinesResult.value  : null;
      const sessionsRes     = sessionsResult.status     === "fulfilled" ? sessionsResult.value     : null;

      // Convertir array del API a WeekPlan map
      const plan: WeekPlan = {};
      for (const row of (weekPlanRes?.data ?? [])) {
        if (row.type === "rest") {
          plan[row.day_index] = { type: "rest" };
        } else if (row.type === "routine") {
          plan[row.day_index] = {
            type: "routine",
            routineId: String(row.user_routine_id ?? row.routine_id),
            routineName: row.routine_name ?? "",
            isUserRoutine: !!row.user_routine_id,
          };
        }
      }
      setWeekPlanState(plan);

      const userR: Routine[] = (userRoutinesRes?.data ?? []).map((r: any) => ({
        id: r.id, name: r.name, isUserRoutine: true,
      }));
      const appR: Routine[] = (appRoutinesRes?.data ?? []).map((r: any) => ({
        id: r.id, name: r.name, isUserRoutine: false,
      }));
      setRoutines([...userR, ...appR]);

      const completedDatesFromApi = (sessionsRes?.data ?? [])
        .filter((s: any) => Number(s.user_id) === Number(user.id) && s.finished_at && s.started_at)
        .map((s: any) => {
          const datePart = (s.started_at as string).split(" ")[0].split("T")[0];
          const [y, m, d] = datePart.split("-").map(Number);
          return new Date(y, m - 1, d);
        });
      setCompletedDates(completedDatesFromApi);
    } catch {
      // sin conexión: dejar estado vacío
      setWeekPlanState({});
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  // Open modal from the weekly schedule strip or from a calendar day tap
  const handleOpenModal = (dayIdx: number) => {
    setSelectedDayIdx(dayIdx);
    setModalVisible(true);
  };

  const syncDay = async (dayIndex: number, dayPlan: DayPlan) => {
    const tok = await Storage.getItem("token");
    if (!tok) return;
    if (dayPlan === null) {
      await updateUserWeekPlan([{ day_index: dayIndex, type: null }], tok);
    } else if (dayPlan.type === "rest") {
      await updateUserWeekPlan([{ day_index: dayIndex, type: "rest" }], tok);
    } else {
      await updateUserWeekPlan([{
        day_index: dayIndex,
        type: "routine",
        routine_id: !dayPlan.isUserRoutine ? Number(dayPlan.routineId) : null,
        user_routine_id: dayPlan.isUserRoutine ? Number(dayPlan.routineId) : null,
        routine_name: dayPlan.routineName,
      }], tok);
    }
  };

  const handleMarkRest = async () => {
    if (selectedDayIdx === null) return;
    const plan: DayPlan = { type: "rest" };
    setWeekPlanState(prev => ({ ...prev, [selectedDayIdx]: plan }));
    setModalVisible(false);
    await syncDay(selectedDayIdx, plan);
  };

  const handleAssign = async (routine: Routine) => {
    if (selectedDayIdx === null) return;
    const plan: DayPlan = {
      type: "routine",
      routineId: String(routine.id),
      routineName: routine.name,
      isUserRoutine: routine.isUserRoutine,
    };
    setWeekPlanState(prev => ({ ...prev, [selectedDayIdx]: plan }));
    setModalVisible(false);
    await syncDay(selectedDayIdx, plan);
  };

  const handleRemove = async () => {
    if (selectedDayIdx === null) return;
    setWeekPlanState(prev => ({ ...prev, [selectedDayIdx]: null }));
    setModalVisible(false);
    await syncDay(selectedDayIdx, null);
  };

  const handleResetPlan = () => {
    Alert.alert(
      t("calendar.resetScheduleTitle"),
      t("calendar.resetScheduleMessage"),
      [
        { text: t("calendar.cancel"), style: "cancel" },
        {
          text: t("calendar.resetScheduleConfirm"),
          style: "destructive",
          onPress: async () => {
            const tok = await Storage.getItem("token");
            if (!tok) return;
            const allDays = [0,1,2,3,4,5,6].map(i => ({ day_index: i, type: null as null }));
            await updateUserWeekPlan(allDays, tok);
            setWeekPlanState({});
          },
        },
      ]
    );
  };

  // --- Progress: only count "routine" days (not rest, not null) ---
  const allDaysInMonth = grid.flat().filter((d): d is Date => d !== null && d.getMonth() === viewMonth);
  const plannedDaysInMonth = allDaysInMonth.filter(d => weekPlan[dayOfWeekIndex(d)]?.type === "routine");
  const completedInMonth = plannedDaysInMonth.filter(d =>
    completedDates.some(cd => isSameDay(cd, d))
  );
  const progressPct = plannedDaysInMonth.length > 0
    ? Math.min(Math.round((completedInMonth.length / plannedDaysInMonth.length) * 100), 100)
    : 0;

  const trainingDaysCount = Object.values(weekPlan).filter(p => p?.type === "routine").length;
  const selectedPlan = selectedDayIdx !== null ? weekPlan[selectedDayIdx] : null;
  const selectedIsRest = selectedPlan?.type === "rest";
  const selectedIsRoutine = selectedPlan?.type === "routine";

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {!isConnected && <OfflineBanner />}

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.pageHeader}>
          <Text style={styles.screenTitle}>{t("calendar.title")}</Text>
          <Text style={styles.screenSubtitle}>{t("calendar.subtitle")}</Text>
        </View>

        {/* ── Weekly schedule strip ── */}
        <View style={styles.scheduleCard}>
          <View style={styles.scheduleHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.scheduleTitle}>{t("calendar.mySchedule")}</Text>
              <Text style={styles.scheduleSubtitle}>
                {trainingDaysCount > 0
                  ? t("calendar.trainingDays", { n: trainingDaysCount })
                  : t("calendar.subtitle")}
              </Text>
            </View>
            {Object.keys(weekPlan).length > 0 && (
              <HapticButton
                onPress={handleResetPlan}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                style={styles.resetBtn}
              >
                <Ionicons name="trash-outline" size={18} color="#EF4444" />
              </HapticButton>
            )}
          </View>

          <View style={styles.scheduleStrip}>
            {DAY_KEYS_SHORT.map((label, i) => {
              const plan = weekPlan[i];
              const isRoutine = plan?.type === "routine";
              const isRest = plan?.type === "rest";
              return (
                <HapticButton
                  key={i}
                  style={styles.scheduleDayCol}
                  onPress={() => handleOpenModal(i)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.scheduleDayLabel,
                    isRoutine && styles.scheduleDayLabelActive,
                    isRest && styles.scheduleDayLabelRest,
                  ]}>
                    {label}
                  </Text>
                  <View style={[
                    styles.scheduleDot,
                    isRoutine && styles.scheduleDotActive,
                    isRest && styles.scheduleDotRestActive,
                    !plan && styles.scheduleDotEmpty,
                  ]}>
                    {isRoutine && <Ionicons name="barbell" size={14} color="white" />}
                    {isRest && <Ionicons name="moon" size={13} color="white" />}
                    {!plan && <Ionicons name="add" size={16} color={colors.textSecondary} />}
                  </View>
                  {plan?.type === "routine" && (
                    <Text style={styles.scheduleRoutineName} numberOfLines={1}>
                      {plan.routineName}
                    </Text>
                  )}
                  {isRest && (
                    <Text style={styles.scheduleRestLabel}>{t("calendar.restDay")}</Text>
                  )}
                </HapticButton>
              );
            })}
          </View>
        </View>

        {/* ── Month progress pill ── */}
        <View style={styles.progressPill}>
          <View style={[styles.progressCircle, progressPct === 100 && styles.progressCircleDone]}>
            <Text style={styles.progressPct}>{plannedDaysInMonth.length > 0 ? `${progressPct}%` : "—"}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.progressLabel}>{t("calendar.weekProgress")} — {monthNames[viewMonth]}</Text>
            <Text style={styles.progressSub}>
              {t("calendar.monthProgress", {
                done: completedInMonth.length,
                total: plannedDaysInMonth.length,
              })}
            </Text>
          </View>
        </View>

        {/* ── Monthly calendar ── */}
        <View style={styles.calCard}>
          <View style={styles.monthRow}>
            <HapticButton onPress={prevMonth} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="chevron-back" size={22} color={colors.text} />
            </HapticButton>
            <Text style={styles.monthLabel}>{monthNames[viewMonth]} {viewYear}</Text>
            <HapticButton onPress={nextMonth} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="chevron-forward" size={22} color={colors.text} />
            </HapticButton>
          </View>

          <View style={styles.dayHeaderRow}>
            {DAY_KEYS_SHORT.map(d => (
              <Text key={d} style={styles.dayHeaderText}>{d}</Text>
            ))}
          </View>

          {grid.map((week, wi) => (
            <View key={wi} style={styles.weekRow}>
              {week.map((date, di) => {
                if (!date) return <View key={di} style={styles.daySlot} />;
                const idx = dayOfWeekIndex(date);
                const plan = weekPlan[idx];
                const isToday = isSameDay(date, today);
                const isRoutine = plan?.type === "routine";
                const isRest = plan?.type === "rest";
                const isCompleted = isRoutine && completedDates.some(cd => isSameDay(cd, date));
                const isCurrentMonth = date.getMonth() === viewMonth;

                return (
                  <HapticButton
                    key={di}
                    style={styles.daySlot}
                    onPress={() => {
                      if (plan?.type === "routine") {
                        setStartModalRoutine({
                          id: String(plan.routineId),
                          name: plan.routineName,
                          isUserRoutine: plan.isUserRoutine,
                        });
                        setStartModalDate(date);
                        setStartModalVisible(true);
                      } else {
                        handleOpenModal(idx);
                      }
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={[
                      styles.dayCircle,
                      isToday && styles.dayCircleToday,
                      isRest && styles.dayCircleRest,
                      isRoutine && !isCompleted && styles.dayCirclePlanned,
                      isCompleted && styles.dayCircleDone,
                    ]}>
                      {isCompleted ? (
                        <Ionicons name="checkmark" size={14} color="white" />
                      ) : isRest ? (
                        <Ionicons name="moon" size={13} color="#A78BFA" />
                      ) : (
                        <Text style={[
                          styles.dayNumber,
                          !isCurrentMonth && styles.dayNumberFaded,
                          isToday && styles.dayNumberToday,
                          isRoutine && styles.dayNumberPlanned,
                        ]}>
                          {date.getDate()}
                        </Text>
                      )}
                    </View>
                    {isRoutine && !isCompleted && <View style={styles.planDot} />}
                  </HapticButton>
                );
              })}
            </View>
          ))}

          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.primary + "55" }]} />
              <Text style={styles.legendText}>{t("calendar.assignRoutine")}</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: "#22C55E" }]} />
              <Text style={styles.legendText}>{t("calendar.completed")}</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: "#7C3AED55" }]} />
              <Text style={styles.legendText}>{t("calendar.restDay")}</Text>
            </View>
          </View>
        </View>

      </ScrollView>

      {/* ── Start Workout Modal ── */}
      <Modal visible={startModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.startModalIcon}>
              <Ionicons name="barbell" size={28} color={colors.primary} />
            </View>
            <Text style={styles.startModalTitle}>{t("calendar.startWorkoutTitle")}</Text>
            {startModalRoutine && (
              <Text style={styles.startModalRoutineName}>{startModalRoutine.name}</Text>
            )}
            {startModalDate && (
              <Text style={styles.startModalDate}>
                {startModalDate.toLocaleDateString(language === "es" ? "es-ES" : "en-US", {
                  weekday: "long", day: "numeric", month: "long",
                })}
              </Text>
            )}
            <HapticButton
              style={styles.startBtn}
              onPress={() => {
                setStartModalVisible(false);
                if (startModalRoutine) {
                  router.push({
                    pathname: "/routines/session",
                    params: {
                      id: startModalRoutine.id,
                      name: startModalRoutine.name,
                      isUserRoutine: startModalRoutine.isUserRoutine ? "true" : "false",
                    },
                  });
                }
              }}
            >
              <Ionicons name="play" size={18} color="white" />
              <Text style={styles.startBtnText}>{t("calendar.startWorkout")}</Text>
            </HapticButton>
            <HapticButton
              style={styles.startModalAssignBtn}
              onPress={() => {
                setStartModalVisible(false);
                if (startModalDate) handleOpenModal(dayOfWeekIndex(startModalDate));
              }}
            >
              <Text style={styles.startModalAssignBtnText}>{t("calendar.changeRoutine")}</Text>
            </HapticButton>
            <HapticButton style={styles.cancelBtn} onPress={() => setStartModalVisible(false)}>
              <Text style={styles.cancelBtnText}>{t("calendar.cancel")}</Text>
            </HapticButton>
          </View>
        </View>
      </Modal>

      {/* ── Assign Routine Modal ── */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>

            {selectedDayIdx !== null && (
              <View style={styles.modalDayBadge}>
                <Text style={styles.modalDayBadgeText}>{dayFullNames[selectedDayIdx]}</Text>
              </View>
            )}

            <Text style={styles.recurringHint}>
              <Ionicons name="repeat" size={13} color={colors.primary} />
              {"  "}{t("calendar.recurringHint", {
                day: selectedDayIdx !== null ? dayFullNames[selectedDayIdx] : "",
              })}
            </Text>

            {/* Estado actual del día */}
            {selectedPlan?.type === "routine" && (
              <View style={styles.currentPlanBox}>
                <Ionicons name="barbell" size={16} color={colors.primary} />
                <Text style={styles.currentPlanName} numberOfLines={1}>
                  {selectedPlan.routineName}
                </Text>
                <HapticButton onPress={handleRemove} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Ionicons name="trash-outline" size={18} color="#EF4444" />
                </HapticButton>
              </View>
            )}
            {selectedIsRest && (
              <View style={styles.currentRestBox}>
                <Ionicons name="moon" size={16} color="#A78BFA" />
                <Text style={styles.currentRestText}>{t("calendar.restDay")}</Text>
                <HapticButton onPress={handleRemove} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Ionicons name="trash-outline" size={18} color="#EF4444" />
                </HapticButton>
              </View>
            )}

            <Text style={styles.modalTitle}>{t("calendar.assignRoutine")}</Text>

            {routines.length === 0 ? (
              <Text style={styles.noRoutines}>{t("calendar.noRoutines")}</Text>
            ) : (
              <FlatList
                data={routines}
                keyExtractor={(r) => `${r.isUserRoutine}-${r.id}`}
                style={styles.routineList}
                renderItem={({ item }) => (
                  <HapticButton style={styles.routineItem} onPress={() => handleAssign(item)}>
                    <View style={styles.routineItemLeft}>
                      <Ionicons name="barbell-outline" size={18} color={colors.primary} />
                      <Text style={styles.routineItemName}>{item.name}</Text>
                    </View>
                    {!item.isUserRoutine && (
                      <View style={styles.appBadge}>
                        <Text style={styles.appBadgeText}>App</Text>
                      </View>
                    )}
                  </HapticButton>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                ListFooterComponent={
                  !selectedIsRest ? (
                    <>
                      <View style={styles.separator} />
                      <HapticButton style={styles.routineItem} onPress={handleMarkRest}>
                        <View style={styles.routineItemLeft}>
                          <Ionicons name="moon-outline" size={18} color="#A78BFA" />
                          <Text style={[styles.routineItemName, { color: "#A78BFA" }]}>
                            {t("calendar.markRest")}
                          </Text>
                        </View>
                      </HapticButton>
                    </>
                  ) : null
                }
              />
            )}

            <HapticButton style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelBtnText}>{t("calendar.cancel")}</Text>
            </HapticButton>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const DOT_SIZE = 36;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loadingBox: { flex: 1, justifyContent: "center", alignItems: "center" },
  content: { padding: spacing.screenPadding, paddingBottom: 40, gap: 14 },

  pageHeader: { marginTop: 40, gap: 4 },
  screenTitle: { color: colors.text, fontSize: 28, fontWeight: "bold" },
  screenSubtitle: { color: colors.textSecondary, fontSize: 14 },

  // Weekly schedule strip
  scheduleCard: {
    backgroundColor: colors.card,
    borderRadius: spacing.borderRadius,
    padding: 16,
    gap: 14,
  },

  scheduleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  scheduleTitle: { color: colors.text, fontSize: 15, fontWeight: "700" },
  scheduleSubtitle: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
  resetBtn: { padding: 6, borderRadius: 8, backgroundColor: "#EF444422" },

  scheduleStrip: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  scheduleDayCol: {
    flex: 1,
    alignItems: "center",
    gap: 5,
  },

  scheduleDayLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: "600",
  },

  scheduleDayLabelActive: { color: colors.primary },

  scheduleDot: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
  },

  scheduleDotActive: { backgroundColor: colors.primary },
  scheduleDotRestActive: { backgroundColor: "#7C3AED" },
  scheduleDotEmpty: { backgroundColor: "#2C2C2E" },

  scheduleDayLabelRest: { color: "#A78BFA" },

  scheduleRoutineName: {
    color: colors.primary,
    fontSize: 9,
    fontWeight: "600",
    textAlign: "center",
    maxWidth: 40,
  },

  scheduleRestLabel: {
    color: "#A78BFA",
    fontSize: 9,
    fontWeight: "600",
    textAlign: "center",
  },

  // Progress pill
  progressPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: colors.card,
    borderRadius: spacing.borderRadius,
    padding: 14,
  },

  progressCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 3,
    borderColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  progressCircleDone: { borderColor: "#22C55E" },

  progressPct: { color: colors.text, fontSize: 13, fontWeight: "800" },
  progressLabel: { color: colors.text, fontSize: 14, fontWeight: "700" },
  progressSub: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },

  // Calendar
  calCard: {
    backgroundColor: colors.card,
    borderRadius: spacing.borderRadius,
    padding: 16,
  },

  monthRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  monthLabel: { color: colors.text, fontSize: 17, fontWeight: "700" },

  dayHeaderRow: { flexDirection: "row", marginBottom: 8 },

  dayHeaderText: {
    flex: 1,
    textAlign: "center",
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "600",
  },

  weekRow: { flexDirection: "row", marginBottom: 4 },

  daySlot: { flex: 1, alignItems: "center", gap: 3, paddingVertical: 2 },

  dayCircle: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: "#2C2C2E",
    justifyContent: "center",
    alignItems: "center",
  },

  dayCircleToday: { borderWidth: 2, borderColor: colors.primary },
  dayCirclePlanned: { backgroundColor: colors.primary + "44" },
  dayCircleDone: { backgroundColor: "#22C55E" },
  dayCircleRest: { backgroundColor: "#7C3AED33" },

  dayNumber: { color: colors.text, fontSize: 13, fontWeight: "500" },
  dayNumberFaded: { color: colors.textSecondary + "44" },
  dayNumberToday: { color: colors.primary, fontWeight: "700" },
  dayNumberPlanned: { color: colors.primary, fontWeight: "700" },

  planDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.primary },

  legend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 18,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#2C2C2E",
  },

  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { color: colors.textSecondary, fontSize: 11 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: "#00000088", justifyContent: "flex-end" },

  modalSheet: {
    backgroundColor: "#1C1C1E",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: "75%",
  },

  modalDayBadge: {
    alignSelf: "flex-start",
    backgroundColor: colors.primary + "22",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 8,
  },

  modalDayBadgeText: { color: colors.primary, fontSize: 13, fontWeight: "700" },

  recurringHint: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: 16,
    lineHeight: 18,
  },

  currentPlanBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.primary + "22",
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },

  currentPlanName: { color: colors.primary, fontSize: 14, fontWeight: "600", flex: 1 },

  currentRestBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#7C3AED22",
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },

  currentRestText: { color: "#A78BFA", fontSize: 14, fontWeight: "600", flex: 1 },

  modalTitle: { color: colors.text, fontSize: 18, fontWeight: "700", marginBottom: 12 },

  noRoutines: { color: colors.textSecondary, textAlign: "center", paddingVertical: 32 },

  routineList: { maxHeight: 280 },

  routineItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
  },

  routineItemLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  routineItemName: { color: colors.text, fontSize: 15, fontWeight: "500", flex: 1 },

  appBadge: {
    backgroundColor: colors.primary + "33",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },

  appBadgeText: { color: colors.primary, fontSize: 11, fontWeight: "700" },
  separator: { height: 1, backgroundColor: "#2C2C2E" },

  cancelBtn: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: spacing.borderRadius,
    backgroundColor: "#2C2C2E",
    alignItems: "center",
  },

  cancelBtnText: { color: colors.text, fontSize: 15, fontWeight: "600" },

  // Start Workout Modal
  startModalIcon: {
    alignSelf: "center",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary + "22",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  startModalTitle: { color: colors.textSecondary, fontSize: 13, textAlign: "center", marginBottom: 6 },
  startModalRoutineName: { color: colors.text, fontSize: 22, fontWeight: "800", textAlign: "center", marginBottom: 4 },
  startModalDate: { color: colors.textSecondary, fontSize: 13, textAlign: "center", marginBottom: 24, textTransform: "capitalize" },
  startBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: spacing.borderRadius,
    paddingVertical: 16,
    marginBottom: 10,
  },
  startBtnText: { color: "white", fontSize: 16, fontWeight: "700" },
  startModalAssignBtn: {
    alignItems: "center",
    paddingVertical: 12,
    marginBottom: 4,
  },
  startModalAssignBtnText: { color: colors.textSecondary, fontSize: 14, fontWeight: "500" },
});
