import { ScrollView, Text, StyleSheet, View, ActivityIndicator, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect, useCallback } from "react";
import * as Storage from "@/src/utils/storage";

import { colors, spacing } from "@/src/styles/globalstyles";
import { useLanguage } from "@/src/context/LanguageContext";
import { getUserStreak, getUserRoutineSessions, getExerciseLogs } from "@/src/services/api";
import { useToast } from "@/src/hooks/useToast";
import { useNetworkStatus } from "@/src/hooks/useNetworkStatus";
import { saveCache, loadCache } from "@/src/utils/cache";
import OfflineBanner from "@/src/components/OfflineBanner";

import StatsSummaryGrid from "@/src/components/stats/StatsSummaryGrid";
import WeeklyActivityChart from "@/src/components/stats/WeeklyActivityChart";
import PersonalRecords from "@/src/components/stats/PersonalRecords";

type Stats = { workouts: number; streak: number; totalTime: number; totalWeight: number };
type Session = { user_id: number; started_at: string; finished_at?: string };
type ExerciseLog = { user_id: number; workout_date: string; weight_lifted: string; sets: number; repetitions: number };

export default function StatsScreen() {

  const { t } = useLanguage();
  const { showToast, Toast } = useToast();
  const isConnected = useNetworkStatus();
  const [stats, setStats] = useState<Stats | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [logs, setLogs] = useState<ExerciseLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [animationTrigger, setAnimationTrigger] = useState(0);

  const loadData = async () => {
    try {
      const token = await Storage.getItem("token");
      const userRaw = await Storage.getItem("user");
      if (!token || !userRaw) return;

      const user = JSON.parse(userRaw);
      const userId = Number(user.id);

      const [streakRes, sessionsRes, logsRes] = await Promise.all([
        getUserStreak(userId, token),
        getUserRoutineSessions(token),
        getExerciseLogs(token),
      ]);

      const streak = streakRes?.data;
      const allSessions: Session[] = (sessionsRes?.data ?? []).filter(
        (s: Session) => Number(s.user_id) === userId
      );
      const allLogs: ExerciseLog[] = (logsRes?.data ?? []).filter(
        (l: ExerciseLog) => Number(l.user_id) === userId
      );

      // Tiempo total en horas (suma de duración de sesiones con started_at y finished_at)
      const totalMinutes = allSessions.reduce((sum: number, s: Session) => {
        if (!s.started_at || !s.finished_at) return sum;
        const start = new Date(s.started_at.replace(" ", "T"));
        const end = new Date(s.finished_at.replace(" ", "T"));
        return sum + (end.getTime() - start.getTime()) / 60000;
      }, 0);
      const totalHours = Math.round(totalMinutes / 60);

      // Peso total levantado
      const totalWeight = allLogs.reduce((sum: number, l: ExerciseLog) => {
        return sum + (parseFloat(l.weight_lifted) || 0) * (l.sets ?? 1) * (l.repetitions ?? 1);
      }, 0);

      const statsData = {
        workouts: allSessions.length,
        streak: streak?.current_streak ?? 0,
        totalTime: totalHours,
        totalWeight: Math.round(totalWeight),
      };
      setStats(statsData);
      setSessions(allSessions);
      setLogs(allLogs);
      await saveCache("stats", { stats: statsData, sessions: allSessions, logs: allLogs });
    } catch {
      const cached = await loadCache<any>("stats");
      if (cached) { setStats(cached.stats); setSessions(cached.sessions); setLogs(cached.logs); }
      else showToast(t("statsScreen.errorLoad"), "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setAnimationTrigger(prev => prev + 1);
    setRefreshing(false);
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {!isConnected && <OfflineBanner />}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
      >
        <Text style={styles.title}>{t("statsScreen.title")}</Text>
        <Text style={styles.subtitle}>{t("statsScreen.subtitle")}</Text>

        {stats && <StatsSummaryGrid stats={stats} trigger={animationTrigger} />}

        <WeeklyActivityChart sessions={sessions} />
        <PersonalRecords logs={logs} />

      </ScrollView>
      {Toast}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.background
  },

  content: {
    padding: spacing.screenPadding,
    paddingBottom: 40
  },

  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 10
  },

  subtitle: {
    color: colors.textSecondary,
    marginBottom: 20
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }

});
