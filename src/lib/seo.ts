import { projects } from "../data/projects";
import { articles } from "./blog";
import { routeLanguage, stripLanguage, dictionaries } from "../i18n/context";
import { personal } from "../data/personal";
import { social } from "../data/social";
export function getRoutes() {
  return [
    "/",
    "/projects",
    "/blog",
    ...projects.map((p) => `/projects/${p.slug}`),
    "/ar",
    "/ar/projects",
    "/ar/blog",
    ...projects.map((p) => `/ar/projects/${p.slug}`),
    ...articles.map(
      (a) => `${a.language === "ar" ? "/ar" : ""}/blog/${a.slug}`,
    ),
  ];
}
export function getMetadata(path: string) {
  const lang = routeLanguage(path),
    clean = stripLanguage(path),
    t = dictionaries[lang];
  let title = t.seo.title,
    description = t.seo.description,
    type = "website",
    image = "/images/og-cover.png";
  let jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: personal.name[lang],
    description,
    jobTitle: personal.role[lang],
    image: personal.portrait,
    sameAs: Object.values(social),
    email: personal.email,
    homeLocation: { "@type": "Place", name: personal.location[lang] },
  };
  if (clean === "/projects")
    title = `${t.seo.projects} | ${personal.name[lang]}`;
  if (clean === "/blog") title = `${t.seo.blog} | ${personal.name[lang]}`;
  const project = projects.find((p) => clean === `/projects/${p.slug}`);
  if (project) {
    title = `${project.title} | ${personal.name[lang]}`;
    description = project.description[lang];
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: project.title,
      description,
      author: { "@type": "Person", name: personal.name[lang] },
    };
  }
  const article = articles.find(
    (a) => clean === `/blog/${a.slug}` && a.language === lang,
  );
  if (article) {
    title = `${article.title} | ${personal.name[lang]}`;
    description = article.description;
    type = "article";
    image = article.cover || image;
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: article.title,
      description,
      datePublished: article.date,
      inLanguage: lang,
      author: { "@type": "Person", name: personal.name[lang] },
    };
  }
  const found = getRoutes().includes(path.replace(/\/$/, "") || "/");
  if (!found) {
    title = `${t.seo.notFound} | ${personal.name[lang]}`;
    jsonLd = {};
  }
  return { title, description, lang, type, image, jsonLd, found, article };
}
