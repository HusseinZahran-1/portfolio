# Hussein Zahran — bilingual portfolio

A complete static React + TypeScript portfolio with an English/Arabic interface, supplied portrait and real CV download, five CV-supported projects, an interactive terminal, and a local Markdown journal. Content lives in source files. There is no API synchronization, backend, database, external CMS, or scheduled workflow.

## Run locally

Use Node.js **22.12 or newer** (Node 22 LTS recommended).

```sh
npm ci
npm run dev
```

Open the URL printed by Vite. For the actual production output:

```sh
npm run typecheck
npm test
npm run build
npm run preview
```

`npm run build` performs TypeScript checks, bundles the app, validates content and referenced images, and prerenders every public English and Arabic route. Upload only the resulting `dist/` folder to a static host. Python is **not** needed to run or build the site; `scripts/create-art.py` is optional source for the original conceptual artwork.

## Deploy automatically with GitHub and Cloudflare Pages

These steps use Cloudflare's native Git integration. No GitHub Action or custom deployment service is needed.

1. Sign in to GitHub and select **New repository**. Choose your own repository name and create it. The source can be public or private.
2. On the repository page select **Add file → Upload files**. Upload the extracted source folders and root files, preserving their directory structure. Include `src/`, `public/`, `scripts/`, `package.json`, `package-lock.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `.gitignore`, and `.nvmrc`. Upload the contents of the source archive, not the ZIP itself. Do not upload `node_modules/`, `tmp/`, or `dist/`.
3. Commit to `main`. For a large upload, using GitHub Desktop is another option: add this existing folder, commit the source files, and publish the repository.
4. Sign in to Cloudflare. Go to **Workers & Pages → Create application → Pages → Import an existing Git repository**. Authorize the intended GitHub repository and select it.
5. Configure the project:

   | Setting                | Value                                                   |
   | ---------------------- | ------------------------------------------------------- |
   | Framework preset       | React (Vite), if offered                                |
   | Production branch      | `main`                                                  |
   | Root directory         | Leave empty if `package.json` is at the repository root |
   | Build command          | `npm run build`                                         |
   | Build output directory | `dist`                                                  |
   | Node version           | `22` via `.nvmrc`, or set `NODE_VERSION=22`             |

6. Save and deploy. Cloudflare installs the locked dependencies, builds, and returns your actual `*.pages.dev` URL.
7. In the Pages project's build environment variables, set **`SITE_URL`** to that complete HTTPS URL (no trailing path), then trigger a new deployment. A Cloudflare build already falls back to `CF_PAGES_URL`; setting `SITE_URL` keeps the canonical domain consistent on preview deployments too.
8. Subsequent commits to `main` rebuild and deploy automatically. A failed build does not replace the last successful deployment.

The app uses `/`, `/projects`, `/projects/medai`, `/blog`, and their `/ar` equivalents. Every content route is prerendered. `public/_redirects` supplies a fallback for unknown SPA paths; don't add a root `404.html` unless you deliberately change this routing strategy. An unknown route displays a translated 404 page and sets `noindex` on the client. Because the SPA fallback uses HTTP 200, unknown routes are soft 404s, not server HTTP 404 responses.

Official references: [Cloudflare React deployment](https://developers.cloudflare.com/pages/framework-guides/deploy-a-react-site/), [Pages routing](https://developers.cloudflare.com/pages/configuration/serving-pages/), [redirect rules](https://developers.cloudflare.com/pages/configuration/redirects/).

### Custom domain later

Open the Pages project's **Custom domains** tab and follow Cloudflare's domain setup instructions. Once the domain is active, update `SITE_URL` to its HTTPS origin and redeploy. This regenerates canonical links, language alternates, Open Graph URLs, structured data, robots.txt, and the sitemap. Do not point canonical URLs at an invented or unowned domain.

### If a build fails

- Read the first error in Cloudflare's build log. Project errors name the affected entry; Markdown errors identify the file.
- Check that both English and Arabic values are supplied and that object entries have commas between them.
- Check exact filename capitalization. Cloudflare is case sensitive even if your Windows computer is not.
- An image such as `/images/projects/my-cover.webp` must exist at `public/images/projects/my-cover.webp`.
- Check that a slug is unique, lowercase, and uses hyphens rather than spaces.
- Ensure the root/build settings match the table above and the Node version is at least 22.12.
- Commit `package-lock.json` whenever package dependencies change. Use `npm ci` to reproduce the deployed versions.
- Retry a network-related install failure. For content mistakes, correct the file in GitHub and commit again.

## Edit content directly in GitHub

Open a file in your repository, click the pencil (**Edit this file**), make the change, then select **Commit changes** to `main`. Cloudflare rebuilds automatically after the repository is connected. UI component edits are unnecessary for routine content changes.

| Content                                             | File                         |
| --------------------------------------------------- | ---------------------------- |
| Projects, ordering, features, links, galleries      | `src/data/projects.ts`       |
| Name, role, story, email, résumé and portrait paths | `src/data/personal.ts`       |
| GitHub and LinkedIn URLs                            | `src/data/social.ts`         |
| Skill groups and items                              | `src/data/skills.ts`         |
| Education                                           | `src/data/education.ts`      |
| Certifications                                      | `src/data/certifications.ts` |
| Future verified experience                          | `src/data/experience.ts`     |
| English interface and editorial text                | `src/i18n/en.ts`             |
| Arabic interface and editorial text                 | `src/i18n/ar.ts`             |
| Articles                                            | `src/content/blog/*.md`      |

Some prominent editorial content (hero name, introductory line, interests) lives in the translation files to allow independently polished English/Arabic wording. When renaming the portfolio owner, update these along with `personal.ts` and regenerate the social sharing image.

### Add a project

1. Upload its cover with **Add file → Upload files** into `public/images/projects/`. Use an optimized WebP or SVG; never label an illustration as an actual screenshot.
2. Open `src/data/projects.ts`. Add another object inside the `projects` array, before the closing `];`:

```ts
{
  id: 'my-new-project',
  slug: 'my-new-project',
  title: 'My New Project',
  description: {
    en: 'Write a factual English description.',
    ar: 'اكتب وصفاً دقيقاً باللغة العربية.',
  },
  categories: ['ml'],
  technologies: ['Python', 'Scikit-learn'],
  cover: '/images/projects/my-new-project.webp',
  coverAlt: {
    en: 'Describe what the cover actually shows.',
    ar: 'صف ما يظهر فعلياً في صورة الغلاف.',
  },
  screenshots: [],
  featured: false,
  order: 6,
},
```

3. Commit. The project is automatically included in the explorer, appropriate homepage group, terminal, dynamic detail page, static HTML, and sitemap. You don't edit React components or routing.

Supported category keys: `ml`, `deep`, `data`, `backend`, `xai`. Technology options derive from your entries. To add a fundamentally new category, extend the `Category` type, allowed categories in `src/lib/validation.ts`, and both translation dictionaries. This is a content-schema change, not a component change.

### Manage projects

- **Remove:** delete the whole object, including the correct separating comma. Unused image files can be removed separately.
- **Feature:** set `featured: true`. The homepage puts featured projects in larger cards.
- **Reorder:** change `order` to a number. Lower numbers appear first in curated order. Use unique values for predictable ordering.
- **Descriptions:** edit `description.en` and `description.ar` together.
- **Repository:** add `githubUrl: 'https://…'` using the actual verified repository URL. Links are entered manually; nothing queries GitHub's API.
- **Live demo:** add `demoUrl: 'https://…'` only if a working demo exists. Omit unavailable URLs; do not use `'#'` or empty strings.
- **Status:** optionally add `status: { en: 'In progress', ar: 'قيد التطوير' }` if accurate.
- **Gallery:** upload real screenshots, then add `{ src: '/images/projects/example.webp', alt: { en: 'Description', ar: 'الوصف' } }` to `screenshots`.
- **Case study:** optionally add a `caseStudy` object with bilingual `problem`, `solution`, `implementation`, `results`, and/or `challenges` entries. Unsupported sections are omitted.
- **Context:** use an optional bilingual `note` for a qualification or limitation that readers need.

Project cover images currently use original abstract illustrations, explicitly labeled as conceptual artwork. No project screenshots or individual repository/demo URLs were supplied, so those optional fields are omitted. The GitHub profile is linked separately.

### Publish a blog article

1. Open `src/content/blog/` in GitHub and choose **Add file → Create new file**.
2. Name the file, e.g. `understanding-regression.en.md`.
3. Copy the structure below and replace all sample content:

```md
---
title: "Your actual article title"
slug: "understanding-regression"
description: "A brief, accurate description."
language: en
date: "2026-10-26"
category: "Machine Learning"
tags: ["Python", "Regression"]
draft: false
---

Write your introduction here.

## A section heading

Write your article in Markdown.
```

4. For a cover, upload it to `public/images/blog/` and add `cover: "/images/blog/your-cover.webp"` and `coverAlt: "A meaningful description"` to the metadata.
5. Commit to publish. `draft: true` keeps an article out of listings, routes, built HTML and visitor JavaScript. Use a quoted ISO date. Dates are displayed, not used for scheduling: a non-draft article is published immediately even if its date is in the future.
6. For Arabic, add a separate file ending in `.ar.md`, set `language: ar`, and write the Arabic title, description and body. Use the same slug for translated versions so the language switch keeps the reader on the corresponding article. If no translation exists, the switch opens the other language's journal listing.

Listings, category/tag filters, date formatting, reading time, detail routes, syntax highlighting, related articles, and metadata are automatic. YAML is parsed at build time. Markdown HTML is not executed; arbitrary scripts are not supported. The supplied `example.en.md` and `example.ar.md` are unpublished draft templates.

### Résumé and portrait

- Replace `public/resume/Hussein_Zahran_CV.pdf` to update the résumé without changing buttons. The included file is a byte-for-byte copy of the supplied CV.
- Replace `public/images/profile/hussein-zahran.jpeg` with a portrait. The current photo is the separately supplied `mine.jpeg`, copied unchanged; CSS crops it within the hero frame. If the filename changes, update `personal.ts`.
- Update `public/images/og-cover.png` if changing the portrait, name or headline. Social platforms usually cache preview images; their refresh tools may be needed after deployment.

### Skills, certificates, education and experience

Add or remove an object/item in the corresponding data file. Every object with prose uses `en` and `ar` values. Certificates support optional `provider`, `date`, and verified credential `url` fields. No provider or completion date is invented. `experience.ts` starts empty and the section stays hidden until an entry is added.

## Architecture and behavior

- React, TypeScript, Vite, Tailwind CSS, Motion for React, Lucide, React Router.
- Central dictionaries; `/ar` routes have Arabic typography, `lang="ar"`, and `dir="rtl"`. Explicit language switching persists in localStorage; opening `/` restores Arabic if previously selected. A direct English deep link stays English.
- Self-hosted subset fonts, compressed portrait, original lightweight SVG covers, split route modules and Markdown renderer. The abstract neural graphic uses SVG/CSS instead of WebGL, so no heavy 3D initialization is needed.
- Semantic landmarks, labels, visible keyboard focus, mobile navigation with Escape dismissal, reduced-motion styles, meaningful image alternatives, and safe predefined terminal commands. The terminal never runs code or shell commands. Up/Down recall command history.
- Email actions are real `mailto:` links. No form pretends to send a message. GitHub/LinkedIn links open in a new tab with appropriate attributes.
- The small `scripts/prerender.mjs` build step generates static HTML and SEO files. It is not a deployment script and does not call any external API.
- Without `SITE_URL` or Cloudflare's `CF_PAGES_URL`, local builds omit absolute canonical/language-alternate links and leave the sitemap empty rather than invent a domain. This is expected in a local preview; configure the real domain for production.

## Content provenance and limitations

Personal details, education, certifications, skills and project summaries come from the supplied CV and portfolio brief. The portrait comes from the separately supplied photo. MedAI's 97.52% is labeled as a project-reported result; no clinical reliability or certification is claimed. MediFlow AI has no documented clinical validation. No work experience, metrics, repositories, live demos, testimonials, or published articles have been fabricated.

The source and static build are ready for the setup above. This handoff does **not** imply that a GitHub repository, Cloudflare account integration, custom domain, or public deployment has already been created. See `QA.md` for checks actually performed and remaining verification limits.
