import type { Metadata } from "next";
import "../styles/index.css";

export const metadata: Metadata = {
  title: {
    default: "Shayan Batoaq | Portfolio",
    template: "%s | Shayan Batoaq",
  },
  description:
    "Portfolio of Shayan Batoaq - full-stack web development, agentic AI, automation, and digital products.",
  applicationName: "Shayan Batoaq Portfolio",
  authors: [{ name: "Shayan Batoaq" }],
  creator: "Shayan Batoaq",
  keywords: [
    "Shayan Batoaq",
    "full-stack web development",
    "agentic AI",
    "AI assistants",
    "automation",
    "portfolio",
  ],
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "Shayan Batoaq | Portfolio",
    description:
      "Full-stack web development, agentic AI, automation, and digital products.",
    siteName: "Shayan Batoaq Portfolio",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Shayan Batoaq | Portfolio",
    description:
      "Full-stack web development, agentic AI, automation, and digital products.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
