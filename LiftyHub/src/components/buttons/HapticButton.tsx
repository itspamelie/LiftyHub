import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import * as Haptics from "expo-haptics";

type HapticButtonProps = TouchableOpacityProps & {
  hapticStyle?: Haptics.ImpactFeedbackStyle;
};

export default function HapticButton({
  onPress,
  hapticStyle = Haptics.ImpactFeedbackStyle.Light,
  ...props
}: HapticButtonProps) {
  const handlePress: TouchableOpacityProps["onPress"] = (event) => {
    Haptics.impactAsync(hapticStyle);
    onPress?.(event);
  };

  return <TouchableOpacity onPress={handlePress} {...props} />;
}
