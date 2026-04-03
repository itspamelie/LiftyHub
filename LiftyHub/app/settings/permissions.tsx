import { View, Text, StyleSheet, ScrollView, Linking } from "react-native";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCallback } from "react";
import { router, useFocusEffect } from "expo-router";
import { useState } from "react";
import * as Notifications from "expo-notifications";
import * as ImagePicker from "expo-image-picker";
import SettingsItem from "@/src/components/settings/SettingsItem";
import { useLanguage } from "@/src/context/LanguageContext";
import { colors } from "@/src/styles/globalstyles";

export default function PermissionsScreen() {
  const { t } = useLanguage();

  const [notifPerm, setNotifPerm] = useState<"granted" | "denied" | "unknown">("unknown");
  const [galleryPerm, setGalleryPerm] = useState<"granted" | "denied" | "unknown">("unknown");
  const [cameraPerm, setCameraPerm] = useState<"granted" | "denied" | "unknown">("unknown");

  const checkPermissions = useCallback(async () => {
    const notif = await Notifications.getPermissionsAsync();
    setNotifPerm(notif.status === "granted" ? "granted" : notif.status === "denied" ? "denied" : "unknown");

    const gallery = await ImagePicker.getMediaLibraryPermissionsAsync();
    setGalleryPerm(gallery.status === "granted" ? "granted" : gallery.status === "denied" ? "denied" : "unknown");

    const camera = await ImagePicker.getCameraPermissionsAsync();
    setCameraPerm(camera.status === "granted" ? "granted" : camera.status === "denied" ? "denied" : "unknown");
  }, []);

  useFocusEffect(useCallback(() => { checkPermissions(); }, [checkPermissions]));

  const permColor = (status: "granted" | "denied" | "unknown") => {
    if (status === "granted") return "#10B981";
    if (status === "denied") return "#EF4444";
    return colors.textSecondary;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>{t("permissions.title")}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.description}>{t("permissions.description")}</Text>

        <View style={styles.card}>
          <SettingsItem
            icon="notifications-outline"
            label={t("permissions.notifications")}
            value={t(`permissions.${notifPerm}`)}
            valueColor={permColor(notifPerm)}
            onPress={() => Linking.openSettings()}
            showArrow
          />
          <View style={styles.divider} />
          <SettingsItem
            icon="images-outline"
            label={t("permissions.gallery")}
            value={t(`permissions.${galleryPerm}`)}
            valueColor={permColor(galleryPerm)}
            onPress={() => Linking.openSettings()}
            showArrow
          />
          <View style={styles.divider} />
          <SettingsItem
            icon="camera-outline"
            label={t("permissions.camera")}
            value={t(`permissions.${cameraPerm}`)}
            valueColor={permColor(cameraPerm)}
            onPress={() => Linking.openSettings()}
            showArrow
          />
        </View>

        <Text style={styles.hint}>{t("permissions.hint")}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0F10",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.card,
  },

  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "700",
  },

  content: {
    padding: 20,
    paddingBottom: 60,
  },

  description: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 20,
  },

  card: {
    backgroundColor: "#1C1C1E",
    borderRadius: 16,
    paddingVertical: 6,
  },

  divider: {
    height: 1,
    backgroundColor: "#2A2A2A",
    marginHorizontal: 16,
  },

  hint: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 16,
    textAlign: "center",
    lineHeight: 18,
  },
});
