export type CrewProjectId =
  | "debate"
  | "engineering_team"
  | "financial_researcher"
  | "stock_picker";

export type CrewProjectField = {
  name: string;
  label: string;
  type: "text" | "textarea";
  placeholder: string;
  rows?: number;
  examples: string[];
};

export type CrewProject = {
  id: CrewProjectId;
  folder: string;
  number: string;
  name: string;
  eyebrow: string;
  role: string;
  summary: string;
  description: string;
  runtime: string;
  accent: string;
  accentRgb: string;
  fields: CrewProjectField[];
  stages: { label: string; detail: string }[];
};

export const crewProjects: CrewProject[] = [
  {
    id: "debate",
    folder: "debate",
    number: "01",
    name: "Debate Council",
    eyebrow: "Multi-perspective reasoning",
    role: "Role-based reasoning workflow prototype",
    summary: "A proposer and opponent draft cases; a judge stage compares the arguments.",
    description:
      "An interactive portfolio prototype demonstrating a structured role-based workflow for testing a motion from two sides and passing both arguments to a separate judge stage.",
    runtime: "OpenRouter · Workflow prototype",
    accent: "#fb7185",
    accentRgb: "251, 113, 133",
    fields: [
      {
        name: "motion",
        label: "Motion to debate",
        type: "textarea",
        rows: 7,
        placeholder: "State a clear motion for the council to debate…",
        examples: [
          "Remote work should be the default for knowledge workers.",
          "AI-generated media should always carry a disclosure label.",
        ],
      },
    ],
    stages: [
      { label: "Proposer", detail: "Drafts the affirmative case" },
      { label: "Opponent", detail: "Drafts the opposing case" },
      { label: "Judge", detail: "Compares the arguments" },
    ],
  },
  {
    id: "engineering_team",
    folder: "engineering_team",
    number: "02",
    name: "Engineering Team",
    eyebrow: "Multi-stage code generation",
    role: "Architecture, implementation, and review prototype",
    summary: "Explore a staged workflow that turns a small product brief into code outputs.",
    description:
      "An experimental portfolio workflow that asks separate stages to choose a stack, draft a small software project, and review the generated files. It demonstrates the process; it is not presented as production software delivery.",
    runtime: "OpenRouter · Code generation prototype",
    accent: "#fbbf24",
    accentRgb: "251, 191, 36",
    fields: [
      {
        name: "prompt",
        label: "Software brief",
        type: "textarea",
        rows: 11,
        placeholder:
          "Describe what to build, including any preferred language, framework, runtime, or constraints…",
        examples: [
          "Build a Python CLI that turns a CSV file into a clean HTML report.",
          "Create a small TypeScript REST API for tracking reading lists.",
        ],
      },
    ],
    stages: [
      { label: "Architect", detail: "Proposes stack and structure" },
      { label: "Engineer", detail: "Drafts project files" },
      { label: "Reviewer", detail: "Reviews generated files" },
    ],
  },
  {
    id: "financial_researcher",
    folder: "financial_researcher",
    number: "03",
    name: "Financial Researcher",
    eyebrow: "Structured company research",
    role: "Company research workflow prototype",
    summary: "Explore a staged path from company checks to evidence gathering and synthesis.",
    description:
      "A portfolio prototype designed to demonstrate how company checks, research steps, and analysis can be organized. Its output is experimental and should not be treated as current information or financial advice.",
    runtime: "OpenRouter · Research prototype",
    accent: "#34d399",
    accentRgb: "52, 211, 153",
    fields: [
      {
        name: "company",
        label: "Company or ticker",
        type: "text",
        placeholder: "Enter a company name or ticker…",
        examples: ["NVIDIA", "AAPL"],
      },
    ],
    stages: [
      { label: "Verifier", detail: "Checks the company input" },
      { label: "Researcher", detail: "Gathers source material" },
      { label: "Analyst", detail: "Drafts a structured report" },
    ],
  },
  {
    id: "stock_picker",
    folder: "stock_picker",
    number: "04",
    name: "Stock Picker",
    eyebrow: "Comparative market research",
    role: "Comparative research workflow prototype",
    summary: "Explore a staged workflow for scanning an industry, comparing companies, and drafting a selection rationale.",
    description:
      "An experimental portfolio workflow designed to surface candidate companies, compare available material, and draft a selection rationale. It does not provide validated real-time research or financial advice.",
    runtime: "OpenRouter · Research prototype",
    accent: "#818cf8",
    accentRgb: "129, 140, 248",
    fields: [
      {
        name: "industry",
        label: "Industry to scan",
        type: "text",
        placeholder: "Enter an industry or market theme…",
        examples: ["Semiconductors", "Renewable energy"],
      },
    ],
    stages: [
      { label: "Scanner", detail: "Surfaces candidate companies" },
      { label: "Researcher", detail: "Compares available material" },
      { label: "Selector", detail: "Drafts a selection rationale" },
    ],
  },
];

export function getCrewProject(projectId: string): CrewProject | undefined {
  return crewProjects.find((project) => project.id === projectId);
}
