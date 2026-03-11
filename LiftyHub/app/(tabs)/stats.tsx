import { ScrollView, Text, StyleSheet } from "react-native";
import { colors, spacing } from "@/src/styles/globalstyles";

import StatsSummaryGrid from "@/src/components/stats/StatsSummaryGrid";
import WeeklyActivityChart from "@/src/components/stats/WeeklyActivityChart";
import PersonalRecords from "@/src/components/stats/PersonalRecords";

export default function StatsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      <Text style={styles.title}>Estadísticas</Text>
      <Text style={styles.subtitle}>Resumen de tu entrenamiento</Text>

      <StatsSummaryGrid />

      <WeeklyActivityChart />

      <PersonalRecords />

    </ScrollView>
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
    marginTop: 20
  },

  subtitle: {
    color: colors.textSecondary,
    marginBottom: 20
  }

});