import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing } from "@/src/styles/globalstyles";
import { useLanguage } from "@/src/context/LanguageContext";

type Props = {
  sessions: any[];
};

const DAYS = ["L", "M", "X", "J", "V", "S", "D"];

export default function WeeklyActivityChart({ sessions }: Props) {

  const { t } = useLanguage();

  // Inicio de semana actual (lunes)
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() + diffToMonday);
  weekStart.setHours(0, 0, 0, 0);

  // Contar sesiones por día de la semana (índice 0=lun ... 6=dom)
  const counts = Array(7).fill(0);
  sessions.forEach((s: any) => {
    if (!s.started_at) return;
    const d = new Date(s.started_at.replace(" ", "T"));
    const diff = Math.floor((d.getTime() - weekStart.getTime()) / 86400000);
    if (diff >= 0 && diff < 7) counts[diff]++;
  });

  const maxCount = Math.max(...counts, 1);
  const hasActivity = counts.some((c) => c > 0);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{t("stats.weeklyActivity")}</Text>

      {!hasActivity ? (
        <View style={styles.empty}>
          <Ionicons name="bar-chart-outline" size={36} color={colors.textSecondary} />
          <Text style={styles.emptyText}>Empieza a entrenar para ver tu actividad semanal</Text>
        </View>
      ) : (
        <View style={styles.chart}>
          {counts.map((count, i) => {
            const heightPct = count / maxCount;
            const isToday = i === (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
            return (
              <View key={i} style={styles.barCol}>
                <View style={styles.barBg}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        height: `${Math.max(heightPct * 100, count > 0 ? 10 : 0)}%`,
                        backgroundColor: count > 0 ? colors.primary : "#2C2C2E",
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.dayLabel, isToday && styles.dayLabelToday]}>
                  {DAYS[i]}
                </Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({

  card: {
    backgroundColor: colors.card,
    borderRadius: spacing.borderRadius,
    padding: 20,
    marginTop: 20,
  },

  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 15,
  },

  empty: {
    alignItems: "center",
    paddingVertical: 32,
    gap: 10,
  },

  emptyText: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
  },

  chart: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 100,
    gap: 6,
  },

  barCol: {
    flex: 1,
    alignItems: "center",
    gap: 6,
    height: "100%",
  },

  barBg: {
    flex: 1,
    width: "100%",
    backgroundColor: "#2C2C2E",
    borderRadius: 6,
    justifyContent: "flex-end",
    overflow: "hidden",
  },

  barFill: {
    width: "100%",
    borderRadius: 6,
  },

  dayLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: "600",
  },

  dayLabelToday: {
    color: colors.primary,
  },

});
