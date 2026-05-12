import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform, Alert, Modal, ActivityIndicator, Image } from "react-native";
import { useRouter, Stack } from "expo-router";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Storage from "@/src/utils/storage";
import { loginRequest, googleLoginRequest, forgotPassword, verifyResetCode, resetPassword } from "@/src/services/api";
import { useLanguage } from "@/src/context/LanguageContext";
import { useSubscription } from "@/src/context/SubscriptionContext";
import { colors } from "@/src/styles/globalstyles";
import HapticButton from "@/src/components/buttons/HapticButton";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

WebBrowser.maybeCompleteAuthSession();

export default function Login() {

  const router = useRouter();
  const { t } = useLanguage();
  const { refresh } = useSubscription();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState<1 | 2 | 3>(1);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotCode, setForgotCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === "success") {
      const idToken = response.authentication?.idToken;
      if (idToken) handleGoogleLogin(idToken);
    }
  }, [response]);

  const handleGoogleLogin = async (idToken: string) => {
    setGoogleLoading(true);
    try {
      const data = await googleLoginRequest(idToken);
      if (data?.token) {
        if (data.user?.role !== "user") {
          setError(t("login.errorNotAllowed"));
          return;
        }
        await Storage.setItem("token", data.token);
        await Storage.setItem("user", JSON.stringify(data.user));
        await refresh();
        router.replace("/(tabs)/profile");
      } else {
        setError(t("login.errorInvalid"));
      }
    } catch {
      setError(t("login.errorInvalid"));
    } finally {
      setGoogleLoading(false);
    }
  };

  useEffect(() => {
    const checkLogin = async () => {
      const token = await Storage.getItem("token");
      if (token) {
        router.replace("/(tabs)/profile");
      }
    };
    checkLogin();
  }, []);

  const closeForgotModal = () => {
    setShowForgotModal(false);
    setForgotStep(1);
    setForgotEmail("");
    setForgotCode("");
    setNewPassword("");
    setConfirmPassword("");
    setForgotError("");
  };

  const handleSendCode = async () => {
    if (!forgotEmail) return;
    setForgotLoading(true);
    setForgotError("");
    try {
      await forgotPassword(forgotEmail);
      setForgotStep(2);
    } catch {
      setForgotError("No se pudo enviar el correo. Intenta de nuevo.");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!forgotCode) return;
    setForgotLoading(true);
    setForgotError("");
    try {
      const res = await verifyResetCode(forgotEmail, forgotCode);
      if (res?.status === "ok") {
        setForgotStep(3);
      } else {
        setForgotError("Código incorrecto o expirado.");
      }
    } catch {
      setForgotError("Código incorrecto o expirado.");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) return;
    if (newPassword !== confirmPassword) {
      setForgotError("Las contraseñas no coinciden.");
      return;
    }
    if (newPassword.length < 6) {
      setForgotError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    setForgotLoading(true);
    setForgotError("");
    try {
      const res = await resetPassword(forgotEmail, forgotCode, newPassword);
      if (res?.status === "ok") {
        closeForgotModal();
        Alert.alert("¡Listo!", "Tu contraseña fue actualizada. Ya puedes iniciar sesión.");
      } else {
        setForgotError("No se pudo actualizar la contraseña.");
      }
    } catch {
      setForgotError("No se pudo actualizar la contraseña.");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const data = await loginRequest(email, password);

      if (data.token) {
        if (data.user?.role !== "user") {
          setError(t("login.errorNotAllowed"));
          return;
        }
        await Storage.setItem("token", data.token);
        await Storage.setItem("user", JSON.stringify(data.user));
        await refresh();
        router.replace("/(tabs)/profile");
      } else {
        setError(t("login.errorInvalid"));
      }
    } catch (e) {
      setError(t("login.errorInvalid"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>

          <Stack.Screen options={{ headerShown: false }} />

          <View style={styles.header}>
            <View style={styles.logoWrapper}>
              <Image source={require("@/assets/images/logo.jpg")} style={styles.logo} resizeMode="cover" />
            </View>
            <Text style={styles.title}>LiftyHub</Text>
            <Text style={styles.subtitle}>{t("login.subtitle")}</Text>
          </View>

          <View style={styles.card}>

            <Text style={styles.cardTitle}>{t("login.title")}</Text>

            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color={colors.textSecondary} />
              <TextInput
                placeholder={t("login.email")}
                placeholderTextColor={colors.textSecondary}
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} />
              <TextInput
                placeholder={t("login.password")}
                placeholderTextColor={colors.textSecondary}
                secureTextEntry
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
              />
            </View>

            <HapticButton style={styles.forgotBtn} onPress={() => setShowForgotModal(true)}>
              <Text style={styles.forgotText}>{t("login.forgotPassword")}</Text>
            </HapticButton>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <HapticButton style={[styles.loginButton, loading && { opacity: 0.7 }]} onPress={handleLogin} disabled={loading}>
              <Text style={styles.loginText}>{loading ? t("login.loading") : t("login.button")}</Text>
            </HapticButton>

            <HapticButton onPress={() => router.push("/auth/register" as any)}>
              <Text style={styles.register}>
                {t("login.noAccount")} <Text style={styles.registerHighlight}>{t("login.createAccount")}</Text>
              </Text>
            </HapticButton>

            {/* SEPARATOR */}
            <View style={styles.separator}>
              <View style={styles.separatorLine} />
              <Text style={styles.separatorText}>{t("login.orContinueWith")}</Text>
              <View style={styles.separatorLine} />
            </View>

            {/* GOOGLE BUTTON */}
            <HapticButton
              style={[styles.googleBtn, (googleLoading || !request) && { opacity: 0.6 }]}
              onPress={() => promptAsync()}
              disabled={googleLoading || !request}
            >
              <View style={styles.googleIconCircle}>
                <Text style={styles.googleIconText}>G</Text>
              </View>
              <Text style={styles.googleBtnText}>
                {googleLoading ? t("login.loading") : t("login.googleButton")}
              </Text>
            </HapticButton>

          </View>

        </View>
      </TouchableWithoutFeedback>

      {/* MODAL OLVIDÉ CONTRASEÑA */}
      <Modal visible={showForgotModal} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>

              {/* Indicador de pasos */}
              <View style={{ flexDirection: "row", gap: 6, marginBottom: 20 }}>
                {[1, 2, 3].map(s => (
                  <View key={s} style={{ flex: 1, height: 3, borderRadius: 2, backgroundColor: forgotStep >= s ? colors.primary : "#2C2C2E" }} />
                ))}
              </View>

              {/* PASO 1 — Email */}
              {forgotStep === 1 && (
                <>
                  <View style={styles.modalIconCircle}>
                    <Ionicons name="mail-outline" size={28} color={colors.primary} />
                  </View>
                  <Text style={styles.modalTitle}>¿Olvidaste tu contraseña?</Text>
                  <Text style={styles.modalSubtitle}>Ingresa tu correo y te enviaremos un código de verificación.</Text>
                  <View style={styles.modalInput}>
                    <Ionicons name="mail-outline" size={18} color={colors.textSecondary} />
                    <TextInput
                      style={styles.modalInputText}
                      placeholder="correo@ejemplo.com"
                      placeholderTextColor={colors.textSecondary}
                      value={forgotEmail}
                      onChangeText={setForgotEmail}
                      autoCapitalize="none"
                      keyboardType="email-address"
                    />
                  </View>
                  {forgotError ? <Text style={styles.modalError}>{forgotError}</Text> : null}
                  <HapticButton style={[styles.modalBtn, (!forgotEmail || forgotLoading) && { opacity: 0.6 }]} onPress={handleSendCode} disabled={!forgotEmail || forgotLoading}>
                    {forgotLoading ? <ActivityIndicator color="white" /> : <Text style={styles.modalBtnText}>Enviar código</Text>}
                  </HapticButton>
                  <HapticButton onPress={closeForgotModal}>
                    <Text style={styles.modalCancelText}>Cancelar</Text>
                  </HapticButton>
                </>
              )}

              {/* PASO 2 — Código */}
              {forgotStep === 2 && (
                <>
                  <View style={styles.modalIconCircle}>
                    <Ionicons name="keypad-outline" size={28} color={colors.primary} />
                  </View>
                  <Text style={styles.modalTitle}>Ingresa el código</Text>
                  <Text style={styles.modalSubtitle}>Revisá tu correo <Text style={{ color: "white" }}>{forgotEmail}</Text>. El código expira en 15 minutos.</Text>
                  <TextInput
                    style={styles.modalCodeInput}
                    placeholder="000000"
                    placeholderTextColor={colors.textSecondary}
                    value={forgotCode}
                    onChangeText={setForgotCode}
                    keyboardType="number-pad"
                    maxLength={6}
                    textAlign="center"
                  />
                  {forgotError ? <Text style={styles.modalError}>{forgotError}</Text> : null}
                  <HapticButton style={[styles.modalBtn, (!forgotCode || forgotLoading) && { opacity: 0.6 }]} onPress={handleVerifyCode} disabled={!forgotCode || forgotLoading}>
                    {forgotLoading ? <ActivityIndicator color="white" /> : <Text style={styles.modalBtnText}>Verificar código</Text>}
                  </HapticButton>
                  <HapticButton onPress={() => setForgotStep(1)}>
                    <Text style={styles.modalCancelText}>← Volver</Text>
                  </HapticButton>
                </>
              )}

              {/* PASO 3 — Nueva contraseña */}
              {forgotStep === 3 && (
                <>
                  <View style={styles.modalIconCircle}>
                    <Ionicons name="lock-closed-outline" size={28} color={colors.primary} />
                  </View>
                  <Text style={styles.modalTitle}>Nueva contraseña</Text>
                  <Text style={styles.modalSubtitle}>Elige una contraseña segura de al menos 6 caracteres.</Text>
                  <View style={styles.modalInput}>
                    <Ionicons name="lock-closed-outline" size={18} color={colors.textSecondary} />
                    <TextInput
                      style={styles.modalInputText}
                      placeholder="Nueva contraseña"
                      placeholderTextColor={colors.textSecondary}
                      value={newPassword}
                      onChangeText={setNewPassword}
                      secureTextEntry={!showNewPassword}
                      autoCapitalize="none"
                    />
                    <HapticButton onPress={() => setShowNewPassword(p => !p)}>
                      <Ionicons name={showNewPassword ? "eye-off" : "eye"} size={18} color={colors.textSecondary} />
                    </HapticButton>
                  </View>
                  <View style={styles.modalInput}>
                    <Ionicons name="lock-closed-outline" size={18} color={colors.textSecondary} />
                    <TextInput
                      style={styles.modalInputText}
                      placeholder="Repetir contraseña"
                      placeholderTextColor={colors.textSecondary}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={!showConfirmPassword}
                      autoCapitalize="none"
                    />
                    <HapticButton onPress={() => setShowConfirmPassword(p => !p)}>
                      <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={18} color={colors.textSecondary} />
                    </HapticButton>
                  </View>
                  {forgotError ? <Text style={styles.modalError}>{forgotError}</Text> : null}
                  <HapticButton style={[styles.modalBtn, (!newPassword || !confirmPassword || forgotLoading) && { opacity: 0.6 }]} onPress={handleResetPassword} disabled={!newPassword || !confirmPassword || forgotLoading}>
                    {forgotLoading ? <ActivityIndicator color="white" /> : <Text style={styles.modalBtnText}>Cambiar contraseña</Text>}
                  </HapticButton>
                </>
              )}

            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    padding: 24
  },

  header: {
    alignItems: "center",
    marginBottom: 40
  },

  logoWrapper: {
    width: 100,
    height: 100,
    borderRadius: 20,
    overflow: "hidden",
  },
  logo: {
    width: "100%",
    height: "100%",
  },
  title: {
    color: "#ffffff",
    fontSize: 34,
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 2,
  },

  subtitle: {
    color: colors.textSecondary,
    marginTop: 4
  },

  card: {
    backgroundColor: "#1C1C1E",
    borderRadius: 20,
    padding: 24
  },

  cardTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 20
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2C2C2E",
    borderRadius: 14,
    paddingHorizontal: 12,
    marginBottom: 14
  },

  input: {
    flex: 1,
    color: "white",
    padding: 14,
    marginLeft: 6
  },

  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: 30,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10
  },

  loginText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600"
  },

  register: {
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 18
  },

  registerHighlight: {
    color: colors.primary,
    fontWeight: "600"
  },

  forgotBtn: {
    alignSelf: "flex-end",
    marginBottom: 4,
  },

  forgotText: {
    color: colors.primary,
    fontSize: 13,
  },

  errorText: {
    color: colors.danger,
    fontSize: 13,
    marginBottom: 10,
    textAlign: "center"
  },

  separator: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 16,
    gap: 10,
  },

  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#3A3A3E",
  },

  separatorText: {
    color: colors.textSecondary,
    fontSize: 12,
  },

  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: "#2C2C2E",
    borderRadius: 14,
    height: 50,
    borderWidth: 1,
    borderColor: "#3A3A3E",
  },

  googleIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },

  googleIconText: {
    color: "#4285F4",
    fontSize: 14,
    fontWeight: "800",
  },

  googleBtnText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  modalCard: {
    backgroundColor: "#1C1C1E",
    borderRadius: 20,
    padding: 28,
    width: "100%",
    alignItems: "center",
  },

  modalIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(59,130,246,0.12)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  modalTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },

  modalSubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 20,
  },

  modalInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2C2C2E",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
    width: "100%",
    marginBottom: 16,
    gap: 8,
  },

  modalInputText: {
    flex: 1,
    color: "white",
    fontSize: 15,
  },

  modalBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    height: 48,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  modalBtnText: {
    color: "white",
    fontSize: 15,
    fontWeight: "700",
  },

  modalCancelText: {
    color: colors.textSecondary,
    fontSize: 14,
  },

  modalError: {
    color: "#EF4444",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 10,
  },

  modalCodeInput: {
    backgroundColor: "#2C2C2E",
    borderRadius: 12,
    height: 64,
    width: "100%",
    color: "white",
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: 12,
    marginBottom: 16,
    textAlign: "center",
  },

});
