import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from "react-native";

import { useRouter, Stack } from "expo-router";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BackButton from "@/src/components/buttons/backButton";
import { colors, spacing } from "@/src/styles/globalstyles";

export default function Objectives() {

  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  const objectives = [
    { label: "Perder grasa", icon: "flame-outline" },
    { label: "Ganar músculo", icon: "barbell-outline" },
    { label: "Recomposición corporal", icon: "repeat-outline" },
    { label: "Mejorar resistencia", icon: "heart-outline" },
    { label: "Mejorar fuerza", icon: "fitness-outline" }
  ];

  const handleNext = async () => {
    if (!selected) return;
    await AsyncStorage.setItem("@register_objective", selected);
    router.push("/onboarding/personal" as any);
  };

  return (
    <View style={styles.container}>

      <Stack.Screen options={{ headerShown: false }} />

      {/* 🔙 BOTÓN BACK */}
      <BackButton />

      <ScrollView contentContainerStyle={styles.content}>

        {/* 🔥 TÍTULO LIMPIO */}
        <Text style={styles.title}>¿Cuál es tu objetivo?</Text>
        <Text style={styles.subtitle}>
          Esto nos ayudará a personalizar tu plan
        </Text>

        {/* CARD */}
        <View style={styles.card}>

          {objectives.map((item, index) => {
            const isActive = selected === item.label;

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.option,
                  isActive && styles.optionActive
                ]}
                onPress={() => setSelected(item.label)}
              >

                <Ionicons
                  name={item.icon as any}
                  size={22}
                  color={isActive ? colors.primary : colors.textSecondary}
                />

                <Text
                  style={[
                    styles.optionText,
                    isActive && styles.optionTextActive
                  ]}
                >
                  {item.label}
                </Text>

              </TouchableOpacity>
            );
          })}

        </View>

        {/* BOTÓN */}
        <TouchableOpacity
          style={[
            styles.button,
            !selected && styles.disabled
          ]}
          onPress={handleNext}
          disabled={!selected}
        >
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>

      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.background
  },

  content: {
  flexGrow: 1,
  justifyContent: "center",
  padding: spacing.screenPadding,
  paddingTop: 100
},

  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 6
  },

  subtitle: {
    color: colors.textSecondary,
    marginBottom: 24
  },

  card: {
    backgroundColor: colors.card,
    borderRadius: spacing.borderRadius,
    padding: 16
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2C2C2E",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10
  },

  optionActive: {
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: "#1E3A8A33"
  },

  optionText: {
    color: colors.text,
    marginLeft: 10,
    fontSize: 15
  },

  optionTextActive: {
    color: colors.primary,
    fontWeight: "600"
  },

  button: {
    backgroundColor: colors.primary,
    borderRadius: 30,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20
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


