import type { Localized } from "../types/content";
export const certifications: {
  title: Localized;
  provider?: string;
  date?: string;
  url?: string;
}[] = [
  { title: { en: "Python Programming", ar: "برمجة بايثون" } },
  { title: { en: "Machine Learning", ar: "تعلم الآلة" } },
  { title: { en: "Deep Learning", ar: "التعلم العميق" } },
  { title: { en: "SQL", ar: "SQL" } },
];
