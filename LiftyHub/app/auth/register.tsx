import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ScrollView
} from "react-native";

import { useRouter, Stack } from "expo-router";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import BackButton from "@/src/components/buttons/backButton";
import { colors, spacing } from "@/src/styles/globalstyles";

export default function Register() {

  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleRegister = () => {

    if (!name || !email || !password || !confirmPassword) {
      alert("Completa todos los campos");
      return;
    }

    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    router.replace("/onboarding/objectives");
  };

  return (

    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >

        <Stack.Screen options={{ headerShown: false }} />

        {/* 🔙 BOTÓN BACK (COMPONENTE REUTILIZABLE) */}
        <BackButton />

        <ScrollView contentContainerStyle={styles.content}>

          {/* 🔥 HEADER CON LOGO (MEJORADO) */}
          <View style={styles.header}>
            <Ionicons name="barbell" size={50} color={colors.primary} />
            <Text style={styles.title}>LiftyHub</Text>
            <Text style={styles.subtitle}>Crea tu cuenta</Text>
          </View>

          {/* 🧾 CARD */}
          <View style={styles.card}>

            <Text style={styles.cardTitle}>Registrarse</Text>

            {/* Nombre */}
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color={colors.textSecondary} />
              <TextInput
                placeholder="Nombre"
                placeholderTextColor={colors.textSecondary}
                style={styles.input}
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* Email */}
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color={colors.textSecondary} />
              <TextInput
                placeholder="Correo electrónico"
                placeholderTextColor={colors.textSecondary}
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password */}
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} />
              <TextInput
                placeholder="Contraseña"
                placeholderTextColor={colors.textSecondary}
                secureTextEntry={!showPassword}
                style={styles.input}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            {/* Confirm Password */}
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} />
              <TextInput
                placeholder="Confirmar contraseña"
                placeholderTextColor={colors.textSecondary}
                secureTextEntry={!showConfirm}
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                <Ionicons
                  name={showConfirm ? "eye-off" : "eye"}
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            {/* BOTÓN */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                (!name || !email || !password || !confirmPassword) && styles.disabled
              ]}
              onPress={handleRegister}
              disabled={!name || !email || !password || !confirmPassword}
            >
              <Text style={styles.loginText}>Crear cuenta</Text>
            </TouchableOpacity>

            {/* LOGIN */}
            <TouchableOpacity onPress={() => router.push("/auth/login" as any)}>
              <Text style={styles.register}>
                ¿Ya tienes cuenta?{" "}
                <Text style={styles.registerHighlight}>Inicia sesión</Text>
              </Text>
            </TouchableOpacity>

          </View>

        </ScrollView>

      </KeyboardAvoidingView>

    </TouchableWithoutFeedback>

  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.background
  },

  content: {
    padding: spacing.screenPadding,
    paddingTop: 100,
    justifyContent: "center",
  },

  header: {
    alignItems: "center",
    marginBottom: 30
  },

  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: "700",
    marginTop: 8
  },

  subtitle: {
    color: colors.textSecondary,
    marginTop: 4
  },

  card: {
    backgroundColor: colors.card,
    borderRadius: spacing.borderRadius,
    padding: 20
  },

  cardTitle: {
    color: colors.text,
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
    color: colors.text,
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

  disabled: {
    opacity: 0.5
  },

  loginText: {
    color: colors.text,
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
  }

});