import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  Modal,
  RefreshControl
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { Stack, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors, spacing, planColors } from "@/src/styles/globalstyles";
import { getUserProperties, updateUser, updateUserProperties, checkPassword } from "@/src/services/api";
import { useLanguage } from "@/src/context/LanguageContext";
import { useSubscription } from "@/src/context/SubscriptionContext";

const SOMATOTYPE_MAP: Record<string, number> = {
  "Ectomorfo": 1,
  "Mesomorfo": 2,
  "Endomorfo": 3,
};

export default function EditProfileScreen() {

  const { t } = useLanguage();
  const { plan } = useSubscription();
  const planColor = planColors[plan?.name ?? "Free"] ?? "#A1A1A1";

  const [name, setName]           = useState("");
  const [email, setEmail]         = useState("");
  const [height, setHeight]       = useState("");
  const [weight, setWeight]       = useState("");
  const [somatotype, setSomatotype] = useState("Mesomorfo");
  const [goal, setGoal]           = useState("Ganar músculo");

  const [userId, setUserId]           = useState<number | null>(null);
  const [propertiesId, setPropertiesId] = useState<number | null>(null);
  const [token, setToken]             = useState<string | null>(null);

  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Modal contraseña
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword]     = useState("");
  const [newPassword, setNewPassword]             = useState("");
  const [confirmPassword, setConfirmPassword]     = useState("");
  const [passwordVerified, setPasswordVerified]   = useState(false);
  const [verifying, setVerifying]                 = useState(false);
  const [changingPassword, setChangingPassword]   = useState(false);
  const [showCurrent, setShowCurrent]             = useState(false);
  const [showNew, setShowNew]                     = useState(false);
  const [showConfirm, setShowConfirm]             = useState(false);

  const loadData = async (isRefresh = false) => {
    try {
      const storedToken = await AsyncStorage.getItem("token");
      const storedUser  = await AsyncStorage.getItem("user");

      if (!storedToken || !storedUser) return;

      const user = JSON.parse(storedUser);
      setToken(storedToken);
      setUserId(user.id);
      setName(user.name ?? "");
      setEmail(user.email ?? "");

      const props = await getUserProperties(user.id, storedToken);
      if (props?.data) {
        const d = props.data;
        setPropertiesId(d.id);
        setHeight(d.stature ? String(d.stature) : "");
        setWeight(d.weight  ? String(d.weight)  : "");
        setGoal(d.objective ?? "Ganar músculo");
        setSomatotype(d.somatotype?.type ?? "Mesomorfo");
      }
    } catch {
      Alert.alert("Error", "No se pudieron cargar tus datos. Verifica tu conexión.");
    } finally {
      if (isRefresh) setRefreshing(false);
      else setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData(true);
  };

  const resetPasswordModal = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordVerified(false);
    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);
    setShowPasswordModal(false);
  };

  const handleVerifyPassword = async () => {
    if (!currentPassword || !token) return;
    setVerifying(true);
    try {
      const res = await checkPassword(currentPassword, token);
      if (res?.valid) {
        setPasswordVerified(true);
      } else {
        Alert.alert(t("editProfile.errorTitle"), t("editProfile.modal.errorWrongPassword"));
      }
    } catch {
      Alert.alert(t("editProfile.errorTitle"), t("editProfile.modal.errorVerify"));
    } finally {
      setVerifying(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      Alert.alert(t("editProfile.errorTitle"), t("editProfile.modal.errorPasswordLength"));
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert(t("editProfile.errorTitle"), t("editProfile.modal.errorPasswordMatch"));
      return;
    }
    if (!userId || !token) return;
    setChangingPassword(true);
    try {
      await updateUser(userId, { password: newPassword } as any, token);
      Alert.alert(t("editProfile.successTitle"), t("editProfile.modal.successPassword"));
      resetPasswordModal();
    } catch {
      Alert.alert(t("editProfile.errorTitle"), t("editProfile.modal.errorChange"));
    } finally {
      setChangingPassword(false);
    }
  };

  const handleSave = async () => {
    if (!userId || !token) return;

    setSaving(true);
    try {
      // Actualizar nombre en users
      await updateUser(userId, { name }, token);

      // Actualizar user properties si existen
      if (propertiesId) {
        await updateUserProperties(
          propertiesId,
          {
            user_id:      userId,
            stature:      height ? parseFloat(height) : undefined,
            weight:       weight ? parseFloat(weight) : undefined,
            objective:    goal,
            somatotype_id: SOMATOTYPE_MAP[somatotype],
          },
          token
        );
      }

      // Actualizar nombre en AsyncStorage
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        await AsyncStorage.setItem("user", JSON.stringify({ ...user, name }));
      }

      Alert.alert(t("editProfile.successTitle"), t("editProfile.successSave"), [
        { text: "OK", onPress: () => router.back() }
      ]);
    } catch (e) {
      console.log("Error guardando:", e);
      Alert.alert(t("editProfile.errorTitle"), t("editProfile.errorSave"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >

      <Stack.Screen options={{ headerShown: false }} />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("editProfile.title")}</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary} />
        }
      >

        {/* AVATAR */}
        <View style={styles.avatarSection}>
          <Image
            source={require("@/src/assets/defaultd.png")}
            style={[styles.avatar, { borderColor: planColor }]}
          />
          <TouchableOpacity style={styles.changePhoto}>
            <Ionicons name="camera" size={16} color="white" />
            <Text style={styles.changePhotoText}>{t("editProfile.changePhoto")}</Text>
          </TouchableOpacity>
        </View>

        {/* DATOS PERSONALES */}
        <Text style={styles.section}>{t("editProfile.personalData")}</Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons name="person" size={20} color={colors.text} />
              <Text style={styles.label}>{t("editProfile.name")}</Text>
            </View>
            <TextInput
              value={name}
              onChangeText={setName}
              style={styles.input}
              placeholder={t("editProfile.name")}
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons name="mail" size={20} color={colors.textSecondary} />
              <Text style={styles.label}>{t("editProfile.email")}</Text>
            </View>
            <Text style={styles.emailValue}>{email}</Text>
          </View>
        </View>

        {/* INFORMACIÓN FÍSICA */}
        <Text style={styles.section}>{t("editProfile.physicalInfo")}</Text>

        {/* ALTURA */}
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons name="resize" size={20} color={colors.text} />
              <Text style={styles.label}>{t("editProfile.height")}</Text>
            </View>
            <TextInput
              value={height}
              onChangeText={setHeight}
              style={styles.input}
              keyboardType="numeric"
              placeholder="cm"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </View>

        {/* PESO */}
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons name="barbell" size={20} color={colors.text} />
              <Text style={styles.label}>{t("editProfile.weight")}</Text>
            </View>
            <TextInput
              value={weight}
              onChangeText={setWeight}
              style={styles.input}
              keyboardType="numeric"
              placeholder="kg"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </View>

        {/* SOMATOTIPO */}
        <View style={styles.card}>
          <View style={styles.rowColumn}>
            <View style={styles.rowLeft}>
              <Ionicons name="body" size={20} color={colors.text} />
              <Text style={styles.label}>{t("editProfile.somatotype")}</Text>
            </View>
            <View style={styles.selectorContainer}>
              {["Ectomorfo", "Mesomorfo", "Endomorfo"].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[styles.selectorButton, somatotype === type && styles.selectorButtonActive]}
                  onPress={() => setSomatotype(type)}
                >
                  <Text style={[styles.selectorText, somatotype === type && styles.selectorTextActive]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* OBJETIVO */}
        <View style={styles.card}>
          <View style={styles.rowColumn}>
            <View style={styles.rowLeft}>
              <Ionicons name="flag" size={20} color={colors.text} />
              <Text style={styles.label}>{t("editProfile.goal")}</Text>
            </View>
            <View style={styles.selectorContainer}>
              {[
                "Perder grasa",
                "Ganar músculo",
                "Recomposición corporal",
                "Mejorar resistencia",
                "Mejorar fuerza"
              ].map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[styles.selectorButton, goal === item && styles.selectorButtonActive]}
                  onPress={() => setGoal(item)}
                >
                  <Text style={[styles.selectorText, goal === item && styles.selectorTextActive]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* BOTÓN CAMBIAR CONTRASEÑA */}
        <TouchableOpacity
          style={styles.passwordButton}
          onPress={() => setShowPasswordModal(true)}
        >
          <Ionicons name="lock-closed" size={18} color={colors.primary} />
          <Text style={styles.passwordButtonText}>{t("editProfile.changePassword")}</Text>
        </TouchableOpacity>

        {/* BOTÓN GUARDAR */}
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.disabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving
            ? <ActivityIndicator color="white" />
            : <Text style={styles.saveText}>{t("editProfile.saveChanges")}</Text>
          }
        </TouchableOpacity>

      </ScrollView>

      {/* MODAL CONTRASEÑA */}
      <Modal visible={showPasswordModal} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); resetPasswordModal(); }}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.modalContent}>

            <Text style={styles.modalTitle}>{t("editProfile.modal.title")}</Text>

            {!passwordVerified ? (
              <>
                <Text style={styles.modalSubtitle}>{t("editProfile.modal.verifySubtitle")}</Text>

                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.modalInput}
                    placeholder={t("editProfile.modal.currentPassword")}
                    placeholderTextColor={colors.textSecondary}
                    secureTextEntry={!showCurrent}
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                  />
                  <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)}>
                    <Ionicons name={showCurrent ? "eye-off" : "eye"} size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={[styles.modalButton, (!currentPassword || verifying) && styles.disabled]}
                  onPress={handleVerifyPassword}
                  disabled={!currentPassword || verifying}
                >
                  {verifying
                    ? <ActivityIndicator color="white" />
                    : <Text style={styles.modalButtonText}>{t("editProfile.modal.verify")}</Text>
                  }
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.modalSubtitle}>{t("editProfile.modal.newSubtitle")}</Text>

                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.modalInput}
                    placeholder={t("editProfile.modal.newPassword")}
                    placeholderTextColor={colors.textSecondary}
                    secureTextEntry={!showNew}
                    value={newPassword}
                    onChangeText={setNewPassword}
                  />
                  <TouchableOpacity onPress={() => setShowNew(!showNew)}>
                    <Ionicons name={showNew ? "eye-off" : "eye"} size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.modalInput}
                    placeholder={t("editProfile.modal.confirmPassword")}
                    placeholderTextColor={colors.textSecondary}
                    secureTextEntry={!showConfirm}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                  />
                  <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                    <Ionicons name={showConfirm ? "eye-off" : "eye"} size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={[styles.modalButton, (!newPassword || !confirmPassword || changingPassword) && styles.disabled]}
                  onPress={handleChangePassword}
                  disabled={!newPassword || !confirmPassword || changingPassword}
                >
                  {changingPassword
                    ? <ActivityIndicator color="white" />
                    : <Text style={styles.modalButtonText}>{t("editProfile.modal.savePassword")}</Text>
                  }
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity style={styles.modalCancel} onPress={resetPasswordModal}>
              <Text style={styles.modalCancelText}>{t("editProfile.modal.cancel")}</Text>
            </TouchableOpacity>

          </View>
          </TouchableWithoutFeedback>
        </View>
        </TouchableWithoutFeedback>
      </Modal>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.background
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center"
  },

  content: {
    padding: spacing.screenPadding,
    paddingBottom: 120
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

  headerTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "bold",
  },

  backButton: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  avatarSection: {
    alignItems: "center",
    marginTop: 24,
    marginBottom: 40
  },

  avatar: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 3,
    borderColor: colors.background,
    marginBottom: 12
  },

  changePhoto: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: spacing.borderRadius
  },

  changePhotoText: {
    color: "white",
    marginLeft: 6,
    fontWeight: "600",
    fontSize: 14
  },

  section: {
    color: colors.textSecondary,
    fontSize: 13,
    marginBottom: 8,
    marginTop: 20,
    fontWeight: "600",
    textTransform: "uppercase"
  },

  card: {
    backgroundColor: colors.card,
    borderRadius: spacing.borderRadius,
    marginBottom: 12
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18
  },

  rowColumn: {
    padding: 18
  },

  rowLeft: {
    flexDirection: "row",
    alignItems: "center"
  },

  label: {
    color: colors.text,
    fontSize: 16,
    marginLeft: 10
  },

  input: {
    color: colors.text,
    fontSize: 16,
    width: 120,
    textAlign: "right"
  },

  divider: {
    height: 1,
    backgroundColor: colors.background,
    marginHorizontal: 18,
  },

  emailValue: {
    color: colors.textSecondary,
    fontSize: 14,
    flexShrink: 1,
    textAlign: "right",
  },

  selectorContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 14
  },

  selectorButton: {
    backgroundColor: colors.background,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: spacing.borderRadius,
    marginRight: 10,
    marginBottom: 10
  },

  selectorButtonActive: {
    backgroundColor: colors.primary
  },

  selectorText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "600"
  },

  selectorTextActive: {
    color: "white",
    fontSize: 14,
    fontWeight: "600"
  },

  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: spacing.borderRadius,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 30
  },

  disabled: {
    opacity: 0.6
  },

  saveText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold"
  },

  passwordButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: spacing.borderRadius,
    paddingVertical: 14,
    marginTop: 16,
    gap: 8
  },

  passwordButtonText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "600"
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center"
  },

  modalContent: {
    backgroundColor: colors.card,
    borderRadius: spacing.borderRadius,
    padding: 24,
    width: "88%"
  },

  modalTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6
  },

  modalSubtitle: {
    color: colors.textSecondary,
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
    color: colors.text,
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
    color: colors.textSecondary,
    fontSize: 14
  }

});
