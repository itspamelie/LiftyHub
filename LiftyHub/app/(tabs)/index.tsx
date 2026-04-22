import { FlatList, View, Text, StyleSheet, TextInput, ActivityIndicator, RefreshControl, Alert, Modal, Dimensions, ScrollView, Linking } from "react-native";
import RoutineCard from "@/src/components/routines/RoutineCard";
import FilterButton from "@/src/components/exercises/FilterButton";
import { colors, spacing } from "@/src/styles/globalstyles";
import { Ionicons } from "@expo/vector-icons";
import { useState, useRef, useCallback, useEffect } from "react";
import { useFocusEffect, router } from "expo-router";
import { useLanguage } from "@/src/context/LanguageContext";
import { useSubscription } from "@/src/context/SubscriptionContext";
import { BlurView } from "expo-blur";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Storage from "@/src/utils/storage";
import { CameraView, useCameraPermissions } from "expo-camera";
import { getRoutines, getUserRoutines, deleteUserRoutine, createUserRoutine } from "@/src/services/api";
import { useToast } from "@/src/hooks/useToast";
import { useNetworkStatus } from "@/src/hooks/useNetworkStatus";
import { saveCache, loadCache } from "@/src/utils/cache";
import OfflineBanner from "@/src/components/OfflineBanner";
import HapticButton from "@/src/components/buttons/HapticButton";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");


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

  const { showToast, Toast } = useToast();
  const { t } = useLanguage();
  const { plan, loading: subLoading } = useSubscription();

  const PLAN_OPTIONS = [
    {
      name: "Basic",
      price: "$99/mes",
      color: "#3B82F6",
      features: [t("plans.features.exercises"), t("plans.features.routines20"), t("plans.features.stats")],
    },
    {
      name: "Pro",
      price: "$600/mes",
      color: "#F59E0B",
      features: [t("plans.features.routinesUnlimited"), t("plans.features.shareRoutinesUnlimited"), t("plans.features.nutritionist"), t("plans.features.dietPlan")],
      highlighted: true,
    },
  ];
  const isConnected = useNetworkStatus();
  const hasAppAccess = plan?.name !== "Free";
  const listRef = useRef<FlatList>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const filters = [
    { key: "Todo",      label: t("routines.categories.all") },
    { key: "Favoritos", label: t("routines.categories.favorites") },
    { key: "Fuerza",    label: t("routines.categories.strength") },
    { key: "Movilidad", label: t("routines.categories.mobility") },
    { key: "Cardio",    label: t("routines.categories.cardio") },
    { key: "HIIT",      label: t("routines.categories.hiit") },
    { key: "Full Body", label: t("routines.categories.fullBody") },
  ];

  const [routines, setRoutines] = useState<Routine[]>([]);
  const [userRoutines, setUserRoutines] = useState<UserRoutine[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [activeTab, setActiveTab] = useState<"mine" | "app">("mine");
  const [selectedFilter, setSelectedFilter] = useState("Todo");
  const [search, setSearch] = useState("");

  // QR Import
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [showScanner, setShowScanner] = useState(false);
  const [scannedData, setScannedData] = useState<{
    app: string;
    name: string;
    objective?: string;
    level?: string;
    category?: string;
    duration?: number;
    exercises?: { name: string; sets: number; reps: number }[];
  } | null>(null);
  const [importing, setImporting] = useState(false);
  const scanLock = useRef(false);
  const [scannerUsed, setScannerUsed] = useState(false);
  const [showScannerWarning, setShowScannerWarning] = useState(false);
  const [nextScanDate, setNextScanDate] = useState<Date | null>(null);
  const [showCameraPermModal, setShowCameraPermModal] = useState(false);

  useEffect(() => {
    const checkScannerDate = async () => {
      try {
        const val = await AsyncStorage.getItem("@liftyhub_scanner_date");
        if (!val) return;
        const last = new Date(val);
        const next = new Date(last);
        next.setMonth(next.getMonth() + 1);
        if (new Date() < next) {
          setScannerUsed(true);
          setNextScanDate(next);
        }
      } catch {}
    };
    checkScannerDate();
  }, []);

  const openScannerCamera = async () => {
    if (cameraPermission?.granted) {
      scanLock.current = false;
      setShowScanner(true);
      return;
    }
    // Permiso denegado por el SO → no se puede volver a pedir, guiar a Ajustes
    if (cameraPermission?.status === "denied") {
      setShowCameraPermModal(true);
      return;
    }
    // Permiso aún no solicitado → mostrar modal explicativo primero
    setShowCameraPermModal(true);
  };

  const handleRequestCameraPermission = async () => {
    setShowCameraPermModal(false);
    if (cameraPermission?.status === "denied") {
      Linking.openSettings();
      return;
    }
    const { granted } = await requestCameraPermission();
    if (granted) {
      scanLock.current = false;
      setShowScanner(true);
    } else {
      setShowCameraPermModal(true); // muestra modal de ajustes
    }
  };

  const handleOpenScanner = () => {
    if (!hasAppAccess) {
      if (scannerUsed) {
        setShowUpgradeModal(true);
      } else {
        setShowScannerWarning(true);
      }
      return;
    }
    openScannerCamera();
  };

  const handleScannerWarningConfirm = async () => {
    setShowScannerWarning(false);
    const now = new Date().toISOString();
    await AsyncStorage.setItem("@liftyhub_scanner_date", now);
    setScannerUsed(true);
    const next = new Date();
    next.setMonth(next.getMonth() + 1);
    setNextScanDate(next);
    openScannerCamera();
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanLock.current) return;
    try {
      const parsed = JSON.parse(data);
      if (parsed?.app !== "liftyhub") {
        showToast(t("routines.qrInvalid"), "error");
        return;
      }
      scanLock.current = true;
      setShowScanner(false);
      setScannedData(parsed);
    } catch {
      showToast(t("routines.qrError"), "error");
    }
  };

  const handleImportRoutine = async () => {
    if (!scannedData) return;
    setImporting(true);
    try {
      const token = await Storage.getItem("token");
      const userRaw = await Storage.getItem("user");
      if (!token || !userRaw) return;
      const user = JSON.parse(userRaw);

      await createUserRoutine({
        user_id: user.id,
        name: scannedData.name,
        objective: scannedData.objective ?? "",
        level: scannedData.level ?? "",
        category: scannedData.category ?? "",
        duration: Number(scannedData.duration) || 30,
      }, token);

      setScannedData(null);
      fetchAll();
      showToast(t("routines.importSuccess", { name: scannedData.name }), "success");
    } catch {
      showToast(t("routines.importError"), "error");
    } finally {
      setImporting(false);
    }
  };

  const favKey = (tab: "mine" | "app") => `@liftyhub_favorites_${tab}`;

  const loadFavorites = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(favKey(activeTab));
      setFavorites(new Set(raw ? JSON.parse(raw) : []));
    } catch {}
  }, [activeTab]);

  const toggleFavorite = async (id: number) => {
    const key = favKey(activeTab);
    const itemKey = String(id);
    const next = new Set(favorites);
    if (next.has(itemKey)) next.delete(itemKey);
    else next.add(itemKey);
    setFavorites(next);
    try {
      await AsyncStorage.setItem(key, JSON.stringify([...next]));
    } catch {}
  };

  const fetchAll = useCallback(async (isRefresh = false) => {
    try {
      const token = await Storage.getItem("token");
      const userRaw = await Storage.getItem("user");
      if (!token || !userRaw) return;

      const user = JSON.parse(userRaw);

      const [resRoutines, resUserRoutines] = await Promise.allSettled([
        getRoutines(token),
        getUserRoutines(user.id, token),
      ]);

      let hasError = false;

      if (resRoutines.status === "fulfilled" && resRoutines.value?.data) {
        setRoutines(resRoutines.value.data);
        await saveCache("routines", resRoutines.value.data);
      } else {
        const cached = await loadCache<Routine[]>("routines");
        if (cached) setRoutines(cached);
        else hasError = true;
      }

      if (resUserRoutines.status === "fulfilled" && resUserRoutines.value?.data) {
        setUserRoutines(resUserRoutines.value.data);
        await saveCache("userRoutines", resUserRoutines.value.data);
      } else {
        const cached = await loadCache<UserRoutine[]>("userRoutines");
        if (cached) setUserRoutines(cached);
        else hasError = true;
      }

      setNetworkError(hasError);
    } catch {
      showToast(t("routines.errorLoad"), "error");
      setNetworkError(true);
    } finally {
      if (isRefresh) setRefreshing(false);
      else setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchAll();
      loadFavorites();
    }, [fetchAll, loadFavorites])
  );

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAll(true);
  }, [fetchAll]);

  useEffect(() => {
    if (!subLoading && activeTab === "app" && !hasAppAccess) {
      setShowUpgradeModal(true);
    }
  }, [subLoading, activeTab, hasAppAccess]);

  const handleTabSwitch = async (tab: "mine" | "app") => {
    if (tab === "app" && !hasAppAccess) {
      setShowUpgradeModal(true);
      return;
    }
    setActiveTab(tab);
    setSelectedFilter("Todo");
    setSearch("");
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
    try {
      const raw = await AsyncStorage.getItem(`@liftyhub_favorites_${tab}`);
      setFavorites(new Set(raw ? JSON.parse(raw) : []));
    } catch {}
  };

  const activeData = (activeTab === "mine" ? userRoutines : routines).filter((r) => {
    const isFav = favorites.has(String(r.id));
    const matchCategory =
      selectedFilter === "Todo" ||
      (selectedFilter === "Favoritos" ? isFav : r.category === selectedFilter);
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleDeleteRoutine = (id: number) => {
    Alert.alert(
      t("routines.deleteTitle"),
      t("routines.deleteMessage"),
      [
        { text: t("routines.cancel"), style: "cancel" },
        {
          text: t("routines.deleteConfirm"),
          style: "destructive",
          onPress: async () => {
            try {
              const token = await Storage.getItem("token");
              if (!token) return;
              await deleteUserRoutine(id, token);
              setUserRoutines((prev) => {
                const updated = prev.filter((r) => r.id !== id);
                saveCache("userRoutines", updated);
                return updated;
              });
              showToast(t("routines.deleteSuccess"), "success");
            } catch {
              showToast(t("routines.deleteError"), "error");
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
      {!isConnected && <OfflineBanner />}
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
          <Ionicons name={networkError ? "cloud-offline-outline" : "barbell-outline"} size={60} color={colors.textSecondary} />
          <Text style={styles.emptyTitle}>{networkError ? t("routines.errorLoad") : t("routines.empty")}</Text>
          <Text style={styles.emptyText}>
            {networkError ? "" : activeTab === "mine" ? t("routines.noUserRoutines") : t("routines.emptyHint")}
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
              <View style={styles.headerButtons}>
                <HapticButton style={styles.iconButton} onPress={handleOpenScanner}>
                  <Ionicons name="qr-code" size={20} color="white" />
                </HapticButton>
                <HapticButton style={styles.iconButton} onPress={() => router.push("/routines/new")}>
                  <Ionicons name="add" size={26} color="white" />
                </HapticButton>
              </View>
            )}
          </View>

          {/* TAB SWITCH */}
          <View style={styles.tabRow}>
            <HapticButton
              style={[styles.tabBtn, activeTab === "mine" && styles.tabBtnActive]}
              onPress={() => handleTabSwitch("mine")}
            >
              <Text style={[styles.tabBtnText, activeTab === "mine" && styles.tabBtnTextActive]}>
                {t("routines.myRoutines")}
              </Text>
            </HapticButton>
            <HapticButton
              style={[styles.tabBtn, activeTab === "app" && styles.tabBtnActive]}
              onPress={() => handleTabSwitch("app")}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                {!hasAppAccess && (
                  <Ionicons name="lock-closed" size={11} color={activeTab === "app" ? "white" : "#A1A1A1"} />
                )}
                <Text style={[styles.tabBtnText, activeTab === "app" && styles.tabBtnTextActive]}>
                  {t("routines.appRoutines")}
                </Text>
              </View>
            </HapticButton>
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
          isFavorite={favorites.has(String(item.id))}
          onToggleFavorite={() => toggleFavorite(item.id)}
          onDelete={activeTab === "mine" ? () => handleDeleteRoutine(item.id) : undefined}
          onPress={() => router.push({
            pathname: "/routines/[id]",
            params: {
              id: item.id,
              name: item.name,
              duration: `${item.duration} min`,
              level: item.level,
              category: item.category,
              objective: item.objective,
              image: getRoutineImage(item.img, item.id),
              isUserRoutine: activeTab === "mine" ? "true" : "false",
            }
          })}
        />
      )}
    />

      {/* BLUR si está en pestaña app sin acceso */}
      {activeTab === "app" && !hasAppAccess && (
        <BlurView intensity={55} tint="dark" style={StyleSheet.absoluteFill} pointerEvents="box-none" />
      )}

      {/* BOTÓN reabrir modal */}
      {activeTab === "app" && !hasAppAccess && !showUpgradeModal && (
        <View style={styles.unlockBar}>
          <HapticButton style={styles.unlockButton} onPress={() => setShowUpgradeModal(true)}>
            <Ionicons name="lock-closed" size={16} color="white" />
            <Text style={styles.unlockText}>{t("routines.unlockButton")}</Text>
          </HapticButton>
        </View>
      )}

      {/* MODAL UPGRADE */}
      <Modal visible={showUpgradeModal} transparent animationType="slide">
        <HapticButton style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowUpgradeModal(false)}>
          <HapticButton activeOpacity={1} style={styles.modalContent} onPress={() => {}}>
            <HapticButton style={styles.modalClose} onPress={() => setShowUpgradeModal(false)}>
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </HapticButton>
            <View style={styles.modalIcon}>
              <Ionicons name="barbell" size={32} color={colors.primary} />
            </View>
            <Text style={styles.modalTitle}>{t("routines.upgradeTitle")}</Text>
            <Text style={styles.modalSubtitle}>
              {scannerUsed && nextScanDate
                ? t("routines.upgradeSubtitleScanner", { date: nextScanDate.toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" }) })
                : t("routines.upgradeSubtitleDefault")}
            </Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {PLAN_OPTIONS.map((plan) => (
                <HapticButton
                  key={plan.name}
                  style={[styles.planCard, plan.highlighted && { borderColor: plan.color, borderWidth: 2 }]}
                  onPress={() => { setShowUpgradeModal(false); router.push("/settings/plans"); }}
                >
                  {plan.highlighted && (
                    <View style={[styles.planBadge, { backgroundColor: plan.color }]}>
                      <Text style={styles.planBadgeText}>{t("routines.recommended")}</Text>
                    </View>
                  )}
                  <View style={styles.planHeader}>
                    <Text style={[styles.planName, { color: plan.color }]}>{plan.name}</Text>
                    <Text style={styles.planPrice}>{plan.price}</Text>
                  </View>
                  {plan.features.map((f, i) => (
                    <View key={i} style={styles.planFeature}>
                      <Ionicons name="checkmark-circle" size={16} color={plan.color} />
                      <Text style={styles.planFeatureText}>{f}</Text>
                    </View>
                  ))}
                </HapticButton>
              ))}
              <Text style={styles.modalNote}>{t("routines.adminNote")}</Text>
            </ScrollView>
          </HapticButton>
        </HapticButton>
      </Modal>

      {/* MODAL SCANNER QR */}
      <Modal visible={showScanner} animationType="slide" onRequestClose={() => setShowScanner(false)}>
        <View style={styles.scannerContainer}>
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing="back"
            onBarcodeScanned={handleBarCodeScanned}
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          />
          <View style={styles.scannerOverlay}>
            <View style={styles.scannerFrame} />
            <Text style={styles.scannerHint}>{t("routines.scannerHint")}</Text>
          </View>
          <HapticButton style={styles.scannerClose} onPress={() => setShowScanner(false)}>
            <Ionicons name="close" size={28} color="white" />
          </HapticButton>
        </View>
      </Modal>

      {Toast}

      {/* MODAL PERMISO CÁMARA */}
      <Modal visible={showCameraPermModal} transparent animationType="fade">
        <HapticButton style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowCameraPermModal(false)}>
          <HapticButton activeOpacity={1} style={styles.modalContent} onPress={() => {}}>
            <HapticButton style={styles.modalClose} onPress={() => setShowCameraPermModal(false)}>
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </HapticButton>
            <View style={styles.modalIcon}>
              <Ionicons name="camera" size={32} color={colors.primary} />
            </View>
            <Text style={styles.modalTitle}>{t("routines.cameraPermTitle")}</Text>
            <Text style={styles.modalSubtitle}>
              {cameraPermission?.status === "denied"
                ? t("routines.cameraPermDenied")
                : t("routines.cameraPermRequest")}
            </Text>
            <HapticButton
              style={[styles.planCard, { alignItems: "center", paddingVertical: 14, backgroundColor: colors.primary }]}
              onPress={handleRequestCameraPermission}
            >
              <Text style={{ color: "white", fontWeight: "700" }}>
                {cameraPermission?.status === "denied" ? t("routines.openSettings") : t("routines.allowCamera")}
              </Text>
            </HapticButton>
            <HapticButton
              style={[styles.planCard, { alignItems: "center", paddingVertical: 14, borderColor: "#2C2C2E", borderWidth: 1, marginTop: 8 }]}
              onPress={() => setShowCameraPermModal(false)}
            >
              <Text style={{ color: colors.textSecondary, fontWeight: "600" }}>{t("routines.cancel")}</Text>
            </HapticButton>
          </HapticButton>
        </HapticButton>
      </Modal>

      {/* MODAL ADVERTENCIA SCANNER FREE */}
      <Modal visible={showScannerWarning} transparent animationType="fade">
        <HapticButton style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowScannerWarning(false)}>
          <HapticButton activeOpacity={1} style={styles.modalContent} onPress={() => {}}>
            <View style={styles.modalIcon}>
              <Ionicons name="qr-code" size={32} color={colors.primary} />
            </View>
            <Text style={styles.modalTitle}>{t("routines.freeScannerTitle")}</Text>
            <Text style={styles.modalSubtitle}>
              {t("routines.freeScannerSubtitle", {
                date: (() => {
                  const next = new Date();
                  next.setMonth(next.getMonth() + 1);
                  return next.toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" });
                })()
              })}
            </Text>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <HapticButton
                style={[styles.planCard, { flex: 1, alignItems: "center", paddingVertical: 14, borderColor: "#2C2C2E", borderWidth: 1 }]}
                onPress={() => setShowScannerWarning(false)}
              >
                <Text style={{ color: colors.textSecondary, fontWeight: "600" }}>{t("routines.cancel")}</Text>
              </HapticButton>
              <HapticButton
                style={[styles.planCard, { flex: 1, alignItems: "center", paddingVertical: 14, backgroundColor: colors.primary }]}
                onPress={handleScannerWarningConfirm}
              >
                <Text style={{ color: "white", fontWeight: "700" }}>{t("routines.scan")}</Text>
              </HapticButton>
            </View>
          </HapticButton>
        </HapticButton>
      </Modal>

      {/* MODAL CONFIRMACIÓN IMPORTAR */}
      <Modal visible={!!scannedData} transparent animationType="slide" onRequestClose={() => setScannedData(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <HapticButton style={styles.modalClose} onPress={() => setScannedData(null)}>
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </HapticButton>

            <View style={styles.modalIcon}>
              <Ionicons name="download-outline" size={32} color={colors.primary} />
            </View>

            <Text style={styles.modalTitle}>{t("routines.importTitle")}</Text>
            <Text style={styles.modalSubtitle}>{t("routines.importSubtitle")}</Text>

            {scannedData && (
              <View style={styles.importCard}>
                <Text style={styles.importName}>{scannedData.name}</Text>
                <Text style={styles.importMeta}>
                  {scannedData.category}  ·  {scannedData.level}  ·  {scannedData.duration} min
                </Text>
                {scannedData.exercises?.length > 0 && (
                  <View style={styles.importExercises}>
                    {scannedData.exercises.slice(0, 4).map((ex: any, i: number) => (
                      <Text key={i} style={styles.importExerciseItem}>• {ex.name}  ({ex.sets}×{ex.reps})</Text>
                    ))}
                    {scannedData.exercises.length > 4 && (
                      <Text style={styles.importExerciseItem}>{t("routines.importMore", { n: scannedData.exercises.length - 4 })}</Text>
                    )}
                  </View>
                )}
              </View>
            )}

            <HapticButton
              style={[styles.importButton, importing && { opacity: 0.6 }]}
              onPress={handleImportRoutine}
              disabled={importing}
            >
              {importing
                ? <ActivityIndicator color="white" />
                : <Text style={styles.importButtonText}>{t("routines.addButton")}</Text>
              }
            </HapticButton>
          </View>
        </View>
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

  headerButtons: {
    position: "absolute",
    top: 40,
    right: 0,
    flexDirection: "row",
    gap: 8,
    zIndex: 20,
  },

  iconButton: {
    width: 45,
    height: 45,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
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

  unlockBar: {
    position: "absolute",
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: "center",
  },

  unlockButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: spacing.borderRadius,
    gap: 8,
  },

  unlockText: {
    color: "white",
    fontWeight: "700",
    fontSize: 15,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },

  modalContent: {
    backgroundColor: "#1C1C1E",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 48,
    maxHeight: SCREEN_HEIGHT * 0.85,
  },

  modalClose: {
    alignSelf: "flex-end",
    padding: 4,
  },

  modalIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(59,130,246,0.15)",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 16,
  },

  modalTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },

  modalSubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },

  planCard: {
    backgroundColor: "#2C2C2E",
    borderRadius: spacing.borderRadius,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "transparent",
  },

  planBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 8,
  },

  planBadgeText: {
    color: "white",
    fontSize: 11,
    fontWeight: "700",
  },

  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  planName: {
    fontSize: 18,
    fontWeight: "700",
  },

  planPrice: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  planFeature: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },

  planFeatureText: {
    color: colors.textSecondary,
    fontSize: 13,
  },

  modalNote: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
  },

  // Scanner
  scannerContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  scannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  scannerFrame: {
    width: 220,
    height: 220,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 16,
  },
  scannerHint: {
    color: "white",
    marginTop: 20,
    fontSize: 14,
  },
  scannerClose: {
    position: "absolute",
    top: 56,
    right: 24,
  },

  // Import confirm
  importCard: {
    backgroundColor: "#2C2C2E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    width: "100%",
  },
  importName: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 4,
  },
  importMeta: {
    color: colors.textSecondary,
    fontSize: 13,
    marginBottom: 12,
  },
  importExercises: {
    gap: 4,
  },
  importExerciseItem: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  importButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    width: "100%",
  },
  importButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },

});
