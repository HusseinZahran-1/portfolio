import { describe, expect, it } from "vitest";
import { projects } from "../data/projects";
import { validateProjects } from "./validation";
import { emptyFilters, filterProjects } from "./projects";
import { parseArticle } from "./article-parser";
import { articles } from "./blog";
import { parseCommand, commands } from "./terminal";
import { getRoutes, getMetadata } from "./seo";
import { en } from "../i18n/en";
import { ar } from "../i18n/ar";
import { render } from "../entry-server";
import type { Project } from "../types/content";

describe("project content and discovery", () => {
  it("validates supplied content", () =>
    expect(validateProjects(projects)).toHaveLength(5));
  it("rejects duplicate slugs and unsafe links with actionable errors", () => {
    expect(() =>
      validateProjects([projects[0], { ...projects[0], id: "different" }]),
    ).toThrow(/slug/);
    expect(() =>
      validateProjects([{ ...projects[0], githubUrl: "javascript:alert(1)" }]),
    ).toThrow(/HTTPS/);
    expect(() =>
      validateProjects([
        { ...projects[0], description: { en: "Text", ar: "" } },
      ]),
    ).toThrow(/English\/Arabic/);
  });
  it("combines search, category, technology, featured status and sorting", () => {
    expect(
      filterProjects(projects, { ...emptyFilters, query: " MEDAI " }),
    ).toHaveLength(1);
    expect(
      filterProjects(projects, {
        ...emptyFilters,
        category: "backend",
        technology: "FastAPI",
        featured: true,
      })[0].slug,
    ).toBe("mediflow-ai");
    expect(
      filterProjects(projects, { ...emptyFilters, category: "deep" }),
    ).toEqual([]);
    expect(
      filterProjects(projects, { ...emptyFilters, sort: "az" })[0].title,
    ).toBe("Car Price Prediction");
    expect(
      filterProjects(projects, { ...emptyFilters, sort: "za" })[0].title,
    ).toBe("Voice Emotion Recognition");
  });
  it("renders a newly added project through existing cards and dynamic routes in both languages", async () => {
    const fixture: Project = {
      ...projects[0],
      id: "qa-fixture",
      slug: "qa-fixture",
      title: "QA fixture — never published",
      description: { en: "Temporary test entry", ar: "إدخال مؤقت للاختبار" },
    };
    projects.push(fixture);
    try {
      validateProjects(projects);
      expect(getRoutes()).toContain("/projects/qa-fixture");
      expect(getRoutes()).toContain("/ar/projects/qa-fixture");
      expect(await render("/projects")).toContain(
        "QA fixture — never published",
      );
      expect(await render("/projects/qa-fixture")).toContain(
        "Temporary test entry",
      );
      expect(await render("/ar/projects/qa-fixture")).toContain(
        "إدخال مؤقت للاختبار",
      );
    } finally {
      projects.pop();
    }
  });
});

describe("local Markdown publishing", () => {
  const source =
    '---\ntitle: "Test"\nslug: test\ndescription: "A test only"\nlanguage: en\ndate: "2026-10-26"\ncategory: Python\ntags: [Python]\ndraft: false\n---\n## Hello\n\n```python\nprint("hello")\n```';
  it("parses metadata, reading time, and Markdown", () => {
    const a = parseArticle(source, "test.md");
    expect(a.minutes).toBe(1);
    expect(a.body).toContain("```python");
    expect(a.draft).toBe(false);
  });
  it("rejects invalid metadata, dates and missing image descriptions", () => {
    expect(() =>
      parseArticle(source.replace("2026-10-26", "2026-02-30"), "test.md"),
    ).toThrow(/real YYYY/);
    expect(() =>
      parseArticle(source.replace("language: en", "language: fr"), "test.md"),
    ).toThrow(/language/);
    expect(() =>
      parseArticle(
        source.replace("draft: false", "cover: /images/test.png\ndraft: false"),
        "test.md",
      ),
    ).toThrow(/coverAlt/);
  });
  it("does not publish the example drafts", () => {
    expect(articles).toEqual([]);
    expect(getRoutes()).not.toContain("/blog/example-article");
  });
});

describe("bilingual routes, SEO, and terminal", () => {
  const keys = (obj: object, prefix = ""): string[] =>
    Object.entries(obj).flatMap(([k, v]) =>
      v && typeof v === "object" && !Array.isArray(v)
        ? keys(v, `${prefix}${k}.`)
        : [`${prefix}${k}`],
    );
  it("provides every English interface key in Arabic", () =>
    expect(keys(ar).sort()).toEqual(keys(en).sort()));
  it("prepares all public routes and unique localized metadata", () => {
    expect(getRoutes()).toHaveLength(16);
    expect(getMetadata("/ar/projects/medai").lang).toBe("ar");
    expect(getMetadata("/projects/medai").title).toContain("MedAI");
    expect(getMetadata("/missing").found).toBe(false);
  });
  it("renders direct project URLs, empty journal, and unknown routes", async () => {
    for (const p of projects)
      expect(await render(`/projects/${p.slug}`)).toContain(p.title);
    expect(await render("/blog")).toContain(en.blog.empty);
    expect(await render("/blog/example-article")).toContain("404");
    expect(await render("/missing")).toContain("404");
  });
  it("only accepts predefined commands", () => {
    for (const c of commands)
      expect(parseCommand(` ${c.toUpperCase()} `)).toBe(c);
    for (const c of [
      "alert(1)",
      "help; rm -rf /",
      "<script>",
      'fetch("https://example.com")',
    ])
      expect(parseCommand(c)).toBe("unknown");
  });
});
