# Verification — 26 October 2026

## Executed checks

- `npm run build`: successful TypeScript check, Vite production bundle, and 16 prerendered English/Arabic public pages. Required images and résumé files validated during the build.
- `npm test`: 11 passing tests covering project validation, filter combinations, sorting, adding a project, bilingual dynamic detail rendering, Markdown metadata/date validation, unpublished drafts, translation keys, routes/metadata, unknown routes, and the safe terminal command allowlist.
- `node scripts/test-publishing.mjs`: temporarily added a project to the source data and a new published Markdown fixture, then built the site. Verified generated project cards and English/Arabic detail pages, the article listing, highlighted article HTML, canonical metadata, BlogPosting schema, and sitemap inclusion with a test-only HTTPS origin. The script restored source files; the final build contains neither fixture nor test domain.
- `node scripts/audit-static.mjs`: passed on all 16 final pages, including 344 local links/assets, linked anchors, heading structure, metadata, résumé integrity, and axe semantic accessibility checks. Color contrast is excluded from this non-visual DOM audit.
- `npm audit`: zero known vulnerabilities after installing the final dependencies; production-only audit also passed.
- The served résumé downloaded through the browser. Its SHA-256 matches the original supplied CV: `E10978266D53DF7D574C369075F08FF98CDE8225C8BD94C2BAC4EBE596C646A5`.
- The replacement portrait is the user-supplied `mine.jpeg`, copied unchanged. The social image uses the replacement photo too.

## Browser checks

Tested in the in-app Chromium browser against the production preview:

- Search by name, category filtering, technology filtering, sorting, featured-only selection, and the empty state.
- Switching between English and Arabic while retaining project filters; appropriate `lang` and `dir` values.
- Saved Arabic preference restored when opening `/` again.
- Mobile menu opens; Escape dismisses it and restores focus to its button.
- Terminal commands: `help`, `about`, `skills`, `projects`, `github`, `contact`, `clear`; Up/Down history; arbitrary `alert(1)` text rejected as an unknown command.
- Homepage, explorer, MedAI detail, and blog listing in both languages at 320×900, 768×900, and 1440×900. All 24 checks completed with document scroll width equal to client width after fixing decorative-ring and contact-email overflow. Desktop scrollbars reduce client widths by 15 pixels.
- Visual review of English desktop/tablet and Arabic mobile layouts, project artwork, and the replacement portrait. Final browser error log was empty.

## Performance and deployment boundaries

- Main JavaScript bundle: approximately 141 kB gzipped; stylesheet: approximately 10.8 kB gzipped. The Markdown/syntax-highlighting renderer is separately loaded (approximately 103 kB gzipped). Fonts are served locally; the replacement JPEG is approximately 51 kB. SVG artwork avoids WebGL overhead.
- No Lighthouse scores or real-device performance measurements are claimed. Device emulation and semantic auditing do not replace a full assistive-technology, contrast, or cross-browser audit.
- Reduced-motion CSS and Motion configuration are implemented; no operating-system accessibility preference was changed during testing.
- Cloudflare-compatible static output exists in `dist/`. No GitHub repository or Cloudflare integration was created, and no public deployment was performed.
- No production domain was supplied. Local output intentionally has no absolute canonical/hreflang URLs and an empty sitemap. Cloudflare's `CF_PAGES_URL`, or a configured `SITE_URL`, fills these during the deployment build; this behavior passed the publishing test.

## Re-run

```sh
npm ci
npm test
npm run build
node scripts/audit-static.mjs
npm audit
```

For the source-edit publishing integration test, run `node scripts/test-publishing.mjs`, then **always** run `npm run build` again to replace its temporary output. Do not publish the fixture build.
