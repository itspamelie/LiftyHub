import { View, StyleSheet } from "react-native";
import StatSummaryCard from "./StatSummaryCard";

export default function StatsSummaryGrid() {
  return (
    <View style={styles.grid}>
      <StatSummaryCard icon="barbell" label="Entrenamientos" value="24" />
      <StatSummaryCard icon="flame" label="Racha" value="5 días" />
      <StatSummaryCard icon="time" label="Tiempo total" value="18h" />
      <StatSummaryCard icon="flash" label="Calorías" value="6200" />
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