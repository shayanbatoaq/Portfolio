export const SITE_URL = "https://shayan.patricians.pk";
export const SITE_NAME = "Shayan Batoaq";
export const SITE_TITLE = "Shayan Batoaq — AI Engineer & Full-Stack Developer";
export const SITE_DESCRIPTION =
  "Portfolio of Shayan Batoaq, an AI engineer and full-stack developer building agentic AI systems, polished websites, and digital growth experiences.";

export const absoluteUrl = (path = "/") => new URL(path, SITE_URL).toString();
