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
    role: "Propose, oppose, and judge crew",
    summary: "Two opposing agents build the case. A neutral judge decides it.",
    description:
      "A structured reasoning system that tests an idea from both sides before a separate judge evaluates only the strength of the arguments presented.",
    runtime: "CrewAI · OpenRouter",
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
      { label: "Proposer", detail: "Builds the affirmative case" },
      { label: "Opponent", detail: "Challenges the motion" },
      { label: "Judge", detail: "Weighs both arguments" },
    ],
  },
  {
    id: "engineering_team",
    folder: "engineering_team",
    number: "02",
    name: "Engineering Team",
    eyebrow: "Autonomous software delivery",
    role: "Claude-powered polyglot coding crew",
    summary: "Describe a product. The crew returns a complete, runnable codebase.",
    description:
      "A production-minded coding system that chooses an appropriate stack, implements the requested software, reviews every file, and returns a runnable project bundle.",
    runtime: "CrewAI · Claude Sonnet",
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
      { label: "Architect", detail: "Selects stack and structure" },
      { label: "Engineer", detail: "Builds the full project" },
      { label: "Reviewer", detail: "Repairs and validates files" },
    ],
  },
  {
    id: "financial_researcher",
    folder: "financial_researcher",
    number: "03",
    name: "Financial Researcher",
    eyebrow: "Evidence-led company analysis",
    role: "Company research and analysis crew",
    summary: "Verify a company, research it, and receive a structured report.",
    description:
      "A research pipeline that verifies the company first, gathers current business evidence, and hands it to a financial analyst for a focused, readable report.",
    runtime: "CrewAI · Web Research",
    accent: "#34d399",
    accentRgb: "52, 211, 153",
    fields: [
      {
        name: "company",
        label: "Company or ticker",
        type: "text",
        placeholder: "Enter a genuine company name or ticker…",
        examples: ["NVIDIA", "AAPL"],
      },
    ],
    stages: [
      { label: "Verifier", detail: "Confirms the company" },
      { label: "Researcher", detail: "Collects current evidence" },
      { label: "Analyst", detail: "Synthesizes the report" },
    ],
  },
  {
    id: "stock_picker",
    folder: "stock_picker",
    number: "04",
    name: "Stock Picker",
    eyebrow: "Trend-to-thesis intelligence",
    role: "Trending company research and selection crew",
    summary: "Scan an industry, compare trending companies, and select one.",
    description:
      "A managed market-research crew that discovers companies attracting attention, investigates the strongest candidates, and produces a transparent final selection.",
    runtime: "CrewAI · Web Research",
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
      { label: "Scanner", detail: "Finds trending companies" },
      { label: "Researcher", detail: "Compares the candidates" },
      { label: "Selector", detail: "Builds the final thesis" },
    ],
  },
];

export function getCrewProject(projectId: string): CrewProject | undefined {
  return crewProjects.find((project) => project.id === projectId);
}
