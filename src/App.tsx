import { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { MotionConfig } from "motion/react";
import { LanguageContext, routeLanguage, dictionaries } from "./i18n/context";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { RouteEffects } from "./components/RouteEffects";
import Home from "./pages/Home";
const Projects = lazy(() => import("./pages/Projects"));
const ProjectDetails = lazy(() => import("./pages/ProjectDetails"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const NotFound = lazy(() => import("./pages/NotFound"));
export default function App() {
  const { pathname } = useLocation();
  const lang = routeLanguage(pathname);
  const t = dictionaries[lang];
  return (
    <LanguageContext.Provider value={lang}>
      <MotionConfig reducedMotion="user">
        <div id="top" />
        <a href="#main" className="skip-link">
          {t.common.skip}
        </a>
        <Header />
        <RouteEffects />
        <main id="main" tabIndex={-1}>
          <Suspense
            fallback={
              <div className="container page-section" role="status">
                {t.common.loading}
              </div>
            }
          >
            <Routes>
              {["", "/ar"].map((prefix) => (
                <Route key={prefix} path={prefix || "/"}>
                  <Route index element={<Home />} />
                  <Route path="projects" element={<Projects />} />
                  <Route path="projects/:slug" element={<ProjectDetails />} />
                  <Route path="blog" element={<Blog key={lang} />} />
                  <Route path="blog/:slug" element={<BlogPost />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              ))}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </MotionConfig>
    </LanguageContext.Provider>
  );
}
