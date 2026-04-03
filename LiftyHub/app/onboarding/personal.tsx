import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
  KeyboardAvoidingView,
  Modal,
} from "react-native";

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
  const [tempDate, setTempDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [waist, setWaist] = useState("");
  const [gender, setGender] = useState<string | null>(null);
  const [somatotype, setSomatotype] = useState<string | null>(null);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const somatotypeMap: Record<string, number> = {
    ectomorph: 1,
    mesomorph: 2,
    endomorph: 3,
  };

  const genders = [
    { key: "Masculino", label: t("onboarding.male") },
    { key: "Femenino", label: t("onboarding.female") },
  ];

  const somatotypes = [
    { key: "ectomorph", label: t("onboarding.ectomorph") },
    { key: "mesomorph", label: t("onboarding.mesomorph") },
    { key: "endomorph", label: t("onboarding.endomorph") },
  ];

  const isComplete = !!birthdate && !!height && !!weight && !!waist && !!gender && !!somatotype;

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
      waist: parseFloat(waist),
      somatotype_id: somatotypeMap[somatotype!],
    }));

    router.push("/onboarding/permissions" as any);
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
          </TouchableOpacity>

          <Modal visible={showPicker} transparent animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
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
              </View>
            </View>
          </Modal>

          {/* ESTATURA */}
          <View style={styles.inputContainer}>
            <Ionicons name="resize-outline" size={20} color={colors.textSecondary} />
            <TextInput
              placeholder={t("onboarding.heightPlaceholder")}
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
              placeholder={t("onboarding.weightPlaceholder")}
              placeholderTextColor={colors.textSecondary}
              style={styles.input}
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
            />
          </View>

          {/* CINTURA */}
          <View style={styles.inputContainer}>
            <Ionicons name="body-outline" size={20} color={colors.textSecondary} />
            <TextInput
              placeholder={t("onboarding.waistPlaceholder")}
              placeholderTextColor={colors.textSecondary}
              style={styles.input}
              value={waist}
              onChangeText={setWaist}
              keyboardType="numeric"
            />
          </View>

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

          {/* SOMATOTIPO */}
          <Text style={styles.sectionTitle}>{t("onboarding.somatotypeTitle")}</Text>
          <View style={styles.selectorContainer}>
            {somatotypes.map((item) => {
              const isActive = somatotype === item.key;
              return (
                <TouchableOpacity
                  key={item.key}
                  style={[styles.selectorButton, isActive && styles.selectorButtonActive]}
                  onPress={() => setSomatotype(item.key)}
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
