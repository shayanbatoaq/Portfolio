export type BrandPlatform = "Instagram" | "Facebook" | "Meta Ads" | "Other";

export type BrandAssetFormat =
  | "Post"
  | "Carousel"
  | "Ad"
  | "Cover"
  | "Profile"
  | "Campaign";

export type BrandAssetAspect = "portrait" | "square" | "landscape" | "wide";

export type BrandSection = {
  title: string;
  description: string;
  items: string[];
};

export type BrandAsset = {
  src: string;
  alt: string;
  platform: BrandPlatform;
  format: BrandAssetFormat;
  aspect: BrandAssetAspect;
  caption: string;
  available: boolean;
};

export type BrandCampaign = {
  title: string;
  objective: string;
  audience: string;
  platforms: BrandPlatform[];
  languages: string[];
  creativeDirection: string;
  format: string;
  notes: string;
  metricsPublished: false;
};

export type BrandReflection = {
  role: string;
  requirement: string;
  strategy: string;
  constraints: string;
  learning: string;
};

export type BrandLogo = {
  src: string;
  alt: string;
  available: boolean;
};

export type BrandSystemProject = {
  slug: string;
  name: string;
  logo: BrandLogo;
  industry: string;
  summary: string;
  positioning: string;
  capabilities: string[];
  platforms: BrandPlatform[];
  visualDirection: string[];
  sections: {
    identity: BrandSection;
    content: BrandSection;
  };
  gallery: BrandAsset[];
  campaigns?: BrandCampaign[];
  reflection: BrandReflection;
  websiteUrl?: string;
  socialLinks: {
    instagram: string;
    facebook: string;
  };
};

const asset = (
  client: string,
  filename: string,
  alt: string,
  platform: BrandPlatform,
  format: BrandAssetFormat,
  aspect: BrandAssetAspect,
  caption: string,
  available = false,
): BrandAsset => ({
  src: `/work/brand-systems/${client}/${filename}`,
  alt,
  platform,
  format,
  aspect,
  caption,
  available,
});

export const BRAND_SYSTEMS: BrandSystemProject[] = [
  {
    slug: "euphoric",
    name: "Euphoric",
    logo: {
      src: "/work/brand-systems/euphoric/logo.jpg",
      alt: "Euphoric monogram logo",
      available: true,
    },
    industry: "Fragrance / E-commerce",
    summary:
      "A luxury-inspired fragrance brand with separate visual and content systems for Instagram and Facebook.",
    positioning: "Two platforms, one brand, distinct content systems.",
    capabilities: [
      "Instagram branding",
      "Instagram content design",
      "Facebook branding",
      "Facebook content design",
      "Platform-specific direction",
      "Product storytelling",
      "Visual consistency",
    ],
    platforms: ["Instagram", "Facebook"],
    visualDirection: ["Black", "Silver", "Luxury-led", "Product-focused"],
    sections: {
      identity: {
        title: "A premium identity with room for platform nuance",
        description:
          "The system positions perfume impressions with a luxury-inspired visual language while keeping the core message consistent.",
        items: [
          "Luxury fragrance positioning",
          "Black and silver visual direction",
          "Premium product presentation",
          "Consistent perfume-impression messaging",
        ],
      },
      content: {
        title: "Distinct directions for Instagram and Facebook",
        description:
          "Each platform receives its own presentation and content approach rather than a duplicated feed.",
        items: [
          "Instagram-specific visual system",
          "Facebook-specific visual system",
          "Product-focused posts",
          "Fragrance-note storytelling",
        ],
      },
    },
    gallery: [
      asset("euphoric", "instagram-01.jpg", "Euphoric Instagram creative about luxury-inspired fragrances", "Instagram", "Post", "square", "Luxury-inspired fragrance positioning", true),
      asset("euphoric", "facebook-01.jpg", "Euphoric Facebook creative about accessible luxury scents", "Facebook", "Post", "square", "Luxury scents made accessible", true),
      asset("euphoric", "logo.jpg", "Euphoric social profile monogram", "Facebook", "Profile", "square", "Social profile identity", true),
      asset("euphoric", "cover.png", "Euphoric Facebook cover featuring three fragrance bottles", "Facebook", "Cover", "wide", "Where scent meets precision", true),
    ],
    reflection: {
      role: "I developed the platform-specific brand and content direction across Instagram and Facebook.",
      requirement: "The brand needed a premium, recognizable presentation without making both social channels feel identical.",
      strategy: "I kept the positioning and product story consistent, then adapted pacing, hierarchy, and content treatment for each platform.",
      constraints: "The system had to retain a restrained luxury tone while still making individual fragrances easy to understand.",
      learning: "I refined the system around a simple principle: consistency belongs at the brand level, not in duplicating every execution.",
    },
    websiteUrl: "https://euphoric.pk",
    socialLinks: {
      instagram: "https://www.instagram.com/euphoricpak/",
      facebook: "https://www.facebook.com/profile.php?id=61560426114088",
    },
  },
  {
    slug: "home-cure",
    name: "Home Cure",
    logo: {
      src: "/work/brand-systems/home-cure/logo.jpg",
      alt: "Home Cure logo",
      available: true,
    },
    industry: "Healthcare / Home Sample Collection",
    summary:
      "A patient-focused healthcare presence designed for clarity, trust, and consistent communication across Instagram and Facebook.",
    positioning: "Clear healthcare communication, delivered with consistency and care.",
    capabilities: [
      "Instagram branding",
      "Facebook branding",
      "Ongoing social content",
      "Healthcare communication",
      "Service education",
      "Visual consistency",
    ],
    platforms: ["Instagram", "Facebook"],
    visualDirection: ["Clean", "Trust-oriented", "Accessible", "Service-led"],
    sections: {
      identity: {
        title: "A clear, trust-oriented healthcare presence",
        description:
          "The identity prioritizes reassurance and service clarity so essential information remains approachable.",
        items: [
          "Clean healthcare branding",
          "Trust-oriented visual language",
          "Service clarity",
          "Accessible messaging",
        ],
      },
      content: {
        title: "Consistent guidance across the patient journey",
        description:
          "The content system explains home sample collection and related services in a direct, patient-focused way.",
        items: [
          "Home sample collection",
          "Healthcare service education",
          "Patient guidance",
          "Consistent social posting",
        ],
      },
    },
    gallery: [
      asset("home-cure", "facebook-01.jpg", "Home Cure sample collection journey explainer", "Facebook", "Post", "square", "What happens after sample collection", true),
      asset("home-cure", "facebook-02.jpg", "Home Cure safe sample transport explainer", "Facebook", "Post", "square", "From home to lab: a safe journey", true),
      asset("home-cure", "logo.jpg", "Home Cure social profile logo", "Facebook", "Profile", "square", "Consistent healthcare identity", true),
      asset("home-cure", "cover.png", "Home Cure home nursing care cover creative", "Facebook", "Cover", "landscape", "Care delivered at the patient's doorstep", true),
    ],
    reflection: {
      role: "I created the social identity and ongoing educational content for Instagram and Facebook.",
      requirement: "Home Cure needed a professional digital presence that could explain healthcare services without adding friction or uncertainty.",
      strategy: "I organized the communication around service clarity, patient guidance, and repeatable visual cues across both platforms.",
      constraints: "Healthcare information needed to stay accessible, calm, and legible across different post formats.",
      learning: "I learned to treat clarity as part of the identity itself, then refined each execution around what a patient needed to understand first.",
    },
    websiteUrl: "https://homecure.com.pk",
    socialLinks: {
      instagram: "https://www.instagram.com/homecurepak/",
      facebook: "https://www.facebook.com/profile.php?id=61585081491893",
    },
  },
  {
    slug: "rootcyber",
    name: "RootCyber",
    logo: {
      src: "/work/brand-systems/root-cyber/logo.jpg",
      alt: "RootCyber logo",
      available: true,
    },
    industry: "Cybersecurity",
    summary:
      "A technical content system built to communicate cybersecurity topics with authority, clarity, and visual consistency.",
    positioning: "Complex security topics, structured for clear visual communication.",
    capabilities: [
      "Instagram content",
      "Facebook content",
      "Cybersecurity education",
      "Technical communication",
      "Ongoing content design",
    ],
    platforms: ["Instagram", "Facebook"],
    visualDirection: ["Blue", "Black", "White", "Technical", "Authoritative"],
    sections: {
      identity: {
        title: "Technical authority without visual noise",
        description:
          "The direction uses a focused security-led presentation to make RootCyber feel credible and consistent.",
        items: [
          "Blue, black, and white visual direction",
          "Technical and authoritative tone",
          "Security-focused presentation",
        ],
      },
      content: {
        title: "A visual framework for complex security topics",
        description:
          "The repeatable content system gives dense technical subjects a clear hierarchy across social platforms.",
        items: [
          "Ransomware",
          "Identity and access management",
          "VAPT",
          "SOC",
          "Compliance",
          "Cloud security",
          "Incident response",
          "Employee awareness",
          "Penetration testing",
        ],
      },
    },
    gallery: [
      asset("root-cyber", "facebook-01.jpg", "RootCyber managed security services creative", "Facebook", "Post", "square", "Managed security services", true),
      asset("root-cyber", "facebook-02.jpg", "RootCyber cybersecurity service creative", "Facebook", "Post", "square", "Security expertise made scannable", true),
      asset("root-cyber", "facebook-03.jpg", "RootCyber technical awareness creative", "Facebook", "Post", "square", "Technical security communication", true),
      asset("root-cyber", "cover.jpg", "RootCyber Facebook cover identity", "Facebook", "Cover", "wide", "RootCyber social identity", true),
    ],
    reflection: {
      role: "I translated ongoing cybersecurity topics into a consistent social content system for Instagram and Facebook.",
      requirement: "RootCyber needed to communicate technical expertise clearly without reducing complex subjects to generic security slogans.",
      strategy: "I used a repeatable hierarchy and topic-led structure so each creative could carry authority while remaining easy to scan.",
      constraints: "Dense terminology and varied subject matter had to fit into concise, legible social formats.",
      learning: "I refined the system by separating the technical detail that builds trust from the visual information a reader needs first.",
    },
    socialLinks: {
      instagram: "https://www.instagram.com/official.rootcyber/",
      facebook: "https://www.facebook.com/profile.php?id=61571781654318",
    },
  },
  {
    slug: "clear-voice-hub",
    name: "Clear Voice Hub",
    logo: {
      src: "/work/brand-systems/clear-voice-hub/logo.jpg",
      alt: "Clear Voice Hub logo",
      available: true,
    },
    industry: "Speech Therapy / Healthcare",
    summary:
      "A calm, educational social presence designed to communicate speech therapy services clearly to families and patients.",
    positioning: "Calm, accessible guidance for families and patients.",
    capabilities: [
      "Instagram branding",
      "Facebook branding",
      "Ongoing content design",
      "Healthcare education",
      "Service communication",
      "Visual consistency",
    ],
    platforms: ["Instagram", "Facebook"],
    visualDirection: ["Medical blue", "White", "Calm", "Accessible", "Parent-focused"],
    sections: {
      identity: {
        title: "A calm system built for trust and accessibility",
        description:
          "The visual direction keeps clinical credibility while making the experience approachable for families.",
        items: [
          "Medical blue and white visual direction",
          "Calm and accessible layout",
          "Parent-focused communication",
          "Consistent logo spacing and branding",
        ],
      },
      content: {
        title: "Educational content shaped around real questions",
        description:
          "The system explains therapy services and early signs with a consistent, reassuring presentation.",
        items: [
          "Speech therapy",
          "Language therapy",
          "Fluency",
          "Voice therapy",
          "Online therapy",
          "Early signs",
          "Bilingual development",
        ],
      },
    },
    gallery: [
      asset("clear-voice-hub", "facebook-01.jpg", "Clear Voice Hub learning languages creative", "Facebook", "Post", "square", "Learning languages opens doors", true),
      asset("clear-voice-hub", "facebook-02.jpg", "Clear Voice Hub services overview creative", "Facebook", "Post", "square", "Services organized for quick understanding", true),
      asset("clear-voice-hub", "facebook-03.jpg", "Clear Voice Hub confidence and communication creative", "Facebook", "Post", "square", "Confidence begins with communication", true),
      asset("clear-voice-hub", "cover.png", "Clear Voice Hub services cover creative", "Facebook", "Cover", "landscape", "One destination for confident communication", true),
      asset("clear-voice-hub", "logo.jpg", "Clear Voice Hub social profile logo", "Facebook", "Profile", "square", "Calm, recognizable profile identity", true),
    ],
    reflection: {
      role: "I developed the social branding and ongoing educational content across Instagram and Facebook.",
      requirement: "Clear Voice Hub needed to explain therapy services in a way that felt professional, calm, and welcoming to families.",
      strategy: "I paired a consistent medical visual language with topic structures centered on services, early signs, and common patient questions.",
      constraints: "The design had to balance clinical clarity with warmth while keeping detailed guidance readable.",
      learning: "I refined the system by using hierarchy and tone to reduce uncertainty before adding more information.",
    },
    websiteUrl: "https://clearvoicehub.com",
    socialLinks: {
      instagram: "https://www.instagram.com/clearvoicehub/",
      facebook: "https://www.facebook.com/profile.php?id=61588375756820",
    },
  },
  {
    slug: "ama-audit-and-accounting",
    name: "AMA Audit and Accounting",
    logo: {
      src: "/work/brand-systems/ama-auditing/logo.jpg",
      alt: "AMA Auditing, Accounting and Tax logo",
      available: true,
    },
    industry: "Accounting / Corporate Finance / UAE",
    summary:
      "A structured content and advertising system for a UAE accounting firm, combining ongoing social communication with Meta campaigns.",
    positioning: "Corporate finance communication organized for social content and paid campaigns.",
    capabilities: [
      "Instagram content",
      "Facebook content",
      "Meta advertising",
      "Corporate visual system",
      "Campaign design",
      "Financial education",
      "Compliance communication",
    ],
    platforms: ["Instagram", "Facebook", "Meta Ads"],
    visualDirection: ["Muted red", "White", "Charcoal", "Structured", "Corporate"],
    sections: {
      identity: {
        title: "A structured corporate finance system",
        description:
          "The visual language supports ongoing education and campaign work with a professional, repeatable grid.",
        items: [
          "Muted red, white, and charcoal visual system",
          "Professional finance positioning",
          "Structured grid consistency",
          "Clean corporate layouts",
        ],
      },
      content: {
        title: "Finance and compliance topics made scannable",
        description:
          "The content system gives service communication and financial education a clear, consistent structure.",
        items: [
          "Corporate tax",
          "VAT",
          "Audit",
          "Bookkeeping",
          "CFO services",
          "Risk management",
          "E-invoicing",
          "Compliance",
        ],
      },
    },
    gallery: [
      asset("ama-auditing", "facebook-01.jpg", "AMA business confidence campaign creative", "Facebook", "Post", "square", "Build your business with confidence", true),
      asset("ama-auditing", "facebook-02.jpg", "AMA business compliance services creative", "Facebook", "Post", "square", "Complete business compliance", true),
      asset("ama-auditing", "facebook-03.jpg", "AMA audit accounting and tax services creative", "Facebook", "Post", "square", "Audit, accounting, and tax services", true),
      asset("ama-auditing", "cover.png", "AMA Facebook cover identity", "Facebook", "Cover", "wide", "Corporate finance social identity", true),
      asset("ama-auditing", "logo.jpg", "AMA social profile logo", "Facebook", "Profile", "square", "Recognizable finance identity", true),
    ],
    campaigns: [
      {
        title: "Corporate Tax Campaign",
        objective: "Communicate corporate tax support to businesses in the UAE.",
        audience: "UAE businesses seeking corporate tax guidance.",
        platforms: ["Meta Ads"],
        languages: ["English", "Arabic"],
        creativeDirection: "Clear corporate messaging with a structured service-led hierarchy.",
        format: "Business-focused lead campaign",
        notes: "Creative variants were organized for multilingual delivery and strategic iteration.",
        metricsPublished: false,
      },
      {
        title: "Bookkeeping Campaign",
        objective: "Present bookkeeping and accounting support to UAE SMEs.",
        audience: "Small and medium-sized businesses in the UAE.",
        platforms: ["Meta Ads"],
        languages: ["English", "Arabic"],
        creativeDirection: "Service clarity supported by a restrained corporate visual system.",
        format: "Bookkeeping and accounting promotion",
        notes: "Messaging was adapted by language while retaining a consistent campaign structure.",
        metricsPublished: false,
      },
      {
        title: "UAE E-Invoicing Campaign",
        objective: "Introduce e-invoicing support through timely compliance communication.",
        audience: "UAE businesses preparing for e-invoicing requirements.",
        platforms: ["Meta Ads", "Facebook"],
        languages: ["English", "Arabic"],
        creativeDirection: "Compliance information presented with direct, scannable visual hierarchy.",
        format: "Educational campaign creative",
        notes: "The system allowed service and educational variants to evolve without losing consistency.",
        metricsPublished: false,
      },
      {
        title: "Audit Services Campaign",
        objective: "Communicate professional audit services to business decision-makers.",
        audience: "UAE business owners and finance decision-makers.",
        platforms: ["Meta Ads", "Instagram", "Facebook"],
        languages: ["English", "Arabic"],
        creativeDirection: "Professional finance positioning with concise service messaging.",
        format: "Business-focused lead campaign",
        notes: "Campaign concepts were structured for iteration across placement and language variants.",
        metricsPublished: false,
      },
    ],
    reflection: {
      role: "I built the ongoing social content and Meta advertising system across finance, audit, and compliance topics.",
      requirement: "AMA needed one coherent corporate presence that could support education, service communication, and multilingual campaigns.",
      strategy: "I separated organic and paid objectives while keeping the visual structure recognizable across Instagram, Facebook, and Meta Ads.",
      constraints: "Financial subjects had to remain accurate, concise, and legible across English and Arabic creative variants.",
      learning: "I refined the system through creative and messaging iteration, keeping campaign structure visible without treating unpublished metrics as portfolio claims.",
    },
    socialLinks: {
      instagram: "https://www.instagram.com/amaauditandaccounting/",
      facebook: "https://www.facebook.com/amaauditing",
    },
  },
];

export const getBrandSystem = (slug: string) =>
  BRAND_SYSTEMS.find((project) => project.slug === slug);
