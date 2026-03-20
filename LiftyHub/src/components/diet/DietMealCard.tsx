import { View, Text, StyleSheet, Image } from "react-native";

type Meal = {
  emoji: string;
  name: string;
  items: string[];
  imageUrl: string;
  calories: string;
};

type Props = {
  meal: Meal;
};

export default function DietMealCard({ meal }: Props) {
  return (
    <View style={styles.card}>

      {/* IMAGEN */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: meal.imageUrl }} style={styles.image} />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{meal.emoji} {meal.name}</Text>
        </View>
        <View style={styles.caloriesBadge}>
          <Text style={styles.caloriesText}>{meal.calories}</Text>
        </View>
      </View>

      {/* ITEMS */}
      <View style={styles.content}>
        {meal.items.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <View style={styles.dot} />
            <Text style={styles.itemText}>{item}</Text>
          </View>
        ))}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  card: {
    backgroundColor: "#1C1C1E",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 14
  },

  imageContainer: {
    position: "relative"
  },

  image: {
    width: "100%",
    height: 160
  },

  badge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#00000088",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10
  },

  badgeText: {
    color: "white",
    fontSize: 13,
    fontWeight: "700"
  },

  caloriesBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#3B82F6cc",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10
  },

  caloriesText: {
    color: "white",
    fontSize: 12,
    fontWeight: "700"
  },

  content: {
    padding: 14,
    gap: 8
  },

  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#3B82F6"
  },

  itemText: {
    color: "#A1A1A1",
    fontSize: 14,
    lineHeight: 20,
    flex: 1
  }

});
