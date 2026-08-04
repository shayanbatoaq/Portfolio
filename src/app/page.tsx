import App from "./App";
import { contact } from "@/data/shayan/contact";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo";

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    alternateName: "Shayan Batoaq Portfolio",
    description: SITE_DESCRIPTION,
    inLanguage: "en",
    publisher: { "@id": `${SITE_URL}/#person` },
  },
  {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${SITE_URL}/#profile-page`,
    url: SITE_URL,
    name: "Shayan Batoaq — AI Engineer & Full-Stack Developer",
    description: SITE_DESCRIPTION,
    mainEntity: { "@id": `${SITE_URL}/#person` },
  },
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: SITE_NAME,
    url: SITE_URL,
    jobTitle: "AI Engineer and Full-Stack Developer",
    description: SITE_DESCRIPTION,
    email: `mailto:${contact.email}`,
    sameAs: [contact.linkedIn, contact.instagram],
    knowsAbout: [
      "Applied AI prototypes",
      "AI workflow prototyping",
      "CrewAI",
      "Full-stack web development",
      "Next.js",
      "TypeScript",
      "Client-facing web development",
      "Digital marketing and brand communication",
    ],
    worksFor: {
      "@type": "Organization",
      name: "Patricians",
      url: "https://patricians.pk",
    },
  },
];

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <App />
    </>
  );
}
