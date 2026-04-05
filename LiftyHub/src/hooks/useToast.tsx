import { useRef, useCallback, useState } from "react";
import { Animated, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type ToastType = "success" | "error" | "info";

const ICON: Record<ToastType, "checkmark-circle" | "close-circle" | "information-circle"> = {
  success: "checkmark-circle",
  error: "close-circle",
  info: "information-circle",
};

const BG: Record<ToastType, string> = {
  success: "#16a34a",
  error: "#dc2626",
  info: "#2563eb",
};

export function useToast() {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  const [message, setMessage] = useState("");
  const [type, setType] = useState<ToastType>("info");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback(
    (msg: string, toastType: ToastType = "info") => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setMessage(msg);
      setType(toastType);

      opacity.setValue(0);
      translateY.setValue(20);

      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();

      timerRef.current = setTimeout(() => {
        Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }).start(() =>
          setMessage("")
        );
      }, 2800);
    },
    [opacity, translateY]
  );

  const Toast = message ? (
    <Animated.View
      pointerEvents="none"
      style={[styles.toast, { backgroundColor: BG[type], opacity, transform: [{ translateY }] }]}
    >
      <Ionicons name={ICON[type]} size={18} color="white" />
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  ) : null;

  return { showToast, Toast };
}

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    bottom: 100,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    zIndex: 9999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  text: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
});
