import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import { colors, spacing } from "@/src/styles/globalstyles";
import { useLanguage } from "@/src/context/LanguageContext";
import HapticButton from "@/src/components/buttons/HapticButton";

export default function PrivacyScreen() {
  const { t } = useLanguage();

  return (
    <View style={styles.container}>

      <Stack.Screen options={{ headerShown: false }} />

      {/* HEADER ESTÁTICO */}
      <View style={styles.header}>
        <HapticButton style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="white" />
        </HapticButton>
        <Text style={styles.headerTitle}>{t("privacy.title")}</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.date}>{t("privacy.lastUpdated")}</Text>

        <Text style={styles.section}>{t("privacy.s1Title")}</Text>
        <Text style={styles.text}>{t("privacy.s1Text")}</Text>

        <Text style={styles.section}>{t("privacy.s2Title")}</Text>
        <Text style={styles.text}>{t("privacy.s2Intro")}</Text>
        <Text style={styles.bullet}>{t("privacy.s2b1")}</Text>
        <Text style={styles.bullet}>{t("privacy.s2b2")}</Text>
        <Text style={styles.bullet}>{t("privacy.s2b3")}</Text>
        <Text style={styles.bullet}>{t("privacy.s2b4")}</Text>
        <Text style={styles.bullet}>{t("privacy.s2b5")}</Text>
        <Text style={styles.bullet}>{t("privacy.s2b6")}</Text>

        <Text style={styles.section}>{t("privacy.s3Title")}</Text>
        <Text style={styles.text}>{t("privacy.s3Intro")}</Text>
        <Text style={styles.bullet}>{t("privacy.s3b1")}</Text>
        <Text style={styles.bullet}>{t("privacy.s3b2")}</Text>
        <Text style={styles.bullet}>{t("privacy.s3b3")}</Text>
        <Text style={styles.bullet}>{t("privacy.s3b4")}</Text>

        <Text style={styles.section}>{t("privacy.s4Title")}</Text>
        <Text style={styles.text}>{t("privacy.s4Text")}</Text>

        <Text style={styles.section}>{t("privacy.s5Title")}</Text>
        <Text style={styles.text}>{t("privacy.s5Text")}</Text>

        <Text style={styles.section}>{t("privacy.s6Title")}</Text>
        <Text style={styles.text}>{t("privacy.s6Intro")}</Text>
        <Text style={styles.bullet}>{t("privacy.s6b1")}</Text>
        <Text style={styles.bullet}>{t("privacy.s6b2")}</Text>
        <Text style={styles.bullet}>{t("privacy.s6b3")}</Text>

        <Text style={styles.section}>{t("privacy.s7Title")}</Text>
        <Text style={styles.text}>{t("privacy.s7Text")}</Text>

        <Text style={styles.section}>{t("privacy.s8Title")}</Text>
        <Text style={styles.text}>{t("privacy.s8Text")}</Text>

        <Text style={styles.section}>{t("privacy.s9Title")}</Text>
        <Text style={styles.text}>{t("privacy.s9Intro")}</Text>
        <Text style={styles.bullet}>{t("privacy.s9b1")}</Text>
        <Text style={styles.bullet}>{t("privacy.s9b2")}</Text>

        <Text style={styles.footer}>{t("privacy.footer")}</Text>

      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.background
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: colors.background,
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.card,
  },

  backBtn: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center"
  },

  headerTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "700"
  },

  scroll: {
    flex: 1
  },

  content: {
    padding: spacing.screenPadding,
    paddingTop: 10,
    paddingBottom: 40
  },

  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 6
  },

  date: {
    color: colors.textSecondary,
    fontSize: 13,
    marginBottom: 24
  },

  section: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "600",
    marginTop: 24,
    marginBottom: 8
  },

  text: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 8
  },

  bullet: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 4,
    paddingLeft: 8
  },

  footer: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 32,
    marginBottom: 20,
    textAlign: "center"
  }

});
