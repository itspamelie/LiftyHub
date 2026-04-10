import { View, Text, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import HapticButton from "@/src/components/buttons/HapticButton";

type Props = {
  name: string;
  specialty: string;
  imageUrl: string;
  status: "active" | "completed";
  updatedAt: string;
};

export default function NutritionistCard({ name, specialty, imageUrl, status, updatedAt }: Props) {
  return (
    <View style={styles.card}>

      <View style={styles.top}>
        <Image source={{ uri: imageUrl }} style={styles.avatar} />
        <View style={styles.info}>
          <Text style={styles.label}>Nutricionista asignada</Text>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.specialty}>{specialty}</Text>
        </View>
        <View style={[styles.badge, status === "active" ? styles.badgeActive : styles.badgeCompleted]}>
          <Text style={[styles.badgeText, status === "active" ? styles.badgeTextActive : styles.badgeTextCompleted]}>
            {status === "active" ? "Activo" : "Completado"}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.bottom}>
        <View style={styles.updatedRow}>
          <Ionicons name="time-outline" size={14} color="#666" />
          <Text style={styles.updated}>Última actualización: {updatedAt}</Text>
        </View>
        <HapticButton style={styles.detailBtn} onPress={() => router.push("/nutritionist-profile")}>
          <Text style={styles.detailBtnText}>Ver perfil</Text>
          <Ionicons name="arrow-forward" size={14} color="#3B82F6" />
        </HapticButton>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  card: {
    backgroundColor: "#1C1C1E",
    borderRadius: 18,
    padding: 16,
    marginBottom: 20
  },

  top: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#3B82F6"
  },

  info: {
    flex: 1
  },

  label: {
    color: "#666",
    fontSize: 11,
    marginBottom: 2
  },

  name: {
    color: "white",
    fontSize: 16,
    fontWeight: "700"
  },

  specialty: {
    color: "#A1A1A1",
    fontSize: 13,
    marginTop: 2
  },

  badge: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1
  },

  badgeActive: {
    backgroundColor: "#16a34a22",
    borderColor: "#16a34a"
  },

  badgeCompleted: {
    backgroundColor: "#6B728022",
    borderColor: "#6B7280"
  },

  badgeText: {
    fontSize: 12,
    fontWeight: "600"
  },

  badgeTextActive: {
    color: "#16a34a"
  },

  badgeTextCompleted: {
    color: "#6B7280"
  },

  divider: {
    height: 1,
    backgroundColor: "#2A2A2A",
    marginBottom: 12
  },

  bottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },

  updatedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },

  updated: {
    color: "#666",
    fontSize: 13
  },

  detailBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4
  },

  detailBtnText: {
    color: "#3B82F6",
    fontSize: 13,
    fontWeight: "600"
  }

});
