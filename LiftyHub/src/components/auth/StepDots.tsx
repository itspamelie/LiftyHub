import { View, StyleSheet, Animated } from "react-native";
import { useRef, useEffect } from "react";
import { colors } from "@/src/styles/globalstyles";

const TOTAL_STEPS = 5;

function Dot({ active }: { active: boolean }) {
  const fill = useRef(new Animated.Value(active ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(fill, {
      toValue: active ? 1 : 0,
      useNativeDriver: true,
      damping: 12,
      stiffness: 180,
    }).start();
  }, [active]);

  return (
    <View style={styles.outer}>
      <Animated.View style={[styles.inner, { transform: [{ scale: fill }] }]} />
    </View>
  );
}

export default function StepDots({ currentStep }: { currentStep: number }) {
  return (
    <View style={styles.container}>
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <Dot key={i} active={i < currentStep} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginTop: 28,
    marginBottom: 4,
  },
  outer: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  inner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
});
