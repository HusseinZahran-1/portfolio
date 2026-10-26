import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getMetadata, getRoutes } from "../lib/seo";
import { stripLanguage } from "../i18n/context";
export function RouteEffects() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    const m = getMetadata(pathname);
    document.title = m.title;
    document.documentElement.lang = m.lang;
    document.documentElement.dir = m.lang === "ar" ? "rtl" : "ltr";
    const origin = import.meta.env.VITE_SITE_ORIGIN
      ? new URL(import.meta.env.VITE_SITE_ORIGIN).origin
      : location.origin;
    const meta = (key: string, value: string, property = false) => {
      const attr = property ? "property" : "name";
      let el = document.head.querySelector<HTMLMetaElement>(
        `meta[${attr}="${key}"]`,
      );
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.append(el);
      }
      el.content = value;
    };
    meta("description", m.description);
    meta("robots", m.found ? "index,follow" : "noindex,follow");
    meta("og:title", m.title, true);
    meta("og:description", m.description, true);
    meta("og:type", m.type, true);
    meta("og:locale", m.lang === "ar" ? "ar_JO" : "en_US", true);
    meta("og:image", new URL(m.image, location.origin).href, true);
    meta("og:url", location.origin + pathname, true);
    meta("twitter:card", "summary_large_image");
    meta("twitter:title", m.title);
    meta("twitter:description", m.description);
    meta("twitter:image", new URL(m.image, location.origin).href);
    document.head
      .querySelectorAll(
        'link[rel="canonical"],link[rel="alternate"][hreflang],script[data-structured],meta[property="article:published_time"]',
      )
      .forEach((el) => el.remove());
    const canonical = document.createElement("link");
    canonical.rel = "canonical";
    canonical.href = origin + pathname;
    document.head.append(canonical);
    const path = stripLanguage(pathname);
    for (const l of ["en", "ar"]) {
      const route = l === "ar" ? `/ar${path === "/" ? "" : path}` : path;
      if (getRoutes().includes(route)) {
        const el = document.createElement("link");
        el.rel = "alternate";
        el.hreflang = l;
        el.href = origin + route;
        document.head.append(el);
      }
    }
    if (m.article) meta("article:published_time", m.article.date, true);
    const structured = document.createElement("script");
    structured.type = "application/ld+json";
    structured.dataset.structured = "";
    structured.textContent = JSON.stringify(m.jsonLd);
    document.head.append(structured);
  }, [pathname]);
  useEffect(() => {
    let tries = 0;
    let timer: ReturnType<typeof setTimeout>;
    function navigate() {
      const target = hash
        ? document.getElementById(decodeURIComponent(hash.slice(1)))
        : document.querySelector<HTMLElement>("main h1");
      if (!target && tries++ < 20) {
        timer = setTimeout(navigate, 50);
        return;
      }
      if (hash)
        target?.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "instant"
            : "smooth",
        });
      else {
        window.scrollTo(0, 0);
        target?.focus({ preventScroll: true });
      }
    }
    timer = setTimeout(navigate, 0);
    return () => clearTimeout(timer);
  }, [pathname, hash]);
  return null;
}
