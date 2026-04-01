import { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Linking, Modal, TextInput, ActivityIndicator, TouchableWithoutFeedback, Keyboard, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import * as ImagePicker from "expo-image-picker";
import SettingsItem from "@/src/components/settings/SettingsItem";
import SettingsSwitchItem from "@/src/components/settings/SettingsSwitchItem";
import { deleteAccount, checkPassword } from "@/src/services/api";
import { useLanguage } from "@/src/context/LanguageContext";
import { colors } from "@/src/styles/globalstyles";

export default function Settings() {

  const { t, language, changeLanguage } = useLanguage();
  const [notifications, setNotifications] = useState(false);
  const [units, setUnits] = useState("kg");

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
        Alert.alert("Error", "La contraseña es incorrecta");
      }
    } catch {
      Alert.alert("Error", "No se pudo verificar la contraseña");
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
      router.replace("/auth/login");
    } catch {
      Alert.alert("Error", t("settings.errorDelete"));
    } finally {
      setDeletingAccount(false);
    }
  };

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

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      router.replace("/auth/login");
    } catch (error) {
      console.log("Error al cerrar sesión:", error);
    }
  };

  const saveUnits = async (value: string) => {
    try {
      setUnits(value);
      await AsyncStorage.setItem("@liftyhub_units", value);
    } catch (error) {
      console.log("Error saving units", error);
    }
  };

  const handleUnits = () => {
    Alert.alert(
      t("settings.unitsTitle"),
      t("settings.unitsMessage"),
      [
        { text: t("settings.unitsKg"), onPress: () => saveUnits("kg") },
        { text: t("settings.unitsLb"), onPress: () => saveUnits("lb") },
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

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const savedUnits = await AsyncStorage.getItem("@liftyhub_units");
        if (savedUnits !== null) setUnits(savedUnits);
      } catch (error) {
        console.log("Error loading preferences", error);
      }
    };
    loadPreferences();
  }, []);

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="white" />
        </TouchableOpacity>
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
            icon="diamond-outline"
            label={t("settings.myPlan")}
            value={t("settings.freePlan")}
          />
          <View style={styles.divider} />
          <SettingsItem
            icon="sparkles-outline"
            label={t("settings.viewPlans")}
            showArrow
            onPress={() => router.push("/settings/plans")}
          />
        </View>

        {/* PREFERENCIAS */}
        <Text style={styles.section}>{t("settings.preferences")}</Text>
        <View style={styles.card}>
          <SettingsItem
            icon="moon-outline"
            label={t("settings.theme")}
            value={t("settings.dark")}
          />
          <View style={styles.divider} />
          <SettingsItem
            icon="barbell-outline"
            label={t("settings.units")}
            value={units}
            onPress={handleUnits}
            showArrow
          />
          <View style={styles.divider} />
          <SettingsItem
            icon="language-outline"
            label={t("settings.language")}
            value={language === "es" ? t("settings.langEs") : t("settings.langEn")}
            onPress={handleLanguage}
            showArrow
          />
        </View>

        {/* ENTRENAMIENTO */}
        <Text style={styles.section}>{t("settings.workout")}</Text>
        <View style={styles.card}>
          <SettingsSwitchItem
            icon="notifications-outline"
            label={t("settings.reminders")}
            value={notifications}
            onChange={setNotifications}
          />
          <View style={styles.divider} />
          <SettingsItem
            icon="volume-high-outline"
            label={t("settings.workoutSounds")}
          />
        </View>

        {/* PERMISOS */}
        <Text style={styles.section}>{t("permissions.title")}</Text>
        <View style={styles.card}>
          <SettingsItem
            icon="notifications-outline"
            label={t("permissions.notifications")}
            value={t(`permissions.${notifPerm}`)}
            onPress={() => Linking.openSettings()}
            showArrow
          />
          <View style={styles.divider} />
          <SettingsItem
            icon="images-outline"
            label={t("permissions.gallery")}
            value={t(`permissions.${galleryPerm}`)}
            onPress={() => Linking.openSettings()}
            showArrow
          />
          <View style={styles.divider} />
          <SettingsItem
            icon="camera-outline"
            label={t("permissions.camera")}
            value={t(`permissions.${cameraPerm}`)}
            onPress={() => Linking.openSettings()}
            showArrow
          />
        </View>

        {/* ACERCA DE */}
        <Text style={styles.section}>{t("settings.about")}</Text>
        <View style={styles.card}>
          <SettingsItem
            icon="information-circle-outline"
            label={t("settings.aboutLiftyHub")}
            showArrow
            onPress={() => router.push("/settings/about")}
          />
          <View style={styles.divider} />
          <SettingsItem
            icon="document-text-outline"
            label={t("settings.privacy")}
            showArrow
            onPress={() => router.push("/settings/privacy")}
          />
          <View style={styles.divider} />
          <SettingsItem
            icon="code-outline"
            label={t("settings.version")}
            value="1.0.0"
          />
        </View>

        {/* CUENTA */}
        <Text style={styles.section}>{t("settings.account")}</Text>
        <View style={styles.card}>
          <SettingsItem
            icon="log-out-outline"
            label={t("settings.logout")}
            danger
            onPress={handleLogout}
          />
          <View style={styles.divider} />
          <SettingsItem
            icon="trash-outline"
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
                      Verifica tu contraseña para continuar
                    </Text>

                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.modalInput}
                        placeholder="Contraseña actual"
                        placeholderTextColor={colors.textSecondary}
                        secureTextEntry={!showDeletePassword}
                        value={deletePassword}
                        onChangeText={setDeletePassword}
                      />
                      <TouchableOpacity onPress={() => setShowDeletePassword(!showDeletePassword)}>
                        <Ionicons
                          name={showDeletePassword ? "eye-off" : "eye"}
                          size={20}
                          color={colors.textSecondary}
                        />
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      style={[styles.modalButton, (!deletePassword || verifyingDelete) && styles.disabled]}
                      onPress={handleVerifyDeletePassword}
                      disabled={!deletePassword || verifyingDelete}
                    >
                      {verifyingDelete
                        ? <ActivityIndicator color="white" />
                        : <Text style={styles.modalButtonText}>Verificar</Text>
                      }
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <Text style={styles.modalSubtitle}>
                      Esta acción es permanente y no se puede deshacer.
                    </Text>

                    <TouchableOpacity
                      style={[styles.modalButtonDanger, deletingAccount && styles.disabled]}
                      onPress={handleConfirmDelete}
                      disabled={deletingAccount}
                    >
                      {deletingAccount
                        ? <ActivityIndicator color="white" />
                        : <Text style={styles.modalButtonText}>{t("settings.deleteBtn")}</Text>
                      }
                    </TouchableOpacity>
                  </>
                )}

                <TouchableOpacity style={styles.modalCancel} onPress={resetDeleteModal}>
                  <Text style={styles.modalCancelText}>{t("settings.cancel")}</Text>
                </TouchableOpacity>

              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#0F0F10"
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
    paddingBottom: 10,
    gap: 12,
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
    color: "#A1A1A1",
    marginTop: 20,
    marginBottom: 10,
    fontSize: 14
  },

  card: {
    backgroundColor: "#1C1C1E",
    borderRadius: 16,
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
