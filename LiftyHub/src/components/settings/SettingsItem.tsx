import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/src/styles/globalstyles";
import HapticButton from "@/src/components/buttons/HapticButton";

type Props = {
  icon: any;
  label: string;
  value?: string;
  valueColor?: string;
  onPress?: () => void;
  danger?: boolean;
  showArrow?: boolean;
};

export default function SettingsItem({
  icon,
  label,
  value,
  valueColor,
  onPress,
  danger = false,
  showArrow = false
}: Props) {

  return (
    <HapticButton
      style={styles.row}
      activeOpacity={onPress ? 0.7 : 1}
      onPress={onPress}
    >

      <View style={styles.rowLeft}>
        <Ionicons
          name={icon}
          size={20}
          color={danger ? colors.danger : colors.text}
        />

        <Text style={[styles.label, danger && { color: colors.danger }]}>
          {label}
        </Text>
      </View>

      <View style={styles.rowRight}>
        {value && (
          <Text style={[styles.value, onPress && styles.valueInteractive, valueColor ? { color: valueColor, fontWeight: "700" } : undefined]}>
            {value}
          </Text>
        )}

        {showArrow && (
          <Ionicons name="chevron-forward" size={18} color="#A1A1A1" />
        )}
      </View>

    </HapticButton>
  );
}

const styles = StyleSheet.create({

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16
  },

  rowLeft: {
    flexDirection: "row",
    alignItems: "center"
  },

  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },

  label: {
    color: "white",
    fontSize: 16,
    marginLeft: 12
  },

  labelStatic: {
    color: "#555"
  },

  value: {
    color: "#A1A1A1"
  },

  valueStatic: {
    color: "#444"
  },

  valueInteractive: {
    color: colors.primary,
    fontWeight: "600"
  }

});