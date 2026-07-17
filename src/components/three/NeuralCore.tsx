"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  AdditiveBlending,
  BufferGeometry,
  Color,
  Group,
  InstancedMesh,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  Vector3,
} from "three";
import type { MutableRefObject } from "react";

import type { SceneRuntime } from "@/lib/three/sceneStates";
import NodeNetwork from "./NodeNetwork";
import ParticleField from "./ParticleField";

interface NeuralCoreProps {
  runtimeRef: MutableRefObject<SceneRuntime>;
  nodeCount: number;
  particleCount: number;
  simplified: boolean;
}

const BLUE = new Color("#1597ff");
const PURPLE = new Color("#8145ff");

export default function NeuralCore({
  runtimeRef,
  nodeCount,
  particleCount,
  simplified,
}: NeuralCoreProps) {
  const coreRef = useRef<Mesh>(null);
  const shellRef = useRef<Mesh>(null);
  const torusRef = useRef<Mesh>(null);
  const orbitRef = useRef<Group>(null);
  const pulsesRef = useRef<InstancedMesh>(null);
  const coreMaterialRef = useRef<MeshStandardMaterial>(null);
  const shellMaterialRef = useRef<MeshBasicMaterial>(null);
  const torusMaterialRef = useRef<MeshBasicMaterial>(null);
  const orbitMaterialsRef = useRef<LineBasicMaterial[]>([]);
  const pulseMaterialRef = useRef<MeshBasicMaterial>(null);

  const pulseCount = simplified ? 5 : 9;
  const dummy = useMemo(() => new Object3D(), []);
  const pulseColor = useMemo(() => new Color(), []);
  const orbitGeometries = useMemo(() => {
    return [0.83, 1.08, 1.35].map((radius, ringIndex) => {
      const points = Array.from({ length: 96 }, (_, index) => {
        const angle = (index / 96) * Math.PI * 2;
        return new Vector3(
          Math.cos(angle) * radius,
          Math.sin(angle * (ringIndex + 2)) * 0.055,
          Math.sin(angle) * radius,
        );
      });

      return new BufferGeometry().setFromPoints(points);
    });
  }, []);

  useEffect(() => {
    return () => orbitGeometries.forEach((geometry) => geometry.dispose());
  }, [orbitGeometries]);

  useFrame((state, delta) => {
    const runtime = runtimeRef.current;
    const motion = runtime.reducedMotion ? 0 : 1;
    const elapsed = runtime.elapsed;
    const dt = Math.min(delta, 0.05);
    const opacity = runtime.backgroundOpacity;
    const reaction = runtime.reactionPulse;

    if (coreRef.current) {
      coreRef.current.rotation.x += dt * runtime.orbitalSpeed * 0.19 * motion;
      coreRef.current.rotation.y += dt * runtime.orbitalSpeed * 0.31 * motion;
      coreRef.current.scale.setScalar(
        1 + Math.sin(elapsed * runtime.pulseSpeed) * 0.025 * motion + reaction * 0.045
      );
    }

    if (shellRef.current) {
      shellRef.current.rotation.y -= dt * runtime.orbitalSpeed * 0.13 * motion;
      shellRef.current.scale.setScalar(1 + runtime.signalWave * 0.18);
    }

    if (torusRef.current) {
      torusRef.current.rotation.x += dt * runtime.orbitalSpeed * 0.12 * motion;
      torusRef.current.rotation.z -= dt * runtime.orbitalSpeed * 0.16 * motion;
    }

    if (orbitRef.current) {
      orbitRef.current.rotation.x += dt * runtime.orbitalSpeed * 0.035 * motion;
      orbitRef.current.rotation.y += dt * runtime.orbitalSpeed * 0.075 * motion;
      orbitRef.current.rotation.z = Math.sin(elapsed * 0.12) * 0.07 * motion;
    }

    if (coreMaterialRef.current) {
      coreMaterialRef.current.opacity = opacity * (0.5 + runtime.glowIntensity * 0.2);
      coreMaterialRef.current.emissiveIntensity =
        0.6 + runtime.glowIntensity * 0.8 + reaction * 0.4;
      coreMaterialRef.current.color.copy(BLUE).lerp(PURPLE, runtime.colorBalance);
      coreMaterialRef.current.emissive
        .copy(BLUE)
        .lerp(PURPLE, Math.min(1, runtime.colorBalance + 0.15));
    }

    if (shellMaterialRef.current) {
      shellMaterialRef.current.opacity =
        opacity * (0.045 + runtime.glowIntensity * 0.025 + reaction * 0.025);
      shellMaterialRef.current.color.copy(BLUE).lerp(PURPLE, runtime.colorBalance);
    }

    if (torusMaterialRef.current) {
      torusMaterialRef.current.opacity =
        opacity * (0.18 + runtime.connectionIntensity * 0.13);
      torusMaterialRef.current.color
        .copy(BLUE)
        .lerp(PURPLE, Math.min(1, runtime.colorBalance + 0.08));
    }

    orbitMaterialsRef.current.forEach((material, index) => {
      if (!material) return;
      material.opacity =
        opacity *
        (0.15 + runtime.connectionIntensity * 0.1) *
        (1 - index * 0.14);
      material.color
        .copy(BLUE)
        .lerp(PURPLE, Math.min(1, runtime.colorBalance + index * 0.12));
    });

    if (pulsesRef.current && pulseMaterialRef.current) {
      for (let index = 0; index < pulseCount; index += 1) {
        const phase =
          (index / pulseCount +
            elapsed * (0.035 + runtime.pulseSpeed * 0.018)) %
          1;
        const angle = phase * Math.PI * 5 + index * 0.7;
        const radius = 0.42 + phase * 1.15;
        const compression = 1 - runtime.signalWave * 0.22;

        dummy.position.set(
          Math.cos(angle) * radius * compression,
          (phase - 0.5) * 1.3 * compression,
          Math.sin(angle) * radius * 0.7
        );
        dummy.scale.setScalar(
          (0.022 + reaction * 0.008) * (1 - phase * 0.5)
        );
        dummy.updateMatrix();
        pulsesRef.current.setMatrixAt(index, dummy.matrix);
      }
      pulsesRef.current.instanceMatrix.needsUpdate = true;
      pulseColor.copy(BLUE).lerp(PURPLE, runtime.colorBalance);
      pulseMaterialRef.current.color.copy(pulseColor);
      pulseMaterialRef.current.opacity =
        opacity * (0.55 + runtime.signalWave * 0.2);
    }
  });

  return (
    <group>
      <mesh ref={shellRef}>
        <sphereGeometry
          args={[0.88, simplified ? 20 : 32, simplified ? 14 : 24]}
        />
        <meshBasicMaterial
          ref={shellMaterialRef}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>

      <mesh ref={coreRef}>
        <octahedronGeometry args={[0.43, simplified ? 2 : 3]} />
        <meshStandardMaterial
          ref={coreMaterialRef}
          transparent
          roughness={0.28}
          metalness={0.42}
          depthWrite={false}
        />
      </mesh>

      <mesh ref={torusRef} rotation={[Math.PI / 3, 0.2, -0.3]}>
        <torusKnotGeometry
          args={[0.65, 0.012, simplified ? 72 : 120, 7, 2, 5]}
        />
        <meshBasicMaterial
          ref={torusMaterialRef}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>

      <group ref={orbitRef}>
        {orbitGeometries.map((geometry, index) => (
          <lineLoop
            key={index}
            geometry={geometry}
            rotation={[
              Math.PI * (0.18 + index * 0.17),
              Math.PI * (0.12 + index * 0.11),
              Math.PI * index * 0.09,
            ]}
          >
            <lineBasicMaterial
              ref={(material) => {
                if (material) orbitMaterialsRef.current[index] = material;
              }}
              transparent
              depthWrite={false}
              blending={AdditiveBlending}
            />
          </lineLoop>
        ))}
      </group>

      <instancedMesh ref={pulsesRef} args={[undefined, undefined, pulseCount]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial
          ref={pulseMaterialRef}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </instancedMesh>

      <NodeNetwork runtimeRef={runtimeRef} count={nodeCount} />
      <ParticleField runtimeRef={runtimeRef} count={particleCount} />
    </group>
  );
}
