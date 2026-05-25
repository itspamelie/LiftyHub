import { View, Text, StyleSheet, TouchableWithoutFeedback, TextInput, Image, ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Keyboard, Platform, Modal, RefreshControl } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { Stack, router } from "expo-router";
import * as Storage from "@/src/utils/storage";
import * as ImagePicker from "expo-image-picker";
import { colors, spacing, planColors } from "@/src/styles/globalstyles";
import { getUserProperties, updateUser, updateUserProperties, updateUserPhoto, checkPassword } from "@/src/services/api";
import { useLanguage } from "@/src/context/LanguageContext";
import { useSubscription } from "@/src/context/SubscriptionContext";
import HapticButton from "@/src/components/buttons/HapticButton";

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
  const [userImg, setUserImg]      = useState<string | null>(null);
  const [localPhoto, setLocalPhoto] = useState<string | null>(null);

  const [saving, setSaving]       = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [tempHeight, setTempHeight] = useState(170);
  const [tempWeight, setTempWeight] = useState(70);
  const [showHeightPicker, setShowHeightPicker] = useState(false);
  const [showWeightPicker, setShowWeightPicker] = useState(false);

  const HEIGHT_VALUES = Array.from({ length: 151 }, (_, i) => i + 100);
  const WEIGHT_VALUES = Array.from({ length: 221 }, (_, i) => i + 30);

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
      const storedToken = await Storage.getItem("token");
      const storedUser  = await Storage.getItem("user");

      if (!storedToken || !storedUser) return;

      const user = JSON.parse(storedUser);
      setToken(storedToken);
      setUserId(user.id);
      setName(user.name ?? "");
      setEmail(user.email ?? "");
      setUserImg(user.img ?? null);

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
      Alert.alert(t("editProfile.errorTitle"), t("editProfile.errorLoad"));
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

  const handlePickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(t("editProfile.errorTitle"), t("permissions.gallery"));
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setLocalPhoto(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!userId || !token) return;

    setSaving(true);
    try {
      // Subir foto si se seleccionó una nueva
      if (localPhoto) {
        const res = await updateUserPhoto(userId, localPhoto, token);
        if (res?.data?.img) {
          const storedUser = await Storage.getItem("user");
          if (storedUser) {
            const user = JSON.parse(storedUser);
            await Storage.setItem("user", JSON.stringify({ ...user, img: res.data.img }));
          }
          setUserImg(res.data.img);
          setLocalPhoto(null);
        }
      }

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

      // Actualizar nombre en Storage
      const storedUser2 = await Storage.getItem("user");
      if (storedUser2) {
        const user = JSON.parse(storedUser2);
        await Storage.setItem("user", JSON.stringify({ ...user, name }));
      }

      Alert.alert(t("editProfile.successTitle"), t("editProfile.successSave"), [
        { text: "OK", onPress: () => router.back() }
      ]);
    } catch (e) {
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
        <HapticButton style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="white" />
        </HapticButton>
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
            source={
              localPhoto
                ? { uri: localPhoto }
                : userImg && userImg !== "default.jpg"
                ? { uri: `${process.env.EXPO_PUBLIC_API_URL?.replace("/api", "")}/users/${userImg}` }
                : require("@/src/assets/defaultd.png")
            }
            style={[styles.avatar, { borderColor: planColor }]}
          />
          <HapticButton style={styles.changePhoto} onPress={handlePickPhoto}>
            <Ionicons name="camera" size={16} color="white" />
            <Text style={styles.changePhotoText}>{t("editProfile.changePhoto")}</Text>
          </HapticButton>
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
        <HapticButton
          style={styles.card}
          onPress={() => { setTempHeight(height ? parseInt(height) : 170); setShowHeightPicker(true); }}
        >
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons name="resize" size={20} color={colors.text} />
              <Text style={styles.label}>{t("editProfile.height")}</Text>
            </View>
            <View style={styles.valueRow}>
              <Text style={[styles.input, { color: height ? colors.text : colors.textSecondary }]}>
                {height ? `${height} cm` : "—"}
              </Text>
              <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
            </View>
          </View>
        </HapticButton>

        {/* PESO */}
        <HapticButton
          style={styles.card}
          onPress={() => { setTempWeight(weight ? parseInt(weight) : 70); setShowWeightPicker(true); }}
        >
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons name="barbell" size={20} color={colors.text} />
              <Text style={styles.label}>{t("editProfile.weight")}</Text>
            </View>
            <View style={styles.valueRow}>
              <Text style={[styles.input, { color: weight ? colors.text : colors.textSecondary }]}>
                {weight ? `${weight} kg` : "—"}
              </Text>
              <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
            </View>
          </View>
        </HapticButton>

        {/* SOMATOTIPO */}
        <View style={styles.card}>
          <View style={styles.rowColumn}>
            <View style={styles.rowLeft}>
              <Ionicons name="body" size={20} color={colors.text} />
              <Text style={styles.label}>{t("editProfile.somatotype")}</Text>
            </View>
            <View style={styles.selectorContainer}>
              {([
                { value: "Ectomorfo", label: t("editProfile.ectomorph") },
                { value: "Mesomorfo", label: t("editProfile.mesomorph") },
                { value: "Endomorfo", label: t("editProfile.endomorph") },
              ] as const).map(({ value, label }) => (
                <HapticButton
                  key={value}
                  style={[styles.selectorButton, somatotype === value && styles.selectorButtonActive]}
                  onPress={() => setSomatotype(value)}
                >
                  <Text style={[styles.selectorText, somatotype === value && styles.selectorTextActive]}>
                    {label}
                  </Text>
                </HapticButton>
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
              {([
                { value: "Perder grasa",            label: t("editProfile.goalLoseFat") },
                { value: "Ganar músculo",           label: t("editProfile.goalBuildMuscle") },
                { value: "Recomposición corporal",  label: t("editProfile.goalRecomposition") },
                { value: "Mejorar resistencia",     label: t("editProfile.goalEndurance") },
                { value: "Mejorar fuerza",          label: t("editProfile.goalStrength") },
              ] as const).map(({ value, label }) => (
                <HapticButton
                  key={value}
                  style={[styles.selectorButton, goal === value && styles.selectorButtonActive]}
                  onPress={() => setGoal(value)}
                >
                  <Text style={[styles.selectorText, goal === value && styles.selectorTextActive]}>
                    {label}
                  </Text>
                </HapticButton>
              ))}
            </View>
          </View>
        </View>

        {/* BOTÓN CAMBIAR CONTRASEÑA */}
        <HapticButton
          style={styles.passwordButton}
          onPress={() => setShowPasswordModal(true)}
        >
          <Ionicons name="lock-closed" size={18} color={colors.primary} />
          <Text style={styles.passwordButtonText}>{t("editProfile.changePassword")}</Text>
        </HapticButton>

        {/* BOTÓN GUARDAR */}
        <HapticButton
          style={[styles.saveButton, saving && styles.disabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving
            ? <ActivityIndicator color="white" />
            : <Text style={styles.saveText}>{t("editProfile.saveChanges")}</Text>
          }
        </HapticButton>

      </ScrollView>

      {/* MODAL ALTURA */}
      <Modal visible={showHeightPicker} transparent animationType="fade">
        <HapticButton style={styles.pickerOverlay} activeOpacity={1} onPress={() => setShowHeightPicker(false)}>
          <HapticButton activeOpacity={1} onPress={() => {}} style={styles.pickerContent}>
            <View style={styles.pickerHeader}>
              <HapticButton onPress={() => setShowHeightPicker(false)}>
                <Ionicons name="close" size={22} color={colors.textSecondary} />
              </HapticButton>
            </View>
            <Picker
              selectedValue={tempHeight}
              onValueChange={(val) => setTempHeight(val)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              {HEIGHT_VALUES.map((h) => (
                <Picker.Item key={h} label={`${h} cm`} value={h} />
              ))}
            </Picker>
            <HapticButton
              style={styles.confirmButton}
              onPress={() => { setHeight(tempHeight.toString()); setShowHeightPicker(false); }}
            >
              <Text style={styles.confirmText}>{t("onboarding.birthdateConfirm")}</Text>
            </HapticButton>
          </HapticButton>
        </HapticButton>
      </Modal>

      {/* MODAL PESO */}
      <Modal visible={showWeightPicker} transparent animationType="fade">
        <HapticButton style={styles.pickerOverlay} activeOpacity={1} onPress={() => setShowWeightPicker(false)}>
          <HapticButton activeOpacity={1} onPress={() => {}} style={styles.pickerContent}>
            <View style={styles.pickerHeader}>
              <HapticButton onPress={() => setShowWeightPicker(false)}>
                <Ionicons name="close" size={22} color={colors.textSecondary} />
              </HapticButton>
            </View>
            <Picker
              selectedValue={tempWeight}
              onValueChange={(val) => setTempWeight(val)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              {WEIGHT_VALUES.map((w) => (
                <Picker.Item key={w} label={`${w} kg`} value={w} />
              ))}
            </Picker>
            <HapticButton
              style={styles.confirmButton}
              onPress={() => { setWeight(tempWeight.toString()); setShowWeightPicker(false); }}
            >
              <Text style={styles.confirmText}>{t("onboarding.birthdateConfirm")}</Text>
            </HapticButton>
          </HapticButton>
        </HapticButton>
      </Modal>

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
                  <HapticButton onPress={() => setShowCurrent(!showCurrent)}>
                    <Ionicons name={showCurrent ? "eye-off" : "eye"} size={20} color={colors.textSecondary} />
                  </HapticButton>
                </View>

                <HapticButton
                  style={[styles.modalButton, (!currentPassword || verifying) && styles.disabled]}
                  onPress={handleVerifyPassword}
                  disabled={!currentPassword || verifying}
                >
                  {verifying
                    ? <ActivityIndicator color="white" />
                    : <Text style={styles.modalButtonText}>{t("editProfile.modal.verify")}</Text>
                  }
                </HapticButton>
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
                  <HapticButton onPress={() => setShowNew(!showNew)}>
                    <Ionicons name={showNew ? "eye-off" : "eye"} size={20} color={colors.textSecondary} />
                  </HapticButton>
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
                  <HapticButton onPress={() => setShowConfirm(!showConfirm)}>
                    <Ionicons name={showConfirm ? "eye-off" : "eye"} size={20} color={colors.textSecondary} />
                  </HapticButton>
                </View>

                <HapticButton
                  style={[styles.modalButton, (!newPassword || !confirmPassword || changingPassword) && styles.disabled]}
                  onPress={handleChangePassword}
                  disabled={!newPassword || !confirmPassword || changingPassword}
                >
                  {changingPassword
                    ? <ActivityIndicator color="white" />
                    : <Text style={styles.modalButtonText}>{t("editProfile.modal.savePassword")}</Text>
                  }
                </HapticButton>
              </>
            )}

            <HapticButton style={styles.modalCancel} onPress={resetPasswordModal}>
              <Text style={styles.modalCancelText}>{t("editProfile.modal.cancel")}</Text>
            </HapticButton>

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
  },

  valueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  pickerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },

  pickerContent: {
    backgroundColor: "#1C1C1E",
    borderRadius: 20,
    padding: 20,
    width: "85%",
    alignItems: "center",
  },

  pickerHeader: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 4,
  },

  picker: {
    width: "100%",
    color: "white",
  },

  pickerItem: {
    color: "white",
    fontSize: 18,
  },

  confirmButton: {
    marginTop: 10,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 20,
  },

  confirmText: {
    color: "white",
    fontWeight: "600",
    fontSize: 15,
  },

});
