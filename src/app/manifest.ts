import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Shayan Batoaq Portfolio",
    short_name: "Shayan Batoaq",
    description:
      "AI systems, full-stack web development, and digital growth work by Shayan Batoaq.",
    start_url: "/",
    display: "standalone",
    background_color: "#07070f",
    theme_color: "#07070f",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
