import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLanguage } from "@/src/context/LanguageContext";

export default function OfflineBanner() {
  const { t } = useLanguage();
  return (
    <View style={styles.banner}>
      <Ionicons name="cloud-offline-outline" size={15} color="white" />
      <Text style={styles.text}>{t("offline.banner")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: "#374151",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 7,
  },
  text: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
});
