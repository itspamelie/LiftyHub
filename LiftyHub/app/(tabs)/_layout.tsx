import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLanguage } from "@/src/context/LanguageContext";

export default function TabLayout() {
  const { t } = useLanguage();
  return (
    <Tabs
      screenListeners={{
        tabPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      }}
      screenOptions={{
        headerShown: false,

        tabBarStyle: {
          backgroundColor: "#131313",
          borderTopWidth: 0,
          height: 70
        },

        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "#6B7280"
      }}
    >

      <Tabs.Screen
        name="index"
        options={{
          title: t("tabs.routines"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="barbell" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="stats"
        options={{
          href: null
        }}
      />

      

      <Tabs.Screen
        name="exercises"
        options={{
          title: t("tabs.exercises"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="fitness" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="diet"
        options={{
          title: t("tabs.diet"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="nutrition" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: t("tabs.profile"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
  name="settings"
  options={{
    title: t("tabs.settings"),
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="settings-outline" size={size} color={color} />
    ),
  }}
/>

    </Tabs>
  );
}