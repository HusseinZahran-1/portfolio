import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, ArrowUpRight } from "lucide-react";
import { articles, formatDate } from "../lib/blog";
import { useI18n } from "../i18n/context";
import { SafeImage } from "../components/ui";
export default function Blog() {
  const { t, lang, local } = useI18n();
  const [category, setCategory] = useState("all"),
    [tag, setTag] = useState("all");
  const list = articles.filter((a) => a.language === lang);
  const categories = [...new Set(list.map((a) => a.category))];
  const tags = [...new Set(list.flatMap((a) => a.tags))];
  const visible = list.filter(
    (a) =>
      (category === "all" || a.category === category) &&
      (tag === "all" || a.tags.includes(tag)),
  );
  return (
    <div className="container page-section blog-page">
      <div className="page-heading">
        <p className="eyebrow">{t.blog.label}</p>
        <h1 tabIndex={-1}>{t.blog.title}</h1>
        <p>{t.blog.description}</p>
      </div>
      {list.length ? (
        <>
          <div className="blog-filters">
            <label className="select-field">
              <span>{t.blog.category}</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="all">{t.blog.all}</option>
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className="select-field">
              <span>{t.blog.tags}</span>
              <select value={tag} onChange={(e) => setTag(e.target.value)}>
                <option value="all">{t.blog.all}</option>
                {tags.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="project-grid">
            {visible.map((a) => (
              <article className="article-card" key={a.slug}>
                {a.cover && (
                  <SafeImage src={a.cover} alt={a.coverAlt || a.title} />
                )}
                <p className="eyebrow">{a.category}</p>
                <h2>
                  <Link to={local(`/blog/${a.slug}`)}>
                    {a.title}
                    <ArrowUpRight size={20} />
                  </Link>
                </h2>
                <p>{a.description}</p>
                <div className="article-meta">
                  <time dateTime={a.date}>{formatDate(a.date, lang)}</time>
                  <span>
                    {a.minutes} {t.blog.min}
                  </span>
                </div>
                <div className="tags">
                  {a.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
          {visible.length === 0 && (
            <button
              className="button secondary"
              onClick={() => {
                setCategory("all");
                setTag("all");
              }}
            >
              {t.work.reset}
            </button>
          )}
        </>
      ) : (
        <div className="empty-state blog-empty">
          <div className="empty-orbit">
            <BookOpen size={38} strokeWidth={1.2} aria-hidden="true" />
          </div>
          <h2>{t.blog.empty}</h2>
          <p>{t.blog.emptyText}</p>
          <Link to={local("/projects")} className="button secondary">
            {t.common.projects}
            <ArrowUpRight size={17} />
          </Link>
        </div>
      )}
    </div>
  );
}
