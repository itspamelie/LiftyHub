import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, Modal, Alert } from "react-native";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Storage from "@/src/utils/storage";
import { getNutritionistProfiles } from "@/src/services/api";
import { colors, spacing } from "@/src/styles/globalstyles";
import { useLanguage } from "@/src/context/LanguageContext";
import BackButton from "@/src/components/buttons/backButton";
import HapticButton from "@/src/components/buttons/HapticButton";

type Nutritionist = {
  id: number;
  specialty: string;
  profile_pic: string;
  bio: string;
  rating: number;
  location: string;
  is_active: number;
  user: {
    id: number;
    name: string;
  };
};

export default function NutritionistsScreen() {

  const { t } = useLanguage();
  const [nutritionists, setNutritionists] = useState<Nutritionist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selected, setSelected] = useState<Nutritionist | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const token = await Storage.getItem("token");
        if (!token) return;
        const data = await getNutritionistProfiles(token);
        const all: Nutritionist[] = data?.data ?? [];
        setNutritionists(all.filter((n) => n.is_active));
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSelect = (n: Nutritionist) => {
    setSelected(n);
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    Alert.alert(
      t("nutritionists.comingSoonTitle"),
      t("nutritionists.comingSoonMessage"),
      [{ text: "OK", onPress: () => router.back() }]
    );
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    router.back();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="cloud-offline-outline" size={48} color={colors.textSecondary} />
        <Text style={{ color: colors.textSecondary, marginTop: 12, fontSize: 15, textAlign: "center" }}>
          {t("nutritionists.errorLoad")}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>{t("nutritionists.title")}</Text>
      </View>
      <View style={styles.headerDivider} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>{t("nutritionists.subtitle")}</Text>

        {nutritionists.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="person-outline" size={40} color={colors.textSecondary} />
            <Text style={styles.emptyText}>{t("nutritionists.empty")}</Text>
          </View>
        ) : (
          nutritionists.map((n) => (
            <View key={n.id} style={styles.card}>

              <View style={styles.cardTop}>
                {n.profile_pic ? (
                  <Image source={{ uri: n.profile_pic }} style={styles.avatar} />
                ) : (
                  <View style={[styles.avatar, styles.avatarFallback]}>
                    <Ionicons name="person" size={28} color={colors.textSecondary} />
                  </View>
                )}
                <View style={styles.cardInfo}>
                  <Text style={styles.cardName}>{n.user?.name ?? t("nutritionists.fallbackName")}</Text>
                  <Text style={styles.cardSpecialty}>{n.specialty}</Text>
                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={13} color="#F59E0B" />
                    <Text style={styles.ratingText}>{Number(n.rating).toFixed(1)}</Text>
                    <Text style={styles.locationText}>· {n.location}</Text>
                  </View>
                </View>
              </View>

              {n.bio ? (
                <Text style={styles.bio} numberOfLines={2}>{n.bio}</Text>
              ) : null}

              <View style={styles.actionsRow}>
                <HapticButton
                  style={styles.viewBtn}
                  onPress={() => router.push({
                    pathname: "/nutritionist-profile",
                    params: {
                      name: n.user?.name ?? "Nutriólogo",
                      specialty: n.specialty,
                      bio: n.bio ?? "",
                      rating: n.rating,
                      location: n.location ?? "",
                      profile_pic: n.profile_pic ?? "",
                    },
                  } as any)}
                >
                  <Ionicons name="person-outline" size={15} color={colors.primary} />
                  <Text style={styles.viewBtnText}>{t("nutritionists.viewProfile")}</Text>
                </HapticButton>
                <HapticButton style={styles.selectBtn} onPress={() => handleSelect(n)}>
                  <Text style={styles.selectBtnText}>{t("nutritionists.select")}</Text>
                  <Ionicons name="arrow-forward" size={15} color="white" />
                </HapticButton>
              </View>

            </View>
          ))
        )}
      </ScrollView>

      {/* MODAL CONFIRMACIÓN */}
      <Modal visible={showConfirm} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>{t("nutritionists.confirmTitle")}</Text>
            <Text style={styles.modalSubtitle}>
              {t("nutritionists.confirmSubtitle")}{" "}
              <Text style={{ color: "white", fontWeight: "700" }}>
                {selected?.user?.name ?? t("nutritionists.fallbackName")}
              </Text>
              {t("nutritionists.confirmSubtitle2")}
            </Text>
            <View style={styles.modalBtns}>
              <HapticButton style={styles.cancelBtn} onPress={() => setShowConfirm(false)}>
                <Text style={styles.cancelBtnText}>{t("nutritionists.cancel")}</Text>
              </HapticButton>
              <HapticButton style={styles.confirmBtn} onPress={handleConfirm}>
                <Text style={styles.confirmBtnText}>{t("nutritionists.confirm")}</Text>
              </HapticButton>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL ÉXITO */}
      <Modal visible={showSuccess} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark-circle" size={48} color="#16a34a" />
            </View>
            <Text style={styles.modalTitle}>{t("nutritionists.successTitle")}</Text>
            <Text style={styles.modalSubtitle}>{t("nutritionists.successSubtitle")}</Text>
            <HapticButton style={styles.confirmBtn} onPress={handleSuccessClose}>
              <Text style={styles.confirmBtnText}>{t("nutritionists.understood")}</Text>
            </HapticButton>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({

  loadingContainer: {
    flex: 1,
    backgroundColor: "#0F0F10",
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    flex: 1,
    backgroundColor: "#0F0F10",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 16,
    paddingLeft: 80,
    paddingRight: 20,
    minHeight: 110,
  },

  headerTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "700",
    flex: 1,
  },

  headerDivider: {
    height: 1,
    backgroundColor: "#2A2A2A",
  },

  content: {
    padding: 20,
    paddingBottom: 100,
  },

  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },

  emptyContainer: {
    alignItems: "center",
    paddingVertical: 60,
    gap: 12,
  },

  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: "center",
  },

  card: {
    backgroundColor: "#1C1C1E",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },

  cardTop: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 10,
  },

  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: colors.primary,
  },

  avatarFallback: {
    backgroundColor: "#2C2C2E",
    justifyContent: "center",
    alignItems: "center",
  },

  cardInfo: {
    flex: 1,
    justifyContent: "center",
    gap: 3,
  },

  cardName: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },

  cardSpecialty: {
    color: colors.textSecondary,
    fontSize: 13,
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },

  ratingText: {
    color: "#F59E0B",
    fontSize: 13,
    fontWeight: "600",
  },

  locationText: {
    color: colors.textSecondary,
    fontSize: 12,
  },

  bio: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },

  selectRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 4,
  },

  selectText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },

  actionsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },

  viewBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: spacing.borderRadius,
    paddingVertical: 10,
  },

  viewBtnText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },

  selectBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: colors.primary,
    borderRadius: spacing.borderRadius,
    paddingVertical: 10,
  },

  selectBtnText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  modalBox: {
    backgroundColor: "#1C1C1E",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    gap: 12,
  },

  successIcon: {
    alignItems: "center",
    marginBottom: 4,
  },

  modalTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },

  modalSubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },

  modalBtns: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },

  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: spacing.borderRadius,
    backgroundColor: "#2C2C2E",
    alignItems: "center",
  },

  cancelBtnText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: "600",
  },

  confirmBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: spacing.borderRadius,
    backgroundColor: colors.primary,
    alignItems: "center",
  },

  confirmBtnText: {
    color: "white",
    fontSize: 15,
    fontWeight: "700",
  },

});
