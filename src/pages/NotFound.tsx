import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useI18n } from "../i18n/context";
export default function NotFound() {
  const { t, local } = useI18n();
  return (
    <div className="container page-section empty-state not-found">
      <span className="error-code">404</span>
      <h1 tabIndex={-1}>{t.common.unknownTitle}</h1>
      <p>{t.common.unknownText}</p>
      <Link to={local("/")} className="button primary">
        {t.common.home}
        <ArrowRight size={18} />
      </Link>
    </div>
  );
}
