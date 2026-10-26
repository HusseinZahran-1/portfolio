import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { articles, formatDate } from "../lib/blog";
import { useI18n } from "../i18n/context";
import { SafeImage } from "../components/ui";
import NotFound from "./NotFound";
export default function BlogPost() {
  const { slug } = useParams();
  const { lang, local, t } = useI18n();
  const article = articles.find((a) => a.slug === slug && a.language === lang);
  if (!article) return <NotFound />;
  const related = articles
    .filter(
      (a) =>
        a.language === lang &&
        a.slug !== slug &&
        (a.category === article.category ||
          a.tags.some((tag) => article.tags.includes(tag))),
    )
    .slice(0, 3);
  return (
    <div className="container page-section">
      <Link className="text-link back-link" to={local("/blog")}>
        <ArrowLeft size={16} />
        {t.blog.back}
      </Link>
      <article className="blog-post">
        <header>
          <p className="eyebrow">{article.category}</p>
          <h1 tabIndex={-1}>{article.title}</h1>
          <p className="article-description">{article.description}</p>
          <div className="article-meta">
            <time dateTime={article.date}>
              {formatDate(article.date, lang)}
            </time>
            <span>
              {article.minutes} {t.blog.min}
            </span>
          </div>
          <div className="tags">
            {article.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </header>
        {article.cover && (
          <SafeImage
            eager
            src={article.cover}
            alt={article.coverAlt || article.title}
          />
        )}
        <div className="prose">
          <Markdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              a: ({ href, children }) => (
                <a
                  href={href}
                  {...(href?.startsWith("https://")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {children}
                </a>
              ),
              img: ({ src, alt }) => (
                <SafeImage
                  src={typeof src === "string" ? src : ""}
                  alt={alt || ""}
                />
              ),
            }}
          >
            {article.body}
          </Markdown>
        </div>
      </article>
      {related.length > 0 && (
        <section className="related-articles">
          <h2>{t.blog.related}</h2>
          {related.map((a) => (
            <Link
              className="text-link"
              to={local(`/blog/${a.slug}`)}
              key={a.slug}
            >
              {a.title}
            </Link>
          ))}
        </section>
      )}
    </div>
  );
}
