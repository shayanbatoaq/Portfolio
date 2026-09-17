export interface Project {
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
