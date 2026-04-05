import { ScrollView, Text, StyleSheet, View, ActivityIndicator, RefreshControl, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { colors, spacing } from "@/src/styles/globalstyles";
import { getUserStreak, getUserRoutineSessions, getExerciseLogs } from "@/src/services/api";

import StatsSummaryGrid from "@/src/components/stats/StatsSummaryGrid";
import WeeklyActivityChart from "@/src/components/stats/WeeklyActivityChart";
import PersonalRecords from "@/src/components/stats/PersonalRecords";

export default function StatsScreen() {

  const [stats, setStats] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [animationTrigger, setAnimationTrigger] = useState(0);

  const loadData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userRaw = await AsyncStorage.getItem("user");
      if (!token || !userRaw) return;

      const user = JSON.parse(userRaw);
      const userId = Number(user.id);

      const [streakRes, sessionsRes, logsRes] = await Promise.all([
        getUserStreak(userId, token),
        getUserRoutineSessions(token),
        getExerciseLogs(token),
      ]);

      const streak = streakRes?.data;
      const allSessions: any[] = (sessionsRes?.data ?? []).filter(
        (s: any) => Number(s.user_id) === userId
      );
      const allLogs: any[] = (logsRes?.data ?? []).filter(
        (l: any) => Number(l.user_id) === userId
      );

      // Tiempo total en horas (suma de duración de sesiones con started_at y finished_at)
      const totalMinutes = allSessions.reduce((sum: number, s: any) => {
        if (!s.started_at || !s.finished_at) return sum;
        const start = new Date(s.started_at.replace(" ", "T"));
        const end = new Date(s.finished_at.replace(" ", "T"));
        return sum + (end.getTime() - start.getTime()) / 60000;
      }, 0);
      const totalHours = Math.round(totalMinutes / 60);

      // Peso total levantado
      const totalWeight = allLogs.reduce((sum: number, l: any) => {
        return sum + (parseFloat(l.weight_lifted) || 0) * (l.sets ?? 1) * (l.repetitions ?? 1);
      }, 0);

      setStats({
        workouts: allSessions.length,
        streak: streak?.current_streak ?? 0,
        totalTime: totalHours,
        totalWeight: Math.round(totalWeight),
      });
      setSessions(allSessions);
      setLogs(allLogs);
    } catch {
      Alert.alert("Error", "No se pudieron cargar las estadísticas. Verifica tu conexión.");
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
        <Text style={styles.title}>Estadísticas</Text>
        <Text style={styles.subtitle}>Resumen de tu entrenamiento</Text>

        {stats && <StatsSummaryGrid stats={stats} trigger={animationTrigger} />}

        <WeeklyActivityChart sessions={sessions} />
        <PersonalRecords logs={logs} />

      </ScrollView>
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
