import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  tips: string[];
};

export default function DietTipCard({ tips }: Props) {
  return (
    <View style={styles.card}>
      {tips.map((tip, index) => (
        <View key={index} style={styles.tipRow}>
          <Ionicons name="checkmark-circle" size={20} color="#3B82F6" />
          <Text style={styles.tipText}>{tip}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({

  card: {
    backgroundColor: "#1C1C1E",
    borderRadius: 16,
    padding: 16,
    gap: 14
  },

  tipRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10
  },

  tipText: {
    color: "#A1A1A1",
    fontSize: 14,
    lineHeight: 20,
    flex: 1
  }

});
