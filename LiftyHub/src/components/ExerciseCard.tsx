import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing } from "@/src/styles/globalstyles";

type ExerciseFile = {
  file_path: string;
  type: "image" | "video" | "pdf";
};

type Exercise = {
  id: number;
  name: string;
  muscle: string;
  technique: string;
  files?: ExerciseFile[];
};

type Props = {
  exercise: Exercise;
};

export default function ExerciseCard({ exercise }: Props) {

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

        <TouchableOpacity style={styles.previewButton}>
          <Text style={styles.previewText}>Vista previa</Text>
        </TouchableOpacity>
      </View>

      {/* BOTÓN + */}
      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add" size={20} color="white" />
      </TouchableOpacity>

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

  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10
  }

});