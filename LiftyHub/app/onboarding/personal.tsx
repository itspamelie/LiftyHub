import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
  KeyboardAvoidingView,
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

import { useRouter, Stack } from "expo-router";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import BackButton from "@/src/components/buttons/backButton";
import { colors, spacing } from "@/src/styles/globalstyles";
import { useLanguage } from "@/src/context/LanguageContext";

export default function Personal() {
  const router = useRouter();
  const { t } = useLanguage();

  const [birthdate, setBirthdate] = useState<Date | null>(null);
  const [tempDate, setTempDate] = useState(new Date(2025, 0, 1));
  const [showPicker, setShowPicker] = useState(false);

  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [tempHeight, setTempHeight] = useState(170);
  const [tempWeight, setTempWeight] = useState(70);
  const [showHeightPicker, setShowHeightPicker] = useState(false);
  const [showWeightPicker, setShowWeightPicker] = useState(false);

  const HEIGHT_VALUES = Array.from({ length: 151 }, (_, i) => i + 100); // 100–250 cm
  const WEIGHT_VALUES = Array.from({ length: 221 }, (_, i) => i + 30);  // 30–250 kg
  const [gender, setGender] = useState<string | null>(null);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const genders = [
    { key: "Masculino", label: t("onboarding.male") },
    { key: "Femenino", label: t("onboarding.female") },
  ];

  const isComplete = !!birthdate && !!height && !!weight && !!gender;

  const handleNext = async () => {
    if (!isComplete) {
      Alert.alert("Error", t("onboarding.errorComplete"));
      return;
    }

    const registerDataRaw = await AsyncStorage.getItem("@register_data");
    if (!registerDataRaw) {
      Alert.alert("Error", t("onboarding.errorData"));
      return;
    }

    const { name, email, password } = JSON.parse(registerDataRaw);

    await AsyncStorage.setItem("@register_data", JSON.stringify({
      name,
      email,
      password,
      gender,
      birthdate: birthdate!.toISOString().split("T")[0],
    }));

    await AsyncStorage.setItem("@register_properties", JSON.stringify({
      height: parseFloat(height),
      weight: parseFloat(weight),
      waist: 0,
    }));

    router.push("/onboarding/somatotype" as any);
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
          <Text style={styles.title}>{t("onboarding.personalTitle")}</Text>
          <Text style={styles.subtitle}>{t("onboarding.personalSubtitle")}</Text>
        </View>

        {/* CARD */}
        <View style={styles.card}>

          {/* FECHA DE NACIMIENTO */}
          <TouchableOpacity
            style={styles.inputContainer}
            onPress={() => setShowPicker(true)}
          >
            <Ionicons name="calendar-outline" size={20} color={colors.textSecondary} />
            <Text style={[styles.input, { color: birthdate ? colors.text : colors.textSecondary }]}>
              {birthdate ? formatDate(birthdate) : t("onboarding.birthdate")}
            </Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <Modal visible={showPicker} transparent animationType="fade">
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => setShowPicker(false)}
            >
              <TouchableOpacity activeOpacity={1} onPress={() => {}} style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <TouchableOpacity onPress={() => setShowPicker(false)}>
                    <Ionicons name="close" size={22} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={tempDate}
                  mode="date"
                  display="spinner"
                  maximumDate={new Date()}
                  textColor="white"
                  onChange={(_, selectedDate) => {
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
                  <Text style={styles.confirmText}>{t("onboarding.birthdateConfirm")}</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            </TouchableOpacity>
          </Modal>

          {/* ESTATURA */}
          <TouchableOpacity
            style={styles.inputContainer}
            onPress={() => setShowHeightPicker(true)}
          >
            <Ionicons name="resize-outline" size={20} color={colors.textSecondary} />
            <Text style={[styles.input, { color: height ? colors.text : colors.textSecondary }]}>
              {height ? `${height} cm` : t("onboarding.heightPlaceholder")}
            </Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <Modal visible={showHeightPicker} transparent animationType="fade">
            <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowHeightPicker(false)}>
              <TouchableOpacity activeOpacity={1} onPress={() => {}} style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <TouchableOpacity onPress={() => setShowHeightPicker(false)}>
                    <Ionicons name="close" size={22} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
                <Picker
                  selectedValue={tempHeight}
                  onValueChange={(val) => setTempHeight(val)}
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                >
                  {HEIGHT_VALUES.map((h) => (
                    <Picker.Item key={h} label={`${h} cm`} value={h} />
                  ))}
                </Picker>
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={() => { setHeight(tempHeight.toString()); setShowHeightPicker(false); }}
                >
                  <Text style={styles.confirmText}>{t("onboarding.birthdateConfirm")}</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            </TouchableOpacity>
          </Modal>

          {/* PESO */}
          <TouchableOpacity
            style={styles.inputContainer}
            onPress={() => setShowWeightPicker(true)}
          >
            <Ionicons name="barbell-outline" size={20} color={colors.textSecondary} />
            <Text style={[styles.input, { color: weight ? colors.text : colors.textSecondary }]}>
              {weight ? `${weight} kg` : t("onboarding.weightPlaceholder")}
            </Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <Modal visible={showWeightPicker} transparent animationType="fade">
            <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowWeightPicker(false)}>
              <TouchableOpacity activeOpacity={1} onPress={() => {}} style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <TouchableOpacity onPress={() => setShowWeightPicker(false)}>
                    <Ionicons name="close" size={22} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
                <Picker
                  selectedValue={tempWeight}
                  onValueChange={(val) => setTempWeight(val)}
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                >
                  {WEIGHT_VALUES.map((w) => (
                    <Picker.Item key={w} label={`${w} kg`} value={w} />
                  ))}
                </Picker>
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={() => { setWeight(tempWeight.toString()); setShowWeightPicker(false); }}
                >
                  <Text style={styles.confirmText}>{t("onboarding.birthdateConfirm")}</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            </TouchableOpacity>
          </Modal>

          {/* GÉNERO */}
          <Text style={styles.sectionTitle}>{t("onboarding.genderTitle")}</Text>
          <View style={styles.selectorContainer}>
            {genders.map((item) => {
              const isActive = gender === item.key;
              return (
                <TouchableOpacity
                  key={item.key}
                  style={[styles.selectorButton, isActive && styles.selectorButtonActive]}
                  onPress={() => setGender(item.key)}
                >
                  <Text style={[styles.selectorText, isActive && styles.selectorTextActive]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* BOTÓN */}
          <TouchableOpacity
            style={[styles.button, !isComplete && styles.disabled]}
            onPress={handleNext}
            disabled={!isComplete}
          >
            <Text style={styles.buttonText}>{t("onboarding.personalContinue")}</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    flexGrow: 1,
    justifyContent: "center",
    padding: spacing.screenPadding,
    paddingTop: 100,
    paddingBottom: 40,
  },

  header: {
    alignItems: "center",
    marginBottom: 30,
  },

  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "700",
    marginTop: 8,
  },

  subtitle: {
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: "center",
  },

  card: {
    backgroundColor: colors.card,
    borderRadius: spacing.borderRadius,
    padding: 20,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2C2C2E",
    borderRadius: 14,
    paddingHorizontal: 12,
    marginBottom: 14,
    height: 50,
  },

  input: {
    flex: 1,
    marginLeft: 6,
    fontSize: 15,
    color: colors.text,
  },

  sectionTitle: {
    color: colors.textSecondary,
    marginTop: 10,
    marginBottom: 8,
  },

  selectorContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  selectorButton: {
    flex: 1,
    backgroundColor: "#2C2C2E",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 4,
  },

  selectorButtonActive: {
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: "#1E3A8A33",
  },

  selectorText: {
    color: colors.text,
  },

  selectorTextActive: {
    color: colors.primary,
    fontWeight: "600",
  },

  button: {
    backgroundColor: colors.primary,
    borderRadius: 30,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
  },

  disabled: {
    opacity: 0.5,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    backgroundColor: "#1C1C1E",
    borderRadius: 20,
    padding: 20,
    width: "85%",
    alignItems: "center",
  },

  modalHeader: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 4,
  },

  picker: {
    width: "100%",
    color: "white",
  },

  pickerItem: {
    color: "white",
    fontSize: 18,
  },

  confirmButton: {
    marginTop: 10,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 20,
  },

  confirmText: {
    color: "white",
    fontWeight: "600",
    fontSize: 15,
  },
});
