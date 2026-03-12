import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function Login() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>LiftyHub</Text>

      <View style={styles.card}>

        <Text style={styles.cardTitle}>Iniciar sesión</Text>

        <TextInput
          placeholder="Correo electrónico"
          placeholderTextColor="#A1A1A1"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          placeholder="Contraseña"
          placeholderTextColor="#A1A1A1"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.register}>Crear cuenta</Text>
        </TouchableOpacity>

      </View>

    </View>
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
    textAlign: "center",
    marginBottom: 30
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

  loginButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 20,
    height: 45,
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
    marginTop: 16
  }

});
