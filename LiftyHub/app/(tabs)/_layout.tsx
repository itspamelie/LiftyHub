import { Tabs, router } from "expo-router";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Text, View, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { useState, useRef, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

  const [fabOpen, setFabOpen] = useState(false);
  const fabAnim = useRef(new Animated.Value(0)).current;
  const [hydrationCount, setHydrationCount] = useState(0);
  const HYDRATION_GOAL = 8;
  const hydrationFillAnim = useRef(new Animated.Value(0)).current;
  const hydrationTransAnim = useRef(new Animated.Value(0)).current; // 0=icon, 1=number
  const hydrationCountTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hydrationTapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hydrationTapCount = useRef(0);
  const hydrationIconOpacity = hydrationTransAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });
  const hydrationNumOpacity  = hydrationTransAnim;

  const animateHydrationBtn = (value: number) => {
    Animated.spring(hydrationFillAnim, {
      toValue: 48 * Math.min(value / HYDRATION_GOAL, 1),
      useNativeDriver: false,
      tension: 80,
      friction: 8,
    }).start();
  };

  const loadHydration = async () => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const date = await AsyncStorage.getItem("@liftyhub_hydration_date");
      if (date !== today) { setHydrationCount(0); animateHydrationBtn(0); return; }
      const count = parseInt((await AsyncStorage.getItem("@liftyhub_hydration_count")) ?? "0");
      setHydrationCount(count);
      animateHydrationBtn(count);
    } catch {}
  };

  const updateHydration = async (next: number) => {
    setHydrationCount(next);
    animateHydrationBtn(next);
    if (hydrationCountTimer.current) clearTimeout(hydrationCountTimer.current);
    Animated.timing(hydrationTransAnim, { toValue: 1, duration: 180, useNativeDriver: true }).start();
    hydrationCountTimer.current = setTimeout(() => {
      Animated.timing(hydrationTransAnim, { toValue: 0, duration: 180, useNativeDriver: true }).start();
    }, 1500);
    try {
      const today = new Date().toISOString().slice(0, 10);
      await AsyncStorage.setItem("@liftyhub_hydration_date", today);
      await AsyncStorage.setItem("@liftyhub_hydration_count", String(next));
    } catch {}
  };

  const addHydration = async () => {
    hydrationTapCount.current += 1;
    if (hydrationTapTimer.current) clearTimeout(hydrationTapTimer.current);

    hydrationTapTimer.current = setTimeout(async () => {
      const taps = hydrationTapCount.current;
      hydrationTapCount.current = 0;

      if (taps >= 2) {
        // Doble tap → restar
        if (hydrationCount <= 0) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        await updateHydration(Math.max(0, hydrationCount - 1));
      } else {
        // Tap simple → sumar
        if (hydrationCount >= HYDRATION_GOAL) return;
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        await updateHydration(hydrationCount + 1);
      }
    }, 250);
  };


  useEffect(() => { loadHydration(); }, []);

  const toggleFab = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (!fabOpen) loadHydration();
    const toValue = fabOpen ? 0 : 1;
    setFabOpen(!fabOpen);
    Animated.spring(fabAnim, {
      toValue,
      useNativeDriver: true,
      tension: 90,
      friction: 8,
    }).start();
  };

  const closeFab = (callback?: () => void) => {
    setFabOpen(false);
    Animated.spring(fabAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 90,
      friction: 8,
    }).start(() => callback?.());
  };

  const btn1TranslateY = fabAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -64] });
  const btn2TranslateY = fabAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -128] });
  const btn3TranslateY = fabAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -192] });
  const subScale = fabAnim.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] });
  const subOpacity = fabAnim;


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

      {/* SPEED DIAL — músculos + IA */}
      <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">

        {/* Overlay para cerrar al tocar fuera */}
        {fabOpen && (
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            activeOpacity={1}
            onPress={() => closeFab()}
          />
        )}

        {/* Sub-btn 1: Hidratación — tap = +1 vaso, long press = pantalla */}
        <Animated.View
          pointerEvents={fabOpen ? "auto" : "none"}
          style={[
            overlayStyles.bodyBtn,
            {
              bottom: 70 + insets.bottom + 12,
              right: 20,
              backgroundColor: "#0c2340",
              overflow: "hidden",
              opacity: subOpacity,
              transform: [{ translateY: btn1TranslateY }, { scale: subScale }],
            },
          ]}
        >
          <Animated.View style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            height: hydrationFillAnim,
            backgroundColor: "#3B82F6",
          }} />
          <TouchableOpacity
            style={overlayStyles.subBtnInner}
            onPress={addHydration}
            onLongPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); closeFab(() => router.push("/hydration" as any)); }}
            delayLongPress={400}
            activeOpacity={0.85}
          >
            <Animated.View style={{ position: "absolute", opacity: hydrationIconOpacity }}>
              <Ionicons name="water" size={20} color="white" />
            </Animated.View>
            <Animated.View style={{ position: "absolute", opacity: hydrationNumOpacity }}>
              <Text style={{ color: "white", fontWeight: "800", fontSize: 15 }}>{hydrationCount}</Text>
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>

        {/* Sub-btn 2: Músculos trabajados */}
        <Animated.View
          pointerEvents={fabOpen ? "auto" : "none"}
          style={[
            overlayStyles.bodyBtn,
            {
              bottom: 70 + insets.bottom + 12,
              right: 20,
              backgroundColor: membershipColor,
              opacity: subOpacity,
              transform: [{ translateY: btn2TranslateY }, { scale: subScale }],
            },
          ]}
        >
          <TouchableOpacity
            style={overlayStyles.subBtnInner}
            onPress={() => closeFab(() => router.push("/body-avatar"))}
            activeOpacity={0.85}
          >
            <Ionicons name="body" size={20} color="white" />
          </TouchableOpacity>
        </Animated.View>

        {/* Sub-btn 3: Generar rutina con IA */}
        <Animated.View
          pointerEvents={fabOpen ? "auto" : "none"}
          style={[
            overlayStyles.bodyBtn,
            {
              bottom: 70 + insets.bottom + 12,
              right: 20,
              backgroundColor: "#8B5CF6",
              opacity: subOpacity,
              transform: [{ translateY: btn3TranslateY }, { scale: subScale }],
            },
          ]}
        >
          <TouchableOpacity
            style={overlayStyles.subBtnInner}
            onPress={() => closeFab(() => router.push("/routines/generate" as any))}
            activeOpacity={0.85}
          >
            <MaterialCommunityIcons name="robot-outline" size={22} color="white" />
          </TouchableOpacity>
        </Animated.View>

        {/* Botón principal */}
        <TouchableOpacity
          style={[
            overlayStyles.bodyBtn,
            {
              bottom: 70 + insets.bottom + 12,
              right: 20,
              backgroundColor: fabOpen ? "#374151" : membershipColor,
            },
          ]}
          onPress={toggleFab}
          activeOpacity={0.85}
        >
          <Ionicons name={fabOpen ? "close" : "menu"} size={22} color="white" />
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
  subBtnInner: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
