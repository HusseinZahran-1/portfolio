import { createContext, useContext } from "react";
import { en } from "./en";
import { ar } from "./ar";
import type { Language } from "../types/content";
export const dictionaries = { en, ar };
export const LanguageContext = createContext<Language>("en");
export function useI18n() {
  const lang = useContext(LanguageContext);
  return {
    lang,
    t: dictionaries[lang],
    local: (path = "/") =>
      lang === "ar" ? `/ar${path === "/" ? "" : path}` : path,
  };
}
export function routeLanguage(path: string): Language {
  return /^\/ar(?:\/|$)/.test(path) ? "ar" : "en";
}
export function stripLanguage(path: string) {
  return path.replace(/^\/ar(?=\/|$)/, "").replace(/\/$/, "") || "/";
}
