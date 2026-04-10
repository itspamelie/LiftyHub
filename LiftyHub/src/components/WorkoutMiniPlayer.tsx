import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useWorkout } from "@/src/context/WorkoutContext";
import { useLanguage } from "@/src/context/LanguageContext";
import { colors } from "@/src/styles/globalstyles";

const formatTime = (secs: number) => {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

export default function WorkoutMiniPlayer() {
  const { isActive, isMinimized, elapsedSecs, snapshot, endWorkout } = useWorkout();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();

  if (!isActive || !isMinimized || !snapshot) return null;

  const currentEx = snapshot.exercises[snapshot.exIndex];
  const currentExName =
    currentEx?.exercise?.name ?? currentEx?.name ?? t("session.exerciseFallback");

  const handleResume = () => {
    router.push({
      pathname: "/routines/session",
      params: {
        id: snapshot.routineId,
        name: snapshot.routineName,
        isUserRoutine: snapshot.isUserRoutine,
      },
    } as any);
  };

  const handleEnd = () => {
    Alert.alert(t("session.cancelTitle"), t("session.cancelMessage"), [
      { text: t("offline.cancel"), style: "cancel" },
      { text: t("session.cancelConfirm"), style: "destructive", onPress: endWorkout },
    ]);
  };

  return (
    <TouchableOpacity style={[styles.container, { paddingTop: insets.top + 8 }]} onPress={handleResume} activeOpacity={0.85}>
      <View style={styles.left}>
        <View style={styles.iconBg}>
          <Ionicons name="barbell" size={16} color={colors.primary} />
        </View>
        <View style={styles.textBlock}>
          <Text style={styles.routineName} numberOfLines={1}>{snapshot.routineName}</Text>
          <Text style={styles.exName} numberOfLines={1}>{currentExName}</Text>
        </View>
      </View>

      <View style={styles.right}>
        <Text style={styles.timer}>{formatTime(elapsedSecs)}</Text>
        <TouchableOpacity
          onPress={handleEnd}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close-circle" size={26} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1C1C1E",
    borderBottomWidth: 1,
    borderBottomColor: colors.primary + "55",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 10,
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },

  iconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary + "22",
    justifyContent: "center",
    alignItems: "center",
  },

  textBlock: {
    flex: 1,
  },

  routineName: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "700",
  },

  exName: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 1,
  },

  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  timer: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
});
