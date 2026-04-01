import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useRouter, Stack } from "expo-router";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors, spacing } from "@/src/styles/globalstyles";
import { registerRequest, createUserProperties } from "@/src/services/api";

type PermissionStatus = "idle" | "granted" | "denied";

export default function Permissions() {
  const router = useRouter();

  const [notifStatus, setNotifStatus] = useState<PermissionStatus>("idle");
  const [galleryStatus, setGalleryStatus] = useState<PermissionStatus>("idle");
  const [cameraStatus, setCameraStatus] = useState<PermissionStatus>("idle");
  const [loading, setLoading] = useState(false);

  const requestNotifications = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    setNotifStatus(status === "granted" ? "granted" : "denied");
  };

  const requestGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    setGalleryStatus(status === "granted" ? "granted" : "denied");
  };

  const requestCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    setCameraStatus(status === "granted" ? "granted" : "denied");
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      const registerDataRaw = await AsyncStorage.getItem("@register_data");
      const objective = await AsyncStorage.getItem("@register_objective");
      const propertiesRaw = await AsyncStorage.getItem("@register_properties");

      console.log("[permissions] keys →", {
        hasRegisterData: !!registerDataRaw,
        hasObjective: !!objective,
        hasProperties: !!propertiesRaw,
        registerData: registerDataRaw,
        properties: propertiesRaw,
        objective,
      });

      if (!registerDataRaw || !objective || !propertiesRaw) {
        Alert.alert("Error", "Datos incompletos, vuelve a intentarlo");
        setLoading(false);
        return;
      }

      const { name, email, password, gender, birthdate } = JSON.parse(registerDataRaw);
      const { height, weight, waist, somatotype_id } = JSON.parse(propertiesRaw);

      console.log("[permissions] registerData:", { name, email, gender, birthdate });
      console.log("[permissions] properties:", { height, weight, somatotype_id, objective });

      const data = await registerRequest({ name, email, password, gender, birthdate });
      console.log("[permissions] registerRequest response:", JSON.stringify(data));

      if (data?.token) {
        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("user", JSON.stringify(data.user));

        const propsResult = await createUserProperties(
          {
            user_id: data.user.id,
            stature: height,
            weight,
            waist,
            objective,
            somatotype_id,
          },
          data.token
        );
        console.log("[permissions] createUserProperties response:", JSON.stringify(propsResult));

        await AsyncStorage.removeItem("@register_data");
        await AsyncStorage.removeItem("@register_objective");
        await AsyncStorage.removeItem("@register_properties");

        router.replace("/(tabs)" as any);
      } else {
        const mensaje = data?.errors?.email?.[0] ?? data?.message ?? "No se pudo crear la cuenta";
        Alert.alert("Error", mensaje, [
          { text: "OK", onPress: () => router.replace("/auth/register" as any) }
        ]);
      }
    } catch (error) {
      console.log("Error en registro:", error);
      Alert.alert("Error", "Ocurrió un problema, intenta de nuevo");
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (status: PermissionStatus, granted: string, idle: string) => {
    if (status === "granted") return granted;
    if (status === "denied") return "close-circle-outline";
    return idle;
  };

  const getIconColor = (status: PermissionStatus) => {
    if (status === "granted") return colors.primary;
    if (status === "denied") return "#EF4444";
    return colors.textSecondary;
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* HEADER */}
      <View style={styles.header}>
        <Ionicons name="shield-checkmark-outline" size={50} color={colors.primary} />
        <Text style={styles.title}>Permisos</Text>
        <Text style={styles.subtitle}>
          Necesitamos tu autorización para algunas funciones de la app
        </Text>
      </View>

      {/* PERMISOS */}
      <View style={styles.card}>

        {/* NOTIFICACIONES */}
        <TouchableOpacity
          style={styles.permissionRow}
          onPress={requestNotifications}
          disabled={notifStatus !== "idle"}
        >
          <View style={styles.permissionIcon}>
            <Ionicons name="notifications-outline" size={24} color={colors.primary} />
          </View>
          <View style={styles.permissionInfo}>
            <Text style={styles.permissionTitle}>Notificaciones</Text>
            <Text style={styles.permissionDesc}>
              Recordatorios de entrenamiento y actualizaciones
            </Text>
          </View>
          <Ionicons
            name={getIcon(notifStatus, "checkmark-circle", "chevron-forward-outline") as any}
            size={22}
            color={getIconColor(notifStatus)}
          />
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* GALERÍA */}
        <TouchableOpacity
          style={styles.permissionRow}
          onPress={requestGallery}
          disabled={galleryStatus !== "idle"}
        >
          <View style={styles.permissionIcon}>
            <Ionicons name="images-outline" size={24} color={colors.primary} />
          </View>
          <View style={styles.permissionInfo}>
            <Text style={styles.permissionTitle}>Galería</Text>
            <Text style={styles.permissionDesc}>
              Para subir tu foto de perfil y progreso
            </Text>
          </View>
          <Ionicons
            name={getIcon(galleryStatus, "checkmark-circle", "chevron-forward-outline") as any}
            size={22}
            color={getIconColor(galleryStatus)}
          />
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* CÁMARA */}
        <TouchableOpacity
          style={styles.permissionRow}
          onPress={requestCamera}
          disabled={cameraStatus !== "idle"}
        >
          <View style={styles.permissionIcon}>
            <Ionicons name="camera-outline" size={24} color={colors.primary} />
          </View>
          <View style={styles.permissionInfo}>
            <Text style={styles.permissionTitle}>Cámara</Text>
            <Text style={styles.permissionDesc}>
              Para tomar fotos de perfil y de progreso
            </Text>
          </View>
          <Ionicons
            name={getIcon(cameraStatus, "checkmark-circle", "chevron-forward-outline") as any}
            size={22}
            color={getIconColor(cameraStatus)}
          />
        </TouchableOpacity>

      </View>

      <Text style={styles.hint}>
        Puedes cambiar estos permisos en cualquier momento desde la configuración de tu dispositivo.
      </Text>

      {/* BOTÓN FINALIZAR */}
      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleFinish}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Creando cuenta..." : "Empezar"}
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.screenPadding,
    justifyContent: "center",
  },

  header: {
    alignItems: "center",
    marginBottom: 36,
  },

  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "700",
    marginTop: 12,
  },

  subtitle: {
    color: colors.textSecondary,
    marginTop: 6,
    textAlign: "center",
    lineHeight: 20,
  },

  card: {
    backgroundColor: colors.card,
    borderRadius: spacing.borderRadius,
    paddingVertical: 6,
    marginBottom: 16,
  },

  permissionRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 14,
  },

  permissionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#1E3A8A22",
    justifyContent: "center",
    alignItems: "center",
  },

  permissionInfo: {
    flex: 1,
  },

  permissionTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
  },

  permissionDesc: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },

  divider: {
    height: 1,
    backgroundColor: "#2A2A2A",
    marginHorizontal: 16,
  },

  hint: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: "center",
    marginBottom: 28,
    lineHeight: 18,
  },

  button: {
    backgroundColor: colors.primary,
    borderRadius: 30,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

});
