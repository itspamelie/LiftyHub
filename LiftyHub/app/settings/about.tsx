import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import { colors, spacing } from "@/src/styles/globalstyles";
import { useLanguage } from "@/src/context/LanguageContext";

export default function AboutScreen() {
  const { t } = useLanguage();

  return (

    <View style={styles.container}>

      <Stack.Screen options={{ headerShown: false }} />

      {/* HEADER ESTÁTICO */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("about.title")}</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>

        <Text style={styles.section}>{t("about.missionTitle")}</Text>
        <Text style={styles.text}>{t("about.missionText")}</Text>

        <Text style={styles.section}>{t("about.whatTitle")}</Text>
        <Text style={styles.text}>{t("about.whatText")}</Text>

        <Text style={styles.section}>{t("about.teamTitle")}</Text>

        <View style={styles.memberCard}>
          <Ionicons name="person-circle-outline" size={40} color="#3B82F6" />
          <View style={styles.memberInfo}>
            <Text style={styles.memberName}>Pamela Martinez Moreno</Text>
            <Text style={styles.memberRole}>{t("about.developerF")}</Text>
          </View>
        </View>

        <View style={styles.memberCard}>
          <Ionicons name="person-circle-outline" size={40} color="#3B82F6" />
          <View style={styles.memberInfo}>
            <Text style={styles.memberName}>Angel David Hinojos Vega</Text>
            <Text style={styles.memberRole}>{t("about.developer")}</Text>
          </View>
        </View>

        <Text style={styles.section}>{t("about.contactTitle")}</Text>
        <Text style={styles.text}>support@liftyhub.app</Text>

        <Text style={styles.version}>{t("about.version")}</Text>
        <Text style={styles.footer}>{t("about.copyright")}</Text>

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
    paddingTop: 10
  },

  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20
  },

  text: {
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16
  },

  section: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "600",
    marginTop: 24,
    marginBottom: 10
  },

  memberCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1C1E",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    gap: 12
  },

  memberInfo: {
    flex: 1
  },

  memberName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600"
  },

  memberRole: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 2
  },

  version: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 24
  },

  footer: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 6,
    marginBottom: 20
  }

});