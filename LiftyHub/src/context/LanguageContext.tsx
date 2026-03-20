import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { I18n } from "i18n-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { translations } from "@/src/i18n/translations";

const i18n = new I18n(translations);
i18n.enableFallback = true;
i18n.defaultLocale = "es";

type LanguageContextType = {
  t: (scope: string, options?: object) => string;
  language: string;
  changeLanguage: (lang: string) => void;
};

const LanguageContext = createContext<LanguageContextType>({
  t: (scope) => scope,
  language: "es",
  changeLanguage: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState("es");

  useEffect(() => {
    AsyncStorage.getItem("@liftyhub_language").then((saved) => {
      if (saved) {
        setLanguage(saved);
        i18n.locale = saved;
      }
    });
  }, []);

  const changeLanguage = async (lang: string) => {
    setLanguage(lang);
    i18n.locale = lang;
    await AsyncStorage.setItem("@liftyhub_language", lang);
  };

  const t = (scope: string, options?: object) => i18n.t(scope, options);

  return (
    <LanguageContext.Provider value={{ t, language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
