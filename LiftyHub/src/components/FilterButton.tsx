import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { colors } from "@/src/styles/globalstyles";

type Props = {
  label: string;
  active?: boolean;
};

export default function FilterButton({ label, active }: Props) {
  return (
    <TouchableOpacity
      style={[styles.button, active && styles.activeButton]}
    >
      <Text style={[styles.text, active && styles.activeText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({

  button: {
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10
  },

  activeButton: {
    backgroundColor: colors.primary
  },

  text: {
    color: colors.textSecondary,
    fontSize: 14
  },

  activeText: {
    color: colors.text
  }

});