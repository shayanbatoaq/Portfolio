"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

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

export function GradientText({
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

export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, visible } = useScrollReveal();
  const reduceMotion = useReducedMotion();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible || reduceMotion ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
      style={{ transitionDelay: reduceMotion ? "0ms" : `${delay}ms` }}
    >
      {children}
    </div>
  );
}
