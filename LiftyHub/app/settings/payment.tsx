import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { colors } from "@/src/styles/globalstyles";

export default function PaymentScreen() {

  const { title, price } = useLocalSearchParams<{ title: string; price: string }>();

  const handlePay = () => {
    Alert.alert("Pago", "Esta función estará disponible próximamente.");
  };

  return (
    <View style={styles.container}>

      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pago</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* RESUMEN DEL PLAN */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Plan seleccionado</Text>
          <Text style={styles.summaryPlan}>{title}</Text>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryTotal}>Total</Text>
            <Text style={styles.summaryPrice}>{price}</Text>
          </View>
        </View>

        {/* FORMULARIO */}
        <Text style={styles.section}>Datos de pago</Text>

        <View style={styles.card}>

          <Text style={styles.label}>Nombre en la tarjeta</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. Juan Pérez"
            placeholderTextColor="#666"
          />

          <Text style={styles.label}>Número de tarjeta</Text>
          <View style={styles.inputRow}>
            <Ionicons name="card-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, styles.inputFlex]}
              placeholder="0000 0000 0000 0000"
              placeholderTextColor="#666"
              keyboardType="numeric"
              maxLength={19}
            />
          </View>

          <View style={styles.row}>
            <View style={styles.half}>
              <Text style={styles.label}>Vencimiento</Text>
              <TextInput
                style={styles.input}
                placeholder="MM/AA"
                placeholderTextColor="#666"
                keyboardType="numeric"
                maxLength={5}
              />
            </View>
            <View style={styles.half}>
              <Text style={styles.label}>CVV</Text>
              <TextInput
                style={styles.input}
                placeholder="•••"
                placeholderTextColor="#666"
                keyboardType="numeric"
                maxLength={3}
                secureTextEntry
              />
            </View>
          </View>

        </View>

        {/* SEGURIDAD */}
        <View style={styles.secureRow}>
          <Ionicons name="lock-closed-outline" size={14} color="#666" />
          <Text style={styles.secureText}>Pago seguro con encriptación SSL</Text>
        </View>

        {/* BOTON */}
        <TouchableOpacity style={styles.payButton} onPress={handlePay}>
          <Text style={styles.payButtonText}>Pagar {price}</Text>
        </TouchableOpacity>

      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#0F0F10"
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: "#0F0F10",
    gap: 14
  },

  backBtn: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center"
  },

  headerTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "700"
  },

  content: {
    padding: 20,
    paddingBottom: 60
  },

  summaryCard: {
    backgroundColor: "#1C1C1E",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#3B82F6",
    marginBottom: 24
  },

  summaryLabel: {
    color: "#A1A1A1",
    fontSize: 13,
    marginBottom: 4
  },

  summaryPlan: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 14
  },

  divider: {
    height: 1,
    backgroundColor: "#2A2A2A",
    marginBottom: 14
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

  summaryTotal: {
    color: "#A1A1A1",
    fontSize: 15
  },

  summaryPrice: {
    color: "#3B82F6",
    fontSize: 18,
    fontWeight: "700"
  },

  section: {
    color: "#A1A1A1",
    fontSize: 14,
    marginBottom: 10
  },

  card: {
    backgroundColor: "#1C1C1E",
    borderRadius: 16,
    padding: 20,
    gap: 4
  },

  label: {
    color: "#A1A1A1",
    fontSize: 13,
    marginTop: 12,
    marginBottom: 6
  },

  input: {
    backgroundColor: "#2A2A2A",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "white",
    fontSize: 15
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
    borderRadius: 10,
    paddingHorizontal: 14
  },

  inputIcon: {
    marginRight: 8
  },

  inputFlex: {
    flex: 1,
    backgroundColor: "transparent",
    paddingHorizontal: 0
  },

  row: {
    flexDirection: "row",
    gap: 12
  },

  half: {
    flex: 1
  },

  secureRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 16,
    marginBottom: 24
  },

  secureText: {
    color: "#666",
    fontSize: 13
  },

  payButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center"
  },

  payButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700"
  }

});
