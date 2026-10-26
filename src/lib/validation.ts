import type { Project } from "../types/content";
const safeUrl = (s: string) => {
  try {
    return new URL(s).protocol === "https:";
  } catch {
    return false;
  }
};
const localized = (value: unknown): boolean =>
  !!value &&
  typeof value === "object" &&
  ["en", "ar"].every(
    (k) =>
      typeof (value as Record<string, unknown>)[k] === "string" &&
      String((value as Record<string, unknown>)[k]).trim(),
  );
export function validateProjects(entries: Project[]) {
  const ids = new Set<string>(),
    slugs = new Set<string>();
  for (const [i, p] of entries.entries()) {
    const fail = (message: string): never => {
      throw new Error(`Project ${p.title || i + 1}: ${message}`);
    };
    if (!p.id || ids.has(p.id)) fail("id must be present and unique");
    if (
      !p.slug ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug) ||
      slugs.has(p.slug)
    )
      fail("slug must be unique and use lowercase words separated by hyphens");
    if (!p.title?.trim() || !localized(p.description) || !localized(p.coverAlt))
      fail("title, English/Arabic description and coverAlt are required");
    if (
      !Array.isArray(p.categories) ||
      !p.categories.length ||
      p.categories.some(
        (x) => !["ml", "deep", "data", "backend", "xai"].includes(x),
      )
    )
      fail("categories must contain supported category keys");
    if (
      !Array.isArray(p.technologies) ||
      !p.technologies.length ||
      p.technologies.some((t) => !t.trim())
    )
      fail("technologies cannot be empty");
    if (!p.cover?.startsWith("/images/"))
      fail("cover must be a local /images/ path");
    if (!Number.isFinite(p.order) || typeof p.featured !== "boolean")
      fail("order must be numeric and featured must be true or false");
    for (const url of [p.githubUrl, p.demoUrl])
      if (url !== undefined && !safeUrl(url))
        fail(
          "repository and demo links must be valid HTTPS URLs; omit unavailable links",
        );
    for (const shot of p.screenshots || [])
      if (!shot.src.startsWith("/images/") || !localized(shot.alt))
        fail("screenshots need a local path and bilingual alt text");
    for (const value of Object.values(p.caseStudy || {}))
      if (!localized(value))
        fail("case study sections need English and Arabic text");
    for (const value of [p.status, p.note])
      if (value && !localized(value))
        fail("status and note need English and Arabic text");
    ids.add(p.id);
    slugs.add(p.slug);
  }
  return entries;
}
