import { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import SettingsItem from "@/src/components/settings/SettingsItem";
import SettingsSwitchItem from "@/src/components/settings/SettingsSwitchItem";

export default function Settings() {

  const [notifications, setNotifications] = useState(false);
  const [units, setUnits] = useState("kg");

  const logout = async () => {
  try {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    console.log("Sesión cerrada correctamente");

    router.replace("/auth/login");
  } catch (error) {
    console.log("Error al cerrar sesión:", error);
  }
};


  const saveUnits = async (value: string) => {
    try {
      setUnits(value);
      await AsyncStorage.setItem("@liftyhub_units", value);
    } catch (error) {
      console.log("Error saving units", error);
    }
  };
  const handleUnits = () => {

    Alert.alert(
      "Unidades",
      "Selecciona el sistema de unidades",
      [
        {
          text: "Kilogramos (kg)",
          onPress: () => saveUnits("kg")
        },
        {
          text: "Libras (lb)",
          onPress: () => saveUnits("lb")
        },
        {
          text: "Cancelar",
          style: "cancel"
        }
      ]
    );

  };

  const handleLogout = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro de que deseas cerrar sesión?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Cerrar sesión",
          style: "destructive",
          onPress: logout
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Eliminar cuenta",
      "Esta acción es permanente. ¿Deseas continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => console.log("Eliminar cuenta")
        }
      ]
    );
  };

  useEffect(() => {

    const loadUnits = async () => {
      try {
        const savedUnits = await AsyncStorage.getItem("@liftyhub_units")

        if (savedUnits !== null) {
          setUnits(savedUnits);
        }

      } catch (error) {
        console.log("Error loading units", error);
      }
    };

    loadUnits();

  }, []);

  return (

    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >

      <Text style={styles.title}>Configuración</Text>

      {/* PLAN */}

      <Text style={styles.section}>Plan</Text>

      <View style={styles.card}>

        <SettingsItem
          icon="diamond-outline"
          label="Mi plan"
          value="Gratis"
        />

        <View style={styles.divider} />

        <SettingsItem
          icon="sparkles-outline"
          label="Ver planes"
          showArrow
          onPress={() => router.push("/settings/plans")}
        />

      </View>

      {/* PREFERENCIAS */}

      <Text style={styles.section}>Preferencias</Text>

      <View style={styles.card}>

        <SettingsItem
          icon="moon-outline"
          label="Tema"
          value="Oscuro"
        />

        <View style={styles.divider} />

        <SettingsItem
          icon="barbell-outline"
          label="Unidades"
          value={units}
          onPress={handleUnits}
        />

      </View>

      {/* ENTRENAMIENTO */}

      <Text style={styles.section}>Entrenamiento</Text>

      <View style={styles.card}>

        <SettingsSwitchItem
          icon="notifications-outline"
          label="Recordatorios"
          value={notifications}
          onChange={setNotifications}
        />

        <View style={styles.divider} />

        <SettingsItem
          icon="volume-high-outline"
          label="Sonidos de entrenamiento"
        />

      </View>

      {/* ACERCA DE */}

      <Text style={styles.section}>Acerca de</Text>

      <View style={styles.card}>

        <SettingsItem
          icon="information-circle-outline"
          label="Sobre LiftyHub"
          showArrow
          onPress={() => router.push("/settings/about")}
        />

        <View style={styles.divider} />

        <SettingsItem
          icon="document-text-outline"
          label="Política de privacidad"
          showArrow
          onPress={() => router.push("/settings/privacy")}
        />

        <View style={styles.divider} />

        <SettingsItem
          icon="code-outline"
          label="Versión"
          value="1.0.0"
        />

      </View>

      {/* CUENTA */}

      <Text style={styles.section}>Cuenta</Text>

      <View style={styles.card}>

        <SettingsItem
          icon="log-out-outline"
          label="Cerrar sesión"
          danger
          onPress={handleLogout}
        />
        <View style={styles.divider} />
        <SettingsItem
          icon="trash-outline"
          label="Eliminar cuenta"
          danger
          onPress={handleDeleteAccount}
        />

      </View>

    </ScrollView>

  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#0F0F10"
  },

  content: {
    padding: 20,
    paddingBottom: 80
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

  divider: {
    height: 1,
    backgroundColor: "#2A2A2A",
    marginHorizontal: 16
  },

});