import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Lang, STRINGS, I18nStrings } from "../i18n";

interface LanguageContextValue {
  lang: Lang;
  t: I18nStrings;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "en",
  t: STRINGS.en,
  toggleLang: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    AsyncStorage.getItem("appLang").then((saved) => {
      if (saved === "en" || saved === "kr") setLang(saved as Lang);
    });
  }, []);

  const toggleLang = () => {
    const next: Lang = lang === "en" ? "kr" : "en";
    setLang(next);
    AsyncStorage.setItem("appLang", next).catch(() => {});
  };

  return (
    <LanguageContext.Provider value={{ lang, t: STRINGS[lang], toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
