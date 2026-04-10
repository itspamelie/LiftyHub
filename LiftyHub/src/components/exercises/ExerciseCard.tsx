import { View, Text, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { colors, spacing } from "@/src/styles/globalstyles";
import HapticButton from "@/src/components/buttons/HapticButton";

type ExerciseFile = {
  file_path: string;
  type: "image" | "video" | "pdf";
};

type Exercise = {
  id: number;
  name: string;
  muscle: string;
  technique: string;
  categorie?: string;
  files?: ExerciseFile[];
};

type Props = {
  exercise: Exercise;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onAdd?: () => void;
};

export default function ExerciseCard({ exercise, isFavorite, onToggleFavorite, onAdd }: Props) {

  const getImage = () => {
    const imageFile = exercise.files?.find(file => file.type === "image");
    return imageFile?.file_path ?? "https://via.placeholder.com/100";
  };

  return (
    <View style={styles.card}>

      {/* IMAGEN */}
      <Image source={{ uri: getImage() }} style={styles.image} />

      {/* CONTENIDO */}
      <View style={styles.content}>
        <Text style={styles.title}>{exercise.name}</Text>
        <Text style={styles.muscle}>{exercise.muscle}</Text>

        <HapticButton
          style={styles.previewButton}
          onPress={() => router.push({
            pathname: "/exercise/[id]",
            params: {
              id: exercise.id,
              name: exercise.name,
              muscle: exercise.muscle,
              technique: exercise.technique,
              categorie: exercise.categorie ?? "",
            }
          })}
        >
          <Text style={styles.previewText}>Vista previa</Text>
        </HapticButton>
      </View>

      {/* ACCIONES */}
      <View style={styles.actions}>
        <HapticButton style={styles.favoriteButton} onPress={onToggleFavorite}>
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={18}
            color={isFavorite ? "#EF4444" : "white"}
          />
        </HapticButton>
        <HapticButton style={styles.addButton} onPress={onAdd}>
          <Ionicons name="add" size={20} color="white" />
        </HapticButton>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  card: {
    backgroundColor: colors.card,
    borderRadius: spacing.borderRadius,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16
  },

  image: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 14
  },

  content: {
    flex: 1
  },

  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600"
  },

  muscle: {
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: 8
  },

  previewButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    alignSelf: "flex-start"
  },

  previewText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600"
  },

  actions: {
    flexDirection: "row",
    gap: 8,
    marginLeft: 10,
  },

  favoriteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },

  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  }

});