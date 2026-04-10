import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Body from "react-native-body-highlighter";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/src/styles/globalstyles";
import { useState } from "react";

type Props = {
  visible: boolean;
  onClose: () => void;
  gender: "male" | "female";
};

export default function BodyAvatarModal({ visible, onClose, gender }: Props) {
  const [side, setSide] = useState<"front" | "back">("front");

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <Text style={styles.title}>Mi cuerpo</Text>

          {/* Toggle frente / espalda */}
          <View style={styles.toggle}>
            <TouchableOpacity
              style={[styles.toggleBtn, side === "front" && styles.toggleBtnActive]}
              onPress={() => setSide("front")}
            >
              <Text style={[styles.toggleText, side === "front" && styles.toggleTextActive]}>Frente</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleBtn, side === "back" && styles.toggleBtnActive]}
              onPress={() => setSide("back")}
            >
              <Text style={[styles.toggleText, side === "back" && styles.toggleTextActive]}>Espalda</Text>
            </TouchableOpacity>
          </View>

          {/* Avatar */}
          <View style={styles.bodyContainer}>
            <Body
              data={[]}
              gender={gender}
              side={side}
              scale={1.5}
              border="#3A3A3C"
              defaultFill="#2A2A2C"
            />
          </View>

          <Text style={styles.hint}>Próximamente verás los músculos que más entrenas</Text>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 24,
    paddingBottom: 48,
    alignItems: "center",
  },
  closeBtn: {
    alignSelf: "flex-end",
    padding: 4,
    marginBottom: 4,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
  toggle: {
    flexDirection: "row",
    backgroundColor: "#2C2C2E",
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    width: "100%",
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  toggleBtnActive: {
    backgroundColor: colors.primary,
  },
  toggleText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "600",
  },
  toggleTextActive: {
    color: "white",
  },
  bodyContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 320,
  },
  hint: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: "center",
    marginTop: 12,
  },
});
