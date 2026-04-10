import { View, Text, StyleSheet, ScrollView, Alert,  } from "react-native";
import { useRouter, Stack } from "expo-router";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BackButton from "@/src/components/buttons/backButton";
import { colors, spacing } from "@/src/styles/globalstyles";
import { useLanguage } from "@/src/context/LanguageContext";
import HapticButton from "@/src/components/buttons/HapticButton";

const SOMATOTYPE_MAP: Record<string, number> = {
  ectomorph: 1,
  mesomorph: 2,
  endomorph: 3,
};

const SOMATOTYPE_META = [
  { key: "ectomorph", icon: "trending-up" as const, color: "#3B82F6" },
  { key: "mesomorph", icon: "barbell" as const,     color: "#10B981" },
  { key: "endomorph", icon: "body" as const,        color: "#F59E0B" },
];

export default function SomatotypeScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const [selected, setSelected] = useState<string | null>(null);

  const SOMATOTYPES = SOMATOTYPE_META.map(({ key, icon, color }) => ({
    key,
    icon,
    color,
    title: t(`onboarding.${key}Title` as any),
    subtitle: t(`onboarding.${key}Subtitle` as any),
    description: t(`onboarding.${key}Desc` as any),
    traits: [
      t(`onboarding.${key}Trait1` as any),
      t(`onboarding.${key}Trait2` as any),
      t(`onboarding.${key}Trait3` as any),
    ],
  }));

  const handleContinue = async () => {
    if (!selected) {
      Alert.alert("Error", t("onboarding.errorComplete"));
      return;
    }

    const raw = await AsyncStorage.getItem("@register_properties");
    const props = raw ? JSON.parse(raw) : {};
    await AsyncStorage.setItem(
      "@register_properties",
      JSON.stringify({ ...props, somatotype_id: SOMATOTYPE_MAP[selected] })
    );

    router.push("/onboarding/permissions" as any);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <BackButton />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Ionicons name="body" size={50} color={colors.primary} />
          <Text style={styles.title}>{t("onboarding.somatotypeTitle")}</Text>
          <Text style={styles.subtitle}>
            {t("onboarding.somatotypeSubtitle")}
          </Text>
        </View>

        {/* TARJETAS */}
        {SOMATOTYPES.map((item) => {
          const isActive = selected === item.key;
          return (
            <HapticButton
              key={item.key}
              style={[styles.card, isActive && { borderColor: item.color, borderWidth: 2 }]}
              onPress={() => setSelected(item.key)}
              activeOpacity={0.85}
            >
              {/* TOP ROW */}
              <View style={styles.cardTop}>
                <View style={[styles.iconBg, { backgroundColor: `${item.color}22` }]}>
                  <Ionicons name={item.icon} size={28} color={item.color} />
                </View>
                <View style={styles.cardTitles}>
                  <Text style={[styles.cardTitle, { color: item.color }]}>{item.title}</Text>
                  <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
                </View>
                <View style={[styles.radio, isActive && { borderColor: item.color }]}>
                  {isActive && <View style={[styles.radioDot, { backgroundColor: item.color }]} />}
                </View>
              </View>

              {/* DESCRIPCIÓN */}
              <Text style={styles.cardDescription}>{item.description}</Text>

              {/* RASGOS */}
              <View style={styles.traitsRow}>
                {item.traits.map((trait, i) => (
                  <View key={i} style={[styles.trait, { backgroundColor: `${item.color}18` }]}>
                    <Ionicons name="checkmark" size={12} color={item.color} />
                    <Text style={[styles.traitText, { color: item.color }]}>{trait}</Text>
                  </View>
                ))}
              </View>
            </HapticButton>
          );
        })}

        {/* BOTÓN */}
        <HapticButton
          style={[styles.button, !selected && styles.disabled]}
          onPress={handleContinue}
          disabled={!selected}
        >
          <Text style={styles.buttonText}>{t("onboarding.personalContinue")}</Text>
        </HapticButton>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    padding: spacing.screenPadding,
    paddingTop: 100,
    paddingBottom: 40,
  },

  header: {
    alignItems: "center",
    marginBottom: 28,
  },

  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "700",
    marginTop: 8,
    textAlign: "center",
  },

  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 6,
    textAlign: "center",
    lineHeight: 20,
  },

  card: {
    backgroundColor: colors.card,
    borderRadius: spacing.borderRadius,
    padding: 16,
    marginBottom: 14,
    borderWidth: 2,
    borderColor: "transparent",
  },

  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },

  iconBg: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  cardTitles: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  cardSubtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },

  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.textSecondary,
    justifyContent: "center",
    alignItems: "center",
  },

  radioDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
  },

  cardDescription: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 12,
  },

  traitsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },

  trait: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },

  traitText: {
    fontSize: 11,
    fontWeight: "600",
  },

  button: {
    backgroundColor: colors.primary,
    borderRadius: 30,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },

  buttonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
  },

  disabled: {
    opacity: 0.5,
  },
});
