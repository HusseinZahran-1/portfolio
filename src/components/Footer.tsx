import { ArrowUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/context";
import { personal } from "../data/personal";
import { social } from "../data/social";
import { ExternalLink } from "./ui";
export function Footer() {
  const { lang, t, local } = useI18n();
  return (
    <footer className="site-footer container">
      <div>
        <Link to={local("/")} className="footer-name">
          {personal.name[lang]}
          <span>·</span>
        </Link>
        <p>{t.contact.footer}</p>
      </div>
      <div className="footer-links">
        <ExternalLink href={social.github}>GitHub</ExternalLink>
        <ExternalLink href={social.linkedin}>LinkedIn</ExternalLink>
        <a href={personal.resume} download>
          {t.common.resume}
        </a>
      </div>
      <a className="icon-button" href="#top" aria-label={t.common.top}>
        <ArrowUp size={18} />
      </a>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} {personal.name[lang]}
        </span>
        <span>{t.contact.built}</span>
      </div>
    </footer>
  );
}
