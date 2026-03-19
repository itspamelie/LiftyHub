import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/src/styles/globalstyles";

type Props = {
  icon: any;
  label: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
  showArrow?: boolean;
};

export default function SettingsItem({
  icon,
  label,
  value,
  onPress,
  danger = false,
  showArrow = false
}: Props) {

  return (
    <TouchableOpacity
      style={styles.row}
      activeOpacity={0.7}
      onPress={onPress}
    >

      <View style={styles.rowLeft}>
        <Ionicons
          name={icon}
          size={20}
          color={danger ? colors.danger : colors.text}
        />

        <Text
          style={[
            styles.label,
            danger && { color: colors.danger }
          ]}
        >
          {label}
        </Text>
      </View>

      {value && (
        <Text style={styles.value}>
          {value}
        </Text>
      )}

      {showArrow && (
        <Ionicons name="chevron-forward" size={18} color="#A1A1A1" />
      )}

    </TouchableOpacity>
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

  label: {
    color: "white",
    fontSize: 16,
    marginLeft: 12
  },

  value: {
    color: "#A1A1A1"
  }

});