import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Switch,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Storage from "@/src/utils/storage";
import { saveNutritionProfile, getUserProperties } from "@/src/services/api";
import { colors, spacing } from "@/src/styles/globalstyles";
import BackButton from "@/src/components/buttons/backButton";

type FormData = {
  meal_schedule: string;
  favorite_foods: string;
  disliked_foods: string;
  allergies: string;
  medical_restrictions: string;
  favorite_meal: string;
  can_cook_sunday: boolean;
};

const INITIAL: FormData = {
  meal_schedule: "",
  favorite_foods: "",
  disliked_foods: "",
  allergies: "",
  medical_restrictions: "",
  favorite_meal: "",
  can_cook_sunday: false,
};

export default function QuestionnaireScreen() {
  const [form, setForm] = useState<FormData>(INITIAL);
  const [saving, setSaving] = useState(false);
  const [physicalData, setPhysicalData] = useState<{ weight: number; height: number; age: number } | null>(null);

  useEffect(() => {
    const loadPhysical = async () => {
      try {
        const token = await Storage.getItem("token");
        const userStorage = await Storage.getItem("user");
        if (!token || !userStorage) return;
        const user = JSON.parse(userStorage);
        const res = await getUserProperties(user.id, token);
        const props = res?.data;
        const birthdate = user.birthdate ? new Date(user.birthdate) : null;
        const age = birthdate
          ? Math.floor((Date.now() - birthdate.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
          : 0;
        setPhysicalData({
          weight: parseFloat(props?.weight ?? "0") || 0,
          height: parseFloat(props?.stature ?? "0") || 0,
          age,
        });
      } catch { /* silent */ }
    };
    loadPhysical();
  }, []);

  const set = (key: keyof FormData, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const token = await Storage.getItem("token");
      const userStorage = await Storage.getItem("user");
      if (!token || !userStorage) return;
      const user = JSON.parse(userStorage);

      await saveNutritionProfile(
        {
          user_id: user.id,
          weight: physicalData?.weight ?? 0,
          age: physicalData?.age ?? 0,
          height: physicalData?.height ?? 0,
          meal_schedule: form.meal_schedule || null,
          favorite_foods: form.favorite_foods || null,
          disliked_foods: form.disliked_foods || null,
          allergies: form.allergies || null,
          medical_restrictions: form.medical_restrictions || null,
          favorite_meal: form.favorite_meal || null,
          can_cook_sunday: form.can_cook_sunday,
        },
        token
      );

      Alert.alert(
        "¡Cuestionario enviado!",
        "Tu nutriólogo ya puede ver tu información y comenzará a preparar tu plan.",
        [{ text: "Entendido", onPress: () => router.replace("/(tabs)/diet" as any) }]
      );
    } catch {
      Alert.alert("Error", "No se pudo guardar tu información. Intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#0F0F10" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>Cuestionario nutricional</Text>
      </View>
      <View style={styles.headerDivider} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.intro}>
          Esta información le permite a tu nutriólogo diseñar un plan completamente personalizado para ti.
        </Text>

        {/* HORARIOS Y COMIDAS */}
        <SectionTitle title="Hábitos alimenticios" />

        <FieldLabel label="Horario de comidas" />
        <TextInput
          style={styles.input}
          placeholder="Ej: desayuno 8am, comida 2pm, cena 8pm"
          placeholderTextColor="#444"
          value={form.meal_schedule}
          onChangeText={(v) => set("meal_schedule", v)}
        />

        <FieldLabel label="Alimentos favoritos" />
        <TextInput
          style={[styles.input, styles.multiline]}
          placeholder="Ej: pollo, arroz, frutas, ensaladas..."
          placeholderTextColor="#444"
          multiline
          numberOfLines={3}
          value={form.favorite_foods}
          onChangeText={(v) => set("favorite_foods", v)}
        />

        <FieldLabel label="Alimentos menos favoritos" />
        <TextInput
          style={[styles.input, styles.multiline]}
          placeholder="Ej: brócoli, hígado, mariscos..."
          placeholderTextColor="#444"
          multiline
          numberOfLines={3}
          value={form.disliked_foods}
          onChangeText={(v) => set("disliked_foods", v)}
        />

        <FieldLabel label="¿Cuál es tu comida favorita?" />
        <TextInput
          style={styles.input}
          placeholder="No importa si es chatarra o no"
          placeholderTextColor="#444"
          value={form.favorite_meal}
          onChangeText={(v) => set("favorite_meal", v)}
        />

        {/* RESTRICCIONES */}
        <SectionTitle title="Restricciones" />

        <FieldLabel label="Alimentos alérgicos" />
        <TextInput
          style={[styles.input, styles.multiline]}
          placeholder="Ej: cacahuates, mariscos, lácteos... (escribe 'ninguno' si no tienes)"
          placeholderTextColor="#444"
          multiline
          numberOfLines={3}
          value={form.allergies}
          onChangeText={(v) => set("allergies", v)}
        />

        <FieldLabel label="Alimentos que el doctor te ha prohibido" />
        <TextInput
          style={[styles.input, styles.multiline]}
          placeholder="En caso de alguna enfermedad o indicación médica. Escribe 'ninguno' si no aplica."
          placeholderTextColor="#444"
          multiline
          numberOfLines={3}
          value={form.medical_restrictions}
          onChangeText={(v) => set("medical_restrictions", v)}
        />

        {/* COCINA */}
        <SectionTitle title="Disponibilidad" />

        <View style={styles.switchRow}>
          <View style={styles.switchInfo}>
            <Text style={styles.switchLabel}>¿Tienes tiempo de cocinar todos los domingos?</Text>
            <Text style={styles.switchDesc}>
              Ideal para preparar comidas de la semana con anticipación
            </Text>
          </View>
          <Switch
            value={form.can_cook_sunday}
            onValueChange={(v) => set("can_cook_sunday", v)}
            trackColor={{ false: "#2C2C2E", true: colors.primary + "88" }}
            thumbColor={form.can_cook_sunday ? colors.primary : "#888"}
          />
        </View>

        {/* ENVIAR */}
        <TouchableOpacity
          style={[styles.submitBtn, saving && { opacity: 0.7 }]}
          onPress={handleSubmit}
          disabled={saving}
          activeOpacity={0.85}
        >
          {saving ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Ionicons name="send-outline" size={18} color="white" />
          )}
          <Text style={styles.submitBtnText}>
            {saving ? "Enviando..." : "Enviar cuestionario"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <View style={styles.sectionTitleRow}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionLine} />
    </View>
  );
}

function FieldLabel({ label }: { label: string }) {
  return <Text style={styles.fieldLabel}>{label}</Text>;
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 16,
    paddingLeft: 80,
    paddingRight: 20,
    minHeight: 110,
  },
  headerTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
    flex: 1,
  },
  headerDivider: {
    height: 1,
    backgroundColor: "#2A2A2A",
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  intro: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 24,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 20,
    marginBottom: 14,
  },
  sectionTitle: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#2A2A2A",
  },
  fieldLabel: {
    color: "#888",
    fontSize: 13,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#1C1C1E",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    color: "white",
    fontSize: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  multiline: {
    height: 88,
    textAlignVertical: "top",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: "#1C1C1E",
    borderRadius: 14,
    padding: 16,
    marginTop: 4,
  },
  switchInfo: {
    flex: 1,
    gap: 4,
  },
  switchLabel: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 19,
  },
  switchDesc: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: spacing.borderRadius,
    paddingVertical: 15,
    marginTop: 28,
  },
  submitBtnText: {
    color: "white",
    fontSize: 15,
    fontWeight: "700",
  },
});
