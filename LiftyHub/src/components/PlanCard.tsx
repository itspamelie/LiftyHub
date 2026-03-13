import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  title: string;
  description: string;
  price: string;
  features: string[];
  recommended?: boolean;
};

export default function PlanCard({
  title,
  description,
  price,
  features,
  recommended
}: Props) {

  return (

    <View style={[styles.card, recommended && styles.recommendedCard]}>

      {recommended && (
        <View style={styles.recommendedTag}>
          <Text style={styles.recommendedText}>RECOMENDADO</Text>
        </View>
      )}

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      {features.map((feature, index) => (
        <View key={index} style={styles.featureRow}>
          <Ionicons name="checkmark" size={18} color="#3B82F6" />
          <Text style={styles.featureText}>{feature}</Text>
        </View>
      ))}

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Suscribirse por {price}</Text>
      </TouchableOpacity>

    </View>

  );
}

const styles = StyleSheet.create({

  card: {
    backgroundColor: "#1C1C1E",
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#2A2A2A"
  },

  recommendedCard: {
    borderColor: "#3B82F6"
  },

  recommendedTag: {
    position: "absolute",
    top: -12,
    left: 20,
    backgroundColor: "#3B82F6",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10
  },

  recommendedText: {
    color: "white",
    fontSize: 12,
    fontWeight: "700"
  },

  title: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
    marginTop: 10
  },

  description: {
    color: "#A1A1A1",
    marginBottom: 14,
    marginTop: 4
  },

  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8
  },

  featureText: {
    color: "white",
    marginLeft: 8
  },

  button: {
    marginTop: 18,
    borderWidth: 1,
    borderColor: "#3B82F6",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center"
  },

  buttonText: {
    color: "#3B82F6",
    fontWeight: "700"
  }

});