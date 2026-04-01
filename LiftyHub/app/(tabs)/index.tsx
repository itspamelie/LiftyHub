import { FlatList, View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, ScrollView, TouchableWithoutFeedback, ActivityIndicator, RefreshControl, Alert } from "react-native";
import RoutineCard from "@/src/components/routines/RoutineCard";
import FilterButton from "@/src/components/exercises/FilterButton";
import { colors, spacing } from "@/src/styles/globalstyles";
import { Ionicons } from "@expo/vector-icons";
import { useState, useRef, useEffect, useCallback } from "react";
import { Keyboard } from "react-native";
import { useLanguage } from "@/src/context/LanguageContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getRoutines, getUserRoutines, createUserRoutine, deleteUserRoutine } from "@/src/services/api";

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

  const levels = [
    { key: "Principiante", label: t("routines.levels.beginner") },
    { key: "Intermedio",   label: t("routines.levels.intermediate") },
    { key: "Avanzado",     label: t("routines.levels.advanced") },
  ];

  const [routines, setRoutines] = useState<Routine[]>([]);
  const [userRoutines, setUserRoutines] = useState<UserRoutine[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"mine" | "app">("mine");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Todo");
  const [search, setSearch] = useState("");
  const [newRoutine, setNewRoutine] = useState({
    name: "",
    category: "",
    objective: "",
    level: "",
    duration: 0,
    img: "",
  });

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

  useEffect(() => { fetchAll(); }, []);

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

  const resetForm = () =>
    setNewRoutine({ name: "", category: "", objective: "", level: "", duration: 0, img: "" });

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
    <View style={{ flex: 1 }}>

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
                  onPress={() => setModalVisible(true)}
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

      {/* MODAL PARA AGREGAR RUTINA */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <TouchableOpacity
          style={styles.modalBackground}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modalContainer}>

              <TouchableOpacity
                style={styles.addButton2}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="arrow-back" size={20} color="white" />
              </TouchableOpacity>

              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {t("routines.modal.title")}
              </Text>

              <ScrollView
                style={{ width: "100%" }}
                contentContainerStyle={{ paddingVertical: 10 }}
              >

                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  {t("routines.modal.section")}
                </Text>

                <TextInput
                  placeholder={t("routines.modal.name")}
                  placeholderTextColor={colors.textSecondary}
                  value={newRoutine.name}
                  onChangeText={(text) => setNewRoutine({ ...newRoutine, name: text })}
                  style={styles.search2}
                />

                <TextInput
                  placeholder={t("routines.modal.objective")}
                  placeholderTextColor={colors.textSecondary}
                  value={newRoutine.objective}
                  onChangeText={(text) => setNewRoutine({ ...newRoutine, objective: text })}
                  style={styles.search2}
                />

                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  {t("routines.modal.level")}
                </Text>

                <View style={styles.levelContainer}>
                  {levels.map((nivel) => (
                    <TouchableOpacity
                      key={nivel.key}
                      style={[styles.levelButton, newRoutine.level === nivel.key && styles.levelButtonActive]}
                      onPress={() => setNewRoutine({ ...newRoutine, level: nivel.key })}
                    >
                      <Text style={[styles.levelText, newRoutine.level === nivel.key && styles.levelTextActive]}>
                        {nivel.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  {t("routines.modal.type")}
                </Text>

                <View style={styles.categoryContainer}>
                  {filters.slice(1).map((cat) => (
                    <TouchableOpacity
                      key={cat.key}
                      style={[styles.categoryButton, newRoutine.category === cat.key && styles.levelButtonActive]}
                      onPress={() => setNewRoutine({ ...newRoutine, category: cat.key })}
                    >
                      <Text style={[styles.levelText, newRoutine.category === cat.key && styles.levelTextActive]}>
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  {t("routines.modal.duration")}
                </Text>

                <TextInput
                  placeholder={t("routines.modal.durationPlaceholder")}
                  keyboardType="numeric"
                  placeholderTextColor={colors.textSecondary}
                  value={newRoutine.duration ? newRoutine.duration.toString() : ""}
                  onChangeText={(text) => setNewRoutine({ ...newRoutine, duration: Number(text) })}
                  style={styles.search2}
                />

                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  {t("routines.modal.image")}
                </Text>

                <TextInput
                  placeholder={t("routines.modal.imagePlaceholder")}
                  placeholderTextColor={colors.textSecondary}
                  value={newRoutine.img}
                  onChangeText={(text) => setNewRoutine({ ...newRoutine, img: text })}
                  style={styles.search2}
                />

              </ScrollView>

              <TouchableOpacity
                style={styles.addRoutineButton}
                onPress={async () => {
                  if (!newRoutine.name || !newRoutine.objective || !newRoutine.level || !newRoutine.duration || !newRoutine.category) {
                    alert(t("routines.modal.errorEmpty"));
                    return;
                  }

                  try {
                    const token = await AsyncStorage.getItem("token");
                    const userRaw = await AsyncStorage.getItem("user");
                    if (!token || !userRaw) return;

                    const user = JSON.parse(userRaw);
                    const res = await createUserRoutine(
                      {
                        user_id: user.id,
                        name: newRoutine.name.trim(),
                        objective: newRoutine.objective.trim(),
                        level: newRoutine.level,
                        category: newRoutine.category,
                        duration: newRoutine.duration,
                        img: newRoutine.img || undefined,
                      },
                      token
                    );

                    if (res?.data) {
                      setUserRoutines([res.data, ...userRoutines]);
                      listRef.current?.scrollToOffset({ offset: 0, animated: true });
                    }
                  } catch (error) {
                    console.log("Error creando rutina:", error);
                  }

                  Keyboard.dismiss();
                  setModalVisible(false);
                  resetForm();
                }}
              >
                <Text style={styles.modalButtonText}>
                  {t("routines.modal.button")}
                </Text>
              </TouchableOpacity>

            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>

    </View>
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

  addButton2: {
    position: "absolute",
    top: 10,
    left: 20,
    width: 45,
    height: 45,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20
  },

  // TAB SWITCH (igual que profile)
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

  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12
  },

  categoryButton: {
    backgroundColor: colors.card,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: spacing.borderRadius,
    alignItems: "center",
    margin: 4
  },

  levelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12
  },

  levelButton: {
    flex: 1,
    backgroundColor: colors.card,
    paddingVertical: 12,
    borderRadius: spacing.borderRadius,
    alignItems: "center",
    marginHorizontal: 4
  },

  levelButtonActive: {
    backgroundColor: colors.primary
  },

  levelText: {
    color: colors.textSecondary,
    fontWeight: "600"
  },

  levelTextActive: {
    color: "white"
  },

  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center"
  },

  modalContainer: {
    width: "90%",
    borderRadius: 12,
    padding: 20,
    maxHeight: "90%",
    backgroundColor: colors.background
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center"
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 5
  },

  search2: {
    backgroundColor: colors.card,
    borderRadius: spacing.borderRadius,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 16,
    marginBottom: 12
  },

  addRoutineButton: {
    backgroundColor: colors.primary,
    borderRadius: spacing.borderRadius,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    marginTop: 10
  },

  modalButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white"
  }

});
