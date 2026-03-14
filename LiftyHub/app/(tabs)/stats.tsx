import { ScrollView, Text, StyleSheet, View, ActivityIndicator, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect, useCallback } from "react";

import { colors, spacing } from "@/src/styles/globalstyles";

import StatsSummaryGrid from "@/src/components/stats/StatsSummaryGrid";
import WeeklyActivityChart from "@/src/components/stats/WeeklyActivityChart";
import PersonalRecords from "@/src/components/stats/PersonalRecords";

export default function StatsScreen() {

  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [animationTrigger, setAnimationTrigger] = useState(0);

  const fetchStats = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          workouts: 24,
          streak: 5,
          totalTime: 18,
          totalWeight: 12450
        });
      }, 800);
    });
  };

  const loadStats = async () => {
    const data: any = await fetchStats();
    setStats(data);
    setLoading(false);
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);

    const data: any = await fetchStats();
    setStats(data);

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

        <StatsSummaryGrid stats={stats} trigger={animationTrigger} />

        <WeeklyActivityChart />
        <PersonalRecords />

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