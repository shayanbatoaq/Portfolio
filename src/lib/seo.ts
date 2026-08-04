export const SITE_URL = "https://shayan.patricians.pk";
export const SITE_NAME = "Shayan Batoaq";
export const SITE_TITLE = "Shayan Batoaq — AI Engineer & Full-Stack Developer";
export const SITE_DESCRIPTION =
  "Portfolio of Shayan Batoaq, an early-career AI engineer and full-stack developer building applied-AI prototypes, agent workflows, and client-facing web products.";

export const absoluteUrl = (path = "/") => new URL(path, SITE_URL).toString();
