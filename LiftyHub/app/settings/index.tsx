import { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import SettingsItem from "@/src/components/settings/SettingsItem";
import SettingsSwitchItem from "@/src/components/settings/SettingsSwitchItem";
import BackButton from "@/src/components/buttons/backButton";
import { deleteAccount } from "@/src/services/api";
import { useLanguage } from "@/src/context/LanguageContext";

export default function Settings() {

  const { t, language, changeLanguage } = useLanguage();
  const [notifications, setNotifications] = useState(false);
  const [units, setUnits] = useState("kg");

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      router.replace("/auth/login");
    } catch (error) {
      console.log("Error al cerrar sesión:", error);
    }
  };

  const saveUnits = async (value: string) => {
    try {
      setUnits(value);
      await AsyncStorage.setItem("@liftyhub_units", value);
    } catch (error) {
      console.log("Error saving units", error);
    }
  };

  const handleUnits = () => {
    Alert.alert(
      t("settings.unitsTitle"),
      t("settings.unitsMessage"),
      [
        { text: t("settings.unitsKg"), onPress: () => saveUnits("kg") },
        { text: t("settings.unitsLb"), onPress: () => saveUnits("lb") },
        { text: t("settings.cancel"), style: "cancel" }
      ]
    );
  };

  const handleLanguage = () => {
    Alert.alert(
      t("settings.languageTitle"),
      t("settings.languageMessage"),
      [
        { text: t("settings.langEs"), onPress: () => changeLanguage("es") },
        { text: t("settings.langEn"), onPress: () => changeLanguage("en") },
        { text: t("settings.cancel"), style: "cancel" }
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      t("settings.logoutTitle"),
      t("settings.logoutMessage"),
      [
        { text: t("settings.cancel"), style: "cancel" },
        { text: t("settings.logout"), style: "destructive", onPress: logout }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      t("settings.deleteTitle"),
      t("settings.deleteMessage"),
      [
        { text: t("settings.cancel"), style: "cancel" },
        {
          text: t("settings.deleteBtn"),
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("token");
              const userRaw = await AsyncStorage.getItem("user");
              if (!token || !userRaw) return;

              const user = JSON.parse(userRaw);
              await deleteAccount(user.id, token);

              await AsyncStorage.removeItem("token");
              await AsyncStorage.removeItem("user");
              router.replace("/auth/login");
            } catch (error) {
              Alert.alert("Error", t("settings.errorDelete"));
            }
          }
        }
      ]
    );
  };

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const savedUnits = await AsyncStorage.getItem("@liftyhub_units");
        if (savedUnits !== null) setUnits(savedUnits);
      } catch (error) {
        console.log("Error loading preferences", error);
      }
    };
    loadPreferences();
  }, []);

  return (
    <View style={styles.container}>

      <BackButton />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        <Text style={styles.title}>{t("settings.title")}</Text>

        {/* PLAN */}
        <Text style={styles.section}>{t("settings.plan")}</Text>
        <View style={styles.card}>
          <SettingsItem
            icon="diamond-outline"
            label={t("settings.myPlan")}
            value={t("settings.freePlan")}
          />
          <View style={styles.divider} />
          <SettingsItem
            icon="sparkles-outline"
            label={t("settings.viewPlans")}
            showArrow
            onPress={() => router.push("/settings/plans")}
          />
        </View>

        {/* PREFERENCIAS */}
        <Text style={styles.section}>{t("settings.preferences")}</Text>
        <View style={styles.card}>
          <SettingsItem
            icon="moon-outline"
            label={t("settings.theme")}
            value={t("settings.dark")}
          />
          <View style={styles.divider} />
          <SettingsItem
            icon="barbell-outline"
            label={t("settings.units")}
            value={units}
            onPress={handleUnits}
            showArrow
          />
          <View style={styles.divider} />
          <SettingsItem
            icon="language-outline"
            label={t("settings.language")}
            value={language === "es" ? t("settings.langEs") : t("settings.langEn")}
            onPress={handleLanguage}
            showArrow
          />
        </View>

        {/* ENTRENAMIENTO */}
        <Text style={styles.section}>{t("settings.workout")}</Text>
        <View style={styles.card}>
          <SettingsSwitchItem
            icon="notifications-outline"
            label={t("settings.reminders")}
            value={notifications}
            onChange={setNotifications}
          />
          <View style={styles.divider} />
          <SettingsItem
            icon="volume-high-outline"
            label={t("settings.workoutSounds")}
          />
        </View>

        {/* ACERCA DE */}
        <Text style={styles.section}>{t("settings.about")}</Text>
        <View style={styles.card}>
          <SettingsItem
            icon="information-circle-outline"
            label={t("settings.aboutLiftyHub")}
            showArrow
            onPress={() => router.push("/settings/about")}
          />
          <View style={styles.divider} />
          <SettingsItem
            icon="document-text-outline"
            label={t("settings.privacy")}
            showArrow
            onPress={() => router.push("/settings/privacy")}
          />
          <View style={styles.divider} />
          <SettingsItem
            icon="code-outline"
            label={t("settings.version")}
            value="1.0.0"
          />
        </View>

        {/* CUENTA */}
        <Text style={styles.section}>{t("settings.account")}</Text>
        <View style={styles.card}>
          <SettingsItem
            icon="log-out-outline"
            label={t("settings.logout")}
            danger
            onPress={handleLogout}
          />
          <View style={styles.divider} />
          <SettingsItem
            icon="trash-outline"
            label={t("settings.deleteAccount")}
            danger
            onPress={handleDeleteAccount}
          />
        </View>

      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#0F0F10"
  },

  content: {
    padding: 20,
    paddingTop: 120,
    paddingBottom: 80
  },

  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },

  section: {
    color: "#A1A1A1",
    marginTop: 20,
    marginBottom: 10,
    fontSize: 14
  },

  card: {
    backgroundColor: "#1C1C1E",
    borderRadius: 16,
    paddingVertical: 6
  },

  divider: {
    height: 1,
    backgroundColor: "#2A2A2A",
    marginHorizontal: 16
  },

});
