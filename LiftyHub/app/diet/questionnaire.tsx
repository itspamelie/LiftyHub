import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ActivityIndicator, KeyboardAvoidingView, Platform,
  ScrollView, Modal, Animated,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { useState, useEffect, useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Storage from "@/src/utils/storage";
import { saveNutritionProfile, getUserProperties } from "@/src/services/api";
import { colors, spacing } from "@/src/styles/globalstyles";
import HapticButton from "@/src/components/buttons/HapticButton";
import BackButton from "@/src/components/buttons/backButton";

const ACCENT = "#10B981";
const TOTAL_STEPS = 7;

// ── Tiempos disponibles ───────────────────────────────────────────────────────
const TIMES: string[] = [];
for (let h = 5; h <= 23; h++) {
  TIMES.push(`${h}:00`);
  if (h < 23) TIMES.push(`${h}:30`);
}
const to12h = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  const p = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${m.toString().padStart(2, "0")} ${p}`;
};

// ── Comidas ───────────────────────────────────────────────────────────────────
type MealKey = "desayuno" | "colacion" | "comida" | "merienda" | "cena";
type MealEntry = { enabled: boolean; time: string };
type MealSchedule = Record<MealKey, MealEntry>;

const MEAL_CONFIG: { key: MealKey; label: string; icon: string }[] = [
  { key: "desayuno", label: "Desayuno",  icon: "sunny-outline"     },
  { key: "colacion", label: "Colación",  icon: "cafe-outline"       },
  { key: "comida",   label: "Comida",    icon: "restaurant-outline" },
  { key: "merienda", label: "Merienda",  icon: "nutrition-outline"  },
  { key: "cena",     label: "Cena",      icon: "moon-outline"       },
];

const INITIAL_MEALS: MealSchedule = {
  desayuno: { enabled: true,  time: "8:00"  },
  colacion: { enabled: false, time: "11:00" },
  comida:   { enabled: true,  time: "14:00" },
  merienda: { enabled: false, time: "17:00" },
  cena:     { enabled: true,  time: "20:00" },
};

const COMMON_ALLERGIES = [
  "Ninguna", "Cacahuates", "Mariscos", "Lácteos",
  "Gluten", "Huevos", "Soya", "Frutos secos", "Trigo",
];

// ── Círculo de progreso ───────────────────────────────────────────────────────
function StepCircle({ index, current }: { index: number; current: number }) {
  const done   = index < current;
  const active = index === current;
  const scale  = useRef(new Animated.Value(active ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: active ? 1 : 0,
      useNativeDriver: true,
      damping: 12,
      stiffness: 180,
    }).start();
  }, [active]);

  return (
    <View style={[
      s.circleOuter,
      done   && { borderColor: ACCENT, backgroundColor: ACCENT },
      active && { borderColor: ACCENT },
    ]}>
      {done ? (
        <Ionicons name="checkmark" size={11} color="white" />
      ) : (
        <Animated.View style={[s.circleInner, { transform: [{ scale }] }]} />
      )}
    </View>
  );
}

function StepProgress({ current }: { current: number }) {
  return (
    <View style={s.progressRow}>
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <View key={i} style={{ flexDirection: "row", alignItems: "center" }}>
          <StepCircle index={i} current={current} />
          {i < TOTAL_STEPS - 1 && (
            <View style={[s.progressLine, i < current && { backgroundColor: ACCENT }]} />
          )}
        </View>
      ))}
    </View>
  );
}

// ── Pantalla principal ────────────────────────────────────────────────────────
export default function QuestionnaireScreen() {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const [meals, setMeals]               = useState<MealSchedule>(INITIAL_MEALS);
  const [pickerMeal, setPickerMeal]     = useState<MealKey | null>(null);
  const [pickerTime, setPickerTime]     = useState("8:00");
  const [use12h, setUse12h]             = useState(false);

  const [favFoods, setFavFoods]         = useState<string[]>([]);
  const [favInput, setFavInput]         = useState("");
  const [dislikedFoods, setDislikedFoods] = useState<string[]>([]);
  const [dislikedInput, setDislikedInput] = useState("");
  const [favMeal, setFavMeal]           = useState("");
  const [allergies, setAllergies]       = useState<Set<string>>(new Set(["Ninguna"]));
  const [allergyInput, setAllergyInput] = useState("");
  const [medRestrictions, setMedRestrictions] = useState("");
  const [cookSunday, setCookSunday]     = useState<boolean | null>(null);
  const [physicalData, setPhysicalData] = useState<{ weight: number; height: number; age: number } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const token = await Storage.getItem("token");
        const userStorage = await Storage.getItem("user");
        if (!token || !userStorage) return;
        const user = JSON.parse(userStorage);
        const res = await getUserProperties(user.id, token);
        const props = res?.data;
        const birthdate = user.birthdate ? new Date(user.birthdate) : null;
        const age = birthdate ? Math.floor((Date.now() - birthdate.getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : 0;
        setPhysicalData({ weight: parseFloat(props?.weight ?? "0") || 0, height: parseFloat(props?.stature ?? "0") || 0, age });
      } catch { /* silent */ }
    })();
  }, []);

  const addTag = (list: string[], setList: (v: string[]) => void, input: string, setInput: (v: string) => void) => {
    const val = input.trim();
    if (val && !list.includes(val)) setList([...list, val]);
    setInput("");
  };
  const removeTag = (list: string[], setList: (v: string[]) => void, tag: string) =>
    setList(list.filter((t) => t !== tag));

  const toggleAllergy = (name: string) => {
    setAllergies((prev) => {
      const next = new Set(prev);
      if (name === "Ninguna") { next.clear(); next.add("Ninguna"); return next; }
      next.delete("Ninguna");
      next.has(name) ? next.delete(name) : next.add(name);
      if (next.size === 0) next.add("Ninguna");
      return next;
    });
  };

  const canNext = () => {
    if (step === 0) return MEAL_CONFIG.some((m) => meals[m.key].enabled);
    if (step === 6) return cookSunday !== null;
    return true;
  };

  const serializeMeals = () =>
    MEAL_CONFIG.filter((m) => meals[m.key].enabled)
      .map((m) => `${m.label} ${meals[m.key].time}`).join(", ");

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const token = await Storage.getItem("token");
      const userStorage = await Storage.getItem("user");
      if (!token || !userStorage) return;
      const user = JSON.parse(userStorage);
      await saveNutritionProfile({
        user_id: user.id,
        weight: physicalData?.weight ?? 0,
        age: physicalData?.age ?? 0,
        height: physicalData?.height ?? 0,
        meal_schedule: serializeMeals() || null,
        favorite_foods: favFoods.join(", ") || null,
        disliked_foods: dislikedFoods.join(", ") || null,
        allergies: [...allergies].join(", ") || null,
        medical_restrictions: medRestrictions || null,
        favorite_meal: favMeal || null,
        can_cook_sunday: cookSunday ?? false,
      }, token);
      setDone(true);
    } catch { /* silent */ }
    finally { setSaving(false); }
  };

  const goNext = () => step === TOTAL_STEPS - 1 ? handleSubmit() : setStep((x) => x + 1);
  const goSkip = () => step === TOTAL_STEPS - 1 ? handleSubmit() : setStep((x) => x + 1);

  const STEP_META = [
    { q: "¿Cuáles son tus tiempos de comida?",   hint: "Activa cada comida y ajusta su hora.",              icon: "time-outline"        },
    { q: "¿Cuáles son tus alimentos favoritos?",  hint: "Escribe uno y toca + para agregarlo.",             icon: "heart-outline"       },
    { q: "¿Qué alimentos no te gustan?",          hint: "Los evitaremos o los adaptaremos en tu plan.",     icon: "thumbs-down-outline" },
    { q: "¿Cuál es tu comida favorita?",          hint: "Sin importar si es saludable. ¡Sin juicios!",      icon: "restaurant-outline"  },
    { q: "¿Tienes alguna alergia alimentaria?",   hint: "Selecciona todas las que apliquen.",               icon: "warning-outline"     },
    { q: "¿Tu médico te ha prohibido algo?",      hint: "Indícanos si tienes alguna condición médica.",     icon: "medkit-outline"      },
    { q: "¿Puedes cocinar los domingos?",         hint: "Cocinar un día para toda la semana facilita mucho el plan.", icon: "calendar-outline" },
  ];
  const meta = STEP_META[step];
  const isLast = step === TOTAL_STEPS - 1;
  const isOptional = step === 1 || step === 2 || step === 3 || step === 5;

  // ── ÉXITO ─────────────────────────────────────────────────────────────────
  if (done) {
    return (
      <View style={[s.container, { paddingTop: insets.top + 20 }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={s.successWrap}>
          <View style={s.successCircle}>
            <Ionicons name="checkmark-circle" size={72} color={ACCENT} />
          </View>
          <Text style={s.successTitle}>¡Listo!</Text>
          <Text style={s.successSub}>
            Tu nutriólogo ya puede ver tu información y comenzará a preparar tu plan personalizado.
          </Text>
          <HapticButton style={s.successBtn} onPress={() => router.replace("/(tabs)/diet" as any)}>
            <Text style={s.successBtnText}>Volver a Dieta</Text>
          </HapticButton>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[s.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={10}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <BackButton />

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* CÍRCULOS DE PROGRESO */}
        <StepProgress current={step} />

        {/* ICONO + PREGUNTA */}
        <View style={s.questionWrap}>
          <View style={s.iconBox}>
            <Ionicons name={meta.icon as any} size={28} color={ACCENT} />
          </View>
          <Text style={s.question}>{meta.q}</Text>
          <Text style={s.hint}>{meta.hint}</Text>
        </View>

        {/* ── PASO 0: Horario ───────────────────────────────────────────── */}
        {step === 0 && (
          <View style={s.card}>
            {MEAL_CONFIG.map((m) => {
              const entry = meals[m.key];
              return (
                <View key={m.key} style={[s.mealRow, entry.enabled && s.mealRowOn]}>
                  <HapticButton
                    style={s.mealLeft}
                    onPress={() => setMeals((p) => ({ ...p, [m.key]: { ...p[m.key], enabled: !p[m.key].enabled } }))}
                  >
                    <View style={[s.check, entry.enabled && s.checkOn]}>
                      {entry.enabled && <Ionicons name="checkmark" size={12} color="white" />}
                    </View>
                    <View style={s.mealIconWrap}>
                      <Ionicons name={m.icon as any} size={17} color={entry.enabled ? ACCENT : colors.textSecondary} />
                    </View>
                    <Text style={[s.mealLabel, entry.enabled && s.mealLabelOn]}>{m.label}</Text>
                  </HapticButton>
                  {entry.enabled && (
                    <HapticButton
                      style={s.timeChip}
                      onPress={() => { setPickerMeal(m.key); setPickerTime(entry.time); }}
                    >
                      <Ionicons name="time-outline" size={12} color={ACCENT} />
                      <Text style={s.timeChipTxt}>{use12h ? to12h(entry.time) : entry.time}</Text>
                      <Ionicons name="chevron-down" size={11} color={ACCENT} />
                    </HapticButton>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {/* ── PASO 1 & 2: Tags ──────────────────────────────────────────── */}
        {(step === 1 || step === 2) && (() => {
          const list    = step === 1 ? favFoods      : dislikedFoods;
          const setList = step === 1 ? setFavFoods   : setDislikedFoods;
          const input   = step === 1 ? favInput      : dislikedInput;
          const setIn   = step === 1 ? setFavInput   : setDislikedInput;
          return (
            <View style={s.card}>
              <View style={s.tagRow}>
                <TextInput
                  style={s.tagInput}
                  placeholder="Escribe un alimento..."
                  placeholderTextColor="#444"
                  value={input}
                  onChangeText={setIn}
                  onSubmitEditing={() => addTag(list, setList, input, setIn)}
                  returnKeyType="done"
                />
                <HapticButton
                  style={[s.tagAdd, !input.trim() && { opacity: 0.4 }]}
                  onPress={() => addTag(list, setList, input, setIn)}
                  disabled={!input.trim()}
                >
                  <Ionicons name="add" size={22} color="white" />
                </HapticButton>
              </View>
              <View style={s.chipWrap}>
                {list.length === 0
                  ? <Text style={s.emptyChip}>Aún no hay nada — agrega el primero</Text>
                  : list.map((t) => (
                    <View key={t} style={s.chip}>
                      <Text style={s.chipTxt}>{t}</Text>
                      <TouchableOpacity onPress={() => removeTag(list, setList, t)}>
                        <Ionicons name="close-circle" size={15} color={ACCENT} />
                      </TouchableOpacity>
                    </View>
                  ))
                }
              </View>
            </View>
          );
        })()}

        {/* ── PASO 3: Comida favorita ───────────────────────────────────── */}
        {step === 3 && (
          <View style={s.card}>
            <TextInput
              style={s.input}
              placeholder="Ej: tacos, pizza, caldo de res..."
              placeholderTextColor="#444"
              value={favMeal}
              onChangeText={setFavMeal}
              autoFocus
            />
          </View>
        )}

        {/* ── PASO 4: Alergias ─────────────────────────────────────────── */}
        {step === 4 && (
          <View style={s.card}>
            <View style={s.chipWrap}>
              {COMMON_ALLERGIES.map((a) => {
                const sel = allergies.has(a);
                return (
                  <HapticButton
                    key={a}
                    style={[s.presetChip, sel && s.presetChipOn]}
                    onPress={() => toggleAllergy(a)}
                  >
                    <Text style={[s.presetChipTxt, sel && s.presetChipTxtOn]}>{a}</Text>
                  </HapticButton>
                );
              })}
            </View>
            <View style={[s.tagRow, { marginTop: 14 }]}>
              <TextInput
                style={s.tagInput}
                placeholder="Otra alergia..."
                placeholderTextColor="#444"
                value={allergyInput}
                onChangeText={setAllergyInput}
                onSubmitEditing={() => {
                  if (allergyInput.trim()) {
                    setAllergies((p) => { const n = new Set(p); n.delete("Ninguna"); n.add(allergyInput.trim()); return n; });
                    setAllergyInput("");
                  }
                }}
                returnKeyType="done"
              />
              <HapticButton
                style={[s.tagAdd, !allergyInput.trim() && { opacity: 0.4 }]}
                onPress={() => {
                  if (allergyInput.trim()) {
                    setAllergies((p) => { const n = new Set(p); n.delete("Ninguna"); n.add(allergyInput.trim()); return n; });
                    setAllergyInput("");
                  }
                }}
                disabled={!allergyInput.trim()}
              >
                <Ionicons name="add" size={22} color="white" />
              </HapticButton>
            </View>
            <View style={s.chipWrap}>
              {[...allergies].filter((a) => !COMMON_ALLERGIES.includes(a)).map((a) => (
                <View key={a} style={s.chip}>
                  <Text style={s.chipTxt}>{a}</Text>
                  <TouchableOpacity onPress={() => toggleAllergy(a)}>
                    <Ionicons name="close-circle" size={15} color={ACCENT} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ── PASO 5: Restricciones médicas ────────────────────────────── */}
        {step === 5 && (
          <View style={s.card}>
            <TextInput
              style={[s.input, s.inputMulti]}
              placeholder={"Ej: restricción de sodio por hipertensión,\nsin azúcar por diabetes...\n(escribe 'ninguna' si no aplica)"}
              placeholderTextColor="#444"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={medRestrictions}
              onChangeText={setMedRestrictions}
              autoFocus
            />
          </View>
        )}

        {/* ── PASO 6: Domingos ─────────────────────────────────────────── */}
        {step === 6 && (
          <View style={s.boolRow}>
            <HapticButton
              style={[s.boolCard, cookSunday === true && s.boolCardYes]}
              onPress={() => setCookSunday(true)}
            >
              <Ionicons name="checkmark-circle-outline" size={32} color={cookSunday === true ? ACCENT : colors.textSecondary} />
              <Text style={[s.boolLabel, cookSunday === true && { color: ACCENT }]}>Sí, puedo</Text>
            </HapticButton>
            <HapticButton
              style={[s.boolCard, cookSunday === false && s.boolCardNo]}
              onPress={() => setCookSunday(false)}
            >
              <Ionicons name="close-circle-outline" size={32} color={cookSunday === false ? "#f87171" : colors.textSecondary} />
              <Text style={[s.boolLabel, cookSunday === false && { color: "#f87171" }]}>No por ahora</Text>
            </HapticButton>
          </View>
        )}

        {/* BOTONES */}
        <View style={s.navRow}>
          {step > 0 && (
            <HapticButton style={s.prevBtn} onPress={() => setStep((x) => x - 1)}>
              <Ionicons name="arrow-back" size={17} color={colors.textSecondary} />
              <Text style={s.prevTxt}>Anterior</Text>
            </HapticButton>
          )}
          <HapticButton
            style={[s.nextBtn, !canNext() && { opacity: 0.35 }, step === 0 && { flex: 1 }]}
            onPress={goNext}
            disabled={!canNext() || saving}
          >
            {saving
              ? <ActivityIndicator size="small" color="white" />
              : <>
                  <Text style={s.nextTxt}>{isLast ? "Enviar" : "Siguiente"}</Text>
                  <Ionicons name={isLast ? "send-outline" : "arrow-forward"} size={17} color="white" />
                </>
            }
          </HapticButton>
        </View>

        {isOptional && (
          <TouchableOpacity style={s.skipBtn} onPress={goSkip}>
            <Text style={s.skipTxt}>Omitir esta pregunta</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* ── MODAL HORA ─────────────────────────────────────────────────────── */}
      <Modal visible={pickerMeal !== null} transparent animationType="fade">
        <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={() => setPickerMeal(null)}>
          <TouchableOpacity activeOpacity={1} style={s.pickerCard}>
            <Text style={s.pickerTitle}>
              Hora de {pickerMeal ? MEAL_CONFIG.find((m) => m.key === pickerMeal)?.label : ""}
            </Text>
            <View style={s.formatToggle}>
              <TouchableOpacity
                style={[s.fmtBtn, !use12h && s.fmtBtnOn]}
                onPress={() => setUse12h(false)}
              >
                <Text style={[s.fmtTxt, !use12h && s.fmtTxtOn]}>24h</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.fmtBtn, use12h && s.fmtBtnOn]}
                onPress={() => setUse12h(true)}
              >
                <Text style={[s.fmtTxt, use12h && s.fmtTxtOn]}>12h</Text>
              </TouchableOpacity>
            </View>
            <Picker
              selectedValue={pickerTime}
              onValueChange={(val) => setPickerTime(val)}
              style={{ width: "100%", color: "white" }}
              itemStyle={{ color: "white", fontSize: 18 }}
            >
              {TIMES.map((t) => <Picker.Item key={t} label={use12h ? to12h(t) : t} value={t} />)}
            </Picker>
            <HapticButton
              style={s.pickerConfirm}
              onPress={() => {
                if (pickerMeal) setMeals((p) => ({ ...p, [pickerMeal]: { ...p[pickerMeal], time: pickerTime } }));
                setPickerMeal(null);
              }}
            >
              <Text style={s.pickerConfirmTxt}>Confirmar</Text>
            </HapticButton>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </KeyboardAvoidingView>
  );
}

// ── ESTILOS ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  container:  { flex: 1, backgroundColor: colors.background },
  scroll:     { paddingTop: 60, paddingHorizontal: spacing.screenPadding, paddingBottom: 60 },

  // Progress circles
  progressRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 40 },
  circleOuter: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2, borderColor: "#3A3A3A",
    justifyContent: "center", alignItems: "center",
    backgroundColor: "transparent",
  },
  circleInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: ACCENT },
  progressLine: { width: 22, height: 2, backgroundColor: "#2A2A2A", marginHorizontal: 2 },

  // Question
  questionWrap: { marginBottom: 28 },
  iconBox: {
    width: 60, height: 60, borderRadius: 18,
    backgroundColor: `${ACCENT}18`,
    justifyContent: "center", alignItems: "center",
    marginBottom: 20,
  },
  question: { color: "white", fontSize: 26, fontWeight: "800", lineHeight: 34, marginBottom: 10 },
  hint:     { color: colors.textSecondary, fontSize: 14, lineHeight: 21 },

  // Card container
  card: {
    backgroundColor: colors.card,
    borderRadius: spacing.borderRadius,
    padding: 16,
    marginBottom: 8,
  },

  // Meal schedule
  mealRow: {
    flexDirection: "row", alignItems: "center",
    paddingVertical: 12, paddingHorizontal: 4,
    borderRadius: 12, marginBottom: 4,
  },
  mealRowOn:    { backgroundColor: `${ACCENT}0C` },
  mealLeft:     { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  check: {
    width: 20, height: 20, borderRadius: 6,
    borderWidth: 1.5, borderColor: "#3A3A3A",
    justifyContent: "center", alignItems: "center",
  },
  checkOn:      { backgroundColor: ACCENT, borderColor: ACCENT },
  mealIconWrap: { width: 30, height: 30, borderRadius: 8, backgroundColor: "#2C2C2E", justifyContent: "center", alignItems: "center" },
  mealLabel:    { color: colors.textSecondary, fontSize: 15, fontWeight: "600" },
  mealLabelOn:  { color: "white" },
  timeChip: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: `${ACCENT}18`, borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: 1, borderColor: `${ACCENT}40`,
  },
  timeChipTxt: { color: ACCENT, fontSize: 12, fontWeight: "700" },

  // Tags
  tagRow:   { flexDirection: "row", gap: 10 },
  tagInput: {
    flex: 1, backgroundColor: "#2C2C2E",
    borderRadius: 12, borderWidth: 1, borderColor: "#3A3A3A",
    color: "white", fontSize: 15, paddingHorizontal: 14, paddingVertical: 12,
  },
  tagAdd: {
    width: 46, height: 46, borderRadius: 12,
    backgroundColor: ACCENT, justifyContent: "center", alignItems: "center",
  },
  chipWrap:  { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
  chip: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: `${ACCENT}18`, borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 7,
    borderWidth: 1, borderColor: `${ACCENT}40`,
  },
  chipTxt:   { color: ACCENT, fontSize: 13, fontWeight: "600" },
  emptyChip: { color: "#3A3A3A", fontSize: 13, fontStyle: "italic" },

  // Preset allergy chips
  presetChip: {
    paddingHorizontal: 14, paddingVertical: 9,
    borderRadius: 20, backgroundColor: "#2C2C2E",
    borderWidth: 1.5, borderColor: "#3A3A3A",
  },
  presetChipOn:    { backgroundColor: `${ACCENT}18`, borderColor: ACCENT },
  presetChipTxt:   { color: colors.textSecondary, fontSize: 13, fontWeight: "600" },
  presetChipTxtOn: { color: ACCENT },

  // Text inputs
  input:      { backgroundColor: "#2C2C2E", borderRadius: 12, borderWidth: 1, borderColor: "#3A3A3A", color: "white", fontSize: 15, paddingHorizontal: 14, paddingVertical: 13 },
  inputMulti: { height: 130, textAlignVertical: "top" },

  // Bool cards
  boolRow:    { flexDirection: "row", gap: 14, marginBottom: 8 },
  boolCard: {
    flex: 1, alignItems: "center", gap: 12,
    backgroundColor: colors.card,
    borderWidth: 1.5, borderColor: "#2A2A2A",
    borderRadius: 18, paddingVertical: 28,
  },
  boolCardYes: { borderColor: ACCENT, backgroundColor: `${ACCENT}10` },
  boolCardNo:  { borderColor: "#f87171", backgroundColor: "rgba(248,113,113,0.08)" },
  boolLabel:   { color: colors.textSecondary, fontSize: 15, fontWeight: "700" },

  // Nav buttons
  navRow:  { flexDirection: "row", gap: 12, marginTop: 28 },
  prevBtn: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: colors.card,
    borderWidth: 1, borderColor: "#2A2A2A",
    borderRadius: 14, paddingVertical: 15, paddingHorizontal: 18,
  },
  prevTxt: { color: colors.textSecondary, fontSize: 15, fontWeight: "600" },
  nextBtn: {
    flex: 1, flexDirection: "row", alignItems: "center",
    justifyContent: "center", gap: 8,
    backgroundColor: ACCENT, borderRadius: 14, paddingVertical: 15,
  },
  nextTxt:  { color: "white", fontSize: 15, fontWeight: "700" },
  skipBtn:  { alignItems: "center", paddingVertical: 12 },
  skipTxt:  { color: "#475569", fontSize: 13 },

  // Time picker modal
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.72)", justifyContent: "center", alignItems: "center", padding: 28 },
  pickerCard: {
    backgroundColor: "#13141c", borderRadius: 22, padding: 22,
    width: "100%", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
  },
  pickerTitle: { color: "white", fontSize: 17, fontWeight: "700", marginBottom: 12 },
  formatToggle: { flexDirection: "row", backgroundColor: "#1C1C1E", borderRadius: 10, padding: 3, gap: 3, marginBottom: 4 },
  fmtBtn:   { flex: 1, paddingVertical: 7, alignItems: "center", borderRadius: 8 },
  fmtBtnOn: { backgroundColor: ACCENT },
  fmtTxt:   { color: colors.textSecondary, fontSize: 13, fontWeight: "700" },
  fmtTxtOn: { color: "white" },
  pickerConfirm: { marginTop: 10, backgroundColor: ACCENT, borderRadius: 12, paddingVertical: 13, paddingHorizontal: 48 },
  pickerConfirmTxt: { color: "white", fontWeight: "700", fontSize: 15 },

  // Success
  successWrap: { flex: 1, alignItems: "center", justifyContent: "center", padding: 36 },
  successCircle: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: `${ACCENT}18`,
    justifyContent: "center", alignItems: "center", marginBottom: 28,
  },
  successTitle: { color: "white", fontSize: 30, fontWeight: "800", textAlign: "center", marginBottom: 14 },
  successSub:   { color: colors.textSecondary, fontSize: 15, textAlign: "center", lineHeight: 24, marginBottom: 40 },
  successBtn:   { backgroundColor: ACCENT, borderRadius: 14, paddingVertical: 15, paddingHorizontal: 44 },
  successBtnText: { color: "white", fontSize: 16, fontWeight: "700" },
});
