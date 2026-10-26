import { createServer, loadEnv } from "vite";
import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import path from "node:path";
const env = { ...loadEnv("production", process.cwd(), ""), ...process.env };
const rawOrigin = env.SITE_URL || env.CF_PAGES_URL || "";
const origin = rawOrigin ? new URL(rawOrigin).origin : "";
if (origin && !origin.startsWith("https://"))
  throw new Error("SITE_URL must use HTTPS");
if (!origin)
  console.warn(
    "SITE_URL is not configured. Canonical/hreflang URLs and the sitemap will be populated when SITE_URL or CF_PAGES_URL is set.",
  );
const server = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
});
const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
try {
  const entry = await server.ssrLoadModule("/src/entry-server.tsx");
  for (const asset of [
    ...entry.projects.flatMap((p) => [
      p.cover,
      ...(p.screenshots || []).map((s) => s.src),
    ]),
    ...entry.articles.flatMap((a) => (a.cover ? [a.cover] : [])),
    entry.personal.portrait,
    entry.personal.resume,
  ]) {
    if (asset.includes("..")) throw new Error(`Invalid asset path: ${asset}`);
    try {
      await access(path.join("public", asset));
    } catch {
      throw new Error(`Missing content asset: public${asset}`);
    }
  }
  const template = await readFile("dist/index.html", "utf8");
  const routes = entry.getRoutes();
  for (const route of routes) {
    const m = entry.getMetadata(route);
    const url = origin + route;
    const clean = route.replace(/^\/ar(?=\/|$)/, "") || "/";
    const alternates = ["en", "ar"]
      .map((lang) => ({
        lang,
        route: lang === "ar" ? `/ar${clean === "/" ? "" : clean}` : clean,
      }))
      .filter((a) => routes.includes(a.route));
    const structured = { ...m.jsonLd };
    if (origin) {
      structured.url = url;
      if (structured.image?.startsWith("/"))
        structured.image = origin + structured.image;
    }
    const head = `<title>${escape(m.title)}</title><meta name="description" content="${escape(m.description)}"><meta name="robots" content="index,follow"><meta property="og:title" content="${escape(m.title)}"><meta property="og:description" content="${escape(m.description)}"><meta property="og:type" content="${m.type}"><meta property="og:locale" content="${m.lang === "ar" ? "ar_JO" : "en_US"}"><meta property="og:image" content="${origin}${m.image}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escape(m.title)}"><meta name="twitter:description" content="${escape(m.description)}"><meta name="twitter:image" content="${origin}${m.image}">${m.article ? `<meta property="article:published_time" content="${m.article.date}">` : ""}${origin ? `<link rel="canonical" href="${url}"><meta property="og:url" content="${url}">${alternates.map((a) => `<link rel="alternate" hreflang="${a.lang}" href="${origin}${a.route}">`).join("")}${alternates.some((a) => a.lang === "en") ? `<link rel="alternate" hreflang="x-default" href="${origin}${clean}">` : ""}` : ""}<script type="application/ld+json" data-structured>${JSON.stringify(structured).replace(/</g, "\\u003c")}</script>`;
    const html = template
      .replace(
        'lang="en" dir="ltr"',
        `lang="${m.lang}" dir="${m.lang === "ar" ? "rtl" : "ltr"}"`,
      )
      .replace("<!--app-head-->", head)
      .replace('id="root"', `id="root" data-prerendered="${route}"`)
      .replace("<!--app-html-->", await entry.render(route));
    const directory = path.join("dist", route);
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, "index.html"), html);
  }
  await writeFile(
    "dist/robots.txt",
    `User-agent: *\nAllow: /\n${origin ? `Sitemap: ${origin}/sitemap.xml\n` : ""}`,
  );
  await writeFile(
    "dist/sitemap.xml",
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${origin ? routes.map((route) => `<url><loc>${escape(origin + route)}</loc></url>`).join("") : "<!-- Set SITE_URL or build on Cloudflare Pages to populate absolute URLs. -->"}</urlset>`,
  );
  console.log(
    `Prerendered ${routes.length} bilingual routes. All referenced content assets exist.`,
  );
} finally {
  await server.close();
}
