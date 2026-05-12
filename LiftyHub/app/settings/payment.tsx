import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack, router, useLocalSearchParams } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { colors } from "@/src/styles/globalstyles";
import { useLanguage } from "@/src/context/LanguageContext";
import HapticButton from "@/src/components/buttons/HapticButton";
import { createPayPalOrder, capturePayPalOrder } from "@/src/services/api";
import * as Storage from "@/src/utils/storage";
import { useState } from "react";

export default function PaymentScreen() {
  const { t } = useLanguage();
  const { title, price, accentColor: accentParam, planId } = useLocalSearchParams<{
    title: string;
    price: string;
    accentColor: string;
    planId: string;
  }>();

  const accentColor = accentParam ?? colors.primary;
  const [loading, setLoading] = useState(false);

  const handlePayPal = async () => {
    setLoading(true);
    try {
      const token = await Storage.getItem("token");
      const userStorage = await Storage.getItem("user");
      if (!token || !userStorage) {
        router.replace("/auth/login");
        return;
      }
      const user = JSON.parse(userStorage);

      const orderRes = await createPayPalOrder(
        { plan_id: Number(planId), user_id: user.id },
        token
      );

      if (!orderRes?.approval_url) {
        Alert.alert("Error", "No se pudo iniciar el pago. Intenta de nuevo.");
        return;
      }

      const result = await WebBrowser.openAuthSessionAsync(
        orderRes.approval_url,
        "liftyhub://"
      );

      if (result.type !== "success") {
        return;
      }

      // Extract order token from redirect URL (?token=ORDER_ID)
      const redirectUrl = result.url;
      const tokenMatch = redirectUrl.match(/[?&]token=([^&]+)/);
      const orderId = tokenMatch ? tokenMatch[1] : orderRes.order_id;

      const captureRes = await capturePayPalOrder(
        { order_id: orderId, plan_id: Number(planId), user_id: user.id },
        token
      );

      if (captureRes?.status === "ok") {
        Alert.alert(
          "¡Pago exitoso!",
          `Tu plan ${title} ha sido activado. ¡Disfruta LiftyHub!`,
          [{ text: "¡Genial!", onPress: () => router.replace("/(tabs)/profile" as any) }]
        );
      } else {
        Alert.alert("Error", "El pago no pudo ser procesado. Intenta de nuevo.");
      }
    } catch {
      Alert.alert("Error", "Ocurrió un problema. Revisa tu conexión e intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <HapticButton
          style={[styles.backBtn, { backgroundColor: accentColor }]}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={20} color="white" />
        </HapticButton>
        <Text style={styles.headerTitle}>{t("payment.title")}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* RESUMEN DEL PLAN */}
        <View style={[styles.summaryCard, { borderColor: accentColor }]}>
          <Text style={styles.summaryLabel}>{t("payment.selectedPlan")}</Text>
          <Text style={[styles.summaryPlan, { color: accentColor }]}>{title}</Text>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryTotal}>{t("payment.total")}</Text>
            <Text style={[styles.summaryPrice, { color: accentColor }]}>{price}</Text>
          </View>
        </View>

        {/* INFO PAYPAL */}
        <View style={styles.infoCard}>
          <Ionicons name="shield-checkmark-outline" size={20} color="#888" />
          <Text style={styles.infoText}>
            Serás redirigido a PayPal para completar tu pago de forma segura.
            No almacenamos datos de tu tarjeta.
          </Text>
        </View>

        {/* BOTON PAYPAL */}
        <HapticButton
          style={[styles.paypalBtn, loading && { opacity: 0.7 }]}
          onPress={handlePayPal}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Ionicons name="logo-paypal" size={22} color="white" />
          )}
          <Text style={styles.paypalBtnText}>
            {loading ? "Procesando..." : `Pagar con PayPal`}
          </Text>
        </HapticButton>

        <View style={styles.secureRow}>
          <Ionicons name="lock-closed-outline" size={13} color="#444" />
          <Text style={styles.secureText}>{t("payment.secure")}</Text>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0F10",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: "#0F0F10",
    gap: 14,
  },
  backBtn: {
    width: 45,
    height: 45,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
  },
  content: {
    padding: 20,
    paddingBottom: 60,
  },
  summaryCard: {
    backgroundColor: "#1C1C1E",
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    marginBottom: 20,
  },
  summaryLabel: {
    color: "#A1A1A1",
    fontSize: 13,
    marginBottom: 4,
  },
  summaryPlan: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 14,
  },
  divider: {
    height: 1,
    backgroundColor: "#2A2A2A",
    marginBottom: 14,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryTotal: {
    color: "#A1A1A1",
    fontSize: 15,
  },
  summaryPrice: {
    fontSize: 18,
    fontWeight: "700",
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "#1C1C1E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 28,
  },
  infoText: {
    flex: 1,
    color: "#888",
    fontSize: 13,
    lineHeight: 19,
  },
  paypalBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#003087",
    borderRadius: 14,
    paddingVertical: 16,
  },
  paypalBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  secureRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 16,
  },
  secureText: {
    color: "#444",
    fontSize: 12,
  },
});
