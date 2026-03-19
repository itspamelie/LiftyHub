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
import { colors, spacing } from "@/src/styles/globalstyles";
import { getUserProperties, updateUser, updateUserProperties, checkPassword } from "@/src/services/api";

const SOMATOTYPE_MAP: Record<string, number> = {
  "Ectomorfo": 1,
  "Mesomorfo": 2,
  "Endomorfo": 3,
};

export default function EditProfileScreen() {

  const [name, setName]           = useState("");
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

      const props = await getUserProperties(user.id, storedToken);
      if (props?.data) {
        const d = props.data;
        setPropertiesId(d.id);
        setHeight(d.stature ? String(d.stature) : "");
        setWeight(d.weight  ? String(d.weight)  : "");
        setGoal(d.objective ?? "Ganar músculo");
        setSomatotype(d.somatotype?.type ?? "Mesomorfo");
      }
    } catch (e) {
      console.log("Error cargando datos:", e);
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
        Alert.alert("Error", "La contraseña actual es incorrecta");
      }
    } catch {
      Alert.alert("Error", "No se pudo verificar la contraseña");
    } finally {
      setVerifying(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      Alert.alert("Error", "La nueva contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }
    if (!userId || !token) return;
    setChangingPassword(true);
    try {
      await updateUser(userId, { password: newPassword } as any, token);
      Alert.alert("Listo", "Contraseña actualizada correctamente");
      resetPasswordModal();
    } catch {
      Alert.alert("Error", "No se pudo cambiar la contraseña");
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

      Alert.alert("Listo", "Perfil actualizado correctamente", [
        { text: "OK", onPress: () => router.back() }
      ]);
    } catch (e) {
      console.log("Error guardando:", e);
      Alert.alert("Error", "No se pudo actualizar el perfil");
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

      {/* BOTÓN BACK */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={20} color="white" />
      </TouchableOpacity>

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
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.changePhoto}>
            <Ionicons name="camera" size={16} color="white" />
            <Text style={styles.changePhotoText}>Cambiar foto</Text>
          </TouchableOpacity>
        </View>

        {/* DATOS PERSONALES */}
        <Text style={styles.section}>Datos personales</Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons name="person-outline" size={20} color={colors.text} />
              <Text style={styles.label}>Nombre</Text>
            </View>
            <TextInput
              value={name}
              onChangeText={setName}
              style={styles.input}
              placeholder="Nombre"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </View>

        {/* INFORMACIÓN FÍSICA */}
        <Text style={styles.section}>Información física</Text>

        {/* ALTURA */}
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons name="resize-outline" size={20} color={colors.text} />
              <Text style={styles.label}>Altura (cm)</Text>
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
              <Ionicons name="barbell-outline" size={20} color={colors.text} />
              <Text style={styles.label}>Peso (kg)</Text>
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
              <Ionicons name="body-outline" size={20} color={colors.text} />
              <Text style={styles.label}>Somatotipo</Text>
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
              <Ionicons name="flag-outline" size={20} color={colors.text} />
              <Text style={styles.label}>Objetivo</Text>
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
          <Ionicons name="lock-closed-outline" size={18} color={colors.primary} />
          <Text style={styles.passwordButtonText}>Cambiar contraseña</Text>
        </TouchableOpacity>

        {/* BOTÓN GUARDAR */}
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.disabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving
            ? <ActivityIndicator color="white" />
            : <Text style={styles.saveText}>Guardar cambios</Text>
          }
        </TouchableOpacity>

      </ScrollView>

      {/* MODAL CONTRASEÑA */}
      <Modal visible={showPasswordModal} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); resetPasswordModal(); }}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.modalContent}>

            <Text style={styles.modalTitle}>Cambiar contraseña</Text>

            {!passwordVerified ? (
              <>
                <Text style={styles.modalSubtitle}>Primero verifica tu contraseña actual</Text>

                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Contraseña actual"
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
                    : <Text style={styles.modalButtonText}>Verificar</Text>
                  }
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.modalSubtitle}>Ingresa tu nueva contraseña</Text>

                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Nueva contraseña"
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
                    placeholder="Confirmar contraseña"
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
                    : <Text style={styles.modalButtonText}>Guardar contraseña</Text>
                  }
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity style={styles.modalCancel} onPress={resetPasswordModal}>
              <Text style={styles.modalCancelText}>Cancelar</Text>
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

  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20
  },

  avatarSection: {
    alignItems: "center",
    marginTop: 80,
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
