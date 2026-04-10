import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import Body from "react-native-body-highlighter";
import { colors } from "@/src/styles/globalstyles";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function BodyAvatarScreen() {
  const [side, setSide] = useState<"front" | "back">("front");
  const [gender, setGender] = useState<"male" | "female">("male");

  useEffect(() => {
    AsyncStorage.getItem("user").then(raw => {
      if (!raw) return;
      const u = JSON.parse(raw);
      setGender(u.gender === "Femenino" ? "female" : "male");
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi cuerpo</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Toggle */}
      <View style={styles.toggle}>
        <TouchableOpacity
          style={[styles.toggleBtn, side === "front" && styles.toggleBtnActive]}
          onPress={() => setSide("front")}
        >
          <Text style={[styles.toggleText, side === "front" && styles.toggleTextActive]}>Frente</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, side === "back" && styles.toggleBtnActive]}
          onPress={() => setSide("back")}
        >
          <Text style={[styles.toggleText, side === "back" && styles.toggleTextActive]}>Espalda</Text>
        </TouchableOpacity>
      </View>

      {/* Avatar */}
      <View style={styles.bodyContainer} pointerEvents="none">
        <Body
          data={[]}
          gender={gender}
          side={side}
          scale={1.5}
          border="#3A3A3C"
          defaultFill="#2A2A2C"
        />
      </View>

      {/* Hint */}
      <View style={styles.hintCard}>
        <Ionicons name="trophy-outline" size={22} color={colors.primary} />
        <Text style={styles.hintText}>Próximamente verás los músculos que más entrenas resaltados aquí</Text>
      </View>

    </SafeAreaView>
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
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.card,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    flex: 1,
    color: colors.text,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  toggle: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 4,
    marginHorizontal: 24,
    marginTop: 12,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 12,
  },
  toggleBtnActive: {
    backgroundColor: colors.primary,
  },
  toggleText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: "600",
  },
  toggleTextActive: {
    color: "white",
  },
  bodyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  hintCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.card,
    borderRadius: 16,
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 16,
  },
  hintText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
});
