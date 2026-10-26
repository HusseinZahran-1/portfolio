export type Language = "en" | "ar";
export type Localized = Record<Language, string>;
export type Category = "ml" | "deep" | "data" | "backend" | "xai";
export type CaseSection =
  | "problem"
  | "solution"
  | "implementation"
  | "results"
  | "challenges";
export interface Project {
  id: string;
  slug: string;
  title: string;
  description: Localized;
  categories: Category[];
  technologies: string[];
  cover: string;
  coverAlt: Localized;
  screenshots?: { src: string; alt: Localized }[];
  githubUrl?: string;
  demoUrl?: string;
  featured: boolean;
  order: number;
  status?: Localized;
  caseStudy?: Partial<Record<CaseSection, Localized>>;
  note?: Localized;
}
