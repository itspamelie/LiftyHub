import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, TouchableOpacity } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { getExerciseFiles } from "@/src/services/api";
import { colors, spacing } from "@/src/styles/globalstyles";

type ExerciseFile = {
  id: number;
  exercise_id: number;
  file_path: string;
  type: "image" | "video" | "pdf";
};

const getFileUrl = (path: string) => {
  if (path.startsWith("http")) return path;
  const base = (process.env.EXPO_PUBLIC_API_URL ?? "").replace(/\/api$/, "");
  return `${base}/exercises/${path}`;
};

export default function ExerciseDetail() {

  const { id, name, muscle, technique, categorie } = useLocalSearchParams<{
    id: string;
    name: string;
    muscle: string;
    technique: string;
    categorie: string;
  }>();

  const [files, setFiles] = useState<ExerciseFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token || !id) return;
        const res = await getExerciseFiles(Number(id), token);
        if (res?.data) setFiles(res.data);
      } catch (error) {
        console.log("Error cargando archivos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, [id]);

  const images = files.filter(f => f.type === "image");
  const heroImage = images[activeImage]
    ? getFileUrl(images[activeImage].file_path)
    : "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80";

  const steps = technique
    ? technique.split(/\n|\.(?=\s)/).map(s => s.trim()).filter(Boolean)
    : [];

  return (
    <View style={styles.container}>

      {/* HERO IMAGE */}
      <View style={styles.heroContainer}>
        <Image source={{ uri: heroImage }} style={styles.hero} resizeMode="cover" />

        {/* OVERLAY GRADIENTE */}
        <View style={styles.overlay} />

        {/* BACK BUTTON */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="white" />
        </TouchableOpacity>

        {/* CHIPS SOBRE LA IMAGEN */}
        <View style={styles.chipsOverlay}>
          <View style={styles.chip}>
            <Ionicons name="body-outline" size={13} color={colors.primary} />
            <Text style={styles.chipText}>{muscle}</Text>
          </View>
          {categorie ? (
            <View style={styles.chip}>
              <Ionicons name="pricetag-outline" size={13} color={colors.primary} />
              <Text style={styles.chipText}>{categorie}</Text>
            </View>
          ) : null}
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* NOMBRE */}
        <Text style={styles.title}>{name}</Text>

        {/* MINIATURAS SI HAY VARIAS IMÁGENES */}
        {images.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.thumbRow}
          >
            {images.map((img, index) => (
              <TouchableOpacity
                key={img.id}
                onPress={() => setActiveImage(index)}
                style={[styles.thumb, activeImage === index && styles.thumbActive]}
              >
                <Image
                  source={{ uri: getFileUrl(img.file_path) }}
                  style={styles.thumbImage}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* STATS RÁPIDOS */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="barbell-outline" size={22} color={colors.primary} />
            <Text style={styles.statLabel}>Músculo</Text>
            <Text style={styles.statValue}>{muscle}</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="layers-outline" size={22} color={colors.primary} />
            <Text style={styles.statLabel}>Categoría</Text>
            <Text style={styles.statValue}>{categorie || "—"}</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="images-outline" size={22} color={colors.primary} />
            <Text style={styles.statLabel}>Archivos</Text>
            <Text style={styles.statValue}>{loading ? "..." : files.length}</Text>
          </View>
        </View>

        {/* TÉCNICA */}
        <Text style={styles.sectionTitle}>Técnica</Text>

        {loading ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: 20 }} />
        ) : technique ? (
          steps.length > 1 ? (
            <View style={styles.stepsContainer}>
              {steps.map((step, index) => (
                <View key={index} style={styles.step}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.techniqueCard}>
              <Text style={styles.techniqueText}>{technique}</Text>
            </View>
          )
        ) : (
          <Text style={styles.empty}>Sin descripción disponible.</Text>
        )}

      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  heroContainer: {
    height: 280,
    position: "relative",
  },

  hero: {
    width: "100%",
    height: "100%",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  backButton: {
    position: "absolute",
    top: 55,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },

  chipsOverlay: {
    position: "absolute",
    bottom: 16,
    left: 16,
    flexDirection: "row",
    gap: 8,
  },

  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 5,
    borderWidth: 1,
    borderColor: colors.primary,
  },

  chipText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },

  scroll: {
    flex: 1,
  },

  content: {
    padding: 20,
    paddingBottom: 60,
  },

  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 16,
  },

  thumbRow: {
    marginBottom: 16,
  },

  thumb: {
    marginRight: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "transparent",
    overflow: "hidden",
  },

  thumbActive: {
    borderColor: colors.primary,
  },

  thumbImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },

  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
  },

  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: spacing.borderRadius,
    padding: 14,
    alignItems: "center",
    gap: 4,
  },

  statLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 4,
  },

  statValue: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },

  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },

  stepsContainer: {
    gap: 10,
  },

  step: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: colors.card,
    borderRadius: spacing.borderRadius,
    padding: 14,
  },

  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },

  stepNumberText: {
    color: "white",
    fontWeight: "700",
    fontSize: 13,
  },

  stepText: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },

  techniqueCard: {
    backgroundColor: colors.card,
    borderRadius: spacing.borderRadius,
    padding: 16,
  },

  techniqueText: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 22,
  },

  empty: {
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 20,
  },

});
