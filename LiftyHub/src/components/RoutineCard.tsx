import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

type Props = {
  title: string;
  duration: string;
  level: string;
  image: string;
};

export default function RoutineCard({ title, duration, level, image }: Props) {
  return (
    <View style={styles.card}>

      <Image source={{ uri: image }} style={styles.image} />

      <View style={styles.content}>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.meta}>
            {duration} • {level}
          </Text>
        </View>

        <TouchableOpacity style={styles.playButton}>
          <Text style={styles.playText}>▶</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  card: {
    backgroundColor: "#1C1C1E",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16
  },

  image: {
    width: "100%",
    height: 150
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

  playButton: {
    backgroundColor: "#3B82F6",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center"
  },

  playText: {
    color: "white",
    fontSize: 16
  }

});