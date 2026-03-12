import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing } from "@/src/styles/globalstyles";

type Props = {
  title: string;
  muscle: string;
  image: string;
};

export default function ExerciseCard({ title, muscle, image }: Props) {
  return (
    <View style={styles.card}>

      {/* IMAGEN */}
      <Image source={{ uri: image }} style={styles.image} />

      {/* CONTENIDO */}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.muscle}>{muscle}</Text>

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