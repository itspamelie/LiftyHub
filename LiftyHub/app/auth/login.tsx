import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";

import { useRouter } from "expo-router";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function Login() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {

    if (!email || !password) {
      alert("Completa todos los campos");
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

        <Text style={styles.title}>LiftyHub</Text>

        <Text style={styles.subtitle}>
          Bienvenido de nuevo
        </Text>

        <View style={styles.card}>

          <Text style={styles.cardTitle}>Iniciar sesión</Text>

          {/* EMAIL */}

          <TextInput
            placeholder="Correo electrónico"
            placeholderTextColor="#A1A1A1"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus
          />

          {/* PASSWORD */}

          <View style={styles.passwordContainer}>

            <TextInput
              placeholder="Contraseña"
              placeholderTextColor="#A1A1A1"
              secureTextEntry={!showPassword}
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color="#A1A1A1"
              />
            </TouchableOpacity>

          </View>

          {/* BOTÓN LOGIN */}

          <TouchableOpacity
            style={[
              styles.loginButton,
              (!email || !password) && styles.loginDisabled
            ]}
            onPress={handleLogin}
            disabled={!email || !password}
          >

            <Text style={styles.loginText}>
              Entrar
            </Text>

          </TouchableOpacity>

          {/* REGISTER */}

          <TouchableOpacity
            onPress={() => router.push("./register")}
          >
            <Text style={styles.register}>
              Crear cuenta
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
    backgroundColor: "#000",
    justifyContent: "center",
    padding: 20
  },

  title: {
    color: "white",
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center"
  },

  subtitle: {
    color: "#A1A1A1",
    textAlign: "center",
    marginBottom: 30,
    marginTop: 5
  },

  card: {
    backgroundColor: "#1C1C1E",
    borderRadius: 16,
    padding: 20
  },

  cardTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20
  },

  input: {
    backgroundColor: "#2C2C2E",
    color: "white",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2C2C2E",
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 12
  },

  passwordInput: {
    flex: 1,
    color: "white",
    paddingVertical: 14
  },

  loginButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 20,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10
  },

  loginDisabled: {
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
    marginTop: 16
  }

});