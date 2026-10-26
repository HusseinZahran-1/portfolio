import { defineConfig, loadEnv } from "vite";
import { readFile } from "node:fs/promises";
import { parseArticle } from "./src/lib/article-parser";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig(({ mode }) => ({
  define: {
    "import.meta.env.VITE_SITE_ORIGIN": JSON.stringify(
      process.env.SITE_URL ||
        process.env.CF_PAGES_URL ||
        loadEnv(mode, process.cwd(), "").SITE_URL ||
        "",
    ),
  },
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "local-markdown-content",
      enforce: "pre",
      async load(id) {
        if (!id.endsWith(".md?article")) return;
        const filename = id.slice(0, -8);
        this.addWatchFile(filename);
        const article = parseArticle(
          await readFile(filename, "utf8"),
          filename,
        );
        // Drafts and YAML parsing never enter the visitor's JavaScript bundle.
        return `export default ${JSON.stringify(article.draft ? null : article)}`;
      },
    },
  ],
  build: { target: "es2022" },
}));
