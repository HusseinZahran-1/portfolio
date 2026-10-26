import { parse } from "yaml";
import type { Language } from "../types/content";
export interface Article {
  title: string;
  slug: string;
  description: string;
  language: Language;
  date: string;
  tags: string[];
  category: string;
  cover?: string;
  coverAlt?: string;
  draft: boolean;
  body: string;
  minutes: number;
}
export function parseArticle(raw: string, file: string): Article {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match)
    throw new Error(`${file}: expected YAML front matter between --- lines`);
  const data = parse(match[1]);
  const fail = (s: string): never => {
    throw new Error(`${file}: ${s}`);
  };
  if (!data || typeof data !== "object") fail("metadata must be an object");
  for (const key of ["title", "slug", "description", "date", "category"])
    if (typeof data[key] !== "string" || !data[key].trim())
      fail(`${key} is required and must be text`);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug))
    fail("slug must use lowercase letters, numbers and hyphens");
  if (!["en", "ar"].includes(data.language)) fail("language must be en or ar");
  if (typeof data.draft !== "boolean") fail("draft must be true or false");
  if (
    !Array.isArray(data.tags) ||
    data.tags.some((x: unknown) => typeof x !== "string")
  )
    fail("tags must be an array of text");
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(data.date) ||
    Number.isNaN(Date.parse(data.date)) ||
    new Date(data.date).toISOString().slice(0, 10) !== data.date
  )
    fail("date must be a real YYYY-MM-DD date in quotes");
  if (data.cover && (!data.cover.startsWith("/images/") || !data.coverAlt))
    fail("cover needs a local /images/ path and coverAlt");
  return {
    ...data,
    body: match[2],
    minutes: Math.max(1, Math.ceil(match[2].trim().split(/\s+/).length / 200)),
  };
}
