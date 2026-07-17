"use client";

import { Canvas } from "@react-three/fiber";
import {
  Component,
  useEffect,
  useMemo,
  useState,
  type ErrorInfo,
  type ReactNode,
} from "react";

import { usePointerParallax } from "@/hooks/usePointerParallax";
import { useSectionProgress } from "@/hooks/useSectionProgress";
import SceneController from "./SceneController";

interface BackgroundSceneProps {
  chatOpen: boolean;
}

interface DeviceProfile {
  mobile: boolean;
  reducedMotion: boolean;
  lowPower: boolean;
  webgl: boolean;
}

function StaticFallback() {
  return (
    <div
      data-neural-fallback
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        background:
          "radial-gradient(circle at 68% 40%, rgba(38, 84, 180, 0.09), transparent 28%), radial-gradient(circle at 34% 72%, rgba(105, 53, 190, 0.055), transparent 26%)",
      }}
    />
  );
}

class SceneErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo) {
    // The static visual below keeps the portfolio usable if WebGL is unavailable.
  }

  render() {
    return this.state.failed ? <StaticFallback /> : this.props.children;
  }
}

function detectWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGL2RenderingContext && canvas.getContext("webgl2")
    ) || Boolean(canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function BackgroundScene({ chatOpen }: BackgroundSceneProps) {
  const [profile, setProfile] = useState<DeviceProfile | null>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 767px), (pointer: coarse)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const navigatorWithMemory = navigator as Navigator & {
      deviceMemory?: number;
    };

    const updateProfile = () => {
      const mobile = mobileQuery.matches;
      const lowPower =
        mobile ||
        navigator.hardwareConcurrency <= 4 ||
        (navigatorWithMemory.deviceMemory ?? 8) <= 4;

      setProfile({
        mobile,
        reducedMotion: motionQuery.matches,
        lowPower,
        webgl: detectWebGL(),
      });
    };

    const updateVisibility = () => setVisible(!document.hidden);
    updateProfile();
    updateVisibility();
    mobileQuery.addEventListener("change", updateProfile);
    motionQuery.addEventListener("change", updateProfile);
    document.addEventListener("visibilitychange", updateVisibility);

    return () => {
      mobileQuery.removeEventListener("change", updateProfile);
      motionQuery.removeEventListener("change", updateProfile);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  const reducedMotion = profile?.reducedMotion ?? false;
  const mobile = profile?.mobile ?? false;
  const simplified = Boolean(profile?.lowPower || mobile);
  const sectionRef = useSectionProgress(reducedMotion);
  const pointerRef = usePointerParallax(reducedMotion || mobile);
  const dpr = useMemo<[number, number]>(
    () => (simplified ? [0.75, 1.1] : [1, 1.5]),
    [simplified]
  );

  if (!profile || !profile.webgl) return <StaticFallback />;

  return (
    <SceneErrorBoundary>
      <div
        data-neural-background
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <Canvas
          dpr={dpr}
          frameloop={visible ? "always" : "never"}
          camera={{ position: [0, 0, 7.4], fov: 48, near: 0.1, far: 40 }}
          performance={{ min: 0.5, max: 1, debounce: 300 }}
          gl={{
            alpha: true,
            antialias: !simplified,
            depth: true,
            stencil: false,
            powerPreference: simplified ? "low-power" : "high-performance",
          }}
          onCreated={({ gl }) => gl.setClearColor("#07070f", 0)}
          style={{ pointerEvents: "none" }}
        >
          <fog attach="fog" args={["#07070f", 7, 13]} />
          <SceneController
            sectionRef={sectionRef}
            pointerRef={pointerRef}
            chatOpen={chatOpen}
            reducedMotion={reducedMotion}
            mobile={mobile}
            simplified={simplified}
          />
        </Canvas>
      </div>
    </SceneErrorBoundary>
  );
}
