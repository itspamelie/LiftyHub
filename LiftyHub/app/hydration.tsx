import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { useState, useEffect, useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { colors } from "@/src/styles/globalstyles";
import { useLanguage } from "@/src/context/LanguageContext";

const GOAL = 8;
const GLASS_HEIGHT = 220;
const DATE_KEY = "@liftyhub_hydration_date";
const COUNT_KEY = "@liftyhub_hydration_count";

export default function HydrationScreen() {
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const [count, setCount] = useState(0);
  const fillAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadData();
  }, []);

  const animateFill = (value: number) => {
    Animated.spring(fillAnim, {
      toValue: (value / GOAL) * GLASS_HEIGHT,
      useNativeDriver: false,
      tension: 60,
      friction: 10,
    }).start();
  };

  const loadData = async () => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const date = await AsyncStorage.getItem(DATE_KEY);
      if (date !== today) {
        await AsyncStorage.setItem(DATE_KEY, today);
        await AsyncStorage.setItem(COUNT_KEY, "0");
        setCount(0);
        animateFill(0);
        return;
      }
      const stored = parseInt((await AsyncStorage.getItem(COUNT_KEY)) ?? "0");
      setCount(stored);
      animateFill(stored);
    } catch {}
  };

  const saveCount = async (next: number) => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      await AsyncStorage.setItem(DATE_KEY, today);
      await AsyncStorage.setItem(COUNT_KEY, String(next));
    } catch {}
  };

  const add = () => {
    if (count >= GOAL) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const next = count + 1;
    setCount(next);
    animateFill(next);
    saveCount(next);
  };

  const remove = () => {
    if (count <= 0) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const next = count - 1;
    setCount(next);
    animateFill(next);
    saveCount(next);
  };

  const percent = Math.round((count / GOAL) * 100);
  const done = count >= GOAL;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("hydration.title")}</Text>
      </View>

      <View style={styles.content}>

        {/* Status badge */}
        <View style={[styles.badge, done && styles.badgeDone]}>
          <Ionicons name="water" size={13} color={done ? "#22c55e" : "#3B82F6"} />
          <Text style={[styles.badgeText, done && styles.badgeTextDone]}>
            {done ? t("hydration.goalReached") : t("hydration.glassesCount", { count, goal: GOAL })}
          </Text>
        </View>

        {/* Glass container */}
        <View style={styles.glassWrapper}>
          {/* Glass shape */}
          <View style={styles.glass}>
            {/* Water fill */}
            <Animated.View style={[styles.waterFill, { height: fillAnim }]} />
            {/* Percent text */}
            <View style={styles.glassCenter}>
              <Text style={styles.percentText}>{percent}%</Text>
              <Text style={styles.percentSub}>{count}/{GOAL}</Text>
            </View>
            {/* Shimmer lines */}
            {count > 0 && (
              <View style={styles.shimmerContainer} pointerEvents="none">
                <View style={styles.shimmerLine} />
                <View style={[styles.shimmerLine, { opacity: 0.3, marginTop: 6 }]} />
              </View>
            )}
          </View>

          {/* Glass base */}
          <View style={styles.glassBase} />
        </View>

        {/* Individual glasses */}
        <View style={styles.glassIcons}>
          {Array.from({ length: GOAL }).map((_, i) => (
            <View
              key={i}
              style={[styles.glassIcon, i < count && styles.glassIconFilled]}
            >
              <Ionicons
                name={i < count ? "water" : "water-outline"}
                size={18}
                color={i < count ? "white" : "#374151"}
              />
            </View>
          ))}
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlBtn, styles.controlBtnMinus, count === 0 && styles.controlBtnDisabled]}
            onPress={remove}
            disabled={count === 0}
            activeOpacity={0.7}
          >
            <Ionicons name="remove" size={26} color={count === 0 ? "#374151" : "white"} />
          </TouchableOpacity>

          <View style={styles.countDisplay}>
            <Text style={styles.countNumber}>{count}</Text>
            <Text style={styles.countLabel}>{t("hydration.glassesToday")}</Text>
          </View>

          <TouchableOpacity
            style={[styles.controlBtn, styles.controlBtnPlus, done && styles.controlBtnDisabled]}
            onPress={add}
            disabled={done}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={26} color={done ? "#374151" : "white"} />
          </TouchableOpacity>
        </View>

        {/* Goal label */}
        <Text style={styles.goalLabel}>{t("hydration.goalLabel", { goal: GOAL })}</Text>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 8,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1C1C1E",
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: colors.primary,
    justifyContent: "center", alignItems: "center",
  },
  headerTitle: {
    color: "white", fontSize: 24, fontWeight: "700",
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingTop: 32,
    paddingHorizontal: 24,
  },
  badge: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: "rgba(59,130,246,0.12)",
    borderWidth: 1, borderColor: "rgba(59,130,246,0.3)",
    paddingHorizontal: 14, paddingVertical: 5,
    borderRadius: 999, marginBottom: 36,
  },
  badgeDone: {
    backgroundColor: "rgba(34,197,94,0.12)",
    borderColor: "rgba(34,197,94,0.3)",
  },
  badgeText: {
    color: "#3B82F6", fontSize: 13, fontWeight: "700",
  },
  badgeTextDone: {
    color: "#22c55e",
  },
  glassWrapper: {
    alignItems: "center",
    marginBottom: 32,
  },
  glass: {
    width: 130,
    height: GLASS_HEIGHT,
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: "rgba(59,130,246,0.5)",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    overflow: "hidden",
    backgroundColor: "rgba(59,130,246,0.04)",
    justifyContent: "center",
    alignItems: "center",
  },
  waterFill: {
    position: "absolute",
    bottom: 0, left: 0, right: 0,
    backgroundColor: "rgba(59,130,246,0.65)",
  },
  glassCenter: {
    zIndex: 1,
    alignItems: "center",
  },
  percentText: {
    color: "white",
    fontSize: 36,
    fontWeight: "800",
    letterSpacing: -1,
  },
  percentSub: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    fontWeight: "600",
  },
  shimmerContainer: {
    position: "absolute",
    top: 12, left: 12, right: 12,
    zIndex: 2,
  },
  shimmerLine: {
    height: 2,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 1,
  },
  glassBase: {
    width: 90,
    height: 6,
    backgroundColor: "rgba(59,130,246,0.4)",
    borderRadius: 3,
  },
  glassIcons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
    marginBottom: 36,
  },
  glassIcon: {
    width: 36, height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1, borderColor: "#2C2C2E",
    justifyContent: "center", alignItems: "center",
  },
  glassIconFilled: {
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginBottom: 20,
  },
  controlBtn: {
    width: 56, height: 56,
    borderRadius: 28,
    justifyContent: "center", alignItems: "center",
  },
  controlBtnMinus: {
    backgroundColor: "#1C1C1E",
    borderWidth: 1, borderColor: "#2C2C2E",
  },
  controlBtnPlus: {
    backgroundColor: "#3B82F6",
  },
  controlBtnDisabled: {
    opacity: 0.35,
  },
  countDisplay: {
    alignItems: "center",
    minWidth: 80,
  },
  countNumber: {
    color: "white",
    fontSize: 48,
    fontWeight: "800",
    lineHeight: 52,
  },
  countLabel: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  goalLabel: {
    color: "#374151",
    fontSize: 12,
    textAlign: "center",
  },
});
