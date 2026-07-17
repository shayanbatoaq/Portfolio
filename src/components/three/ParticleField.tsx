"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  AdditiveBlending,
  BufferGeometry,
  Points,
  PointsMaterial,
} from "three";
import type { MutableRefObject } from "react";

import type { SceneRuntime } from "@/lib/three/sceneStates";

interface ParticleFieldProps {
  runtimeRef: MutableRefObject<SceneRuntime>;
  count: number;
}

function seeded(index: number, offset: number): number {
  const value = Math.sin(index * 91.73 + offset * 37.19) * 23191.31;
  return value - Math.floor(value);
}

export default function ParticleField({
  runtimeRef,
  count,
}: ParticleFieldProps) {
  const pointsRef = useRef<Points>(null);
  const materialRef = useRef<PointsMaterial>(null);
  const geometryRef = useRef<BufferGeometry>(null);

  const positions = useMemo(() => {
    const data = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      const radius = 2.2 + seeded(index, 1) * 2.8;
      const angle = seeded(index, 2) * Math.PI * 2;
      const elevation = (seeded(index, 3) - 0.5) * 3.8;
      data[index * 3] = Math.cos(angle) * radius;
      data[index * 3 + 1] = elevation;
      data[index * 3 + 2] = Math.sin(angle) * radius;
    }
    return data;
  }, [count]);

  useFrame(() => {
    const runtime = runtimeRef.current;
    const visibleCount = Math.max(
      8,
      Math.floor(count * runtime.particleDensity)
    );
    geometryRef.current?.setDrawRange(0, visibleCount);

    if (pointsRef.current) {
      const motion = runtime.reducedMotion ? 0 : 1;
      pointsRef.current.rotation.y =
        runtime.elapsed * 0.012 * runtime.orbitalSpeed * motion;
      pointsRef.current.rotation.x =
        Math.sin(runtime.elapsed * 0.04) * 0.025 * motion;
    }

    if (materialRef.current) {
      materialRef.current.opacity =
        runtime.backgroundOpacity *
        (0.16 + runtime.glowIntensity * 0.16);
      materialRef.current.size =
        (runtime.mobile ? 0.018 : 0.024) *
        (1 + runtime.reactionPulse * 0.18);
    }
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        color="#7899ff"
        size={0.022}
        sizeAttenuation
        transparent
        opacity={0.18}
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}
