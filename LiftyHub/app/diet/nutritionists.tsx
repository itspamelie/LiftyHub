import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Modal,
} from "react-native";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getNutritionistProfiles } from "@/src/services/api";
import { colors, spacing } from "@/src/styles/globalstyles";
import BackButton from "@/src/components/buttons/backButton";

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

  const [nutritionists, setNutritionists] = useState<Nutritionist[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Nutritionist | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return;
        const data = await getNutritionistProfiles(token);
        const all: Nutritionist[] = data?.data ?? [];
        setNutritionists(all.filter((n) => n.is_active));
      } catch {
        // error silencioso
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
    setShowSuccess(true);
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

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>Nutriólogos disponibles</Text>
      </View>
      <View style={styles.headerDivider} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>
          Elige el nutriólogo que más se adapte a tus objetivos y estilo de vida.
        </Text>

        {nutritionists.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="person-outline" size={40} color={colors.textSecondary} />
            <Text style={styles.emptyText}>No hay nutriólogos disponibles por el momento.</Text>
          </View>
        ) : (
          nutritionists.map((n) => (
            <TouchableOpacity key={n.id} style={styles.card} onPress={() => handleSelect(n)}>

              <View style={styles.cardTop}>
                {n.profile_pic ? (
                  <Image source={{ uri: n.profile_pic }} style={styles.avatar} />
                ) : (
                  <View style={[styles.avatar, styles.avatarFallback]}>
                    <Ionicons name="person" size={28} color={colors.textSecondary} />
                  </View>
                )}
                <View style={styles.cardInfo}>
                  <Text style={styles.cardName}>{n.user?.name ?? "Nutriólogo"}</Text>
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

              <View style={styles.selectRow}>
                <Text style={styles.selectText}>Seleccionar</Text>
                <Ionicons name="arrow-forward" size={16} color={colors.primary} />
              </View>

            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* MODAL CONFIRMACIÓN */}
      <Modal visible={showConfirm} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>¿Confirmar selección?</Text>
            <Text style={styles.modalSubtitle}>
              Enviarás una solicitud a{" "}
              <Text style={{ color: "white", fontWeight: "700" }}>
                {selected?.user?.name ?? "este nutriólogo"}
              </Text>
              . Recibirás tu plan de dieta una vez que sea aceptada.
            </Text>
            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowConfirm(false)}>
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
                <Text style={styles.confirmBtnText}>Confirmar</Text>
              </TouchableOpacity>
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
            <Text style={styles.modalTitle}>¡Solicitud enviada!</Text>
            <Text style={styles.modalSubtitle}>
              Tu nutriólogo revisará tu solicitud y te asignará un plan personalizado pronto.
            </Text>
            <TouchableOpacity style={styles.confirmBtn} onPress={handleSuccessClose}>
              <Text style={styles.confirmBtnText}>Entendido</Text>
            </TouchableOpacity>
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
