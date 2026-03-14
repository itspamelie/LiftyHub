import { useEffect, useState } from "react";
import { Text } from "react-native";

type Props = {
  value: number;
  suffix?: string;
  style?: any;
  trigger?: number;
};

export default function AnimatedStatNumber({ value, suffix = "", style, trigger = 0 }: Props) {

  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {

    let start = 0;
    const duration = 1200;
    const stepTime = 16;

    const steps = duration / stepTime;
    const increment = value / steps;

    const counter = setInterval(() => {

      start += increment;

      if (start >= value) {
        clearInterval(counter);
        setDisplayValue(value);
      } else {
        setDisplayValue(Math.floor(start));
      }

    }, stepTime);

    return () => clearInterval(counter);

  }, [value, trigger]);

  return (
    <Text style={style}>
      {displayValue.toLocaleString()}{suffix}
    </Text>
  );
}