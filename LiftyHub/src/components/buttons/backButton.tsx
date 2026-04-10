import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { colors } from "@/src/styles/globalstyles";
import HapticButton from "@/src/components/buttons/HapticButton";

export default function BackButton() {

  return (
    <HapticButton
      style={styles.button}
      onPress={() => router.back()}
      activeOpacity={0.7}
    >
      <Ionicons name="arrow-back" size={20} color="white" />
    </HapticButton>
  );
}

const styles = StyleSheet.create({

  button: {
    position: "absolute",
    top: 60,
    left: 20,
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20
  }

});