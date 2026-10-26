import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "@fontsource/ibm-plex-sans-arabic/arabic-400.css";
import "@fontsource/ibm-plex-sans-arabic/arabic-500.css";
import "@fontsource/ibm-plex-sans-arabic/arabic-600.css";
import "./styles/global.css";
import App from "./App";
let redirect = false;
try {
  if (
    location.pathname === "/" &&
    localStorage.getItem("portfolio-language") === "ar"
  ) {
    redirect = true;
    location.replace("/ar" + location.search + location.hash);
  }
} catch {
  /* Preference storage is optional. */
}
if (!redirect) {
  const root = document.getElementById("root")!;
  const app = (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  if (
    root.dataset.prerendered === location.pathname.replace(/\/$/, "") ||
    root.dataset.prerendered === location.pathname
  )
    hydrateRoot(root, app);
  else createRoot(root).render(app);
}
