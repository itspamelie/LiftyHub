import { View, Text, StyleSheet, Image } from "react-native";

type Supplement = {
  name: string;
  dose: string;
  timing: string;
  imageUrl: string;
  color: string;
};

type Props = {
  supplement: Supplement;
};

export default function SupplementCard({ supplement }: Props) {
  return (
    <View style={styles.card}>

      <Image source={{ uri: supplement.imageUrl }} style={styles.image} />

      <View style={styles.info}>
        <View style={styles.nameRow}>
          <View style={[styles.dot, { backgroundColor: supplement.color }]} />
          <Text style={styles.name}>{supplement.name}</Text>
        </View>
        <Text style={styles.dose}>{supplement.dose}</Text>
      </View>

      <View style={[styles.timingBadge, { borderColor: supplement.color }]}>
        <Text style={[styles.timingText, { color: supplement.color }]}>{supplement.timing}</Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  card: {
    backgroundColor: "#1C1C1E",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 10,
    gap: 12
  },

  image: {
    width: 52,
    height: 52,
    borderRadius: 10
  },

  info: {
    flex: 1,
    gap: 4
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4
  },

  name: {
    color: "white",
    fontSize: 15,
    fontWeight: "700"
  },

  dose: {
    color: "#A1A1A1",
    fontSize: 12
  },

  timingBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    backgroundColor: "transparent"
  },

  timingText: {
    fontSize: 11,
    fontWeight: "600"
  }

});
