import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { useRouter, Stack } from "expo-router";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function Login() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    router.replace("/(tabs)" as any);
  };

  return (
    <View style={styles.container}>

      {/* QUITA HEADER BLANCO */}
      <Stack.Screen options={{ headerShown: false }} />

      {/* Logo / Branding */}

      <View style={styles.header}>
        <Ionicons name="barbell" size={60} color="#3B82F6" />
        <Text style={styles.title}>LiftyHub</Text>
        <Text style={styles.subtitle}>Entrena. Progresa. Mejora.</Text>
      </View>

      {/* Card */}

      <View style={styles.card}>

        <Text style={styles.cardTitle}>Iniciar sesión</Text>

        {/* Email */}

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#A1A1A1" />
          <TextInput
            placeholder="Correo electrónico"
            placeholderTextColor="#A1A1A1"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Password */}

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#A1A1A1" />
          <TextInput
            placeholder="Contraseña"
            placeholderTextColor="#A1A1A1"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {/* Login Button */}

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText}>Entrar</Text>
        </TouchableOpacity>

        {/* Register */}

        <TouchableOpacity>
          <Text style={styles.register}>
            ¿No tienes cuenta? <Text style={styles.registerHighlight}>Crear cuenta</Text>
          </Text>
        </TouchableOpacity>

      </View>

    </View>
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
  }

});