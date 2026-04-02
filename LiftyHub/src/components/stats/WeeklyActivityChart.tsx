import { View, Text, StyleSheet } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { colors, spacing } from "@/src/styles/globalstyles";
import { useLanguage } from "@/src/context/LanguageContext";

export default function WeeklyActivityChart() {

  const { t } = useLanguage();

  const data = [
    { value: 3, label: "L" },
    { value: 5, label: "M" },
    { value: 2, label: "M" },
    { value: 6, label: "J" },
    { value: 4, label: "V" },
    { value: 1, label: "S" },
    { value: 5, label: "D" }
  ];

  return (
    <View style={styles.card}>

      <Text style={styles.title}>{t("stats.weeklyActivity")}</Text>

      <View style={styles.chartWrapper}>
        <BarChart
          data={data}
          height={180}

          barWidth={18}
          spacing={20}

          roundedTop
          frontColor={colors.primary}

          hideRules={false}

          yAxisColor={colors.textSecondary}
          xAxisColor={colors.textSecondary}

          yAxisTextStyle={{ color: colors.textSecondary }}
          xAxisLabelTextStyle={{ color: colors.textSecondary }}

          yAxisThickness={0}
        />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  card: {
    backgroundColor: colors.card,
    borderRadius: spacing.borderRadius,
    padding: 20,
    marginTop: 20
  },

  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 15
  },

  chartWrapper: {
    width: "100%",
    overflow: "hidden"
  }

});