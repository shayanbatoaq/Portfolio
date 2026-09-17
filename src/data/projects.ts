import type { Project } from "@/types/portfolio";
import { contact } from "@/data/shayan/contact";

export const WEB_PROJECTS: Project[] = [
  {
    id: "corporate-lens",
    title: "The Corporate Lens",
    description:
      "I designed and developed a corporate media website for Pakistan's business landscape, using structured editorial layouts and clear article discovery.",
    category: "web",
    url: "https://thecorporatelens.com",
    tags: ["Next.js", "TypeScript", "Editorial"],
    hue: "210",
    image: "/assets/projects/logos/corporate-lens.png",
    imageAlt: "The Corporate Lens logo",
    imageBackground: "#fbbf24",
  },
  {
    id: "euphoric",
    title: "Euphoric",
    description:
      "I designed a fragrance storefront for men's, women's, and unisex perfume impressions, with product storytelling and clear browsing paths.",
    category: "web",
    url: "https://euphoric.pk",
    tags: ["Next.js", "Tailwind CSS", "Headless Commerce"],
    hue: "270",
    image: "/assets/projects/logos/euphoric.png",
    imageAlt: "Euphoric logo",
    imageFit: "contain",
    imageBackground: "#f4f2f3",
  },
  {
    id: "betterlife-studio",
    title: "Better Life",
    description:
      "I designed a calm wellness-clinic website that explains Traditional Chinese Medicine treatments, introduces practitioners, shows pricing, and simplifies booking.",
    category: "web",
    url: "https://betterlife.soundstudio.pk",
    tags: ["TCM", "Healthcare", "Booking"],
    hue: "190",
    image: "/assets/projects/logos/better-life.png",
    imageAlt: "Better Life logo",
    imageFit: "contain",
    imageBackground: "#f4f7f5",
  },
  {
    id: "sound-studio",
    title: "Sound Studio",
    description:
      "I built a clear, accessible website for Sound Studio, an audiology clinic in Karachi, using WordPress and Elementor to present its hearing-care services.",
    category: "web",
    url: "https://soundstudio.pk",
    tags: ["WordPress", "Elementor", "Audiology"],
    hue: "160",
    image: "/assets/projects/logos/sound-studio.png",
    imageAlt: "Sound Studio logo",
    imageFit: "contain",
    imageBackground: "#050505",
  },
  {
    id: "gwhs",
    title: "Gateway Health Services",
    description:
      "I built a responsive dental-clinic website with WordPress, Elementor, and Astra, combining treatment information, educational content, and clear booking pathways.",
    category: "web",
    url: "https://gwhs.pk",
    tags: ["WordPress", "Elementor", "Astra"],
    hue: "35",
    image: "/assets/projects/logos/gwhs.webp",
    imageAlt: "Gateway Health Services logo",
    imageFit: "contain",
    imageBackground: "#eceff1",
  },
  {
    id: "homecure",
    title: "HomeCure",
    description:
      "I designed a reassuring healthcare website for Karachi's at-home diagnostic sample collection service, with clear hygiene, booking, and contact pathways.",
    category: "web",
    url: "https://homecure.com.pk",
    tags: ["Healthcare", "Home Diagnostics", "Booking"],
    hue: "340",
    image: "/assets/projects/logos/homecure.png",
    imageAlt: "HomeCure logo",
    imageFit: "contain",
    imageBackground: "#ffffff",
  },
  {
    id: "clearvoicehub",
    title: "ClearVoice Hub",
    description:
      "I designed a welcoming website for speech therapy, public speaking, French, German, and certification programs, with clear consultation and enrolment pathways.",
    category: "web",
    url: "https://clearvoicehub.com",
    tags: ["Speech Therapy", "Languages", "Education"],
    hue: "200",
    image: "/assets/projects/logos/clearvoice-hub.png",
    imageAlt: "ClearVoice Hub logo",
    imageFit: "contain",
    imageBackground: "#f4f7fb",
  },
  {
    id: "bait-us-salam",
    title: "Bait us Salam",
    description:
      "I built a Hajj and Umrah agency concept that organizes detailed packages into filters, comparisons, and inquiry flows with a respectful visual language.",
    category: "web",
    url: "https://bait-us-salam.vercel.app",
    tags: ["Next.js", "TypeScript", "Framer Motion"],
    hue: "140",
    image: "/assets/projects/logos/bait-us-salam.png",
    imageAlt: "Bait Us Salam website",
  },
  {
    id: "safe-safar",
    title: "Safe Safar",
    description:
      "I built a vehicle communication project for Karachi, designed around QR stickers that let road users contact owners without publicly displaying phone numbers.",
    category: "web",
    url: "https://car-connect-rosy.vercel.app",
    tags: ["Next.js", "QR Platform", "Privacy"],
    hue: "220",
    image: "/assets/projects/logos/safe-safar.png",
    imageAlt: "Safe Safar logo",
    imageBackground: "#201e1f",
  },
];

export const AI_PROJECTS: Project[] = [
  {
    id: "debate",
    title: "Debate Council",
    description:
      "Portfolio AI prototype: I built a role-based reasoning workflow where proposer, opponent, and judge stages demonstrate multi-perspective reasoning.",
    category: "ai",
    href: "/work/ai/debate",
    cta: "Open prototype",
    tags: ["OpenRouter", "Reasoning", "Portfolio Prototype"],
    hue: "350",
    visual: {
      code: "DC",
      stages: ["Proposer", "Opponent", "Judge"],
    },
  },
  {
    id: "engineering_team",
    title: "Engineering Team",
    description:
      "Portfolio AI prototype: I explored a staged code-generation workflow that turns a small software brief into architecture, implementation, and review outputs.",
    category: "ai",
    href: "/work/ai/engineering_team",
    cta: "Open prototype",
    tags: ["OpenRouter", "Structured outputs", "Portfolio Prototype"],
    hue: "42",
    visual: {
      code: "ET",
      stages: ["Architect", "Engineer", "Reviewer"],
    },
  },
  {
    id: "financial_researcher",
    title: "Financial Researcher",
    description:
      "Portfolio AI prototype: I built a structured company-research workflow designed to move from company checks and evidence gathering to a readable analysis.",
    category: "ai",
    href: "/work/ai/financial_researcher",
    cta: "Open prototype",
    tags: ["OpenRouter", "Research Workflow", "Portfolio Prototype"],
    hue: "158",
    visual: {
      code: "FR",
      stages: ["Verifier", "Researcher", "Analyst"],
    },
  },
  {
    id: "stock_picker",
    title: "Stock Picker",
    description:
      "Portfolio AI prototype: I explored a multi-step market-research workflow designed to surface attention signals, compare companies, and explain a selection.",
    category: "ai",
    href: "/work/ai/stock_picker",
    cta: "Open prototype",
    tags: ["OpenRouter", "Research Workflow", "Portfolio Prototype"],
    hue: "235",
    visual: {
      code: "SP",
      stages: ["Scanner", "Researcher", "Selector"],
    },
  },
];

// LapSignal is rendered as the permanent flagship above these supporting cards.
export const FEATURED_PROJECTS: Project[] = [
  ...WEB_PROJECTS.filter((project) => project.id === "safe-safar"),
  {
    id: "portfolio",
    title: "Engineering Portfolio & AI Assistant",
    description: "I built this Next.js portfolio with a Three.js background and a server-side OpenRouter assistant: validated requests, rate limits, controlled context and signed Notion logging events.",
    category: "web",
    url: contact.github,
    cta: "View Source",
    tags: ["Next.js", "TypeScript", "OpenRouter"],
    hue: "250",
    image: "/assets/shayan-batoaq-logo.png",
    imageAlt: "Shayan Batoaq portfolio wordmark",
    imageFit: "contain",
  },
];
