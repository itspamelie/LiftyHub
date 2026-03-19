import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
  KeyboardAvoidingView
} from "react-native";
import { Modal } from "react-native";

import { useRouter, Stack } from "expo-router";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import BackButton from "@/src/components/buttons/backButton";
import { colors, spacing } from "@/src/styles/globalstyles";
import { registerRequest } from "@/src/services/api";

export default function Personal() {


    
  const router = useRouter();

  const [birthdate, setBirthdate] = useState<Date | null>(null);
  const [tempDate, setTempDate] = useState(new Date());
const [showPicker, setShowPicker] = useState(false);

  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState<string | null>(null);
  const [somatotype, setSomatotype] = useState<string | null>(null);

  // 🔥 FIX DEL ERROR
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  };

  const handleNext = async () => {
    if (!birthdate || !height || !weight || !gender || !somatotype) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

    try {
      const registerDataRaw = await AsyncStorage.getItem("@register_data");
      const objective = await AsyncStorage.getItem("@register_objective");

      if (!registerDataRaw || !objective) {
        Alert.alert("Error", "Datos incompletos, vuelve a intentarlo");
        return;
      }

      const { name, email, password } = JSON.parse(registerDataRaw);

      const birthdateStr = birthdate.toISOString().split("T")[0];

      const data = await registerRequest({
        name,
        email,
        password,
        gender,
        birthdate: birthdateStr,
      });

      if (data?.token) {
        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
        await AsyncStorage.removeItem("@register_data");
        await AsyncStorage.removeItem("@register_objective");

        Alert.alert("Cuenta creada", "Tu cuenta se ha creado correctamente", [
          { text: "OK", onPress: () => router.replace("/(tabs)" as any) }
        ]);
      } else {
        const mensaje = data?.errors?.email?.[0] ?? data?.message ?? "No se pudo crear la cuenta";
        Alert.alert("Error", mensaje, [
          { text: "OK", onPress: () => router.replace("/auth/register" as any) }
        ]);
      }

    } catch (error) {
      console.log("Error en registro:", error);
      Alert.alert("Error", "Ocurrió un problema, intenta de nuevo");
    }
  };

  return (

    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >

      <Stack.Screen options={{ headerShown: false }} />
      <BackButton />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        {/* HEADER */}
        <View style={styles.header}>
          <Ionicons name="person-circle-outline" size={50} color={colors.primary} />
          <Text style={styles.title}>Tus datos</Text>
          <Text style={styles.subtitle}>
            Ayúdanos a personalizar tu experiencia
          </Text>
        </View>

        {/* CARD */}
        <View style={styles.card}>

          {/* FECHA */}
          <TouchableOpacity
  style={styles.inputContainer}
  onPress={() => setShowPicker(true)}
>
  <Ionicons name="calendar-outline" size={20} color={colors.textSecondary} />

  <Text style={[
    styles.input,
    { color: birthdate ? colors.text : colors.textSecondary }
  ]}>
    {birthdate ? formatDate(birthdate) : "Fecha de nacimiento"}
  </Text>
</TouchableOpacity>
<Modal
  visible={showPicker}
  transparent
  animationType="fade"
>
  <View style={styles.modalOverlay}>

    <View style={styles.modalContent}>

      <DateTimePicker
        value={tempDate}
        mode="date"
        display="spinner"
        maximumDate={new Date()}
        onChange={(event, selectedDate) => {
          if (selectedDate) setTempDate(selectedDate);
        }}
      />

      <TouchableOpacity
        style={styles.confirmButton}
        onPress={() => {
          setBirthdate(tempDate);
          setShowPicker(false);
        }}
      >
        <Text style={styles.confirmText}>Confirmar</Text>
      </TouchableOpacity>

    </View>

  </View>
</Modal>

          {showPicker && (
  <DateTimePicker
    value={birthdate || new Date()}
    mode="date"
    display="default"
    maximumDate={new Date()}
    onChange={(event, selectedDate) => {
      setShowPicker(false); // 🔥 cerrar inmediatamente

      if (selectedDate) {
        setBirthdate(selectedDate);
      }
    }}
  />
)}

          {/* ESTATURA */}
          <View style={styles.inputContainer}>
            <Ionicons name="resize-outline" size={20} color={colors.textSecondary} />
            <TextInput
              placeholder="Estatura (cm)"
              placeholderTextColor={colors.textSecondary}
              style={styles.input}
              value={height}
              onChangeText={setHeight}
              keyboardType="numeric"
            />
          </View>

          {/* PESO */}
          <View style={styles.inputContainer}>
            <Ionicons name="barbell-outline" size={20} color={colors.textSecondary} />
            <TextInput
              placeholder="Peso (kg)"
              placeholderTextColor={colors.textSecondary}
              style={styles.input}
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
            />
          </View>

          {/* GÉNERO */}
          <Text style={styles.sectionTitle}>Género</Text>

          <View style={styles.selectorContainer}>
            {["Masculino", "Femenino"].map((item) => {
              const isActive = gender === item;

              return (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.selectorButton,
                    isActive && styles.selectorButtonActive
                  ]}
                  onPress={() => setGender(item)}
                >
                  <Text style={[
                    styles.selectorText,
                    isActive && styles.selectorTextActive
                  ]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* SOMATOTIPO */}
          <Text style={styles.sectionTitle}>Somatotipo</Text>

          <View style={styles.selectorContainer}>
            {["Ectomorfo", "Mesomorfo", "Endomorfo"].map((item) => {
              const isActive = somatotype === item;

              return (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.selectorButton,
                    isActive && styles.selectorButtonActive
                  ]}
                  onPress={() => setSomatotype(item)}
                >
                  <Text style={[
                    styles.selectorText,
                    isActive && styles.selectorTextActive
                  ]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* BOTÓN */}
          <TouchableOpacity
            style={[
              styles.button,
              (!birthdate || !height || !weight || !gender || !somatotype) && styles.disabled
            ]}
            onPress={handleNext}
            disabled={!birthdate || !height || !weight || !gender || !somatotype}
          >
            <Text style={styles.buttonText}>Continuar</Text>
          </TouchableOpacity>

        </View>

      </ScrollView>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  justifyContent: "center",
  alignItems: "center"
},

modalContent: {
  backgroundColor: "#ffffff",
  borderRadius: 20,
  padding: 20,
  width: "85%",
  alignItems: "center"
},

confirmButton: {
  marginTop: 10,
  backgroundColor: colors.primary,
  paddingVertical: 10,
  paddingHorizontal: 30,
  borderRadius: 20
},

confirmText: {
  color: "white",
  fontWeight: "600"
},

  content: {
    flexGrow: 1,
    justifyContent: "center",
    padding: spacing.screenPadding,
    paddingTop: 100,
    paddingBottom: 40
  },

  header: {
    alignItems: "center",
    marginBottom: 30
  },

  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "700",
    marginTop: 8
  },

  subtitle: {
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: "center"
  },

  card: {
    backgroundColor: colors.card,
    borderRadius: spacing.borderRadius,
    padding: 20
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2C2C2E",
    borderRadius: 14,
    paddingHorizontal: 12,
    marginBottom: 14,
    height: 50
  },

  input: {
    flex: 1,
    marginLeft: 6,
    fontSize: 15,
    color: colors.text
  },

  sectionTitle: {
    color: colors.textSecondary,
    marginTop: 10,
    marginBottom: 8
  },

  selectorContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16
  },

  selectorButton: {
    flex: 1,
    backgroundColor: "#2C2C2E",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 4
  },

  selectorButtonActive: {
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: "#1E3A8A33"
  },

  selectorText: {
    color: colors.text
  },

  selectorTextActive: {
    color: colors.primary,
    fontWeight: "600"
  },

  button: {
    backgroundColor: colors.primary,
    borderRadius: 30,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10
  },

  buttonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600"
  },

  disabled: {
    opacity: 0.5
  }

});