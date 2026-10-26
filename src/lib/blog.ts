import type { Article } from "./article-parser";
import type { Language } from "../types/content";
const files = import.meta.glob("../content/blog/*.md", {
  query: "?article",
  import: "default",
  eager: true,
});
const all = Object.values(files).filter(Boolean) as Article[];
const keys = new Set<string>();
for (const a of all) {
  const key = `${a.language}/${a.slug}`;
  if (keys.has(key)) throw new Error(`Duplicate blog slug: ${key}`);
  keys.add(key);
}
export const articles = all.sort((a, b) => b.date.localeCompare(a.date));
export const formatDate = (date: string, lang: Language) =>
  new Intl.DateTimeFormat(lang === "ar" ? "ar-JO" : "en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
