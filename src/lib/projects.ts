import type { Project } from "../types/content";
export interface Filters {
  query: string;
  category: string;
  technology: string;
  featured: boolean;
  sort: string;
}
export const emptyFilters: Filters = {
  query: "",
  category: "all",
  technology: "all",
  featured: false,
  sort: "curated",
};
export function filterProjects(projects: Project[], f: Filters) {
  return projects
    .filter(
      (p) =>
        p.title.toLowerCase().includes(f.query.trim().toLowerCase()) &&
        (f.category === "all" || p.categories.some((c) => c === f.category)) &&
        (f.technology === "all" || p.technologies.includes(f.technology)) &&
        (!f.featured || p.featured),
    )
    .sort((a, b) =>
      f.sort === "az"
        ? a.title.localeCompare(b.title)
        : f.sort === "za"
          ? b.title.localeCompare(a.title)
          : a.order - b.order,
    );
}
