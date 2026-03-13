import { View, Text, StyleSheet, TouchableOpacity, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

export default function Settings() {

  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(false);

  return (

    <View style={styles.container}>

      <Text style={styles.title}>Configuración</Text>

      {/* PREFERENCIAS */}

      <Text style={styles.section}>Preferencias</Text>

      <View style={styles.card}>

        <View style={styles.row}>

          <View style={styles.rowLeft}>
            <Ionicons name="moon-outline" size={20} color="white" />
            <Text style={styles.itemText}>Tema oscuro</Text>
          </View>

          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: "#767577", true: "#3B82F6" }}
          />

        </View>

        <TouchableOpacity style={styles.row}>

          <View style={styles.rowLeft}>
            <Ionicons name="barbell-outline" size={20} color="white" />
            <Text style={styles.itemText}>Unidades</Text>
          </View>

          <Text style={styles.value}>kg</Text>

        </TouchableOpacity>

      </View>

      {/* ENTRENAMIENTO */}

      <Text style={styles.section}>Entrenamiento</Text>

      <View style={styles.card}>

        <View style={styles.row}>

          <View style={styles.rowLeft}>
            <Ionicons name="notifications-outline" size={20} color="white" />
            <Text style={styles.itemText}>Recordatorios</Text>
          </View>

          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: "#767577", true: "#3B82F6" }}
          />

        </View>

        <TouchableOpacity style={styles.row}>

          <View style={styles.rowLeft}>
            <Ionicons name="volume-high-outline" size={20} color="white" />
            <Text style={styles.itemText}>Sonidos de entrenamiento</Text>
          </View>

        </TouchableOpacity>

      </View>

      {/* ACERCA DE */}

      <Text style={styles.section}>Acerca de</Text>

      <View style={styles.card}>

        <TouchableOpacity style={styles.row}>

          <View style={styles.rowLeft}>
            <Ionicons name="information-circle-outline" size={20} color="white" />
            <Text style={styles.itemText}>Sobre LiftyHub</Text>
          </View>

        </TouchableOpacity>

        <TouchableOpacity style={styles.row}>

          <View style={styles.rowLeft}>
            <Ionicons name="document-text-outline" size={20} color="white" />
            <Text style={styles.itemText}>Política de privacidad</Text>
          </View>

        </TouchableOpacity>

      </View>

      {/* CUENTA */}

      <Text style={styles.section}>Cuenta</Text>

      <View style={styles.card}>

        <TouchableOpacity style={styles.row}>

          <View style={styles.rowLeft}>
            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            <Text style={[styles.itemText, { color: "#EF4444" }]}>
              Cerrar sesión
            </Text>
          </View>

        </TouchableOpacity>

      </View>

    </View>

  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#0F0F10",
    padding: 20,
  },

  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "700",
    marginTop: 40
  },

  section: {
    color: "#A1A1A1",
    marginTop: 20,
    marginBottom: 10,
    fontSize: 14
  },

  card: {
    backgroundColor: "#1C1C1E",
    borderRadius: 16,
    paddingVertical: 6
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16
  },

  rowLeft: {
    flexDirection: "row",
    alignItems: "center"
  },

  itemText: {
    color: "white",
    fontSize: 16,
    marginLeft: 12
  },

  value: {
    color: "#A1A1A1"
  }

});