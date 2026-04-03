import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  title: string;
  duration: string;
  level: string;
  category: string;
  image: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onDelete?: () => void;
  onPress?: () => void;
};

export default function RoutineCard({ title, duration, level, category, image, isFavorite, onToggleFavorite, onDelete, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={onPress ? 0.85 : 1}>

      {/* CONTENEDOR DE IMAGEN */}
      <View style={styles.imageContainer}>

        <Image source={{ uri: image }} style={styles.image} />

        {/* BADGE DE CATEGORÍA */}
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{category}</Text>
        </View>

        {/* FAVORITO */}
        {onToggleFavorite && (
          <TouchableOpacity style={styles.favoriteButton} onPress={onToggleFavorite}>
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={20}
              color={isFavorite ? "#EF4444" : "white"}
            />
          </TouchableOpacity>
        )}

      </View>

      {/* CONTENIDO */}
      <View style={styles.content}>

        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.meta}>
            {duration} • {level}
          </Text>
        </View>

        <View style={styles.actions}>
          {onDelete && (
            <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
              <Ionicons name="trash-outline" size={18} color="white" />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.playButton}>
            <Ionicons name="play" size={18} color="white" />
          </TouchableOpacity>
        </View>

      </View>

    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({

  card: {
    backgroundColor: "#1C1C1E",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16
  },

  imageContainer: {
    position: "relative"
  },

  image: {
    width: "100%",
    height: 150
  },

  favoriteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.45)",
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
  },

  categoryBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#3a3a3b",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8
  },

  categoryText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600"
  },

  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16
  },

  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "600"
  },

  meta: {
    color: "#A1A1A1",
    marginTop: 4
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },

  deleteButton: {
    backgroundColor: "#EF4444",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center"
  },

  playButton: {
    backgroundColor: "#3B82F6",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center"
  },

});