import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowDown,
  ArrowUpRight,
  Download,
  Github,
  Linkedin,
  Code2,
  Cpu,
  Database,
  Braces,
  Wrench,
  GraduationCap,
  BadgeCheck,
  BookOpen,
} from "lucide-react";
import { useI18n } from "../i18n/context";
import { personal } from "../data/personal";
import { social } from "../data/social";
import { projects } from "../data/projects";
import { skills } from "../data/skills";
import { education } from "../data/education";
import { certifications } from "../data/certifications";
import { experience } from "../data/experience";
import { articles, formatDate } from "../lib/blog";
import { ProjectCard } from "../components/ProjectCard";
import { Reveal, SectionHeading, ExternalLink } from "../components/ui";
import NeuralVisual from "../components/NeuralVisual";
import { Contact } from "../sections/Contact";
const Terminal = lazy(() => import("../components/Terminal"));
const icons = [Code2, Cpu, Database, Braces, Wrench];
export default function Home() {
  const { lang, t, local } = useI18n();
  const featured = [...projects]
    .filter((p) => p.featured)
    .sort((a, b) => a.order - b.order);
  const additional = [...projects]
    .filter((p) => !p.featured)
    .sort((a, b) => a.order - b.order);
  const recent = articles.filter((a) => a.language === lang).slice(0, 3);
  return (
    <>
      <section id="home" className="hero container">
        <div className="hero-text">
          <p className="eyebrow hero-eyebrow">
            <span />
            {t.hero.eyebrow}
          </p>
          <h1 tabIndex={-1}>
            {t.hero.first}
            <br />
            <span>
              {t.hero.last}
              <i>.</i>
            </span>
          </h1>
          <div className="hero-statement">
            <h2>
              {t.hero.title}
              <br />
              <span>{t.hero.subtitle}</span>
            </h2>
            <p>{t.hero.description}</p>
          </div>
          <div className="hero-buttons">
            <Link to={local("/projects")} className="button primary">
              {t.common.projects}
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
            <a
              href={personal.resume}
              download="Hussein_Zahran_CV.pdf"
              className="button secondary"
            >
              <Download size={17} aria-hidden="true" />
              {t.common.resume}
            </a>
          </div>
          <div className="hero-socials">
            <ExternalLink href={social.github} icon={false}>
              <Github size={17} aria-hidden="true" />
              GitHub
              <ArrowUpRight size={13} aria-hidden="true" />
            </ExternalLink>
            <ExternalLink href={social.linkedin} icon={false}>
              <Linkedin size={17} aria-hidden="true" />
              LinkedIn
              <ArrowUpRight size={13} aria-hidden="true" />
            </ExternalLink>
            <span className="hero-location">{t.hero.location}</span>
          </div>
        </div>
        <div className="hero-art">
          <div className="orbital-ring ring-one" />
          <div className="orbital-ring ring-two" />
          <span className="art-cross cross-one">+</span>
          <span className="art-cross cross-two">+</span>
          <div className="portrait-frame">
            <img
              src={personal.portrait}
              alt={t.hero.portraitAlt}
              width="719"
              height="1280"
              fetchPriority="high"
            />
            <div className="portrait-caption">
              <span className="status-dot" />
              {t.hero.availability}
            </div>
          </div>
          <div className="neural-badge">
            <NeuralVisual />
          </div>
          <div className="art-coordinate" dir="ltr">
            31.95° N / 35.91° E
          </div>
          <p className="art-label">{t.hero.tag}</p>
          <span className="art-index" dir="ltr">
            HZ — 01
          </span>
        </div>
        <div className="hero-bottom">
          <a href="#about">
            <ArrowDown size={15} aria-hidden="true" />
            {t.hero.scroll}
          </a>
          <span>{t.hero.orbit}</span>
          <span className="hero-bottom-index" dir="ltr">
            PORTFOLIO / {new Date().getFullYear()}
          </span>
        </div>
      </section>
      <div className="discipline-strip" aria-hidden="true">
        <div className="container">
          <span>PYTHON</span>
          <i>✦</i>
          <span>MACHINE LEARNING</span>
          <i>✦</i>
          <span>DATA & INTELLIGENCE</span>
          <i>✦</i>
          <span>BUILT WITH PURPOSE</span>
        </div>
      </div>
      <section id="about" className="section container">
        <Reveal className="about-grid">
          <div>
            <p className="eyebrow">{t.about.label}</p>
            <h2>
              {t.about.title}
              <br />
              <span className="muted-heading">{t.about.accent}</span>
            </h2>
            <p className="about-caption">{t.about.note}</p>
          </div>
          <div className="about-copy">
            <p className="about-question">{personal.introduction[lang]}</p>
            <p>{personal.story[lang]}</p>
            <p className="micro-label">{t.about.interests}</p>
            <div className="interest-list">
              {t.about.interestsList.map((i) => (
                <span key={i}>
                  {i}
                  <ArrowUpRight size={13} aria-hidden="true" />
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </section>
      <section id="projects" className="section work-section">
        <div className="container">
          <div className="section-header-row">
            <SectionHeading
              label={t.work.label}
              title={t.work.title}
              description={t.work.description}
            />
            <Link to={local("/projects")} className="text-link">
              {t.common.allProjects}
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>
          <div className="featured-grid">
            {featured.map((p) => (
              <Reveal key={p.id}>
                <ProjectCard project={p} large />
              </Reveal>
            ))}
          </div>
          {additional.length > 0 && (
            <>
              <h3 className="subheading">{t.work.additional}</h3>
              <div className="project-grid">
                {additional.map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
      <section id="skills" className="section container">
        <SectionHeading
          label={t.skills.label}
          title={t.skills.title}
          description={t.skills.description}
        />
        <div className="skills-grid">
          {skills.map((s, i) => {
            const Icon = icons[i % icons.length];
            return (
              <Reveal className="skill-panel" key={s.title.en}>
                <div className="skill-panel-heading">
                  <Icon size={21} aria-hidden="true" />
                  <span dir="ltr">0{i + 1}</span>
                </div>
                <h3>{s.title[lang]}</h3>
                <div className="skill-items">
                  {s.items.map((item) => (
                    <span key={item} dir="auto">
                      {item}
                    </span>
                  ))}
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>
      <section id="education" className="section education-section">
        <div className="container">
          <SectionHeading label={t.education.label} title={t.education.title} />
          <div className="education-grid">
            <div>
              <p className="micro-label">{t.education.degree}</p>
              {education.map((e) => (
                <div className="education-entry" key={e.institution.en}>
                  <span className="education-icon">
                    <GraduationCap size={23} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="education-period">{e.period[lang]}</p>
                    <h3>{e.degree[lang]}</h3>
                    <p>{e.institution[lang]}</p>
                    <span className="muted">{e.location[lang]}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="certifications">
              <p className="micro-label">{t.education.certificates}</p>
              {certifications.map((c) => (
                <div className="certificate" key={c.title.en}>
                  <BadgeCheck size={18} aria-hidden="true" />
                  <span>
                    {c.url ? (
                      <ExternalLink href={c.url}>{c.title[lang]}</ExternalLink>
                    ) : (
                      c.title[lang]
                    )}
                    {c.provider && <small>{c.provider}</small>}
                  </span>
                  {c.date && <time>{c.date}</time>}
                </div>
              ))}
              <p className="small-note">{t.education.note}</p>
            </div>
          </div>
          {experience.length > 0 && (
            <div className="experience">
              <h3>{t.education.experience}</h3>
              {experience.map((e) => (
                <article key={e.organization.en}>
                  <p>{e.period[lang]}</p>
                  <h4>
                    {e.role[lang]} · {e.organization[lang]}
                  </h4>
                  <p>{e.description[lang]}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
      <section className="section container terminal-section">
        <div>
          <SectionHeading
            label={t.terminal.label}
            title={t.terminal.title}
            description={t.terminal.description}
          />
          <span className="terminal-decor" aria-hidden="true">
            &gt;_
          </span>
        </div>
        <Suspense
          fallback={
            <div className="terminal-placeholder">{t.common.loading}</div>
          }
        >
          <Terminal />
        </Suspense>
      </section>
      <section className="github-section container">
        <div className="github-symbol">
          <Github size={37} strokeWidth={1.3} aria-hidden="true" />
        </div>
        <div>
          <p className="eyebrow">{t.github.label}</p>
          <h2>{t.github.title}</h2>
          <p>{t.github.description}</p>
          {projects.some((p) => p.githubUrl) && (
            <div className="repo-links">
              {projects
                .filter((p) => p.githubUrl)
                .map((p) => (
                  <ExternalLink key={p.id} href={p.githubUrl!}>
                    {p.title}
                  </ExternalLink>
                ))}
            </div>
          )}
        </div>
        <ExternalLink href={social.github} className="button secondary">
          {t.github.button}
        </ExternalLink>
      </section>
      <section id="blog" className="section container">
        <div className="section-header-row">
          <SectionHeading
            label={t.blog.label}
            title={t.blog.title}
            description={t.blog.description}
          />
          <Link to={local("/blog")} className="text-link">
            {t.blog.browse}
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
        {recent.length ? (
          <div className="project-grid">
            {recent.map((a) => (
              <article className="article-card" key={a.slug}>
                <p>
                  {formatDate(a.date, lang)} · {a.minutes} {t.blog.min}
                </p>
                <h3>
                  <Link to={local(`/blog/${a.slug}`)}>{a.title}</Link>
                </h3>
                <p>{a.description}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="journal-empty">
            <span className="journal-icon">
              <BookOpen size={28} strokeWidth={1.3} aria-hidden="true" />
            </span>
            <div>
              <h3>{t.blog.empty}</h3>
              <p>{t.blog.emptyText}</p>
            </div>
            <span className="journal-dots" aria-hidden="true">
              ···
            </span>
          </div>
        )}
      </section>
      <Contact />
    </>
  );
}
