import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useRouter, Stack } from "expo-router";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors, spacing } from "@/src/styles/globalstyles";
import { registerRequest, createUserProperties } from "@/src/services/api";
import { useLanguage } from "@/src/context/LanguageContext";

type PermissionStatus = "idle" | "granted" | "denied";

export default function Permissions() {
  const router = useRouter();
  const { t } = useLanguage();

  const [notifStatus, setNotifStatus] = useState<PermissionStatus>("idle");
  const [galleryStatus, setGalleryStatus] = useState<PermissionStatus>("idle");
  const [cameraStatus, setCameraStatus] = useState<PermissionStatus>("idle");
  const [loading, setLoading] = useState(false);

  const requestNotifications = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    setNotifStatus(status === "granted" ? "granted" : "denied");
  };

  const requestGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    setGalleryStatus(status === "granted" ? "granted" : "denied");
  };

  const requestCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    setCameraStatus(status === "granted" ? "granted" : "denied");
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      const registerDataRaw = await AsyncStorage.getItem("@register_data");
      const objective = await AsyncStorage.getItem("@register_objective");
      const propertiesRaw = await AsyncStorage.getItem("@register_properties");

      if (!registerDataRaw || !objective || !propertiesRaw) {
        Alert.alert("Error", t("onboarding.errorIncomplete"));
        setLoading(false);
        return;
      }

      const { name, email, password, gender, birthdate } = JSON.parse(registerDataRaw);
      const { height, weight, waist, somatotype_id } = JSON.parse(propertiesRaw);

      const data = await registerRequest({ name, email, password, gender, birthdate });

      if (data?.token) {
        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("user", JSON.stringify(data.user));

        await createUserProperties(
          {
            user_id: data.user.id,
            stature: height,
            weight,
            waist,
            objective,
            somatotype_id,
          },
          data.token
        );

        await AsyncStorage.removeItem("@register_data");
        await AsyncStorage.removeItem("@register_objective");
        await AsyncStorage.removeItem("@register_properties");

        router.replace("/(tabs)" as any);
      } else {
        const mensaje = data?.errors?.email?.[0] ?? data?.message ?? t("onboarding.errorGeneral");
        Alert.alert("Error", mensaje, [
          { text: "OK", onPress: () => router.replace("/auth/register" as any) },
        ]);
      }
    } catch {
      Alert.alert("Error", t("onboarding.errorGeneral"));
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (status: PermissionStatus, granted: string, idle: string) => {
    if (status === "granted") return granted;
    if (status === "denied") return "close-circle-outline";
    return idle;
  };

  const getIconColor = (status: PermissionStatus) => {
    if (status === "granted") return "#10B981";
    if (status === "denied") return "#EF4444";
    return colors.textSecondary;
  };

  const permissionRows = [
    {
      icon: "notifications-outline",
      title: t("permissions.notifications"),
      desc: t("onboarding.notificationsDesc"),
      status: notifStatus,
      onPress: requestNotifications,
    },
    {
      icon: "images-outline",
      title: t("permissions.gallery"),
      desc: t("onboarding.galleryDesc"),
      status: galleryStatus,
      onPress: requestGallery,
    },
    {
      icon: "camera-outline",
      title: t("permissions.camera"),
      desc: t("onboarding.cameraDesc"),
      status: cameraStatus,
      onPress: requestCamera,
    },
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <Ionicons name="shield-checkmark-outline" size={50} color={colors.primary} />
        <Text style={styles.title}>{t("onboarding.permissionsTitle")}</Text>
        <Text style={styles.subtitle}>{t("onboarding.permissionsSubtitle")}</Text>
      </View>

      <View style={styles.card}>
        {permissionRows.map((row, index) => (
          <View key={row.icon}>
            {index > 0 && <View style={styles.divider} />}
            <TouchableOpacity
              style={styles.permissionRow}
              onPress={row.onPress}
              disabled={row.status !== "idle"}
            >
              <View style={styles.permissionIcon}>
                <Ionicons name={row.icon as any} size={24} color={colors.primary} />
              </View>
              <View style={styles.permissionInfo}>
                <Text style={styles.permissionTitle}>{row.title}</Text>
                <Text style={styles.permissionDesc}>{row.desc}</Text>
              </View>
              <Ionicons
                name={getIcon(row.status, "checkmark-circle", "chevron-forward-outline") as any}
                size={22}
                color={getIconColor(row.status)}
              />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <Text style={styles.hint}>{t("onboarding.permissionsHint")}</Text>

      <TouchableOpacity
        style={[styles.button, loading && styles.disabled]}
        onPress={handleFinish}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? t("onboarding.loadingAccount") : t("onboarding.finish")}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.screenPadding,
    justifyContent: "center",
  },

  header: {
    alignItems: "center",
    marginBottom: 36,
  },

  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "700",
    marginTop: 12,
  },

  subtitle: {
    color: colors.textSecondary,
    marginTop: 6,
    textAlign: "center",
    lineHeight: 20,
  },

  card: {
    backgroundColor: colors.card,
    borderRadius: spacing.borderRadius,
    paddingVertical: 6,
    marginBottom: 16,
  },

  permissionRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 14,
  },

  permissionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#1E3A8A22",
    justifyContent: "center",
    alignItems: "center",
  },

  permissionInfo: {
    flex: 1,
  },

  permissionTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
  },

  permissionDesc: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },

  divider: {
    height: 1,
    backgroundColor: "#2A2A2A",
    marginHorizontal: 16,
  },

  hint: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: "center",
    marginBottom: 28,
    lineHeight: 18,
  },

  button: {
    backgroundColor: colors.primary,
    borderRadius: 30,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  disabled: {
    opacity: 0.7,
  },
});
