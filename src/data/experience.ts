import type { Localized } from "../types/content";
// Add only verified employment or internship history. Empty sections are hidden.
export const experience: {
  role: Localized;
  organization: Localized;
  period: Localized;
  description: Localized;
}[] = [];
