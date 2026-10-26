import { useState } from "react";
import { ArrowUpRight, Copy, Check, MapPin } from "lucide-react";
import { useI18n } from "../i18n/context";
import { personal } from "../data/personal";
import { social } from "../data/social";
import { ExternalLink } from "../components/ui";
export function Contact() {
  const { t } = useI18n();
  const [status, setStatus] = useState("");
  async function copy() {
    try {
      await navigator.clipboard.writeText(personal.email);
      setStatus(t.contact.copied);
    } catch {
      setStatus(t.contact.copyFailed);
    }
  }
  return (
    <section id="contact" className="contact-section container">
      <p className="eyebrow">{t.contact.label}</p>
      <div className="contact-grid">
        <div>
          <h2>
            {t.contact.title}
            <br />
            <span>{t.contact.accent}</span>
          </h2>
          <p>{t.contact.description}</p>
          <a className="button primary" href={`mailto:${personal.email}`}>
            {t.contact.email}
            <ArrowUpRight size={20} aria-hidden="true" />
          </a>
        </div>
        <div className="contact-details">
          <p className="contact-availability">
            <span className="status-dot" />
            {t.contact.availability}
          </p>
          <div className="email-row">
            <a href={`mailto:${personal.email}`} dir="ltr">
              {personal.email}
            </a>
            <button
              onClick={copy}
              className="icon-button"
              aria-label={t.contact.copy}
            >
              {status === t.contact.copied ? (
                <Check size={17} />
              ) : (
                <Copy size={17} />
              )}
            </button>
          </div>
          <p className="copy-status" role="status">
            {status}
          </p>
          <div className="contact-socials">
            <ExternalLink href={social.github}>GitHub</ExternalLink>
            <ExternalLink href={social.linkedin}>LinkedIn</ExternalLink>
          </div>
          <p className="contact-location">
            <MapPin size={15} aria-hidden="true" />
            {t.contact.location}
          </p>
        </div>
      </div>
    </section>
  );
}
