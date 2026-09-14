export const lapsignal = {
  id: "lapsignal",
  title: "LapSignal",
  category: "ai" as const,
  categoryLabel: "AI Systems",
  type: "Sim Racing Telemetry & Coaching System",
  status: "Alpha Prototype",
  role: "Full-Stack & AI Engineering",
  description:
    "A local-first digital race engineer for sim racers, combining live telemetry, deterministic analysis, and evidence-backed coaching.",
  href: "/work/ai/lapsignal",
  demoUrl: "https://lapsignal.vercel.app/",
  cta: "View project",
  tags: ["Next.js", "TypeScript", "Python", "FastAPI", "WebSockets", "OpenRouter"],
  disciplines: ["AI Systems", "Full-Stack Engineering", "Motorsport", "Telemetry"],
  hue: "350",
  accent: "#fb7185",
  accentRgb: "251, 113, 133",
  image: "/assets/projects/lapsignal/logo-light.png",
  imageAlt: "LapSignal logo on a light background",
  imageFit: "contain" as const,
  imageBackground: "#ffffff",
  // Lift the supplied light logo's cream backdrop to the card's white surface.
  imageFilter: "brightness(1.15)",
  stack: [
    "Next.js", "React", "TypeScript", "Tailwind CSS", "Python", "FastAPI",
    "Node.js", "SQLAlchemy", "SQLite", "Zod", "Pydantic", "WebSockets",
    "UDP Telemetry", "Parquet", "OpenRouter", "pnpm",
  ],
  stages: [
    { label: "Capture", detail: "Windows UDP collector · normalized telemetry · local storage" },
    { label: "Measure", detail: "Deterministic analytics · evidence-backed findings" },
    { label: "Explain", detail: "Rule-based or optional AI coaching · Next.js interface" },
  ],
  features: [
    "Live F1 2021 telemetry ingestion",
    "Deterministic performance analytics",
    "Evidence-backed coaching",
    "Real-time circuit visualization",
    "Session comparison",
    "Optional AI coaching",
    "Local-first data architecture",
    "Progress tracking",
  ],
  sections: [
    {
      label: "Overview",
      text: "LapSignal is a local-first telemetry analysis platform for sim racers. It captures F1 2021 driving data, measures pace, braking, throttle, steering, stint behavior, and consistency, then turns those patterns into evidence-backed coaching. Every coaching claim should have a signal behind it.",
    },
    {
      label: "Problem",
      text: "Sim-racing telemetry tools often overwhelm drivers with raw data or make vague coaching claims without showing the evidence behind them. LapSignal connects measured performance to a clear next action.",
    },
    {
      label: "Approach",
      text: "Measurement comes before explanation. Telemetry is normalized, validated, stored locally, and analyzed deterministically before any coaching layer explains the findings. Pace, braking, throttle, steering, stint degradation, consistency, and theoretical best laps are calculated by the system.",
    },
    {
      label: "Engineering",
      text: "F1 2021 telemetry enters through a native Windows UDP collector or replay, is normalized into a game-independent contract, and reaches a FastAPI backend. Zod and Pydantic validate both sides of the boundary. High-frequency telemetry is stored separately from relational metadata, and bounded, downsampled WebSocket updates feed the Next.js interface. Missing telemetry returns null rather than fabricated estimates.",
    },
    {
      label: "AI",
      text: "AI is an optional explanation and prioritization layer, not the source of truth. It receives a compact bundle of verified metrics, findings, and evidence IDs; it does not analyze raw telemetry or calculate performance. Output that introduces unsupported measurements is rejected. Rule-based coaching remains available without an API key.",
    },
    {
      label: "Privacy",
      text: "Local-first by default: raw telemetry stays on the driver's machine and no cloud account is required. Optional hosted AI through OpenRouter receives compact deterministic summaries rather than raw high-frequency telemetry.",
    },
    {
      label: "Outcome",
      text: "An alpha prototype that brings recording and replay, session analysis, comparison, coaching, and progress tracking into an engineering-focused sim-racing workspace. LapSignal grew from my interest in applying software, data, and AI to motorsport-style performance analysis.",
    },
  ],
  screenshots: [
    {
      src: "/assets/projects/lapsignal/live-session.png",
      width: 1265,
      height: 1342,
      alt: "LapSignal live-session web preview with circuit map, speed, throttle, brake, and steering values",
      caption: "Circuit visualization and recorded session playback",
    },
    {
      src: "/assets/projects/lapsignal/compare.png",
      width: 1265,
      height: 1723,
      alt: "LapSignal comparison workspace with distance-aligned speed, throttle, brake, and steering traces",
      caption: "Distance-aligned telemetry comparison",
    },
  ],
  demoNote: "The public web demo is a read-only product preview with representative telemetry. It does not capture live F1 UDP data from your machine or connect to a physical collector, backend, database, or AI model. Live collection requires the local application.",
};
