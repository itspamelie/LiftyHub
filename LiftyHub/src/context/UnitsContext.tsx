import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@liftyhub_units";
const KG_TO_LB = 2.20462;

type UnitsContextType = {
  units: "kg" | "lb";
  unitLabel: string;
  changeUnits: (u: "kg" | "lb") => Promise<void>;
  toDisplay: (kg: number) => number;
  toKg: (display: number) => number;
};

const UnitsContext = createContext<UnitsContextType>({
  units: "kg",
  unitLabel: "kg",
  changeUnits: async () => {},
  toDisplay: (kg) => kg,
  toKg: (v) => v,
});

export function UnitsProvider({ children }: { children: ReactNode }) {
  const [units, setUnits] = useState<"kg" | "lb">("kg");

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved === "kg" || saved === "lb") setUnits(saved);
    });
  }, []);

  const changeUnits = async (u: "kg" | "lb") => {
    setUnits(u);
    await AsyncStorage.setItem(STORAGE_KEY, u);
  };

  const toDisplay = (kg: number) =>
    units === "lb" ? Math.round(kg * KG_TO_LB * 100) / 100 : kg;

  const toKg = (display: number) =>
    units === "lb" ? Math.round((display / KG_TO_LB) * 100) / 100 : display;

  return (
    <UnitsContext.Provider value={{ units, unitLabel: units, changeUnits, toDisplay, toKg }}>
      {children}
    </UnitsContext.Provider>
  );
}

export const useUnits = () => useContext(UnitsContext);
