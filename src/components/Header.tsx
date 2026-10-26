import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowUpRight, Menu, X, Languages } from "lucide-react";
import { useI18n, stripLanguage } from "../i18n/context";
import { articles } from "../lib/blog";
import { personal } from "../data/personal";
export function Header() {
  const { t, lang, local } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false),
    [section, setSection] = useState("home");
  const menuRef = useRef<HTMLButtonElement>(null);
  const path = stripLanguage(location.pathname);
  useEffect(() => {
    setOpen(false);
  }, [location]);
  useEffect(() => {
    if (path !== "/") return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setSection(e.target.id);
      },
      { rootMargin: "-15% 0px -65% 0px" },
    );
    document
      .querySelectorAll("section[id]")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [path]);
  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuRef.current?.focus();
      }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);
  function switchLanguage() {
    const next = lang === "en" ? "ar" : "en";
    try {
      localStorage.setItem("portfolio-language", next);
    } catch {
      /* Storage may be disabled. */
    }
    let target = path;
    if (
      path.startsWith("/blog/") &&
      !articles.some((a) => a.language === next && a.slug === path.slice(6))
    )
      target = "/blog";
    navigate(
      (next === "ar" ? `/ar${target === "/" ? "" : target}` : target) +
        location.search +
        location.hash,
    );
  }
  return (
    <header className="site-header">
      <div className="nav-shell">
        <Link
          to={local("/")}
          className="brand"
          aria-label={personal.name[lang]}
        >
          <span className="brand-mark">
            h<span>z</span>
            <i />
          </span>
          <span className="brand-name">
            HUSSEIN
            <br />
            ZAHRAN
          </span>
        </Link>
        <nav
          id="main-navigation"
          className={open ? "navigation is-open" : "navigation"}
          aria-label={t.nav.home}
        >
          {(Object.keys(t.nav) as (keyof typeof t.nav)[]).map((key) => {
            const route =
              key === "projects" || key === "blog"
                ? `/${key}`
                : key === "home"
                  ? "/"
                  : `/#${key}`;
            const active =
              path === "/" ? section === key : path.startsWith(`/${key}`);
            return (
              <Link
                key={key}
                to={local(route)}
                className={active ? "active" : ""}
                aria-current={
                  active ? (path === "/" ? "location" : "page") : undefined
                }
              >
                {t.nav[key]}
              </Link>
            );
          })}
        </nav>
        <div className="nav-actions">
          <button
            className="language-button"
            onClick={switchLanguage}
            aria-label={t.common.languageLabel}
          >
            <Languages size={15} aria-hidden="true" />
            <span lang={lang === "en" ? "ar" : "en"}>{t.common.language}</span>
          </button>
          <a className="nav-contact" href={`mailto:${personal.email}`}>
            {t.nav.contact}
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
          <button
            ref={menuRef}
            className="menu-toggle icon-button"
            aria-label={open ? t.common.close : t.common.menu}
            aria-expanded={open}
            aria-controls="main-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}
