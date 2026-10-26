import type { Project } from "../types/content";
import { validateProjects } from "../lib/validation";

// Edit this array to manage the entire showcase. Omit URLs until verified.
export const projects: Project[] = [
  {
    id: "medai",
    slug: "medai",
    title: "MedAI",
    order: 1,
    featured: true,
    description: {
      en: "Making complex health information easier to understand. A bilingual disease prediction and medical risk assistance project.",
      ar: "تبسيط المعلومات الصحية المعقدة. مشروع ثنائي اللغة لتوقع الأمراض والمساعدة في تقدير المخاطر الطبية.",
    },
    categories: ["ml", "xai"],
    technologies: ["Python", "Machine Learning", "Explainable AI"],
    cover: "/images/projects/medai.svg",
    coverAlt: {
      en: "Abstract pulse and connected nodes, a conceptual MedAI cover",
      ar: "نبض وعقد مترابطة في رسم تجريدي توضيحي لمشروع MedAI",
    },
    caseStudy: {
      results: {
        en: "The project reports 97.52% accuracy. The supplied CV does not specify the dataset, evaluation protocol, or external validation.",
        ar: "الدقة المعلنة للمشروع هي 97.52%. لا تحدد السيرة الذاتية مجموعة البيانات أو طريقة التقييم أو أي تحقق خارجي.",
      },
    },
    note: {
      en: "A student project. The reported accuracy is not evidence of clinical reliability or medical certification.",
      ar: "مشروع طلابي. الدقة المعلنة لا تثبت الموثوقية السريرية أو الاعتماد الطبي.",
    },
  },
  {
    id: "mediflow-ai",
    slug: "mediflow-ai",
    title: "MediFlow AI",
    order: 2,
    featured: true,
    description: {
      en: "Exploring more informed emergency care workflows through AI-powered triage and waiting-time prediction.",
      ar: "استكشاف سير عمل أكثر استناداً إلى المعلومات في الطوارئ باستخدام الذكاء الاصطناعي لفرز الحالات وتوقع وقت الانتظار.",
    },
    categories: ["ml", "backend"],
    technologies: ["Python", "Machine Learning", "FastAPI"],
    cover: "/images/projects/mediflow.svg",
    coverAlt: {
      en: "Abstract flowing paths, a conceptual MediFlow AI cover",
      ar: "مسارات انسيابية تجريدية في غلاف توضيحي لمشروع MediFlow AI",
    },
    note: {
      en: "An educational project; no clinical validation is documented in the supplied material.",
      ar: "مشروع تعليمي؛ لا تتضمن المواد المقدمة توثيقاً لأي تحقق سريري.",
    },
  },
  {
    id: "voice-emotion",
    slug: "voice-emotion-recognition",
    title: "Voice Emotion Recognition",
    order: 3,
    featured: false,
    description: {
      en: "An audio-based machine learning system for classifying emotion from voice.",
      ar: "نظام يعتمد على تعلم الآلة لتصنيف المشاعر من الصوت.",
    },
    categories: ["ml"],
    technologies: ["Python", "Machine Learning", "Librosa"],
    cover: "/images/projects/voice.svg",
    coverAlt: {
      en: "Abstract audio waveform, a conceptual cover",
      ar: "موجة صوتية تجريدية توضيحية",
    },
  },
  {
    id: "car-price",
    slug: "car-price-prediction",
    title: "Car Price Prediction",
    order: 4,
    featured: false,
    description: {
      en: "A regression-based price prediction project trained on more than 200,000 vehicle records.",
      ar: "مشروع لتوقع أسعار السيارات باستخدام الانحدار، تم تدريبه على أكثر من 200,000 سجل للمركبات.",
    },
    categories: ["ml", "data"],
    technologies: ["Python", "Machine Learning", "Regression"],
    cover: "/images/projects/car.svg",
    coverAlt: {
      en: "Abstract regression points, a conceptual cover",
      ar: "نقاط انحدار تجريدية توضيحية",
    },
    caseStudy: {
      results: {
        en: "The CV reports a training dataset of over 200,000 vehicle records. No prediction accuracy or error metric was supplied.",
        ar: "تشير السيرة الذاتية إلى بيانات تدريب تضم أكثر من 200,000 سجل للمركبات. لم تُقدم مقاييس لدقة التوقع أو الخطأ.",
      },
    },
  },
  {
    id: "netflix",
    slug: "netflix-dashboard",
    title: "Netflix Dashboard",
    order: 5,
    featured: false,
    description: {
      en: "An interactive Power BI dashboard for exploring and analyzing the Netflix content catalog.",
      ar: "لوحة معلومات تفاعلية باستخدام Power BI لاستكشاف وتحليل محتوى نتفليكس.",
    },
    categories: ["data"],
    technologies: ["Power BI", "Data Analysis"],
    cover: "/images/projects/netflix.svg",
    coverAlt: {
      en: "Abstract editorial bars, a conceptual cover",
      ar: "أعمدة تجريدية في غلاف توضيحي",
    },
  },
];
validateProjects(projects);
