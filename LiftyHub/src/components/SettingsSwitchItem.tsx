import { View, Text, StyleSheet, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  icon: any;
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
};

export default function SettingsSwitchItem({
  icon,
  label,
  value,
  onChange
}: Props) {

  return (
    <View style={styles.row}>

      <View style={styles.rowLeft}>
        <Ionicons name={icon} size={20} color="white" />
        <Text style={styles.label}>{label}</Text>
      </View>

      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: "#767577", true: "#3B82F6" }}
      />

    </View>
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
  }

});