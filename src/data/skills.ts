import type { Localized } from "../types/content";
export const skills: { title: Localized; items: string[] }[] = [
  {
    title: { en: "Programming", ar: "البرمجة" },
    items: ["Python", "JavaScript", "HTML", "CSS", "SQL"],
  },
  {
    title: { en: "AI & Machine Learning", ar: "الذكاء الاصطناعي وتعلم الآلة" },
    items: [
      "Machine Learning Algorithms",
      "Deep Learning",
      "TensorFlow",
      "Keras",
      "Scikit-learn",
      "Neural Networks",
    ],
  },
  {
    title: { en: "Data Analysis", ar: "تحليل البيانات" },
    items: [
      "Pandas",
      "NumPy",
      "Matplotlib",
      "Data Cleaning",
      "Data Visualization",
      "Power BI",
    ],
  },
  {
    title: { en: "Backend & Databases", ar: "الخوادم وقواعد البيانات" },
    items: ["FastAPI", "SQL", "SQLite"],
  },
  {
    title: { en: "Development Tools", ar: "أدوات التطوير" },
    items: ["Git", "GitHub", "VS Code", "PyCharm"],
  },
];
