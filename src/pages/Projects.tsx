import { Search, SlidersHorizontal, RotateCcw } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { projects } from "../data/projects";
import { filterProjects } from "../lib/projects";
import { useI18n } from "../i18n/context";
import { ProjectCard } from "../components/ProjectCard";
export default function Projects() {
  const { t } = useI18n();
  const [params, setParams] = useSearchParams();
  const filters = {
    query: params.get("q") || "",
    category: params.get("category") || "all",
    technology: params.get("tech") || "all",
    sort: params.get("sort") || "curated",
    featured: params.get("featured") === "true",
  };
  const items = filterProjects(projects, filters);
  const techs = [...new Set(projects.flatMap((p) => p.technologies))].sort();
  function update(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (!value || value === "all" || value === "curated" || value === "false")
      next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true, preventScrollReset: true });
  }
  return (
    <div className="container page-section">
      <div className="page-heading">
        <p className="eyebrow">{t.work.explorerLabel}</p>
        <h1 tabIndex={-1}>{t.work.explorerTitle}</h1>
        <p>{t.work.explorerDescription}</p>
      </div>
      <div className="project-filters">
        <div className="filter-top">
          <label className="search-field">
            <Search size={19} aria-hidden="true" />
            <span className="sr-only">{t.work.search}</span>
            <input
              type="search"
              placeholder={t.work.search}
              value={filters.query}
              onChange={(e) => update("q", e.target.value)}
            />
          </label>
          <label className="select-field">
            <span>{t.work.technology}</span>
            <select
              value={filters.technology}
              onChange={(e) => update("tech", e.target.value)}
            >
              <option value="all">{t.work.allTech}</option>
              {techs.map((tech) => (
                <option key={tech}>{tech}</option>
              ))}
            </select>
          </label>
          <label className="select-field">
            <span>{t.work.sort}</span>
            <select
              value={filters.sort}
              onChange={(e) => update("sort", e.target.value)}
            >
              <option value="curated">{t.work.curated}</option>
              <option value="az">{t.work.az}</option>
              <option value="za">{t.work.za}</option>
            </select>
          </label>
        </div>
        <div className="filter-bottom">
          <div
            className="category-filters"
            role="group"
            aria-label={t.blog.category}
          >
            <button
              className={filters.category === "all" ? "selected" : ""}
              aria-pressed={filters.category === "all"}
              onClick={() => update("category", "all")}
            >
              {t.work.all}
            </button>
            {Object.entries(t.categories).map(([key, label]) => (
              <button
                key={key}
                className={filters.category === key ? "selected" : ""}
                aria-pressed={filters.category === key}
                onClick={() => update("category", key)}
              >
                {label}
              </button>
            ))}
          </div>
          <label className="featured-filter">
            <input
              type="checkbox"
              checked={filters.featured}
              onChange={(e) => update("featured", String(e.target.checked))}
            />
            {t.work.featured}
          </label>
        </div>
      </div>
      <div className="results-bar">
        <p role="status">
          {items.length} {t.work.count}
        </p>
        {Object.keys(Object.fromEntries(params)).length > 0 && (
          <button className="text-link" onClick={() => setParams({})}>
            <RotateCcw size={14} aria-hidden="true" />
            {t.work.reset}
          </button>
        )}
      </div>
      {items.length ? (
        <div className="project-grid explorer-grid">
          {items.map((p) => (
            <ProjectCard key={p.id} project={p} headingLevel={2} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <SlidersHorizontal size={34} aria-hidden="true" />
          <h2>{t.work.empty}</h2>
          <p>{t.work.emptyHint}</p>
          <button className="button secondary" onClick={() => setParams({})}>
            {t.work.reset}
          </button>
        </div>
      )}
    </div>
  );
}
