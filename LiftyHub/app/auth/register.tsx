import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform
} from "react-native";

import { useRouter } from "expo-router";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

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

    router.replace("/(tabs)");
  };

  return (

    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >

        {/* Header */}

        <View style={styles.header}>
          <Ionicons name="barbell" size={60} color="#3B82F6" />
          <Text style={styles.title}>LiftyHub</Text>
          <Text style={styles.subtitle}>Crea tu cuenta</Text>
        </View>

        {/* Card */}

        <View style={styles.card}>

          <Text style={styles.cardTitle}>Registrarse</Text>

          {/* Nombre */}

          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#A1A1A1" />

            <TextInput
              placeholder="Nombre"
              placeholderTextColor="#A1A1A1"
              style={styles.input}
              value={name}
              onChangeText={setName}
              autoFocus
            />

          </View>

          {/* Email */}

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#A1A1A1" />

            <TextInput
              placeholder="Correo electrónico"
              placeholderTextColor="#A1A1A1"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

          </View>

          {/* Password */}

          <View style={styles.inputContainer}>

            <Ionicons name="lock-closed-outline" size={20} color="#A1A1A1" />

            <TextInput
              placeholder="Contraseña"
              placeholderTextColor="#A1A1A1"
              secureTextEntry={!showPassword}
              style={styles.input}
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color="#A1A1A1"
              />
            </TouchableOpacity>

          </View>

          {/* Confirm Password */}

          <View style={styles.inputContainer}>

            <Ionicons name="lock-closed-outline" size={20} color="#A1A1A1" />

            <TextInput
              placeholder="Confirmar contraseña"
              placeholderTextColor="#A1A1A1"
              secureTextEntry={!showConfirm}
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
              <Ionicons
                name={showConfirm ? "eye-off" : "eye"}
                size={20}
                color="#A1A1A1"
              />
            </TouchableOpacity>

          </View>

          {/* Register Button */}

          <TouchableOpacity
            style={[
              styles.loginButton,
              (!name || !email || !password || !confirmPassword) && styles.disabled
            ]}
            onPress={handleRegister}
            disabled={!name || !email || !password || !confirmPassword}
          >

            <Text style={styles.loginText}>
              Crear cuenta
            </Text>

          </TouchableOpacity>

          {/* Back to Login */}

          <TouchableOpacity onPress={() => router.push("/(auth)/login" as any)}>
            <Text style={styles.register}>
              ¿Ya tienes cuenta? <Text style={styles.registerHighlight}>Inicia sesión</Text>
            </Text>
          </TouchableOpacity>

        </View>

      </KeyboardAvoidingView>

    </TouchableWithoutFeedback>

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

  disabled: {
    opacity: 0.5
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
  }

});