"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { X, ArrowUpRight, Send, ChevronDown, Sparkles, ExternalLink, Gauge, Dumbbell, BrainCircuit, PenTool } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

type WorkFilter = "all" | "web" | "ai" | "growth";

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
  tags: string[];
  hue: string;
  image: string;
  imageAlt: string;
}

// ── Data ──────────────────────────────────────────────────────────────────────

const WEB_PROJECTS: Project[] = [
  {
    id: "corporate-lens",
    title: "The Corporate Lens",
    description:
      "I built a media platform that redefines corporate storytelling through precision editorial design and investigative content.",
    category: "web",
    url: "https://thecorporatelens.com",
    tags: ["Editorial", "CMS", "Next.js"],
    hue: "210",
    image: "/assets/projects/project-editorial.jpg",
    imageAlt: "Editorial newspaper on a desk",
  },
  {
    id: "euphoric",
    title: "Euphoric",
    description:
      "I built a premium lifestyle brand experience for the Pakistani market: bold, expressive, and culturally resonant.",
    category: "web",
    url: "https://euphoric.pk",
    tags: ["E-Commerce", "Shopify", "Brand"],
    hue: "270",
    image: "/assets/projects/project-lifestyle.jpg",
    imageAlt: "Colourful fashion rail",
  },
  {
    id: "betterlife-studio",
    title: "Better Life Sound Studio",
    description:
      "I created a booking and portfolio platform that connects artists with world-class recording facilities.",
    category: "web",
    url: "https://betterlife.soundstudio.pk",
    tags: ["Booking", "React", "Audio"],
    hue: "190",
    image: "/assets/projects/project-audio.jpg",
    imageAlt: "Recording studio equipment",
  },
  {
    id: "sound-studio",
    title: "Sound Studio PK",
    description:
      "I built the flagship platform for Pakistan's professional recording and production ecosystem.",
    category: "web",
    url: "https://soundstudio.pk",
    tags: ["Platform", "Full Stack", "UX"],
    hue: "160",
    image: "/assets/projects/project-audio.jpg",
    imageAlt: "Recording studio equipment",
  },
  {
    id: "gwhs",
    title: "GWHS",
    description:
      "I created a service-oriented web presence with streamlined UX designed for accessibility and trust.",
    category: "web",
    url: "https://gwhs.pk",
    tags: ["Services", "WordPress", "SEO"],
    hue: "35",
    image: "/assets/projects/project-services.jpg",
    imageAlt: "Modern interior detail",
  },
  {
    id: "homecure",
    title: "HomeCure",
    description:
      "I built a healthcare-at-home platform that connects patients with certified medical professionals across Pakistan.",
    category: "web",
    url: "https://homecure.com.pk",
    tags: ["HealthTech", "React", "Node.js"],
    hue: "340",
    image: "/assets/projects/project-healthcare.jpg",
    imageAlt: "Healthcare consultation",
  },
  {
    id: "clearvoicehub",
    title: "ClearVoice Hub",
    description:
      "I built a communication and customer engagement platform for clarity, speed, and scale.",
    category: "web",
    url: "https://clearvoicehub.com",
    tags: ["SaaS", "Communication", "TypeScript"],
    hue: "200",
    image: "/assets/projects/project-network.jpg",
    imageAlt: "Connected digital network",
  },
  {
    id: "bait-us-salam",
    title: "Bait us Salam",
    description:
      "I created a community-first platform celebrating Islamic values and culture through thoughtful digital design.",
    category: "web",
    url: "https://bait-us-salam.vercel.app",
    tags: ["Community", "Next.js", "i18n"],
    hue: "140",
    image: "/assets/projects/project-community.jpg",
    imageAlt: "Mosque skyline at sunset",
  },
  {
    id: "car-connect",
    title: "Car Connect",
    description:
      "I built an automotive marketplace that brings buyers and sellers together through a refined, trust-first experience.",
    category: "web",
    url: "https://car-connect-rosy.vercel.app",
    tags: ["Marketplace", "React", "Automotive"],
    hue: "220",
    image: "/assets/projects/project-automotive.jpg",
    imageAlt: "Automotive detail on the road",
  },
];

const AI_PROJECTS: Project[] = [
  {
    id: "ai-assistant",
    title: "Intelligent AI Assistant",
    description:
      "I built a conversational AI system trained on domain-specific knowledge, capable of nuanced reasoning and contextual awareness across complex workflows.",
    category: "ai",
    tags: ["LLM", "RAG", "Agent"],
    hue: "265",
    image: "/assets/projects/story-ai.jpg",
    imageAlt: "Artificial intelligence circuitry",
  },
  {
    id: "agentic-workflow",
    title: "Agentic Workflow Engine",
    description:
      "I designed a multi-agent orchestration system for complex, multi-step task automation with human-in-the-loop checkpoints.",
    category: "ai",
    tags: ["LangChain", "Orchestration", "Automation"],
    hue: "230",
    image: "/assets/projects/project-network.jpg",
    imageAlt: "Networked digital systems",
  },
  {
    id: "mcp-system",
    title: "MCP Integration System",
    description:
      "I built Model Context Protocol infrastructure that enables seamless AI-to-tool communication across distributed systems.",
    category: "ai",
    tags: ["MCP", "API", "Integration"],
    hue: "290",
    image: "/assets/projects/story-development.jpg",
    imageAlt: "Development workspace",
  },
];

const GROWTH_BRANDS = [
  "The Corporate Lens",
  "Euphoric",
  "Sound Studio",
  "HomeCure",
  "ClearVoice Hub",
  "Car Connect",
  "GWHS",
];

const SUGGESTED_QUESTIONS = [
  "What kind of work do you do?",
  "Tell me about Patricians.",
  "What technologies do you specialize in?",
  "How can we work together?",
];

const CHAT_UNAVAILABLE_MESSAGE =
  "I could not respond just now. Please try again in a moment.";
const CHAT_RATE_LIMIT_MESSAGE =
  "Too many requests were sent in a short period. Please wait briefly and try again.";

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
            <img
              src="/assets/shayan-batoaq-logo.png"
              alt="Shayan Batoaq"
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
            I am a full stack developer and AI engineer creating intelligent digital experiences inspired by precision, curiosity, and thoughtful design.
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
    body: "From database architecture to pixel-perfect interfaces, I work across the entire stack. I architect systems that are not just functional, but elegant, scalable, and built to endure. Every layer matters. Every decision compounds.",
    gradFrom: "rgba(30,144,255,0.12)",
    gradTo: "rgba(79,123,255,0.06)",
    reverse: false,
    image: "/assets/projects/story-development.jpg",
    imageAlt: "Laptop with a code editor at a development workspace",
    imageContain: false,
  },
  {
    label: "Agentic AI Engineering",
    heading: "Teaching machines to reason, not just respond.",
    body: "I design agentic systems where AI does not just answer questions: it orchestrates complex workflows, reasons through ambiguity, and takes meaningful action. This is the frontier I have chosen to work in, and I approach it with deep conviction.",
    gradFrom: "rgba(106,90,205,0.12)",
    gradTo: "rgba(138,43,226,0.06)",
    reverse: true,
    image: "/assets/projects/story-ai.jpg",
    imageAlt: "Close-up of artificial intelligence circuitry",
    imageContain: false,
  },
  {
    label: "Digital Growth",
    heading: "Strategy that compounds over time.",
    body: "Growth is not about tactics: it is about understanding why people care. I approach digital growth with the same rigor as engineering: data-driven, systematically tested, and always in service of a brand's long-term story rather than vanity metrics.",
    gradFrom: "rgba(106,10,173,0.12)",
    gradTo: "rgba(138,43,226,0.06)",
    reverse: false,
    image: "/assets/projects/story-growth.jpg",
    imageAlt: "Digital analytics on a laptop screen",
    imageContain: false,
  },
  {
    label: "Co-founder · Patricians",
    heading: "Building the company I always wanted to work for.",
    body: "Patricians is the venture where ambition meets craft. As co-founder, I shape not just its products but its culture: one that values excellence, intellectual honesty, and building things genuinely worth building. I make no compromises on any of those.",
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
            I am a full stack developer and AI engineer who believes the best software feels inevitable, as though it could not have been built any other way. I bring that conviction to every line of code, every product decision, and every collaboration.
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
    body: "Motorsport is one of my clearest mental models for precision. Across F1, WEC, and IMSA, success comes from obsessive systems thinking: every component optimized, every process refined, every millisecond accountable. That is how I approach engineering, with the understanding that excellence is never accidental. It is the accumulation of thousands of small, correct decisions made deliberately and under pressure.",
    gradFrom: "rgba(30,144,255,0.08)",
    gradTo: "rgba(79,123,255,0.04)",
    borderColor: "rgba(30,144,255,0.14)",
  },
  {
    number: "II",
    icon: <Dumbbell size={20} strokeWidth={1.5} />,
    title: "Discipline",
    subtitle: "MMA taught me patience.",
    body: "There are no shortcuts in the cage. I earn every position, I lose it, and I earn it again. MMA rewired how I understand consistency: talent without discipline is noise, and the most sophisticated techniques are only available after doing the fundamentals ten thousand times. That mindset walks into every project I take on.",
    gradFrom: "rgba(106,90,205,0.08)",
    gradTo: "rgba(138,43,226,0.04)",
    borderColor: "rgba(106,90,205,0.14)",
  },
  {
    number: "III",
    icon: <BrainCircuit size={20} strokeWidth={1.5} />,
    title: "Curiosity",
    subtitle: "AI is the most interesting problem of our time.",
    body: "When foundation models arrived, I did not wait to see where the dust settled: I went in. AI reshapes what is possible in software and, more importantly, which questions are worth asking. Staying curious is not a personality trait for me; it is a professional obligation when the landscape changes this fast.",
    gradFrom: "rgba(106,10,173,0.08)",
    gradTo: "rgba(138,43,226,0.04)",
    borderColor: "rgba(106,10,173,0.14)",
  },
  {
    number: "IV",
    icon: <PenTool size={20} strokeWidth={1.5} />,
    title: "Creation",
    subtitle: "Software is just the medium.",
    body: "Code is the material, not the point. The point is the person who uses what I build: what they feel when an interface responds exactly as they hoped, when a product makes life a little clearer, faster, and better. I do not build software just to write functions. I build experiences people genuinely enjoy returning to.",
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

function ProjectCard({ project }: { project: Project }) {
  return (
    <div
      className="group relative rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1.5"
      style={{
        background: "rgba(9,9,19,0.75)",
        border: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(16px)",
        boxShadow: "0 4px 28px rgba(0,0,0,0.35)",
      }}
    >
      {/* Screenshot area */}
      <div
        className="aspect-[16/9] relative border-b border-white/[0.04] flex items-center justify-center overflow-hidden"
        style={{
          background: `radial-gradient(ellipse at 40% 40%, hsla(${project.hue}, 70%, 45%, 0.13) 0%, transparent 65%), rgba(10,10,22,0.9)`,
        }}
      >
        <img
          src={project.image}
          alt={project.imageAlt}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-[1.04]"
          style={{ filter: "saturate(0.75) contrast(1.08)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(5,5,14,0.28), rgba(5,5,14,0.6))",
          }}
        />
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />
        {project.url ? (
          <div className="text-center z-10">
            <div
              className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center mx-auto mb-2.5"
              style={{ background: `hsla(${project.hue}, 60%, 40%, 0.15)` }}
            >
              <ExternalLink size={13} className="text-white/30" />
            </div>
            <span
              className="text-white/18 text-[10px]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {project.url.replace(/^https?:\/\//, "")}
            </span>
          </div>
        ) : (
          <span
            className="text-white/10 text-[10px] tracking-[0.3em] uppercase z-10"
            style={{ fontFamily: "var(--font-body)" }}
          >
            AI Project
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
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
          className="text-sm text-white/38 leading-[1.7] mb-5"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {project.description}
        </p>
        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[11px] text-white/28 hover:text-white/65 transition-colors duration-200 group/lnk"
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

// ── Digital Growth ────────────────────────────────────────────────────────────

function DigitalGrowth() {
  const services = [
    { label: "Brand Strategy", desc: "I build identity systems designed to compound." },
    { label: "SEO", desc: "I create content that earns authority, not just traffic." },
    { label: "Performance", desc: "I focus on speed and conversion metrics that actually matter." },
    { label: "Analytics", desc: "I interpret data as narrative, not noise." },
    { label: "Social Campaigns", desc: "I create stories worth sharing and campaigns worth running." },
    { label: "Creative Direction", desc: "I shape visual language that speaks before words do." },
  ];

  return (
    <div className="space-y-10">
      <Reveal>
        <p
          className="text-lg text-white/38 font-light max-w-2xl leading-[1.8]"
          style={{ fontFamily: "var(--font-body)" }}
        >
          I treat digital growth as a practice, not a service offering. I start by understanding what a brand stands for, then engineer the conditions for it to be discovered, recognized, and remembered.
        </p>
      </Reveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((s, i) => (
          <Reveal key={s.label} delay={i * 55}>
            <div
              className="p-6 rounded-2xl border border-white/[0.055] hover:border-white/10 transition-all duration-300"
              style={{ background: "rgba(9,9,19,0.7)" }}
            >
              <p
                className="text-[10px] tracking-[0.28em] text-white/25 uppercase mb-2.5"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {s.label}
              </p>
              <p
                className="text-white/55 text-sm leading-[1.65]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {s.desc}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={100}>
        <div>
          <p
            className="text-[10px] tracking-[0.3em] text-white/20 uppercase mb-5"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Brands I've Grown
          </p>
          <div className="flex flex-wrap gap-3">
            {GROWTH_BRANDS.map((brand) => (
              <span
                key={brand}
                className="px-4 py-2 rounded-full text-sm text-white/45 hover:text-white/75 hover:border-white/15 transition-all duration-300 cursor-default"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  fontFamily: "var(--font-body)",
                }}
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}

// ── Work ──────────────────────────────────────────────────────────────────────

function Work() {
  const [filter, setFilter] = useState<WorkFilter>("all");

  const filters: { key: WorkFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "web", label: "Web Engineering" },
    { key: "ai", label: "AI Systems" },
    { key: "growth", label: "Digital Growth" },
  ];

  const visibleProjects =
    filter === "all"
      ? [...WEB_PROJECTS, ...AI_PROJECTS]
      : filter === "web"
      ? WEB_PROJECTS
      : filter === "ai"
      ? AI_PROJECTS
      : [];

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
          <div className="flex flex-wrap gap-2.5 mb-14">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className="px-5 py-2 rounded-full text-sm transition-all duration-300"
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
        {filter !== "growth" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {visibleProjects.map((project, i) => (
              <Reveal key={project.id} delay={i * 55}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        ) : (
          <DigitalGrowth />
        )}
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
                  I co-founded Patricians, a design and technology studio built on the belief that quality is not a feature: it is a commitment. I shape not just its products, but the standards by which they are made. Every client. Every deliverable. No compromises.
                </p>
                <a
                  href="https://patricians.pk"
                  target="_blank"
                  rel="noopener noreferrer"
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
                05 — Contact
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
                  href="mailto:shayaanbatoaq@gmail.com"
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
                  href="https://www.linkedin.com/in/shayan-batoaq-379a42246"
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
                  href="https://www.instagram.com/shayanbatoaq/"
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
  const [messages, setMessages] = useState<Message[]>([]);
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

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || typing) return;
      const nextMessages = [
        ...messages,
        { role: "user" as const, text: text.trim() },
      ];

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
            messages: nextMessages.map((message) => ({
              role: message.role === "ai" ? "assistant" : "user",
              content: message.text,
            })),
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

        if (!reply) {
          throw new Error("Chat request failed");
        }

        setMessages((current) => [
          ...current,
          { role: "ai", text: reply },
        ]);
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
    [messages, typing]
  );

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col"
      style={{
        background: "rgba(5,5,14,0.97)",
        backdropFilter: "blur(24px)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 sm:px-10 py-5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div>
          <p
            className="text-[9px] tracking-[0.35em] text-white/22 uppercase mb-0.5"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Ask Me
          </p>
          <h2
            className="text-white/70 text-base font-semibold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Powered by my perspective
          </h2>
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
                    {msg.text}
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
            Responses reflect my perspective. For direct enquiries, reach out by email.
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
    return () => {
      document.body.style.overflow = "";
    };
  }, [askOpen]);

  return (
    <div
      className="min-h-screen w-full"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      <Nav />
      <Hero onAskClick={() => setAskOpen(true)} />
      <About />
      <Philosophy />
      <Work />
      <Patricians />
      <Contact />

      <AskButton onClick={() => setAskOpen(true)} />
      {askOpen && <AskModal onClose={() => setAskOpen(false)} />}
    </div>
  );
}
