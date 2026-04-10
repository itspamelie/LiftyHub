import { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, Alert, Modal, TextInput, ActivityIndicator, TouchableWithoutFeedback, Keyboard } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import SettingsItem from "@/src/components/settings/SettingsItem";
import SettingsSwitchItem from "@/src/components/settings/SettingsSwitchItem";
import { deleteAccount, checkPassword } from "@/src/services/api";
import { useLanguage } from "@/src/context/LanguageContext";
import { useToast } from "@/src/hooks/useToast";
import { useSubscription } from "@/src/context/SubscriptionContext";
import { useUnits } from "@/src/context/UnitsContext";
import { colors, spacing, planColors } from "@/src/styles/globalstyles";
import HapticButton from "@/src/components/buttons/HapticButton";

export default function Settings() {

  const { t, language, changeLanguage } = useLanguage();
  const { plan, refresh: refreshSubscription } = useSubscription();
  const { units, changeUnits } = useUnits();
  const { showToast, Toast } = useToast();

  const planColor = plan ? (planColors[plan.name] ?? colors.primary) : "#A1A1A1";
  const [notifications, setNotifications] = useState(false);

  // Dev mode
  const versionTaps = useRef(0);
  const [showDevModal, setShowDevModal] = useState(false);
  const [devActivePlan, setDevActivePlan] = useState<string | null>(null);

  const DEV_PLANS = [
    { id: 1, name: "Free",  level: 0, price: 0,   description: "Acceso limitado" },
    { id: 2, name: "Basic", level: 1, price: 99,  description: "Plan básico" },
    { id: 3, name: "Meal",  level: 2, price: 400, description: "Plan nutrición" },
    { id: 4, name: "Pro",   level: 2, price: 600, description: "Plan completo" },
  ] as const;

  useEffect(() => {
    AsyncStorage.getItem("@liftyhub_dev_plan").then((val) => {
      if (val) setDevActivePlan(JSON.parse(val).name);
    });
  }, []);

  const handleVersionTap = () => {
    versionTaps.current += 1;
    if (versionTaps.current >= 5) {
      versionTaps.current = 0;
      setShowDevModal(true);
    }
  };

  const handleSetDevPlan = async (p: typeof DEV_PLANS[number]) => {
    await AsyncStorage.setItem("@liftyhub_dev_plan", JSON.stringify(p));
    setDevActivePlan(p.name);
    await refreshSubscription();
    setShowDevModal(false);
  };

  const handleClearDevPlan = async () => {
    await AsyncStorage.removeItem("@liftyhub_dev_plan");
    setDevActivePlan(null);
    await refreshSubscription();
    setShowDevModal(false);
  };

  // Modal eliminar cuenta
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deletePasswordVerified, setDeletePasswordVerified] = useState(false);
  const [verifyingDelete, setVerifyingDelete] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [showDeletePassword, setShowDeletePassword] = useState(false);

  const resetDeleteModal = () => {
    setDeletePassword("");
    setDeletePasswordVerified(false);
    setShowDeletePassword(false);
    setShowDeleteModal(false);
  };

  const handleVerifyDeletePassword = async () => {
    if (!deletePassword) return;
    setVerifyingDelete(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;
      const res = await checkPassword(deletePassword, token);
      if (res?.valid) {
        setDeletePasswordVerified(true);
      } else {
        showToast(t("settings.errorVerifyPassword"), "error");
      }
    } catch {
      showToast(t("settings.errorVerifyFailed"), "error");
    } finally {
      setVerifyingDelete(false);
    }
  };

  const handleConfirmDelete = async () => {
    setDeletingAccount(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const userRaw = await AsyncStorage.getItem("user");
      if (!token || !userRaw) return;

      const user = JSON.parse(userRaw);
      await deleteAccount(user.id, token);

      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("@liftyhub_dev_plan");
      await AsyncStorage.removeItem("@liftyhub_calendar_plan");
      router.replace("/auth/login");
    } catch {
      Alert.alert("Error", t("settings.errorDelete"));
    } finally {
      setDeletingAccount(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("@liftyhub_dev_plan");
      await AsyncStorage.removeItem("@liftyhub_calendar_plan");
      router.replace("/auth/login");
    } catch {
      showToast(t("settings.errorLogout"), "error");
    }
  };

  const handleUnits = () => {
    Alert.alert(
      t("settings.unitsTitle"),
      t("settings.unitsMessage"),
      [
        { text: t("settings.unitsKg"), onPress: () => changeUnits("kg") },
        { text: t("settings.unitsLb"), onPress: () => changeUnits("lb") },
        { text: t("settings.cancel"), style: "cancel" }
      ]
    );
  };

  const handleLanguage = () => {
    Alert.alert(
      t("settings.languageTitle"),
      t("settings.languageMessage"),
      [
        { text: t("settings.langEs"), onPress: () => changeLanguage("es") },
        { text: t("settings.langEn"), onPress: () => changeLanguage("en") },
        { text: t("settings.cancel"), style: "cancel" }
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      t("settings.logoutTitle"),
      t("settings.logoutMessage"),
      [
        { text: t("settings.cancel"), style: "cancel" },
        { text: t("settings.logout"), style: "destructive", onPress: logout }
      ]
    );
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <HapticButton onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="white" />
        </HapticButton>
        <Text style={styles.title}>{t("settings.title")}</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* PLAN */}
        <Text style={styles.section}>{t("settings.plan")}</Text>
        <View style={styles.card}>
          <SettingsItem
            icon="diamond"
            label={t("settings.myPlan")}
            value={plan?.name ?? t("settings.freePlan")}
            valueColor={planColor}
          />
          <View style={styles.divider} />
          <SettingsItem
            icon="sparkles"
            label={t("settings.viewPlans")}
            showArrow
            onPress={() => router.push("/settings/plans")}
          />
        </View>

        {/* PREFERENCIAS */}
        <Text style={styles.section}>{t("settings.preferences")}</Text>
        <View style={styles.card}>
          <SettingsItem
            icon="moon"
            label={t("settings.theme")}
            value={t("settings.dark")}
          />
          <View style={styles.divider} />
          <SettingsItem
            icon="barbell"
            label={t("settings.units")}
            value={units}
            onPress={handleUnits}
            showArrow
          />
          <View style={styles.divider} />
          <SettingsItem
            icon="language"
            label={t("settings.language")}
            value={language === "es" ? t("settings.langEs") : t("settings.langEn")}
            onPress={handleLanguage}
            showArrow
          />
          <View style={styles.divider} />
          <SettingsItem
            icon="shield-checkmark"
            label={t("permissions.title")}
            showArrow
            onPress={() => router.push("/settings/permissions")}
          />
        </View>

        {/* ENTRENAMIENTO */}
        <Text style={styles.section}>{t("settings.workout")}</Text>
        <View style={styles.card}>
          <SettingsSwitchItem
            icon="notifications"
            label={t("settings.reminders")}
            value={notifications}
            onChange={setNotifications}
          />
          <View style={styles.divider} />
          <SettingsItem
            icon="volume-high"
            label={t("settings.workoutSounds")}
          />
        </View>

        {/* ACERCA DE */}
        <Text style={styles.section}>{t("settings.about")}</Text>
        <View style={styles.card}>
          <SettingsItem
            icon="information-circle"
            label={t("settings.aboutLiftyHub")}
            showArrow
            onPress={() => router.push("/settings/about")}
          />
          <View style={styles.divider} />
          <SettingsItem
            icon="document-text"
            label={t("settings.privacy")}
            showArrow
            onPress={() => router.push("/settings/privacy")}
          />
          <View style={styles.divider} />
          <SettingsItem
            icon="code"
            label={t("settings.version")}
            value="1.0.0"
            onPress={handleVersionTap}
          />
        </View>

        {/* CUENTA */}
        <Text style={styles.section}>{t("settings.account")}</Text>
        <View style={styles.card}>
          <SettingsItem
            icon="log-out"
            label={t("settings.logout")}
            danger
            onPress={handleLogout}
          />
          <View style={styles.divider} />
          <SettingsItem
            icon="trash"
            label={t("settings.deleteAccount")}
            danger
            onPress={handleDeleteAccount}
          />
        </View>

      </ScrollView>

      {/* MODAL ELIMINAR CUENTA */}
      <Modal visible={showDeleteModal} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); resetDeleteModal(); }}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
              <View style={styles.modalContent}>

                <Text style={styles.modalTitle}>{t("settings.deleteTitle")}</Text>

                {!deletePasswordVerified ? (
                  <>
                    <Text style={styles.modalSubtitle}>
                      {t("settings.deleteVerifySubtitle")}
                    </Text>

                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.modalInput}
                        placeholder={t("settings.deletePasswordPlaceholder")}
                        placeholderTextColor={colors.textSecondary}
                        secureTextEntry={!showDeletePassword}
                        value={deletePassword}
                        onChangeText={setDeletePassword}
                      />
                      <HapticButton onPress={() => setShowDeletePassword(!showDeletePassword)}>
                        <Ionicons
                          name={showDeletePassword ? "eye-off" : "eye"}
                          size={20}
                          color={colors.textSecondary}
                        />
                      </HapticButton>
                    </View>

                    <HapticButton
                      style={[styles.modalButton, (!deletePassword || verifyingDelete) && styles.disabled]}
                      onPress={handleVerifyDeletePassword}
                      disabled={!deletePassword || verifyingDelete}
                    >
                      {verifyingDelete
                        ? <ActivityIndicator color="white" />
                        : <Text style={styles.modalButtonText}>{t("settings.deleteVerifyBtn")}</Text>
                      }
                    </HapticButton>
                  </>
                ) : (
                  <>
                    <Text style={styles.modalSubtitle}>
                      {t("settings.deleteConfirmSubtitle")}
                    </Text>

                    <HapticButton
                      style={[styles.modalButtonDanger, deletingAccount && styles.disabled]}
                      onPress={handleConfirmDelete}
                      disabled={deletingAccount}
                    >
                      {deletingAccount
                        ? <ActivityIndicator color="white" />
                        : <Text style={styles.modalButtonText}>{t("settings.deleteBtn")}</Text>
                      }
                    </HapticButton>
                  </>
                )}

                <HapticButton style={styles.modalCancel} onPress={resetDeleteModal}>
                  <Text style={styles.modalCancelText}>{t("settings.cancel")}</Text>
                </HapticButton>

              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {Toast}

      {/* MODAL DEV — plan override */}
      <Modal visible={showDevModal} transparent animationType="fade">
        <HapticButton style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowDevModal(false)}>
          <HapticButton activeOpacity={1} style={styles.modalContent} onPress={() => {}}>
            <Text style={styles.modalTitle}>🛠 Dev — Cambiar plan</Text>
            <Text style={styles.modalSubtitle}>
              Plan activo: <Text style={{ color: "white", fontWeight: "700" }}>{devActivePlan ?? plan?.name ?? "Free"}</Text>
            </Text>
            {DEV_PLANS.map((p) => (
              <HapticButton
                key={p.name}
                style={[
                  styles.modalButtonDanger,
                  { backgroundColor: colors.primary },
                  devActivePlan === p.name && { opacity: 0.5 },
                  { marginBottom: 8 },
                ]}
                onPress={() => handleSetDevPlan(p)}
                disabled={devActivePlan === p.name}
              >
                <Text style={styles.modalButtonText}>{p.name}</Text>
              </HapticButton>
            ))}
            {devActivePlan && (
              <HapticButton style={[styles.modalCancel, { marginTop: 4 }]} onPress={handleClearDevPlan}>
                <Text style={styles.modalCancelText}>Usar plan real del servidor</Text>
              </HapticButton>
            )}
          </HapticButton>
        </HapticButton>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.background
  },

  content: {
    padding: 20,
    paddingBottom: 80
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

  section: {
    color: colors.textSecondary,
    marginTop: 20,
    marginBottom: 10,
    fontSize: 14
  },

  card: {
    backgroundColor: colors.card,
    borderRadius: spacing.borderRadius,
    paddingVertical: 6
  },

  divider: {
    height: 1,
    backgroundColor: "#2A2A2A",
    marginHorizontal: 16
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center"
  },

  modalContent: {
    backgroundColor: "#1C1C1E",
    borderRadius: 16,
    padding: 24,
    width: "88%"
  },

  modalTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6
  },

  modalSubtitle: {
    color: "#A1A1A1",
    fontSize: 13,
    marginBottom: 16
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2C2C2E",
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
    height: 50
  },

  modalInput: {
    flex: 1,
    color: "white",
    fontSize: 15
  },

  modalButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4
  },

  modalButtonDanger: {
    backgroundColor: "#EF4444",
    borderRadius: 12,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4
  },

  modalButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 15
  },

  modalCancel: {
    alignItems: "center",
    marginTop: 14
  },

  modalCancelText: {
    color: "#A1A1A1",
    fontSize: 14
  },

  disabled: {
    opacity: 0.6
  },

});
