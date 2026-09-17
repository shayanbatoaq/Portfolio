"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { PortfolioNav } from "@/components/navigation/PortfolioNav";
import { emitSceneReaction } from "@/lib/three/sceneEvents";
import { Hero } from "@/components/home/Hero";
import { About } from "@/components/home/About";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { TechnicalCapabilities } from "@/components/home/TechnicalCapabilities";
import { Patricians } from "@/components/home/Patricians";
import { Philosophy } from "@/components/home/Philosophy";
import { Resume } from "@/components/home/Resume";
import { Contact } from "@/components/home/Contact";
import { AskButton, AskModal } from "@/components/home/AskAssistant";

const BackgroundScene = dynamic(
  () => import("@/components/three/BackgroundScene"),
  { ssr: false }
);

export default function App() {
  const [askOpen, setAskOpen] = useState(false);
  const assistantTrigger = useRef<HTMLElement | null>(null);
  const openAssistant = () => {
    assistantTrigger.current = document.activeElement as HTMLElement | null;
    setAskOpen(true);
  };
  const closeAssistant = () => {
    setAskOpen(false);
    window.requestAnimationFrame(() => assistantTrigger.current?.focus());
  };

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
      <div className="relative z-10" inert={askOpen}>
        <a href="#work" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[80] focus:rounded-lg focus:bg-[#07070f] focus:p-4 focus:text-white">Skip to engineering work</a>
        <PortfolioNav />
        <main>
          <Hero onAskClick={openAssistant} />
          <FeaturedWork />
          <TechnicalCapabilities />
          <About />
          <Patricians />
          <Resume />
          <Philosophy />
          <Contact />
        </main>
      </div>

      <div inert={askOpen}><AskButton onClick={openAssistant} /></div>
      {askOpen && <AskModal onClose={closeAssistant} />}
    </div>
  );
}
