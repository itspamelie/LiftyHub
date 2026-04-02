import { FlatList, View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, RefreshControl, Alert } from "react-native";
import RoutineCard from "@/src/components/routines/RoutineCard";
import FilterButton from "@/src/components/exercises/FilterButton";
import { colors, spacing } from "@/src/styles/globalstyles";
import { Ionicons } from "@expo/vector-icons";
import { useState, useRef, useCallback } from "react";
import { useFocusEffect, router } from "expo-router";
import { useLanguage } from "@/src/context/LanguageContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getRoutines, getUserRoutines, deleteUserRoutine } from "@/src/services/api";

const defaultImages = [
  "https://images.unsplash.com/photo-1599058917765-a780eda07a3e",
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
  "https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a",
  "https://images.unsplash.com/photo-1546483875-ad9014c88eba",
  "https://images.unsplash.com/photo-1518611012118-696072aa579a"
];
const getRoutineImage = (img: string | null | undefined, id: number) => {
  if (!img || img === "default.jpg") return defaultImages[id % defaultImages.length];
  if (img.startsWith("http")) return img;
  const base = (process.env.EXPO_PUBLIC_API_URL ?? "").replace(/\/api$/, "");
  return `${base}/routines/${img}`;
};

// ---------------------- TIPOS ----------------------
type Routine = {
  id: number;
  name: string;
  category: string;
  objective: string;
  level: string;
  duration: number;
  img: string;
  plan_id: number;
  somatotype_id: number;
};

type UserRoutine = {
  id: number;
  user_id: number;
  name: string;
  category: string;
  objective: string;
  level: string;
  duration: number;
  img: string | null;
};

// ---------------------- COMPONENTE ----------------------
export default function RoutinesScreen() {

  const { t } = useLanguage();
  const listRef = useRef<FlatList>(null);

  const filters = [
    { key: "Todo",      label: t("routines.categories.all") },
    { key: "Fuerza",    label: t("routines.categories.strength") },
    { key: "Movilidad", label: t("routines.categories.mobility") },
    { key: "Cardio",    label: t("routines.categories.cardio") },
    { key: "HIIT",      label: t("routines.categories.hiit") },
    { key: "Full Body", label: t("routines.categories.fullBody") },
  ];

  const [routines, setRoutines] = useState<Routine[]>([]);
  const [userRoutines, setUserRoutines] = useState<UserRoutine[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"mine" | "app">("mine");
  const [selectedFilter, setSelectedFilter] = useState("Todo");
  const [search, setSearch] = useState("");

  const fetchAll = useCallback(async (isRefresh = false) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userRaw = await AsyncStorage.getItem("user");
      if (!token || !userRaw) return;

      const user = JSON.parse(userRaw);

      const [resRoutines, resUserRoutines] = await Promise.all([
        getRoutines(token),
        getUserRoutines(user.id, token),
      ]);

      if (resRoutines?.data) setRoutines(resRoutines.data);
      if (resUserRoutines?.data) setUserRoutines(resUserRoutines.data);
    } catch (error) {
      console.log("Error cargando rutinas:", error);
    } finally {
      if (isRefresh) setRefreshing(false);
      else setLoading(false);
    }
  }, []);

  // Recarga la lista al volver de la pantalla de nueva rutina
  useFocusEffect(
    useCallback(() => {
      fetchAll();
    }, [fetchAll])
  );

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAll(true);
  }, [fetchAll]);

  const handleTabSwitch = (tab: "mine" | "app") => {
    setActiveTab(tab);
    setSelectedFilter("Todo");
    setSearch("");
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
  };

  const activeData = (activeTab === "mine" ? userRoutines : routines).filter((r) => {
    const matchCategory = selectedFilter === "Todo" || r.category === selectedFilter;
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleDeleteRoutine = (id: number) => {
    Alert.alert(
      "Eliminar rutina",
      "¿Estás seguro de que quieres eliminar esta rutina?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("token");
              if (!token) return;
              await deleteUserRoutine(id, token);
              setUserRoutines((prev) => prev.filter((r) => r.id !== id));
            } catch (error) {
              console.log("Error eliminando rutina:", error);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <FlatList
      ref={listRef}
      style={styles.container}
      data={activeData}
      keyExtractor={(item) => `${activeTab}-${item.id}`}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary} />
      }
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Ionicons name="barbell-outline" size={60} color={colors.textSecondary} />
          <Text style={styles.emptyTitle}>{t("routines.empty")}</Text>
          <Text style={styles.emptyText}>
            {activeTab === "mine" ? t("routines.noUserRoutines") : t("routines.emptyHint")}
          </Text>
        </View>
      }
      ListHeaderComponent={
        <>
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.title}>{t("routines.title")}</Text>
            <Text style={styles.subtitle}>{t("routines.subtitle")}</Text>

            <TextInput
              placeholder={t("routines.search")}
              placeholderTextColor={colors.textSecondary}
              style={styles.search}
              value={search}
              onChangeText={setSearch}
            />

            {activeTab === "mine" && (
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => router.push("/routines/new")}
              >
                <Ionicons name="pencil" size={20} color="white" />
              </TouchableOpacity>
            )}
          </View>

          {/* TAB SWITCH */}
          <View style={styles.tabRow}>
            <TouchableOpacity
              style={[styles.tabBtn, activeTab === "mine" && styles.tabBtnActive]}
              onPress={() => handleTabSwitch("mine")}
            >
              <Text style={[styles.tabBtnText, activeTab === "mine" && styles.tabBtnTextActive]}>
                {t("routines.myRoutines")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabBtn, activeTab === "app" && styles.tabBtnActive]}
              onPress={() => handleTabSwitch("app")}
            >
              <Text style={[styles.tabBtnText, activeTab === "app" && styles.tabBtnTextActive]}>
                {t("routines.appRoutines")}
              </Text>
            </TouchableOpacity>
          </View>

          {/* FILTROS */}
          <FlatList
            data={filters}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.key}
            style={styles.filters}
            renderItem={({ item }) => (
              <FilterButton
                label={item.label}
                active={selectedFilter === item.key}
                onPress={() => setSelectedFilter(item.key)}
              />
            )}
          />
        </>
      }
      renderItem={({ item }) => (
        <RoutineCard
          title={item.name}
          duration={`${item.duration} min`}
          level={item.level}
          category={item.category}
          image={getRoutineImage(item.img, item.id)}
          onDelete={activeTab === "mine" ? () => handleDeleteRoutine(item.id) : undefined}
        />
      )}
    />
  );
}

// ---------------------- ESTILOS ----------------------
const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.background
  },

  content: {
    padding: spacing.screenPadding,
    paddingBottom: 40
  },

  header: {
    marginBottom: 16
  },

  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 40
  },

  subtitle: {
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 16
  },

  search: {
    backgroundColor: colors.card,
    borderRadius: spacing.borderRadius,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 16
  },

  addButton: {
    position: "absolute",
    top: 40,
    right: 0,
    width: 45,
    height: 45,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20
  },

  tabRow: {
    flexDirection: "row",
    backgroundColor: "#1C1C1E",
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },

  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10
  },

  tabBtnActive: {
    backgroundColor: colors.primary
  },

  tabBtnText: {
    color: "#A1A1A1",
    fontSize: 14,
    fontWeight: "600"
  },

  tabBtnTextActive: {
    color: "white"
  },

  filters: {
    marginBottom: 20
  },

  emptyContainer: {
    alignItems: "center",
    marginTop: 60
  },

  emptyTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "600",
    marginTop: 10
  },

  emptyText: {
    color: colors.textSecondary,
    marginTop: 5,
    textAlign: "center"
  },

});
