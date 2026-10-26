import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import type { Project } from "../types/content";
import { useI18n } from "../i18n/context";
import { SafeImage, ExternalLink } from "./ui";
export function ProjectCard({
  project: p,
  large = false,
  headingLevel = 3,
}: {
  project: Project;
  large?: boolean;
  headingLevel?: 2 | 3;
}) {
  const { lang, t, local } = useI18n();
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <article className={`project-card ${large ? "large" : ""}`}>
      <Link
        className="project-cover"
        to={local(`/projects/${p.slug}`)}
        aria-label={`${t.common.view}: ${p.title}`}
      >
        <SafeImage src={p.cover} alt={p.coverAlt[lang]} />
        <span className="cover-caption">{t.common.conceptual}</span>
        {p.featured && (
          <span className="featured-badge">
            <span />
            {t.common.featured}
          </span>
        )}
        <span className="project-arrow">
          <ArrowUpRight size={22} aria-hidden="true" />
        </span>
      </Link>
      <div className="project-content">
        <p className="project-category">
          {p.categories.map((c) => t.categories[c]).join(" / ")}
        </p>
        <Heading>
          <Link to={local(`/projects/${p.slug}`)}>
            {p.title}
            <ArrowUpRight size={22} aria-hidden="true" />
          </Link>
        </Heading>
        <p className="project-description">{p.description[lang]}</p>
        <div className="tags">
          {p.technologies.map((tech) => (
            <span key={tech} dir="auto">
              {tech}
            </span>
          ))}
        </div>
        <div className="project-links">
          <Link className="text-link" to={local(`/projects/${p.slug}`)}>
            {t.common.view}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
          {p.githubUrl && (
            <ExternalLink href={p.githubUrl}>{t.common.github}</ExternalLink>
          )}
          {p.demoUrl && (
            <ExternalLink href={p.demoUrl}>{t.common.demo}</ExternalLink>
          )}
        </div>
      </div>
    </article>
  );
}
