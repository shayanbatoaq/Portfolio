// A listed capability is not a claim of mastery or production-scale experience.
export const skills = {
  coreEngineering: ["TypeScript", "JavaScript", "Python", "React", "Next.js", "FastAPI", "Node.js", "REST APIs", "Supabase", "SQL / SQLite"],
  appliedAI: ["LLM APIs", "OpenRouter", "Structured outputs", "RAG prototypes", "Agent / tool workflows", "Pydantic validation"],
  testingAndDelivery: ["Git", "GitHub", "Automated API tests", "Input validation", "TypeScript checks", "ESLint", "Vercel"],
  additional: ["WordPress", "Elementor", "Figma", "SEO", "Digital marketing", "Branding / design"],
  training: ["Full-stack web development", "SEO", "Digital marketing", "Agentic AI and workflow prototyping", "Python with AI", "A six-month digital marketing internship"],
} as const;

export const capabilityGroups = [
  { title: "Core Engineering", items: skills.coreEngineering },
  { title: "Applied AI", items: skills.appliedAI },
  { title: "Testing & Delivery", items: skills.testingAndDelivery },
  { title: "Additional Capabilities", items: skills.additional },
] as const;
