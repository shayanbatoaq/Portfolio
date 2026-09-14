"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useSyncExternalStore,
} from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  X,
  ArrowUpRight,
  ArrowRight,
  Send,
  ChevronDown,
  Sparkles,
  Gauge,
  Dumbbell,
  BrainCircuit,
  PenTool,
  Scale,
  Code2,
  LineChart,
  Radar,
  FileText,
  Download,
} from "lucide-react";
import { contact } from "@/data/shayan/contact";
import { lapsignal } from "@/data/lapsignal";
import { emitSceneReaction } from "@/lib/three/sceneEvents";
import { BrandSystemsSection } from "@/components/work/brand-systems/BrandSystemsSection";
import { PortfolioNav } from "@/components/navigation/PortfolioNav";
import {
  getPersistedConversationMessages,
  initializeConversationLogging,
  isChatLoggingMetadata,
  prepareConversationMessage,
  recordSuccessfulConversation,
} from "@/lib/conversations/session";

const BackgroundScene = dynamic(
  () => import("@/components/three/BackgroundScene"),
  { ssr: false }
);

// ── Types ─────────────────────────────────────────────────────────────────────

type WorkFilter = "web" | "ai" | "brand";

const getWorkFilterFromLocation = (): WorkFilter => {
  if (typeof window === "undefined") return "web";
  const requestedFilter = new URLSearchParams(window.location.search).get(
    "work",
  );
  return requestedFilter === "ai" || requestedFilter === "brand"
    ? requestedFilter
    : "web";
};

const subscribeToWorkLocation = (onStoreChange: () => void) => {
  window.addEventListener("popstate", onStoreChange);
  return () => window.removeEventListener("popstate", onStoreChange);
};

interface Message {
  role: "user" | "ai";
  text: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  category: "web" | "ai";
  url?: string;
  href?: string;
  cta?: string;
  tags: string[];
  hue: string;
  image?: string;
  imageAlt?: string;
  imageFit?: "cover" | "contain";
  imageBackground?: string;
  imageFilter?: string;
  visual?: {
    code: string;
    stages: string[];
  };
}

// ── Data ──────────────────────────────────────────────────────────────────────

const WEB_PROJECTS: Project[] = [
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

const AI_PROJECTS: Project[] = [
  lapsignal,
  {
    id: "debate",
    title: "Debate Council",
    description:
      "Portfolio AI prototype: I built a role-based CrewAI workflow where proposer, opponent, and judge stages demonstrate multi-perspective reasoning.",
    category: "ai",
    href: "/work/ai/debate",
    cta: "Open prototype",
    tags: ["CrewAI", "Reasoning", "Portfolio Prototype"],
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
    tags: ["CrewAI", "Claude", "Portfolio Prototype"],
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
    tags: ["CrewAI", "Research Workflow", "Portfolio Prototype"],
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
    tags: ["CrewAI", "Research Workflow", "Portfolio Prototype"],
    hue: "235",
    visual: {
      code: "SP",
      stages: ["Scanner", "Researcher", "Selector"],
    },
  },
];

const SUGGESTED_QUESTIONS = [
  "What kind of work do you do?",
  "Tell me about Patricians.",
  "What AI experience do you have?",
  "How can we work together?",
];

const CHAT_UNAVAILABLE_MESSAGE =
  "I could not respond just now. Please try again in a moment.";
const CHAT_RATE_LIMIT_MESSAGE =
  "Too many requests were sent in a short period. Please wait briefly and try again.";

const CONTACT_LINKS = {
  email: {
    label: "Email",
    href: `mailto:${contact.email}`,
  },
  linkedin: {
    label: "LinkedIn",
    href: contact.linkedIn,
  },
  instagram: {
    label: "Instagram",
    href: contact.instagram,
  },
} as const;

type ContactLinkKey = keyof typeof CONTACT_LINKS;

function tokenizeContactLinks(text: string) {
  return text
    .replace(
      /\[[^\]]+\]\(\s*mailto:hello@shayan\.patricians\.pk\s*\)|mailto:hello@shayan\.patricians\.pk|hello@shayan\.patricians\.pk/gi,
      "{{contact:email}}"
    )
    .replace(
      /\[[^\]]+\]\(\s*https?:\/\/(?:www\.)?linkedin\.com\/in\/shayan-batoaq-379a42246\/?\s*\)|(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/shayan-batoaq-379a42246\/?/gi,
      "{{contact:linkedin}}"
    )
    .replace(
      /\[[^\]]+\]\(\s*https?:\/\/(?:www\.)?instagram\.com\/shayanbatoaq\/?\s*\)|(?:https?:\/\/)?(?:www\.)?instagram\.com\/shayanbatoaq\/?|@shayanbatoaq/gi,
      "{{contact:instagram}}"
    );
}

function ChatMessageText({ text }: { text: string }) {
  const parts = tokenizeContactLinks(text).split(
    /(\{\{contact:(?:email|linkedin|instagram)\}\})/g
  );

  return (
    <span className="whitespace-pre-wrap">
      {parts.map((part, index) => {
        const match = part.match(/^\{\{contact:(email|linkedin|instagram)\}\}$/);
        if (!match) return part;

        const key = match[1] as ContactLinkKey;
        const link = CONTACT_LINKS[key];
        const isExternal = key !== "email";

        return (
          <a
            key={`${key}-${index}`}
            href={link.href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="inline-flex items-center gap-1 font-semibold text-[#78b7ff] underline decoration-white/20 underline-offset-4 transition-colors hover:text-white"
          >
            {link.label}
            <ArrowUpRight size={12} aria-hidden="true" />
          </a>
        );
      })}
    </span>
  );
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

function useScrollReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

// ── Shared primitives ─────────────────────────────────────────────────────────

function GradientText({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={className}
      style={{
        background:
          "linear-gradient(135deg, #1E90FF 0%, #4F7BFF 30%, #6A5ACD 65%, #8A2BE2 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      {children}
    </span>
  );
}

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// ── Navigation ────────────────────────────────────────────────────────────────

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#work", label: "Work" },
    { href: "#patricians", label: "Patricians" },
    { href: "#resume", label: "Resume" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-5 px-4">
      <div
        className="relative transition-all duration-500"
        style={{
          background: scrolled
            ? "rgba(7,7,18,0.80)"
            : "transparent",
          backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
          border: scrolled ? "1px solid rgba(255,255,255,0.07)" : "1px solid transparent",
          borderRadius: "9999px",
          padding: "10px 20px",
          boxShadow: scrolled ? "0 8px 40px rgba(0,0,0,0.5)" : "none",
        }}
      >
        <div className="flex items-center gap-8">
          <a
            href="#home"
            className="block transition-opacity duration-200 hover:opacity-90"
          >
            <img
              src="/assets/shayan-batoaq-logo.png"
              alt="Shayan Batoaq"
              width={1597}
              height={256}
              className="h-auto w-36 sm:w-40"
              draggable={false}
            />
          </a>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-white/40 hover:text-white/85 transition-colors duration-300"
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-white/40 hover:text-white/80 transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={16} /> : (
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                <rect y="0" width="16" height="1.5" rx="1" fill="currentColor" />
                <rect y="5.25" width="10" height="1.5" rx="1" fill="currentColor" />
                <rect y="10.5" width="16" height="1.5" rx="1" fill="currentColor" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            className="md:hidden absolute top-full left-0 right-0 mt-2 rounded-2xl border border-white/8 py-4 px-6 flex flex-col gap-4"
            style={{ background: "rgba(7,7,18,0.95)", backdropFilter: "blur(20px)" }}
          >
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm text-white/50 hover:text-white/90 transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────

function Hero({ onAskClick }: { onAskClick: () => void }) {
  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden"
    >
      {/* Ambient radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 38%, rgba(30,144,255,0.055) 0%, rgba(106,10,173,0.03) 55%, transparent 80%)",
        }}
      />
      {/* Very subtle grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      <div className="relative max-w-5xl mx-auto text-center w-full">
        <Reveal>
          <p
            className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10px] tracking-[0.35em] text-white/25 uppercase mb-10"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <span>AI Engineer</span>
            <span aria-hidden="true">·</span>
            <span>Builder</span>
          </p>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="mb-14 flex justify-center select-none">
            <span className="sr-only">
              Shayan Batoaq — AI Engineer, Full-Stack Developer, and Product-Focused Builder
            </span>
            <img
              src="/assets/shayan-batoaq-logo.png"
              alt=""
              aria-hidden="true"
              width={1597}
              height={256}
              className="h-auto w-full max-w-[1024px]"
              draggable={false}
            />
          </h1>
        </Reveal>

        <Reveal delay={180}>
          <p
            className="flex flex-wrap items-baseline justify-center gap-x-2 gap-y-1 font-light text-white/55 tracking-wide mb-7"
            style={{
              fontSize: "clamp(1.1rem,2.8vw,2.2rem)",
              fontFamily: "var(--font-display)",
            }}
          >
            <span>AI Engineer.</span>
            <GradientText className="inline-block">Builder.</GradientText>
            <span>Problem Solver.</span>
          </p>
        </Reveal>

        <Reveal delay={270}>
          <p
            className="max-w-lg mx-auto text-base text-white/35 leading-[1.75] mb-12"
            style={{ fontFamily: "var(--font-body)" }}
          >
            I&apos;m Shayan Batoaq, an AI engineer and full-stack developer building applied-AI prototypes, agent workflows, and thoughtful web products.
          </p>
        </Reveal>

        <Reveal delay={360}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <a
              href="#work"
              className="px-7 py-3.5 rounded-full text-sm font-semibold text-white transition-all duration-300 hover:opacity-90 hover:scale-[1.03] active:scale-[0.97]"
              style={{
                background: "linear-gradient(135deg, #1E90FF, #6A5ACD)",
                boxShadow: "0 0 28px rgba(30,144,255,0.22), 0 4px 16px rgba(0,0,0,0.3)",
                fontFamily: "var(--font-body)",
              }}
            >
              View Work
            </a>
            <button
              onClick={onAskClick}
              className="px-7 py-3.5 rounded-full text-sm font-semibold text-white/55 hover:text-white/90 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.09)",
                backdropFilter: "blur(12px)",
                fontFamily: "var(--font-body)",
              }}
            >
              Ask Me
            </button>
          </div>
        </Reveal>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/15">
        <span
          className="text-[9px] tracking-[0.35em] uppercase"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Scroll
        </span>
        <ChevronDown size={12} className="animate-bounce" />
      </div>
    </section>
  );
}

// ── About ─────────────────────────────────────────────────────────────────────

const aboutTopics = [
  {
    label: "Full Stack Development",
    heading: "Building for the full surface area of the web.",
    body: "I work across modern web products, from responsive interfaces and APIs to content, data, deployment, and client handoff. My focus is clear user journeys, careful implementation, and products that are straightforward to use and maintain.",
    gradFrom: "rgba(30,144,255,0.12)",
    gradTo: "rgba(79,123,255,0.06)",
    reverse: false,
    image: "/assets/projects/story-development-custom.webp",
    imageAlt: "Layered digital architecture representing full-stack development",
    imageContain: false,
  },
  {
    label: "Applied AI Prototyping",
    heading: "Exploring useful multi-step AI workflows.",
    body: "During an Agentic AI internship at Integrity Technologies from September to December 2025, I worked with RAG pipelines, conversational agents for internal knowledge-management use cases, LLM API integrations, and prompt experiments. My other AI work is portfolio prototyping, not production-scale client delivery.",
    gradFrom: "rgba(106,90,205,0.12)",
    gradTo: "rgba(138,43,226,0.06)",
    reverse: true,
    image: "/assets/projects/story-ai-custom.webp",
    imageAlt: "Connected nodes representing a multi-step AI workflow",
    imageContain: false,
  },
  {
    label: "Digital Marketing & Brand Work",
    heading: "Clear communication across brands and channels.",
    body: "My experience includes content planning, social media work, Meta campaigns, brand positioning, creative direction, and audience communication. I value repeatable content systems and close collaboration between strategy, design, and delivery.",
    gradFrom: "rgba(106,10,173,0.12)",
    gradTo: "rgba(138,43,226,0.06)",
    reverse: false,
    image: "/assets/projects/story-growth-custom.webp",
    imageAlt: "Abstract data streams representing digital marketing and brand communication",
    imageContain: false,
  },
  {
    label: "Co-founder · Patricians",
    heading: "Building products directly with clients.",
    body: "As a co-founder of Patricians, I contribute across product strategy, design, development, and delivery for client-facing websites and digital products. We are also exploring AI assistants, agent workflows, and AI-native product ideas as a direction for the studio.",
    gradFrom: "rgba(30,144,255,0.08)",
    gradTo: "rgba(106,90,205,0.08)",
    reverse: true,
    image: "/assets/patricians-wordmark.png",
    imageAlt: "Patricians logo",
    imageContain: true,
  },
];

function About() {
  return (
    <section id="about" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="mb-24">
            <p
              className="text-[10px] tracking-[0.35em] text-white/25 uppercase mb-5"
              style={{ fontFamily: "var(--font-body)" }}
            >
              01 — My Story
            </p>
            <h2
              className="font-bold text-white leading-[0.9] tracking-[-0.03em]"
              style={{
                fontSize: "clamp(2.8rem,6vw,5.5rem)",
                fontFamily: "var(--font-display)",
              }}
            >
              Behind
              <br />
              <GradientText>my work.</GradientText>
            </h2>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <p
            className="max-w-2xl text-xl text-white/40 leading-[1.75] mb-28 font-light"
            style={{ fontFamily: "var(--font-body)" }}
          >
            I am an early-career AI engineer and full-stack developer with experience spanning client websites, digital marketing, an applied-AI internship, and portfolio prototypes. I learn quickly, work across product and design, and value feedback from stronger engineers and collaborators.
          </p>
        </Reveal>

        <div className="space-y-28">
          {aboutTopics.map((topic, i) => (
            <Reveal key={topic.label} delay={i * 60}>
              <div
                className={`grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center ${
                  topic.reverse ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div
                  className="aspect-[4/3] rounded-2xl border border-white/[0.055] relative overflow-hidden"
                  style={{
                    background: topic.imageContain
                      ? "rgba(255,255,255,0.98)"
                      : `linear-gradient(135deg, ${topic.gradFrom}, ${topic.gradTo}), rgba(10,10,22,0.7)`,
                  }}
                >
                  <img
                    src={topic.image}
                    alt={topic.imageAlt}
                    loading="lazy"
                    className={`absolute inset-0 w-full h-full transition-transform duration-700 ${
                      topic.imageContain ? "object-contain p-10" : "object-cover"
                    }`}
                    style={{
                      filter: topic.imageContain
                        ? "none"
                        : "saturate(0.8) contrast(1.05)",
                    }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: topic.imageContain
                        ? "transparent"
                        : "linear-gradient(135deg, rgba(5,5,14,0.08), rgba(5,5,14,0.58))",
                    }}
                  />
                </div>

                {/* Text */}
                <div className="space-y-5">
                  <p
                    className="text-[10px] tracking-[0.3em] text-white/25 uppercase"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {topic.label}
                  </p>
                  <h3
                    className="font-semibold text-white leading-[1.2]"
                    style={{
                      fontSize: "clamp(1.4rem,2.5vw,2rem)",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    {topic.heading}
                  </h3>
                  <p
                    className="text-white/45 leading-[1.8] text-[1.05rem] font-light"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {topic.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}

// ── Philosophy ────────────────────────────────────────────────────────────────

const CHAPTERS = [
  {
    number: "I",
    icon: <Gauge size={20} strokeWidth={1.5} />,
    title: "Precision",
    subtitle: "Motorsport as my mental model.",
    body: "Motorsport is one of my clearest mental models for precision. Across F1, WEC, and IMSA, complex results depend on many connected decisions, careful preparation, and constant refinement. I bring that same attention to interfaces, implementation details, and how each part of a product supports the whole.",
    gradFrom: "rgba(30,144,255,0.08)",
    gradTo: "rgba(79,123,255,0.04)",
    borderColor: "rgba(30,144,255,0.14)",
  },
  {
    number: "II",
    icon: <Dumbbell size={20} strokeWidth={1.5} />,
    title: "Discipline",
    subtitle: "MMA taught me patience.",
    body: "MMA has taught me patience with fundamentals and the value of showing up consistently. Progress comes from repeating the basics, noticing mistakes, and returning with better control. I try to bring that discipline to learning unfamiliar tools and working through difficult product problems.",
    gradFrom: "rgba(106,90,205,0.08)",
    gradTo: "rgba(138,43,226,0.04)",
    borderColor: "rgba(106,90,205,0.14)",
  },
  {
    number: "III",
    icon: <BrainCircuit size={20} strokeWidth={1.5} />,
    title: "Curiosity",
    subtitle: "Applied AI is where I want to grow.",
    body: "I have pursued applied AI through self-directed prototypes and an Agentic AI internship. The tools and patterns change quickly, so I keep testing ideas, learning from stronger engineers, and improving how I connect models to useful interfaces and workflows.",
    gradFrom: "rgba(106,10,173,0.08)",
    gradTo: "rgba(138,43,226,0.04)",
    borderColor: "rgba(106,10,173,0.14)",
  },
  {
    number: "IV",
    icon: <PenTool size={20} strokeWidth={1.5} />,
    title: "Creation",
    subtitle: "Software is just the medium.",
    body: "Code is the material, not the point. I try to build interfaces that make the next action clear and the overall experience considered. Whether the work is a website or an AI prototype, usefulness is the goal and implementation is how I support it.",
    gradFrom: "rgba(138,43,226,0.08)",
    gradTo: "rgba(106,10,173,0.04)",
    borderColor: "rgba(138,43,226,0.14)",
  },
];

function Philosophy() {
  return (
    <section id="philosophy" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="mb-20">
            <p
              className="text-[10px] tracking-[0.35em] text-white/25 uppercase mb-5"
              style={{ fontFamily: "var(--font-body)" }}
            >
              02 — Philosophy
            </p>
            <h2
              className="font-bold text-white leading-[0.9] tracking-[-0.03em]"
              style={{
                fontSize: "clamp(2.8rem,6vw,5.5rem)",
                fontFamily: "var(--font-display)",
              }}
            >
              How I think
              <br />
              <GradientText>about everything.</GradientText>
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {CHAPTERS.map((ch, i) => (
            <Reveal key={ch.title} delay={i * 90}>
              <div
                className="group relative rounded-2xl overflow-hidden h-full transition-all duration-500 hover:-translate-y-1"
                style={{
                  background: `linear-gradient(145deg, ${ch.gradFrom}, ${ch.gradTo}), rgba(10,10,20,0.85)`,
                  border: `1px solid ${ch.borderColor}`,
                  padding: "2.5rem",
                }}
              >
                {/* Subtle sheen on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.025) 0%, transparent 60%)",
                  }}
                />

                <div className="relative">
                  <div className="flex items-start justify-between mb-7">
                    <span
                      className="text-[10px] tracking-[0.3em] text-white/20 uppercase"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      Chapter {ch.number}
                    </span>
                    <span className="text-xl text-white/12 group-hover:text-white/22 transition-colors duration-300">
                      {ch.icon}
                    </span>
                  </div>

                  <h3
                    className="font-bold text-white mb-2"
                    style={{
                      fontSize: "clamp(1.6rem,2.5vw,2rem)",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    {ch.title}
                  </h3>
                  <p
                    className="text-sm text-white/30 italic mb-5"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {ch.subtitle}
                  </p>
                  <p
                    className="text-white/50 leading-[1.8] text-[0.95rem]"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {ch.body}
                  </p>

                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Project card ──────────────────────────────────────────────────────────────

function AgentSystemPreview({ project }: { project: Project }) {
  const icons = {
    debate: Scale,
    engineering_team: Code2,
    financial_researcher: LineChart,
    stock_picker: Radar,
  };
  const Icon = icons[project.id as keyof typeof icons] ?? BrainCircuit;
  const stages = project.visual?.stages ?? [];

  return (
    <div className="absolute inset-0 flex flex-col justify-between p-5">
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.45) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.45) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "linear-gradient(to bottom, black, transparent)",
        }}
      />
      <div className="relative flex items-center justify-between">
        <span
          className="text-[9px] uppercase tracking-[0.24em]"
          style={{ color: `hsla(${project.hue}, 82%, 72%, .72)` }}
        >
          AI workflow prototype
        </span>
        <span className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.18em] text-white/24">
          <span
            className="size-1.5 rounded-full shadow-[0_0_10px_currentColor]"
            style={{
              color: `hsl(${project.hue}, 80%, 68%)`,
              background: "currentColor",
            }}
          />
          Available
        </span>
      </div>

      <div className="relative flex items-center justify-center gap-2">
        {stages.map((stage, index) => (
          <div key={stage} className="contents">
            <div className="min-w-0 text-center">
              <div
                className="mx-auto grid size-10 place-items-center rounded-full border font-mono text-[10px] transition duration-500 group-hover:scale-110"
                style={{
                  borderColor: `hsla(${project.hue}, 75%, 65%, .22)`,
                  background: `hsla(${project.hue}, 75%, 55%, .07)`,
                  color: `hsla(${project.hue}, 82%, 76%, .8)`,
                }}
              >
                {index === 1 ? <Icon size={15} /> : `0${index + 1}`}
              </div>
              <div className="mt-2 max-w-16 truncate text-[9px] text-white/34">
                {stage}
              </div>
            </div>
            {index < stages.length - 1 && (
              <div
                className="mb-5 h-px w-6"
                style={{
                  background: `linear-gradient(90deg, hsla(${project.hue}, 75%, 65%, .45), hsla(${project.hue}, 75%, 65%, .08))`,
                }}
              />
            )}
          </div>
        ))}
      </div>

      <div className="relative flex items-center justify-between border-t border-white/[0.055] pt-3">
        <span className="font-mono text-[9px] tracking-[0.18em] text-white/20">
          {project.visual?.code} / CREWAI
        </span>
        <span
          className="text-[9px] tracking-[0.14em]"
          style={{ color: `hsla(${project.hue}, 82%, 72%, .55)` }}
        >
          READY
        </span>
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const containsLogo = project.imageFit === "contain";

  return (
    <div
      className="group relative h-[460px] rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1.5 flex flex-col"
      onMouseEnter={() => emitSceneReaction("project-hover", 1)}
      onFocus={() => emitSceneReaction("project-hover", 0.8)}
      style={{
        background: "rgba(9,9,19,0.75)",
        border: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(16px)",
        boxShadow: "0 4px 28px rgba(0,0,0,0.35)",
      }}
    >
      {/* Screenshot area */}
      <div
        className="aspect-[16/9] shrink-0 relative border-b border-white/[0.04] flex items-center justify-center overflow-hidden"
        style={{
          background:
            project.imageBackground ??
            `radial-gradient(ellipse at 40% 40%, hsla(${project.hue}, 70%, 45%, 0.13) 0%, transparent 65%), rgba(10,10,22,0.9)`,
        }}
      >
        {project.visual ? (
          <AgentSystemPreview project={project} />
        ) : project.image ? (
          <img
            src={project.image}
            alt={project.imageAlt ?? ""}
            loading="lazy"
            className={`absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-[1.04] ${
              containsLogo ? "object-contain p-8" : "object-cover opacity-80"
            }`}
            style={{
              filter: project.imageFilter ?? (containsLogo ? "none" : "saturate(0.75) contrast(1.08)"),
            }}
          />
        ) : null}
        {!project.visual && !containsLogo && (
          <>
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(5,5,14,0.2), rgba(5,5,14,0.5))",
              }}
            />
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
                backgroundSize: "28px 28px",
              }}
            />
          </>
        )}
        {!project.url && !project.href && !project.visual && (
          <span
            className="text-white/10 text-[10px] tracking-[0.3em] uppercase z-10"
            style={{ fontFamily: "var(--font-body)" }}
          >
            AI Project
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-1 flex-col">
        <div className="flex flex-wrap gap-1.5 mb-3.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded text-[9px] text-white/30 tracking-wide"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                fontFamily: "var(--font-body)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
        <h3
          className="text-base font-semibold text-white mb-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {project.title}
        </h3>
        <p
          className="text-sm text-white/38 leading-[1.7] mb-5 line-clamp-4"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {project.description}
        </p>
        {project.href && (
          <Link
            href={project.href}
            className="mt-auto inline-flex items-center gap-2 text-[11px] text-white/35 transition-colors duration-200 hover:text-white/80 group/lnk"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {project.cta ?? "View project"}
            <ArrowRight
              size={11}
              className="transition-transform duration-200 group-hover/lnk:translate-x-1"
            />
          </Link>
        )}
        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex items-center gap-1.5 text-[11px] text-white/28 hover:text-white/65 transition-colors duration-200 group/lnk"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Visit site
            <ArrowUpRight
              size={11}
              className="group-hover/lnk:translate-x-0.5 group-hover/lnk:-translate-y-0.5 transition-transform duration-200"
            />
          </a>
        )}
      </div>
    </div>
  );
}

// ── Work ──────────────────────────────────────────────────────────────────────

function Work() {
  const locationFilter = useSyncExternalStore(
    subscribeToWorkLocation,
    getWorkFilterFromLocation,
    () => "web",
  );
  const [selectedFilter, setSelectedFilter] = useState<WorkFilter | null>(null);
  const filter = selectedFilter ?? locationFilter;
  const [showAllProjects, setShowAllProjects] = useState(false);
  const reduceMotion = useReducedMotion();

  const selectFilter = (nextFilter: WorkFilter) => {
    setSelectedFilter(nextFilter);
    setShowAllProjects(false);
    emitSceneReaction("filter-change", 1);

    const url = new URL(window.location.href);
    url.searchParams.set("work", nextFilter);
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  };

  const filters: { key: WorkFilter; label: string }[] = [
    { key: "web", label: "Websites" },
    { key: "ai", label: "AI Prototypes" },
    { key: "brand", label: "Brand & Marketing" },
  ];

  const filteredProjects =
    filter === "web" ? WEB_PROJECTS : filter === "ai" ? AI_PROJECTS : [];
  const visibleProjects = showAllProjects
    ? filteredProjects
    : filteredProjects.slice(0, 6);
  const canToggleProjects = filteredProjects.length > 6;

  return (
    <section id="work" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="mb-16">
            <p
              className="text-[10px] tracking-[0.35em] text-white/25 uppercase mb-5"
              style={{ fontFamily: "var(--font-body)" }}
            >
              03 — My Work
            </p>
            <h2
              className="font-bold text-white leading-[0.9] tracking-[-0.03em]"
              style={{
                fontSize: "clamp(2.8rem,6vw,5.5rem)",
                fontFamily: "var(--font-display)",
              }}
            >
              Built with
              <br />
              <GradientText>intention.</GradientText>
            </h2>
          </div>
        </Reveal>

        {/* Filter tabs */}
        <Reveal delay={80}>
          <div
            className="flex flex-wrap gap-2.5 mb-14"
            role="tablist"
            aria-label="Work disciplines"
          >
            {filters.map((f) => (
              <button
                key={f.key}
                id={`work-tab-${f.key}`}
                type="button"
                role="tab"
                onClick={() => selectFilter(f.key)}
                onKeyDown={(event) => {
                  if (
                    !["ArrowLeft", "ArrowRight", "Home", "End"].includes(
                      event.key,
                    )
                  ) {
                    return;
                  }

                  event.preventDefault();
                  const currentIndex = filters.findIndex(
                    (item) => item.key === f.key,
                  );
                  const nextIndex =
                    event.key === "Home"
                      ? 0
                      : event.key === "End"
                        ? filters.length - 1
                        : (currentIndex +
                            (event.key === "ArrowRight" ? 1 : -1) +
                            filters.length) %
                          filters.length;
                  const nextFilter = filters[nextIndex];
                  selectFilter(nextFilter.key);
                  window.requestAnimationFrame(() => {
                    document
                      .getElementById(`work-tab-${nextFilter.key}`)
                      ?.focus();
                  });
                }}
                aria-selected={filter === f.key}
                aria-controls="work-category-panel"
                tabIndex={filter === f.key ? 0 : -1}
                className="px-5 py-2 rounded-full text-sm transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07070f]"
                style={{
                  background:
                    filter === f.key
                      ? "linear-gradient(135deg, rgba(30,144,255,0.18), rgba(138,43,226,0.18))"
                      : "rgba(255,255,255,0.03)",
                  border:
                    filter === f.key
                      ? "1px solid rgba(30,144,255,0.2)"
                      : "1px solid rgba(255,255,255,0.07)",
                  color: filter === f.key ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.38)",
                  fontFamily: "var(--font-body)",
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Content */}
        <div
          id="work-category-panel"
          role="tabpanel"
          aria-labelledby={`work-tab-${filter}`}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={filter}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -6 }}
              transition={{ duration: reduceMotion ? 0 : 0.22, ease: "easeOut" }}
            >
              {filter !== "brand" ? (
                <>
                  <div
                    id="project-grid"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                  >
                    {visibleProjects.map((project, i) => (
                      <Reveal key={project.id} delay={i * 55} className="h-full">
                        <ProjectCard project={project} />
                      </Reveal>
                    ))}
                  </div>

                  {canToggleProjects && (
                    <Reveal delay={120}>
                      <div className="flex justify-center mt-12">
                        <button
                          type="button"
                          onClick={() => setShowAllProjects((current) => !current)}
                          aria-expanded={showAllProjects}
                          aria-controls="project-grid"
                          className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-sm text-white/55 hover:text-white/90 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                          style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.09)",
                            fontFamily: "var(--font-body)",
                          }}
                        >
                          {showAllProjects ? "Show less" : "Show more"}
                          <ChevronDown
                            size={14}
                            aria-hidden="true"
                            className={`transition-transform duration-300 ${
                              showAllProjects ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      </div>
                    </Reveal>
                  )}
                </>
              ) : (
                <BrandSystemsSection />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

// ── Patricians ────────────────────────────────────────────────────────────────

function Patricians() {
  return (
    <section id="patricians" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div
            className="relative rounded-3xl overflow-hidden"
            style={{
              background:
                "linear-gradient(145deg, rgba(30,144,255,0.055) 0%, rgba(106,10,173,0.07) 100%), rgba(9,9,20,0.9)",
              border: "1px solid rgba(255,255,255,0.07)",
              boxShadow:
                "0 0 80px rgba(30,144,255,0.05), 0 32px 80px rgba(0,0,0,0.45)",
              backdropFilter: "blur(24px)",
              padding: "clamp(2.5rem,5vw,5rem)",
            }}
          >
            {/* Corner accent */}
            <div
              className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at top right, rgba(138,43,226,0.08) 0%, transparent 65%)",
              }}
            />

            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
              <div>
                <p
                  className="text-[10px] tracking-[0.35em] text-white/22 uppercase mb-8"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  04 — Patricians
                </p>
                <h2
                  className="font-bold text-white leading-[0.9] tracking-[-0.03em] mb-6"
                  style={{
                    fontSize: "clamp(2.2rem,4.5vw,4rem)",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  Co-founder of
                  <br />
                  <GradientText>Patricians.</GradientText>
                </h2>
                <p
                  className="text-white/42 text-lg leading-[1.75] mb-10 font-light"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  I co-founded Patricians, where I work directly across product strategy, design, development, and delivery for client-facing websites and digital products. The studio also explores AI assistants, agent workflows, and AI-native concepts as a future direction; I do not present those experiments as mature client deployments.
                </p>
                <a
                  href="https://patricians.pk"
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() =>
                    emitSceneReaction("patricians-hover", 1)
                  }
                  onFocus={() => emitSceneReaction("patricians-hover", 1)}
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-sm font-semibold text-white transition-all duration-300 hover:opacity-90 hover:scale-[1.03] active:scale-[0.97]"
                  style={{
                    background: "linear-gradient(135deg, #1E90FF, #6A0DAD)",
                    boxShadow: "0 0 36px rgba(30,144,255,0.18), 0 4px 16px rgba(0,0,0,0.3)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  Visit Patricians
                  <ArrowUpRight size={15} />
                </a>
              </div>

              {/* Logo card */}
              <div className="flex justify-center lg:justify-end">
                <a
                  href="https://patricians.pk"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit Patricians"
                  onMouseEnter={() =>
                    emitSceneReaction("patricians-hover", 1.15)
                  }
                  onFocus={() =>
                    emitSceneReaction("patricians-hover", 1.15)
                  }
                  className="w-52 h-52 rounded-2xl flex flex-col items-center justify-center"
                  style={{
                    background: "rgba(255,255,255,0.98)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <img
                    src="/assets/patricians-icon-transparent.png"
                    alt="Patricians"
                    width={1254}
                    height={1254}
                    className="w-36 h-36 object-contain"
                  />
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── Contact ───────────────────────────────────────────────────────────────────

function Resume() {
  return (
    <section id="resume" className="scroll-mt-24 px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div
            className="relative overflow-hidden rounded-[2rem] px-7 py-10 sm:px-12 sm:py-12 lg:px-16"
            style={{
              background:
                "linear-gradient(135deg, rgba(30,144,255,0.09), rgba(106,90,205,0.07) 55%, rgba(255,255,255,0.025))",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.24)",
            }}
          >
            <div
              className="pointer-events-none absolute -right-24 -top-32 h-72 w-72 rounded-full blur-3xl"
              style={{ background: "rgba(30,144,255,0.12)" }}
              aria-hidden="true"
            />

            <div className="relative flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex max-w-2xl flex-col items-start sm:flex-row sm:items-center sm:gap-7">
                <div
                  className="mb-6 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl sm:mb-0"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.09)",
                  }}
                >
                  <FileText size={26} className="text-white/70" aria-hidden="true" />
                </div>

                <div>
                  <p
                    className="mb-4 text-[10px] uppercase tracking-[0.35em] text-white/25"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    05 — Resume
                  </p>
                  <h2
                    className="mb-4 text-3xl font-bold tracking-[-0.03em] text-white sm:text-4xl"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    The full story, on one page.
                  </h2>
                  <p
                    className="max-w-xl text-sm font-light leading-[1.8] text-white/35 sm:text-base"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Explore my experience, capabilities, and the work behind the ideas.
                    Download a copy of my resume for a closer look.
                  </p>
                </div>
              </div>

              <a
                href="/Shayan-Batoaq-Resume.pdf"
                download="Shayan-Batoaq-Resume.pdf"
                className="inline-flex w-full shrink-0 items-center justify-center gap-2.5 rounded-full px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.03] hover:opacity-90 active:scale-[0.97] sm:w-auto"
                style={{
                  background: "linear-gradient(135deg, #1E90FF, #6A5ACD)",
                  boxShadow:
                    "0 0 28px rgba(30,144,255,0.2), 0 4px 16px rgba(0,0,0,0.3)",
                  fontFamily: "var(--font-body)",
                }}
                aria-label="Download Shayan Batoaq's resume as a PDF"
              >
                Download Resume
                <Download size={15} aria-hidden="true" />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div
          className="pt-20 border-t"
          style={{ borderColor: "rgba(255,255,255,0.04)" }}
        >
          <Reveal>
            <div className="text-center">
              <p
                className="text-[10px] tracking-[0.35em] text-white/20 uppercase mb-8"
                style={{ fontFamily: "var(--font-body)" }}
              >
                06 — Contact
              </p>
              <h2
                className="font-bold text-white leading-[0.9] tracking-[-0.03em] mb-6"
                style={{
                  fontSize: "clamp(2.5rem,5.5vw,5rem)",
                  fontFamily: "var(--font-display)",
                }}
              >
                Let's build something
                <br />
                <GradientText>meaningful.</GradientText>
              </h2>
              <p
                className="text-white/30 text-lg font-light mb-14 max-w-sm mx-auto leading-[1.7]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                I am open to projects, partnerships, and conversations that matter.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href={`mailto:${contact.email}`}
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full text-sm font-semibold text-white transition-all duration-300 hover:opacity-90 hover:scale-[1.03] active:scale-[0.97]"
                  style={{
                    background: "linear-gradient(135deg, #1E90FF, #6A5ACD)",
                    boxShadow: "0 0 28px rgba(30,144,255,0.2), 0 4px 16px rgba(0,0,0,0.3)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  Email
                  <ArrowUpRight size={14} />
                </a>
                <a
                  href={contact.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.09)",
                    color: "rgba(255,255,255,0.5)",
                    fontFamily: "var(--font-body)",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.9)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)")
                  }
                >
                  LinkedIn
                  <ArrowUpRight size={14} />
                </a>
                <a
                  href={contact.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.09)",
                    color: "rgba(255,255,255,0.5)",
                    fontFamily: "var(--font-body)",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.9)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)")
                  }
                >
                  Instagram
                  <ArrowUpRight size={14} />
                </a>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Footer */}
        <div
          className="mt-24 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
        >
          <p
            className="text-[10px] text-white/14 tracking-[0.3em] uppercase"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Shayan — {new Date().getFullYear()}
          </p>
          <p
            className="text-[10px] text-white/14"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Designed and built with intention.
          </p>
        </div>
      </div>
    </section>
  );
}

// ── Ask Shayan modal ──────────────────────────────────────────────────────────

function AskModal({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>(() =>
    getPersistedConversationMessages(),
  );
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<AbortController | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    return () => requestRef.current?.abort();
  }, []);

  useEffect(() => initializeConversationLogging(), []);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || typing) return;
      emitSceneReaction("message-submit", 1);
      const prepared = prepareConversationMessage(text);
      const nextMessages = prepared.messages;

      setMessages(nextMessages);
      setInput("");
      setTyping(true);

      const controller = new AbortController();
      requestRef.current = controller;

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            messages: prepared.requestMessages,
            sessionId: prepared.sessionId,
            exchangeId: prepared.exchangeId,
            startedAt: prepared.startedAt,
          }),
        });
        const payload: unknown = await response.json().catch(() => null);
        const reply =
          payload &&
          typeof payload === "object" &&
          "message" in payload &&
          typeof payload.message === "string"
            ? payload.message.trim()
            : null;
        const logging =
          payload &&
          typeof payload === "object" &&
          "logging" in payload &&
          isChatLoggingMetadata(payload.logging)
            ? payload.logging
            : null;

        if (!response.ok) {
          setMessages((current) => [
            ...current,
            {
              role: "ai",
              text:
                response.status === 429
                  ? CHAT_RATE_LIMIT_MESSAGE
                  : CHAT_UNAVAILABLE_MESSAGE,
            },
          ]);
          return;
        }

        if (!reply || !logging) {
          throw new Error("Chat request failed");
        }

        setMessages((current) => [
          ...current,
          { role: "ai", text: reply },
        ]);
        recordSuccessfulConversation(prepared, reply, logging);
        if (reply.length > 280) {
          emitSceneReaction("chat-reading", 1);
        }
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;

        setMessages((current) => [
          ...current,
          { role: "ai", text: CHAT_UNAVAILABLE_MESSAGE },
        ]);
      } finally {
        if (requestRef.current === controller) requestRef.current = null;
        setTyping(false);
      }
    },
    [typing],
  );

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col"
      style={{
        background: "rgba(5,5,14,0.9)",
        backdropFilter: "blur(18px)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 sm:px-10 py-5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div>
          <h2
            className="text-2xl sm:text-[28px] font-semibold leading-none text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Ask Me
          </h2>
          <p
            className="mt-2 text-[10px] sm:text-[11px] tracking-[0.22em] text-white/38 uppercase"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Chat with Shayan&apos;s AI counterpart
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.09)",
            color: "rgba(255,255,255,0.4)",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.85)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)")
          }
          aria-label="Close"
        >
          <X size={15} />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-6 sm:px-10 py-8">
        <div className="max-w-2xl mx-auto">
          {messages.length === 0 ? (
            <div>
              <div className="text-center pt-10 pb-12">
                <div
                  className="w-14 h-14 rounded-2xl border border-white/8 flex items-center justify-center mx-auto mb-7"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(30,144,255,0.14), rgba(138,43,226,0.14))",
                  }}
                >
                  <Sparkles size={20} className="text-white/40" />
                </div>
                <h3
                  className="text-xl font-semibold text-white/80 mb-3"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Hello. Ask me anything about my work.
                </h3>
                <p
                  className="text-sm text-white/30 max-w-xs mx-auto leading-[1.7]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Ask about my work, background, philosophy, or how to get in touch.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="p-5 text-left rounded-2xl group transition-all duration-300"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.borderColor =
                        "rgba(255,255,255,0.12)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.borderColor =
                        "rgba(255,255,255,0.06)")
                    }
                  >
                    <span
                      className="block text-sm text-white/52 group-hover:text-white/80 transition-colors duration-200 mb-1.5"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {q}
                    </span>
                    <span
                      className="text-[10px] text-white/18 group-hover:text-white/30 transition-colors"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      Tap to ask →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-5 pb-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} items-end gap-2.5`}
                >
                  {msg.role === "ai" && (
                    <div
                      className="w-6 h-6 rounded-lg border border-white/8 flex items-center justify-center flex-shrink-0 mb-0.5"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(30,144,255,0.18), rgba(138,43,226,0.18))",
                      }}
                    >
                      <Sparkles size={10} className="text-white/45" />
                    </div>
                  )}
                  <div
                    className="max-w-[78%] px-5 py-3.5 rounded-2xl text-sm leading-[1.7]"
                    style={{
                      background:
                        msg.role === "user"
                          ? "linear-gradient(135deg, rgba(30,144,255,0.18), rgba(79,123,255,0.18))"
                          : "rgba(255,255,255,0.04)",
                      border:
                        msg.role === "user"
                          ? "1px solid rgba(30,144,255,0.18)"
                          : "1px solid rgba(255,255,255,0.06)",
                      color:
                        msg.role === "user"
                          ? "rgba(255,255,255,0.85)"
                          : "rgba(255,255,255,0.58)",
                      borderRadius:
                        msg.role === "user"
                          ? "1rem 1rem 0.25rem 1rem"
                          : "1rem 1rem 1rem 0.25rem",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {msg.role === "ai" ? (
                      <ChatMessageText text={msg.text} />
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              ))}

              {typing && (
                <div className="flex justify-start items-end gap-2.5">
                  <div
                    className="w-6 h-6 rounded-lg border border-white/8 flex items-center justify-center flex-shrink-0"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(30,144,255,0.18), rgba(138,43,226,0.18))",
                    }}
                  >
                    <Sparkles size={10} className="text-white/45" />
                  </div>
                  <div
                    className="px-5 py-4 rounded-2xl"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: "1rem 1rem 1rem 0.25rem",
                    }}
                  >
                    <div className="flex gap-1.5 items-center">
                      {[0, 1, 2].map((j) => (
                        <div
                          key={j}
                          className="w-1.5 h-1.5 rounded-full bg-white/28 animate-pulse"
                          style={{ animationDelay: `${j * 160}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div
        className="px-6 sm:px-10 py-5"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="max-w-2xl mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="flex gap-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 px-5 py-3.5 rounded-xl text-sm transition-colors duration-200 focus:outline-none"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.75)",
                fontFamily: "var(--font-body)",
              }}
              onFocus={(e) =>
                ((e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(30,144,255,0.3)")
              }
              onBlur={(e) =>
                ((e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(255,255,255,0.08)")
              }
            />
            <button
              type="submit"
              disabled={!input.trim() || typing}
              className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 disabled:opacity-25"
              style={{
                background: "linear-gradient(135deg, #1E90FF, #6A5ACD)",
              }}
            >
              <Send size={15} className="text-white" />
            </button>
          </form>
          <p
            className="text-[10px] text-white/14 text-center mt-3"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Responses use approved portfolio information. For direct enquiries, reach out by email.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Floating Ask button ───────────────────────────────────────────────────────

function AskButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-6 sm:right-8 z-40 flex items-center gap-2.5 px-5 py-3.5 rounded-full text-sm font-semibold text-white transition-all duration-300 hover:scale-105 active:scale-95"
      style={{
        background:
          "linear-gradient(135deg, rgba(30,144,255,0.88), rgba(106,10,173,0.88))",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow: "0 8px 36px rgba(30,144,255,0.22), 0 4px 14px rgba(0,0,0,0.45)",
        fontFamily: "var(--font-body)",
      }}
    >
      <Sparkles size={14} />
      Ask Me
    </button>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [askOpen, setAskOpen] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = askOpen ? "hidden" : "";
    if (askOpen) emitSceneReaction("chat-open", 1);
    return () => {
      document.body.style.overflow = "";
    };
  }, [askOpen]);

  return (
    <div
      className="relative isolate min-h-screen w-full"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      <BackgroundScene chatOpen={askOpen} />
      <div className="relative z-10">
        <PortfolioNav />
        <Hero onAskClick={() => setAskOpen(true)} />
        <About />
        <Philosophy />
        <Work />
        <Patricians />
        <Resume />
        <Contact />
      </div>

      <AskButton onClick={() => setAskOpen(true)} />
      {askOpen && <AskModal onClose={() => setAskOpen(false)} />}
    </div>
  );
}
