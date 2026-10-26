// Temporarily edit source exactly as a content author would, then restore it.
import { readFile, writeFile, unlink, access } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import assert from "node:assert/strict";
const projectFile = "src/data/projects.ts";
const original = await readFile(projectFile, "utf8");
const fixtureFile = "src/content/blog/qa-publishing-fixture.md";
try {
  await access(fixtureFile);
  throw new Error("Refusing to overwrite an existing QA fixture.");
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
try {
  await writeFile(
    projectFile,
    original.replace(
      "validateProjects(projects);",
      `projects.push({ ...projects[0], id: 'qa-publishing-fixture', slug: 'qa-publishing-fixture', title: 'QA publishing fixture — test only', featured: false, order: 99 });\nvalidateProjects(projects);`,
    ),
  );
  await writeFile(
    fixtureFile,
    `---\ntitle: "QA publishing fixture — test only"\nslug: "qa-publishing-fixture"\ndescription: "Temporary verification article, never a published personal claim."\nlanguage: en\ndate: "2026-10-26"\ncategory: "QA"\ntags: ["Testing"]\ndraft: false\n---\n## A verified rendering test\n\n\`\`\`python\nprint("test")\n\`\`\`\n`,
  );
  for (const [script, args] of [
    ["node_modules/typescript/bin/tsc", ["--noEmit"]],
    ["node_modules/vite/bin/vite.js", ["build"]],
    ["scripts/prerender.mjs", []],
  ]) {
    const result = spawnSync(process.execPath, [script, ...args], {
      stdio: "inherit",
      env: { ...process.env, SITE_URL: "https://portfolio-test.example" },
    });
    if (result.status !== 0) throw new Error(`Fixture build failed: ${script}`);
  }
  const project = await readFile(
    "dist/projects/qa-publishing-fixture/index.html",
    "utf8",
  );
  const arabic = await readFile(
    "dist/ar/projects/qa-publishing-fixture/index.html",
    "utf8",
  );
  const blog = await readFile(
    "dist/blog/qa-publishing-fixture/index.html",
    "utf8",
  );
  const listing = await readFile("dist/blog/index.html", "utf8");
  const sitemap = await readFile("dist/sitemap.xml", "utf8");
  assert.match(project, /QA publishing fixture/);
  assert.match(arabic, /dir="rtl"/);
  assert.match(blog, /A verified rendering test/);
  assert.match(blog, /hljs/);
  assert.match(blog, /BlogPosting/);
  assert.match(blog, /rel="canonical"/);
  assert.match(listing, /QA publishing fixture/);
  assert.match(
    sitemap,
    /https:\/\/portfolio-test\.example\/projects\/qa-publishing-fixture/,
  );
  console.log(
    "PASS: a source-only project addition and a new Markdown file create cards, bilingual detail pages, highlighted article HTML, metadata and sitemap entries.",
  );
} finally {
  await writeFile(projectFile, original);
  await unlink(fixtureFile);
  console.log(
    "Original source restored. Run npm run build to replace the temporary QA output.",
  );
}
