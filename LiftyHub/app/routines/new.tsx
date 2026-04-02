import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLanguage } from "@/src/context/LanguageContext";
import { colors, spacing } from "@/src/styles/globalstyles";
import { createUserRoutine } from "@/src/services/api";

export default function NewRoutineScreen() {
  const { t } = useLanguage();

  const filters = [
    { key: "Fuerza",    label: t("routines.categories.strength") },
    { key: "Movilidad", label: t("routines.categories.mobility") },
    { key: "Cardio",    label: t("routines.categories.cardio") },
    { key: "HIIT",      label: t("routines.categories.hiit") },
    { key: "Full Body", label: t("routines.categories.fullBody") },
  ];

  const levels = [
    { key: "Principiante", label: t("routines.levels.beginner") },
    { key: "Intermedio",   label: t("routines.levels.intermediate") },
    { key: "Avanzado",     label: t("routines.levels.advanced") },
  ];

  const [form, setForm] = useState({
    name: "",
    objective: "",
    level: "",
    category: "",
    duration: "",
    img: "",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.name || !form.objective || !form.level || !form.duration || !form.category) {
      Alert.alert(t("routines.modal.errorEmpty"));
      return;
    }

    setSaving(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const userRaw = await AsyncStorage.getItem("user");
      if (!token || !userRaw) return;

      const user = JSON.parse(userRaw);
      await createUserRoutine(
        {
          user_id: user.id,
          name: form.name.trim(),
          objective: form.objective.trim(),
          level: form.level,
          category: form.category,
          duration: Number(form.duration),
          img: form.img || undefined,
        },
        token
      );

      router.back();
    } catch (error) {
      console.log("Error creando rutina:", error);
      Alert.alert("Error", "No se pudo crear la rutina.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>{t("routines.modal.title")}</Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* INFO BASICA */}
        <Text style={styles.sectionTitle}>{t("routines.modal.section")}</Text>

        <TextInput
          placeholder={t("routines.modal.name")}
          placeholderTextColor={colors.textSecondary}
          value={form.name}
          onChangeText={(v) => setForm({ ...form, name: v })}
          style={styles.input}
        />

        <TextInput
          placeholder={t("routines.modal.objective")}
          placeholderTextColor={colors.textSecondary}
          value={form.objective}
          onChangeText={(v) => setForm({ ...form, objective: v })}
          style={styles.input}
        />

        {/* NIVEL */}
        <Text style={styles.sectionTitle}>{t("routines.modal.level")}</Text>
        <View style={styles.levelRow}>
          {levels.map((nivel) => (
            <TouchableOpacity
              key={nivel.key}
              style={[styles.levelButton, form.level === nivel.key && styles.buttonActive]}
              onPress={() => setForm({ ...form, level: nivel.key })}
            >
              <Text style={[styles.buttonText, form.level === nivel.key && styles.buttonTextActive]}>
                {nivel.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* CATEGORIA */}
        <Text style={styles.sectionTitle}>{t("routines.modal.type")}</Text>
        <View style={styles.categoryGrid}>
          {filters.map((cat) => (
            <TouchableOpacity
              key={cat.key}
              style={[styles.categoryButton, form.category === cat.key && styles.buttonActive]}
              onPress={() => setForm({ ...form, category: cat.key })}
            >
              <Text style={[styles.buttonText, form.category === cat.key && styles.buttonTextActive]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* DURACION */}
        <Text style={styles.sectionTitle}>{t("routines.modal.duration")}</Text>
        <TextInput
          placeholder={t("routines.modal.durationPlaceholder")}
          placeholderTextColor={colors.textSecondary}
          keyboardType="numeric"
          value={form.duration}
          onChangeText={(v) => setForm({ ...form, duration: v })}
          style={styles.input}
        />

        {/* IMAGEN */}
        <Text style={styles.sectionTitle}>{t("routines.modal.image")}</Text>
        <TextInput
          placeholder={t("routines.modal.imagePlaceholder")}
          placeholderTextColor={colors.textSecondary}
          value={form.img}
          onChangeText={(v) => setForm({ ...form, img: v })}
          style={styles.input}
          autoCapitalize="none"
        />

        {/* BOTON GUARDAR */}
        <TouchableOpacity
          style={[styles.saveButton, saving && { opacity: 0.6 }]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving
            ? <ActivityIndicator color="white" />
            : <Text style={styles.saveButtonText}>{t("routines.modal.button")}</Text>
          }
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: spacing.screenPadding,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.card,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "bold",
  },

  content: {
    padding: spacing.screenPadding,
    paddingBottom: 40,
  },

  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 8,
  },

  input: {
    backgroundColor: colors.card,
    borderRadius: spacing.borderRadius,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: colors.text,
    fontSize: 16,
    marginBottom: 8,
  },

  levelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },

  levelButton: {
    flex: 1,
    backgroundColor: colors.card,
    paddingVertical: 12,
    borderRadius: spacing.borderRadius,
    alignItems: "center",
  },

  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  categoryButton: {
    backgroundColor: colors.card,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: spacing.borderRadius,
  },

  buttonActive: {
    backgroundColor: colors.primary,
  },

  buttonText: {
    color: colors.textSecondary,
    fontWeight: "600",
    fontSize: 14,
  },

  buttonTextActive: {
    color: "white",
  },

  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: spacing.borderRadius,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 28,
  },

  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
