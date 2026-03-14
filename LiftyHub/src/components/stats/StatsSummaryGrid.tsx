import { View, StyleSheet } from "react-native";
import StatSummaryCard from "@/src/components/stats/StatSummaryCard";

type Props = {
  stats: any;
  trigger?: number;
};

export default function StatsSummaryGrid({ stats, trigger = 0 }: Props) {

  return (
    <View style={styles.grid}>

      <StatSummaryCard
        icon="barbell"
        label="Entrenamientos"
        value={stats.workouts}
        trigger={trigger}
      />

      <StatSummaryCard
        icon="flame"
        label="Racha"
        value={stats.streak}
        trigger={trigger}
      />

      <StatSummaryCard
        icon="time"
        label="Tiempo total"
        value={stats.totalTime}
        trigger={trigger}
      />

      <StatSummaryCard
        icon="fitness"
        label="Peso levantado"
        value={stats.totalWeight}
        trigger={trigger}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10
  }
});