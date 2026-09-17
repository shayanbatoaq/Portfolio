import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  ...nextVitals,
  {
    files: ["src/components/home/**/*.tsx", "src/app/components/figma/**/*.tsx"],
    rules: {
      "@next/next/no-img-element": "off",
      "react/no-unescaped-entities": "off",
    },
  },
  {
    files: [
      "src/app/components/ui/carousel.tsx",
      "src/app/components/ui/use-mobile.ts",
      "src/app/work/ai/**/CrewLab.tsx",
    ],
    rules: { "react-hooks/set-state-in-effect": "off" },
  },
  {
    files: ["src/app/components/ui/sidebar.tsx"],
    rules: { "react-hooks/purity": "off" },
  },
  {
    files: ["src/components/three/NodeNetwork.tsx", "src/components/three/SceneController.tsx"],
    rules: { "react-hooks/immutability": "off" },
  },
  {
    files: ["src/components/work/brand-systems/BrandGallery.tsx"],
    rules: { "react-hooks/exhaustive-deps": "off" },
  },
  globalIgnores([".next/**", "node_modules/**", "tmp/**"]),
]);
