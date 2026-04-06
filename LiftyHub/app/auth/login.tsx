import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform, Alert } from "react-native";
import { useRouter, Stack } from "expo-router";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginRequest } from "@/src/services/api";
import { useLanguage } from "@/src/context/LanguageContext";
import { useSubscription } from "@/src/context/SubscriptionContext";

export default function Login() {

  const router = useRouter();
  const { t } = useLanguage();
  const { refresh } = useSubscription();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        router.replace("/(tabs)" as any);
      }
    };
    checkLogin();
  }, []);

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
        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
        await refresh();
        router.replace("/(tabs)" as any);
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
            <Ionicons name="barbell" size={60} color="#3B82F6" />
            <Text style={styles.title}>LiftyHub</Text>
            <Text style={styles.subtitle}>{t("login.subtitle")}</Text>
          </View>

          <View style={styles.card}>

            <Text style={styles.cardTitle}>{t("login.title")}</Text>

            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#A1A1A1" />
              <TextInput
                placeholder={t("login.email")}
                placeholderTextColor="#A1A1A1"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#A1A1A1" />
              <TextInput
                placeholder={t("login.password")}
                placeholderTextColor="#A1A1A1"
                secureTextEntry
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
              />
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity style={[styles.loginButton, loading && { opacity: 0.7 }]} onPress={handleLogin} disabled={loading}>
              <Text style={styles.loginText}>{loading ? t("login.loading") : t("login.button")}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/auth/register" as any)}>
              <Text style={styles.register}>
                {t("login.noAccount")} <Text style={styles.registerHighlight}>{t("login.createAccount")}</Text>
              </Text>
            </TouchableOpacity>

            {/* SEPARATOR */}
            <View style={styles.separator}>
              <View style={styles.separatorLine} />
              <Text style={styles.separatorText}>{t("login.orContinueWith")}</Text>
              <View style={styles.separatorLine} />
            </View>

            {/* GOOGLE BUTTON */}
            <TouchableOpacity
              style={styles.googleBtn}
              onPress={() => Alert.alert(t("login.googleSoon"), t("login.googleSoonMsg"))}
            >
              <View style={styles.googleIconCircle}>
                <Text style={styles.googleIconText}>G</Text>
              </View>
              <Text style={styles.googleBtnText}>{t("login.googleButton")}</Text>
            </TouchableOpacity>

          </View>

        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#0F0F10",
    justifyContent: "center",
    padding: 24
  },

  header: {
    alignItems: "center",
    marginBottom: 40
  },

  title: {
    color: "white",
    fontSize: 34,
    fontWeight: "700",
    marginTop: 10
  },

  subtitle: {
    color: "#A1A1A1",
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
    backgroundColor: "#3B82F6",
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
    color: "#A1A1A1",
    textAlign: "center",
    marginTop: 18
  },

  registerHighlight: {
    color: "#3B82F6",
    fontWeight: "600"
  },

  errorText: {
    color: "#EF4444",
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
    color: "#A1A1A1",
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

});
