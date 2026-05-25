import { createContext, useContext, useEffect, useState, useMemo, useCallback, ReactNode } from "react";
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
    let cancelled = false;
    AsyncStorage.getItem("@liftyhub_language").then((saved) => {
      if (!cancelled && saved) {
        setLanguage(saved);
        i18n.locale = saved;
      }
    });
    return () => { cancelled = true; };
  }, []);

  const changeLanguage = useCallback(async (lang: string) => {
    setLanguage(lang);
    i18n.locale = lang;
    await AsyncStorage.setItem("@liftyhub_language", lang);
  }, []);

  const t = useCallback((scope: string, options?: object) => i18n.t(scope, options), [language]);

  const value = useMemo(() => ({ t, language, changeLanguage }), [t, language, changeLanguage]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
