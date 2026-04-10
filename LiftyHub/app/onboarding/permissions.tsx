import { View, Text, StyleSheet, Alert, Modal, ActivityIndicator } from "react-native";
import { useRouter, Stack } from "expo-router";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors, spacing } from "@/src/styles/globalstyles";
import { registerRequest, createUserProperties } from "@/src/services/api";
import { useLanguage } from "@/src/context/LanguageContext";
import { useSubscription } from "@/src/context/SubscriptionContext";
import BackButton from "@/src/components/buttons/backButton";
import HapticButton from "@/src/components/buttons/HapticButton";

type PermissionStatus = "idle" | "granted" | "denied";

export default function Permissions() {
  const router = useRouter();
  const { t } = useLanguage();
  const { refresh: refreshSubscription } = useSubscription();

  const [notifStatus, setNotifStatus]     = useState<PermissionStatus>("idle");
  const [galleryStatus, setGalleryStatus] = useState<PermissionStatus>("idle");
  const [cameraStatus, setCameraStatus]   = useState<PermissionStatus>("idle");
  const [loading, setLoading]             = useState(false);

  // Modal de permisos automáticos
  const [step, setStep]           = useState(0);   // 0=notif, 1=gallery, 2=camera
  const [showModal, setShowModal] = useState(false);
  const [stepLoading, setStepLoading] = useState(false);
  const allStepsDone = step >= 3;

  // Abrir el primer modal automáticamente al montar
  useEffect(() => {
    const timer = setTimeout(() => setShowModal(true), 400);
    return () => clearTimeout(timer);
  }, []);

  const advance = () => {
    const next = step + 1;
    setStep(next);
    if (next >= 3) setShowModal(false);
  };

  const handleAccept = async () => {
    setStepLoading(true);
    try {
      if (step === 0) {
        const { status } = await Notifications.requestPermissionsAsync();
        setNotifStatus(status === "granted" ? "granted" : "denied");
      } else if (step === 1) {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        setGalleryStatus(status === "granted" ? "granted" : "denied");
      } else if (step === 2) {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        setCameraStatus(status === "granted" ? "granted" : "denied");
      }
    } finally {
      setStepLoading(false);
      advance();
    }
  };

  const handleDecline = () => {
    if (step === 0) setNotifStatus("denied");
    else if (step === 1) setGalleryStatus("denied");
    else if (step === 2) setCameraStatus("denied");
    advance();
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      const registerDataRaw = await AsyncStorage.getItem("@register_data");
      const objective       = await AsyncStorage.getItem("@register_objective");
      const propertiesRaw   = await AsyncStorage.getItem("@register_properties");

      if (!registerDataRaw || !objective || !propertiesRaw) {
        Alert.alert("Error", t("onboarding.errorIncomplete"));
        setLoading(false);
        return;
      }

      const { name, email, password, gender, birthdate } = JSON.parse(registerDataRaw);
      const { height, weight, waist, somatotype_id }     = JSON.parse(propertiesRaw);

      const data = await registerRequest({ name, email, password, gender, birthdate });

      if (data?.token) {
        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
        await refreshSubscription();

        await createUserProperties(
          { user_id: data.user.id, stature: height, weight, waist, objective, somatotype_id },
          data.token
        );

        await AsyncStorage.removeItem("@register_data");
        await AsyncStorage.removeItem("@register_objective");
        await AsyncStorage.removeItem("@register_properties");

        router.replace("/(tabs)/profile" as any);
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

  // Config de cada paso
  const STEPS = [
    {
      icon: "notifications" as const,
      color: "#3B82F6",
      title: t("permissions.notifications"),
      description: t("onboarding.notificationsDesc"),
      status: notifStatus,
    },
    {
      icon: "images" as const,
      color: "#10B981",
      title: t("permissions.gallery"),
      description: t("onboarding.galleryDesc"),
      status: galleryStatus,
    },
    {
      icon: "camera" as const,
      color: "#F59E0B",
      title: t("permissions.camera"),
      description: t("onboarding.cameraDesc"),
      status: cameraStatus,
    },
  ];

  const currentStep = STEPS[step] ?? null;

  const getStatusColor = (s: PermissionStatus) =>
    s === "granted" ? "#10B981" : s === "denied" ? colors.danger : colors.textSecondary;

  const getStatusIcon = (s: PermissionStatus) =>
    s === "granted" ? "checkmark-circle" : s === "denied" ? "close-circle" : "ellipse-outline";

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <BackButton />

      {/* HEADER */}
      <View style={styles.header}>
        <Ionicons name="shield-checkmark" size={50} color={colors.primary} />
        <Text style={styles.title}>{t("onboarding.permissionsTitle")}</Text>
        <Text style={styles.subtitle}>{t("onboarding.permissionsSubtitle")}</Text>
      </View>

      {/* LISTA DE ESTADO */}
      <View style={styles.card}>
        {STEPS.map((row, index) => (
          <View key={row.icon}>
            {index > 0 && <View style={styles.divider} />}
            <View style={styles.permissionRow}>
              <View style={[styles.permissionIcon, { backgroundColor: `${row.color}22` }]}>
                <Ionicons name={row.icon} size={24} color={row.color} />
              </View>
              <View style={styles.permissionInfo}>
                <Text style={styles.permissionTitle}>{row.title}</Text>
                <Text style={styles.permissionDesc}>{row.description}</Text>
              </View>
              <Ionicons
                name={getStatusIcon(row.status) as any}
                size={22}
                color={getStatusColor(row.status)}
              />
            </View>
          </View>
        ))}
      </View>

      <Text style={styles.hint}>{t("onboarding.permissionsHint")}</Text>

      <HapticButton
        style={[styles.button, (!allStepsDone || loading) && styles.disabled]}
        onPress={handleFinish}
        disabled={!allStepsDone || loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>
            {allStepsDone ? t("onboarding.finish") : t("onboarding.loadingAccount")}
          </Text>
        )}
      </HapticButton>

      {/* MODAL AUTOMÁTICO DE PERMISOS */}
      <Modal visible={showModal && !allStepsDone} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          {currentStep && (
            <View style={styles.modalCard}>

              {/* DOTS */}
              <View style={styles.dots}>
                {STEPS.map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.dot,
                      i === step
                        ? { backgroundColor: currentStep.color, width: 20 }
                        : i < step
                        ? { backgroundColor: "#10B981" }
                        : { backgroundColor: "#3A3A3C" },
                    ]}
                  />
                ))}
              </View>

              {/* ÍCONO */}
              <View style={[styles.modalIconBg, { backgroundColor: `${currentStep.color}22` }]}>
                <Ionicons name={currentStep.icon} size={40} color={currentStep.color} />
              </View>

              {/* TEXTO */}
              <Text style={styles.modalTitle}>{currentStep.title}</Text>
              <Text style={styles.modalDesc}>{currentStep.description}</Text>

              {/* BOTONES */}
              <HapticButton
                style={[styles.acceptBtn, { backgroundColor: currentStep.color }, stepLoading && styles.disabled]}
                onPress={handleAccept}
                disabled={stepLoading}
              >
                {stepLoading
                  ? <ActivityIndicator color="white" />
                  : <Text style={styles.acceptText}>{t("onboarding.accept")}</Text>}
              </HapticButton>

              <HapticButton
                style={styles.declineBtn}
                onPress={handleDecline}
                disabled={stepLoading}
              >
                <Text style={styles.declineText}>{t("onboarding.decline")}</Text>
              </HapticButton>

            </View>
          )}
        </View>
      </Modal>
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
    marginBottom: 32,
  },

  title: {
    color: colors.text,
    fontSize: 28,
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
    opacity: 0.5,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  modalCard: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 28,
    width: "100%",
    alignItems: "center",
  },

  dots: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 28,
  },

  dot: {
    height: 6,
    width: 6,
    borderRadius: 3,
  },

  modalIconBg: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  modalTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
  },

  modalDesc: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 28,
  },

  acceptBtn: {
    width: "100%",
    height: 50,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  acceptText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },

  declineBtn: {
    paddingVertical: 10,
  },

  declineText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
});
