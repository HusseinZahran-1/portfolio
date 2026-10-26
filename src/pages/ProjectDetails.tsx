import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Github, Info } from "lucide-react";
import { projects } from "../data/projects";
import { social } from "../data/social";
import { useI18n } from "../i18n/context";
import { ExternalLink, SafeImage } from "../components/ui";
import { ProjectCard } from "../components/ProjectCard";
import type { CaseSection } from "../types/content";
import NotFound from "./NotFound";
export default function ProjectDetails() {
  const { slug } = useParams();
  const { t, lang, local } = useI18n();
  const p = projects.find((p) => p.slug === slug);
  if (!p) return <NotFound />;
  const related = projects
    .filter(
      (other) =>
        other.id !== p.id &&
        other.categories.some((c) => p.categories.includes(c)),
    )
    .slice(0, 2);
  return (
    <div className="container page-section">
      <Link className="text-link back-link" to={local("/projects")}>
        <ArrowLeft size={16} aria-hidden="true" />
        {t.common.back}
      </Link>
      <header className="detail-heading">
        <div>
          <p className="eyebrow">
            {p.categories.map((c) => t.categories[c]).join(" / ")}
          </p>
          <h1 tabIndex={-1}>{p.title}</h1>
          <p>{p.description[lang]}</p>
        </div>
        <div className="detail-actions">
          {p.githubUrl && (
            <ExternalLink className="button primary" href={p.githubUrl}>
              <Github size={16} />
              {t.common.github}
            </ExternalLink>
          )}
          {p.demoUrl && (
            <ExternalLink className="button secondary" href={p.demoUrl}>
              {t.common.demo}
            </ExternalLink>
          )}
          {p.status && <span className="badge">{p.status[lang]}</span>}
        </div>
      </header>
      <figure className="detail-cover">
        <SafeImage eager src={p.cover} alt={p.coverAlt[lang]} />
        <figcaption>{t.common.conceptual}</figcaption>
      </figure>
      <div className="case-grid">
        <article className="case-content">
          <h2>{t.common.overview}</h2>
          <p>{p.description[lang]}</p>
          {Object.entries(p.caseStudy || {}).map(([key, value]) => (
            <section key={key}>
              <h2>{t.work[key as CaseSection]}</h2>
              <p>{value[lang]}</p>
            </section>
          ))}
          {p.note && (
            <aside className="project-note">
              <Info size={19} aria-hidden="true" />
              <div>
                <h3>{t.work.note}</h3>
                <p>{p.note[lang]}</p>
              </div>
            </aside>
          )}
        </article>
        <aside className="case-sidebar">
          <h2>{t.common.technologies}</h2>
          <div className="tags">
            {p.technologies.map((tech) => (
              <span key={tech}>{tech}</span>
            ))}
          </div>
          <h2>{t.work.source}</h2>
          {p.githubUrl ? (
            <ExternalLink href={p.githubUrl}>{t.common.github}</ExternalLink>
          ) : (
            <>
              <p>{t.work.sourceNote}</p>
              <ExternalLink className="text-link" href={social.github}>
                GitHub
              </ExternalLink>
            </>
          )}
        </aside>
      </div>
      {!!p.screenshots?.length && (
        <section className="gallery">
          <h2>{t.common.gallery}</h2>
          {p.screenshots.map((s) => (
            <figure key={s.src}>
              <SafeImage src={s.src} alt={s.alt[lang]} />
              <figcaption>{s.alt[lang]}</figcaption>
            </figure>
          ))}
        </section>
      )}
      {related.length > 0 && (
        <section className="related-projects">
          <h2>{t.common.more}</h2>
          <div className="featured-grid">
            {related.map((p) => (
              <ProjectCard project={p} key={p.id} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
