import { readFile, readdir, access } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import axe from "axe-core";

async function walk(folder) {
  const entries = await readdir(folder, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((e) =>
        e.isDirectory()
          ? walk(path.join(folder, e.name))
          : [path.join(folder, e.name)],
      ),
    )
  ).flat();
}
const htmlFiles = (await walk("dist")).filter((file) => file.endsWith(".html"));
let checkedLinks = 0;
for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  assert(
    !html.includes("QA publishing fixture"),
    "Temporary test content must not remain in the handoff",
  );
  const dom = new JSDOM(html, {
    url: "https://local-test.example",
    runScripts: "outside-only",
  });
  const doc = dom.window.document;
  assert.equal(
    doc.querySelectorAll("main").length,
    1,
    `${file}: one main landmark`,
  );
  assert.equal(doc.querySelectorAll("h1").length, 1, `${file}: one h1`);
  assert(doc.title, `${file}: title required`);
  assert(
    doc.querySelector('meta[name="description"]')?.content,
    `${file}: description required`,
  );
  for (const element of doc.querySelectorAll("a[href],img[src]")) {
    const url = element.getAttribute("href") || element.getAttribute("src");
    assert(url && url !== "#", `${file}: empty link or image`);
    if (url.startsWith("#")) {
      assert(
        doc.getElementById(url.slice(1)),
        `${file}: missing anchor ${url}`,
      );
      continue;
    }
    if (!url.startsWith("/")) continue;
    const [pathname, anchor] = url.split("#");
    let target = path.join("dist", pathname);
    if (!path.extname(pathname)) target = path.join(target, "index.html");
    await access(target);
    checkedLinks++;
    if (anchor) {
      const targetDoc = new JSDOM(await readFile(target, "utf8")).window
        .document;
      assert(
        targetDoc.getElementById(anchor),
        `${file}: missing linked anchor ${url}`,
      );
    }
  }
  dom.window.eval(axe.source);
  const result = await dom.window.axe.run(doc, {
    rules: { "color-contrast": { enabled: false } },
    runOnly: {
      type: "tag",
      values: ["wcag2a", "wcag2aa", "wcag21aa", "best-practice"],
    },
  });
  if (result.violations.length) {
    console.error(
      file,
      JSON.stringify(
        result.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          nodes: v.nodes.map((n) => n.target),
        })),
        null,
        2,
      ),
    );
    throw new Error("Static accessibility audit failed");
  }
  dom.window.close();
}
const resume = await readFile("public/resume/Hussein_Zahran_CV.pdf");
assert(resume.subarray(0, 4).toString() === "%PDF");
assert.equal(
  createHash("sha256").update(resume).digest("hex"),
  createHash("sha256")
    .update(await readFile("dist/resume/Hussein_Zahran_CV.pdf"))
    .digest("hex"),
);
console.log(
  `PASS: ${htmlFiles.length} static pages; ${checkedLinks} local links/assets; headings, metadata, anchors, resume integrity and axe semantic accessibility checks. Contrast and layout require browser review.`,
);
