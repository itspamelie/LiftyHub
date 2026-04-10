import { Tabs, useSegments, router } from "expo-router";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { useLanguage } from "@/src/context/LanguageContext";
import { useSubscription } from "@/src/context/SubscriptionContext";
import { planColors, colors } from "@/src/styles/globalstyles";
import WorkoutMiniPlayer from "@/src/components/WorkoutMiniPlayer";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function TabLabel({ scope, focused, activeColor }: { scope: string; focused: boolean; activeColor?: string }) {
  const { t } = useLanguage();
  return (
    <Text style={{ fontSize: 10, color: focused ? (activeColor ?? "#ffffff") : "#6B7280" }}>
      {t(scope)}
    </Text>
  );
}

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { plan } = useSubscription();
  const membershipColor = planColors[plan?.name ?? "Free"];

  const visibleRoutes = state.routes.filter(r => r.name !== "stats");

  return (
    <View style={[tabStyles.container, { paddingBottom: insets.bottom, height: 70 + insets.bottom }]}>
{visibleRoutes.map((route) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === state.routes.findIndex(r => r.key === route.key);
        const isCenter = route.name === "profile";

        const onPress = () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name as never);
          }
        };

        if (isCenter) {
          return (
            <TouchableOpacity key={route.key} onPress={onPress} style={tabStyles.centerWrapper} activeOpacity={0.85}>
              <View style={[
                tabStyles.centerBtn,
                {
                  backgroundColor: isFocused ? membershipColor : "#2C2C2E",
                  shadowColor: "#000",
                  borderWidth: 2,
                  borderColor: "#3A3A3C",
                }
              ]}>
                <Ionicons name="person" size={22} color="white" />
              </View>
            </TouchableOpacity>
          );
        }

        const color = isFocused ? "#ffffff" : "#6B7280";
        return (
          <TouchableOpacity key={route.key} onPress={onPress} style={tabStyles.tab} activeOpacity={0.7}>
            {options.tabBarIcon?.({ color, size: 22, focused: isFocused })}
            {typeof options.tabBarLabel === "function"
              ? (options.tabBarLabel as any)({ focused: isFocused, color, children: "" })
              : null}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  const { language } = useLanguage();
  const { plan } = useSubscription();
  const membershipColor = planColors[plan?.name ?? "Free"];
  const insets = useSafeAreaInsets();
  const segments = useSegments();
  const isProfile = segments[segments.length - 1] === "profile";


  return (
    <View key={language} style={{ flex: 1 }}>
      <WorkoutMiniPlayer />
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarLabel: ({ focused }) => <TabLabel scope="tabs.routines" focused={focused} />,
            tabBarIcon: ({ color, size }) => <Ionicons name="barbell" size={size} color={color} />,
          }}
        />

        <Tabs.Screen
          name="calendar"
          options={{
            tabBarLabel: ({ focused }) => <TabLabel scope="tabs.calendar" focused={focused} />,
            tabBarIcon: ({ color, size }) => <Ionicons name="calendar" size={size} color={color} />,
          }}
        />

        {/* CENTER TAB */}
        <Tabs.Screen
          name="profile"
          options={{
            tabBarLabel: () => null,
            tabBarIcon: ({ focused, size }) => (
              <Ionicons name="person" size={size} color={focused ? membershipColor : "#6B7280"} />
            ),
          }}
        />

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

        <Tabs.Screen name="stats" options={{ href: null }} />

      </Tabs>

      {/* OVERLAY GLOBAL - botones flotantes */}
      <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
        {/* Botones de perfil: solo visibles en la pestaña de perfil */}
        {isProfile && (
          <>
            <TouchableOpacity
              style={[overlayStyles.floatBtn, { top: insets.top + 12, left: 20 }]}
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push("/friends"); }}
            >
              <Ionicons name="people" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[overlayStyles.floatBtn, { top: insets.top + 12, right: 20 }]}
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push("/edit-profile"); }}
            >
              <Ionicons name="pencil" size={20} color="white" />
            </TouchableOpacity>
          </>
        )}
        {/* Botón avatar corporal: visible en todos los tabs */}
        <TouchableOpacity
          style={[overlayStyles.bodyBtn, { bottom: 70 + insets.bottom + 12, right: 20, backgroundColor: membershipColor }]}
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push("/body-avatar"); }}
          activeOpacity={0.85}
        >
          <Ionicons name="body" size={22} color="white" />
        </TouchableOpacity>
      </View>

    </View>
  );
}

const tabStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#131313",
    borderTopWidth: 1,
    borderTopColor: "#2C2C2E",
    alignItems: "center",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    paddingTop: 8,
  },
  centerWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 8,
  },
  centerBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
});

const overlayStyles = StyleSheet.create({
  floatBtn: {
    position: "absolute",
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  bodyBtn: {
    position: "absolute",
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#3A3A3C",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
});
