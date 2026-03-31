import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Text, View } from "react-native";
import { useLanguage } from "@/src/context/LanguageContext";

function TabLabel({ scope, focused }: { scope: string; focused: boolean }) {
  const { t } = useLanguage();
  return (
    <Text style={{ fontSize: 10, color: focused ? "#ffffff" : "#6B7280" }}>
      {t(scope)}
    </Text>
  );
}

export default function TabLayout() {
  const { language } = useLanguage();
  return (
    <View key={language} style={{ flex: 1 }}>
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
          tabBarLabel: ({ focused }) => <TabLabel scope="tabs.routines" focused={focused} />,
          tabBarIcon: ({ color, size }) => <Ionicons name="barbell" size={size} color={color} />,
        }}
      />

      <Tabs.Screen name="stats" options={{ href: null }} />

      <Tabs.Screen
        name="exercises"
        options={{
          tabBarLabel: ({ focused }) => <TabLabel scope="tabs.exercises" focused={focused} />,
          tabBarIcon: ({ color, size }) => <Ionicons name="fitness" size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="diet"
        options={{
          tabBarLabel: ({ focused }) => <TabLabel scope="tabs.diet" focused={focused} />,
          tabBarIcon: ({ color, size }) => <Ionicons name="nutrition" size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: ({ focused }) => <TabLabel scope="tabs.profile" focused={focused} />,
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
        }}
      />

    </Tabs>
    </View>
  );
}
