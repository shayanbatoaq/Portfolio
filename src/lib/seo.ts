export const SITE_URL = "https://shayan.patricians.pk";
export const SITE_NAME = "Shayan Batoaq";
export const SITE_TITLE = "Shayan Batoaq | Full-Stack & AI Product Engineer";
export const SITE_DESCRIPTION =
  "Full-stack and AI product engineer building with TypeScript, Next.js, Python and FastAPI. Creator of LapSignal and co-founder of Patricians.";

export const absoluteUrl = (path = "/") => new URL(path, SITE_URL).toString();
