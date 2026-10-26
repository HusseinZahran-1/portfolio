import type { ReactNode } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, ImageOff } from "lucide-react";
import { useState } from "react";
import { useI18n } from "../i18n/context";
export function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ y: 14, opacity: 1 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}
export function SectionHeading({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{label}</p>
      <h2>{title}</h2>
      {description && <p className="section-description">{description}</p>}
    </div>
  );
}
export function ExternalLink({
  href,
  children,
  className = "",
  icon = true,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  icon?: boolean;
}) {
  const { t } = useI18n();
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
      {icon && <ArrowUpRight size={17} aria-hidden="true" />}
      <span className="sr-only"> ({t.common.external})</span>
    </a>
  );
}
export function SafeImage({
  src,
  alt,
  className = "",
  eager = false,
}: {
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const { t } = useI18n();
  return failed ? (
    <div className={`image-fallback ${className}`} role="img" aria-label={alt}>
      <ImageOff aria-hidden="true" />
      <span>{t.common.missingImage}</span>
    </div>
  ) : (
    <img
      src={src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
