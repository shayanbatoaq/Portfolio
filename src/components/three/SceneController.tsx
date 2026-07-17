"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Group, Vector3 } from "three";
import type { MutableRefObject } from "react";

import type { PointerSnapshot } from "@/hooks/usePointerParallax";
import type { SectionProgressSnapshot } from "@/hooks/useSectionProgress";
import {
  PAGE_SECTION_IDS,
  SCENE_STATES,
  createInitialRuntime,
  type SceneRuntime,
  type SceneState,
} from "@/lib/three/sceneStates";
import {
  subscribeToSceneReactions,
  type SceneReaction,
} from "@/lib/three/sceneEvents";
import NeuralCore from "./NeuralCore";

interface SceneControllerProps {
  sectionRef: MutableRefObject<SectionProgressSnapshot>;
  pointerRef: MutableRefObject<PointerSnapshot>;
  chatOpen: boolean;
  reducedMotion: boolean;
  mobile: boolean;
  simplified: boolean;
}

function damp(current: number, target: number, speed: number, delta: number) {
  return current + (target - current) * (1 - Math.exp(-speed * delta));
}

function mix(a: number, b: number, amount: number) {
  return a + (b - a) * amount;
}

function smoothstep(edge0: number, edge1: number, value: number) {
  const normalized = Math.min(
    1,
    Math.max(0, (value - edge0) / (edge1 - edge0))
  );
  return normalized * normalized * (3 - 2 * normalized);
}

type NumericSceneKey = keyof Pick<
  SceneState,
  | "particleDensity"
  | "nodeSpread"
  | "connectionIntensity"
  | "pulseSpeed"
  | "glowIntensity"
  | "morphAmount"
  | "orbitalSpeed"
  | "colorBalance"
  | "backgroundOpacity"
>;

function blendStateNumber(
  from: SceneState,
  to: SceneState,
  key: NumericSceneKey,
  sectionMix: number,
  chatMix: number
) {
  return mix(
    mix(from[key], to[key], sectionMix),
    SCENE_STATES.chat[key],
    chatMix
  );
}

export default function SceneController({
  sectionRef,
  pointerRef,
  chatOpen,
  reducedMotion,
  mobile,
  simplified,
}: SceneControllerProps) {
  const groupRef = useRef<Group>(null);
  const runtimeRef = useRef<SceneRuntime>(
    createInitialRuntime(reducedMotion, mobile)
  );
  const chatOpenRef = useRef(chatOpen);
  const reactionRef = useRef({
    pulse: 0,
    signal: 0,
    contraction: 0,
    hover: 0,
    readingUntil: 0,
  });
  const targetRef = useRef(new Vector3());
  const frameHealthRef = useRef({ time: 0, frames: 0 });
  const { camera, performance: qualityPerformance } = useThree();
  const secondaryLight = useMemo(() => "#5b4dff", []);

  useEffect(() => {
    chatOpenRef.current = chatOpen;
  }, [chatOpen]);

  useEffect(() => {
    runtimeRef.current.reducedMotion = reducedMotion;
    runtimeRef.current.mobile = mobile;
  }, [mobile, reducedMotion]);

  useEffect(() => {
    const handleReaction = (reaction: SceneReaction) => {
      const values = reactionRef.current;
      const strength = Math.min(1.5, Math.max(0, reaction.strength));

      switch (reaction.type) {
        case "filter-change":
          values.pulse = Math.max(values.pulse, 0.42 * strength);
          values.signal = Math.max(values.signal, 0.22 * strength);
          break;
        case "project-hover":
          values.hover = Math.max(values.hover, 0.28 * strength);
          break;
        case "patricians-hover":
          values.pulse = Math.max(values.pulse, 0.5 * strength);
          values.hover = Math.max(values.hover, 0.46 * strength);
          break;
        case "chat-open":
          values.signal = Math.max(values.signal, 0.72 * strength);
          values.pulse = Math.max(values.pulse, 0.38 * strength);
          break;
        case "message-submit":
          values.pulse = Math.max(values.pulse, 1 * strength);
          values.contraction = Math.max(
            values.contraction,
            0.74 * strength
          );
          values.signal = Math.max(values.signal, 0.58 * strength);
          break;
        case "chat-reading":
          values.readingUntil = window.performance.now() + 7000;
          values.signal = Math.max(values.signal, 0.28 * strength);
          break;
      }
    };

    return subscribeToSceneReactions(handleReaction);
  }, []);

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const runtime = runtimeRef.current;
    const section = sectionRef.current;
    const pointer = pointerRef.current;
    const reaction = reactionRef.current;
    const lastSectionIndex = PAGE_SECTION_IDS.length - 1;
    const transition = reducedMotion
      ? 0
      : smoothstep(0.52, 0.96, section.progress);
    const targetSectionPosition = reducedMotion
      ? 0
      : Math.min(lastSectionIndex, section.index + transition);

    runtime.elapsed = reducedMotion ? 0 : state.clock.elapsedTime;
    runtime.sectionPosition = damp(
      runtime.sectionPosition,
      targetSectionPosition,
      reducedMotion ? 12 : 3.8,
      delta
    );
    runtime.chatMix = damp(
      runtime.chatMix,
      chatOpenRef.current ? 1 : 0,
      4.2,
      delta
    );

    const pagePosition = Math.min(
      lastSectionIndex,
      Math.max(0, runtime.sectionPosition)
    );
    const fromIndex = Math.floor(pagePosition);
    const toIndex = Math.min(lastSectionIndex, fromIndex + 1);
    const sectionMix = pagePosition - fromIndex;
    const from = SCENE_STATES[PAGE_SECTION_IDS[fromIndex]];
    const to = SCENE_STATES[PAGE_SECTION_IDS[toIndex]];
    const chatState = SCENE_STATES.chat;
    const chatMix = runtime.chatMix;
    const reading =
      !reducedMotion && window.performance.now() < reaction.readingUntil;

    runtime.particleDensity = damp(
      runtime.particleDensity,
      blendStateNumber(from, to, "particleDensity", sectionMix, chatMix),
      3,
      delta
    );
    runtime.nodeSpread = damp(
      runtime.nodeSpread,
      blendStateNumber(from, to, "nodeSpread", sectionMix, chatMix),
      3,
      delta
    );
    runtime.connectionIntensity = damp(
      runtime.connectionIntensity,
      blendStateNumber(
        from,
        to,
        "connectionIntensity",
        sectionMix,
        chatMix
      ),
      3.4,
      delta
    );
    runtime.pulseSpeed = damp(
      runtime.pulseSpeed,
      blendStateNumber(from, to, "pulseSpeed", sectionMix, chatMix) *
        (reading ? 0.72 : 1),
      2.8,
      delta
    );
    runtime.glowIntensity = damp(
      runtime.glowIntensity,
      blendStateNumber(from, to, "glowIntensity", sectionMix, chatMix),
      3.2,
      delta
    );
    runtime.morphAmount = damp(
      runtime.morphAmount,
      blendStateNumber(from, to, "morphAmount", sectionMix, chatMix),
      2.8,
      delta
    );
    runtime.orbitalSpeed = damp(
      runtime.orbitalSpeed,
      blendStateNumber(from, to, "orbitalSpeed", sectionMix, chatMix) *
        (reading ? 0.62 : 1),
      2.8,
      delta
    );
    runtime.colorBalance = damp(
      runtime.colorBalance,
      blendStateNumber(from, to, "colorBalance", sectionMix, chatMix),
      2.5,
      delta
    );
    const reducedOpacity =
      SCENE_STATES[section.current].backgroundOpacity * 0.72;
    const mobileOpacity = mobile ? 0.74 : 1;
    runtime.backgroundOpacity = damp(
      runtime.backgroundOpacity,
      reducedMotion
        ? reducedOpacity
        : blendStateNumber(
            from,
            to,
            "backgroundOpacity",
            sectionMix,
            chatMix
          ) * mobileOpacity,
      3.4,
      delta
    );

    runtime.pointerX = damp(
      runtime.pointerX,
      reducedMotion || mobile ? 0 : pointer.x,
      4.4,
      delta
    );
    runtime.pointerY = damp(
      runtime.pointerY,
      reducedMotion || mobile ? 0 : pointer.y,
      4.4,
      delta
    );
    runtime.scrollVelocity = damp(
      runtime.scrollVelocity,
      reducedMotion ? 0 : section.velocity,
      5.5,
      delta
    );

    reaction.pulse = damp(reaction.pulse, 0, 3.1, delta);
    reaction.signal = damp(reaction.signal, 0, 2.2, delta);
    reaction.contraction = damp(reaction.contraction, 0, 4, delta);
    reaction.hover = damp(reaction.hover, 0, 5.2, delta);
    runtime.reactionPulse = reducedMotion ? 0 : reaction.pulse;
    runtime.signalWave = reducedMotion ? 0 : reaction.signal;
    runtime.contraction = reducedMotion ? 0 : reaction.contraction;
    runtime.hoverActivity = reducedMotion ? 0 : reaction.hover;

    if (groupRef.current) {
      const pageX = mix(
        from.objectPosition[0],
        to.objectPosition[0],
        sectionMix
      );
      const pageY = mix(
        from.objectPosition[1],
        to.objectPosition[1],
        sectionMix
      );
      const pageZ = mix(
        from.objectPosition[2],
        to.objectPosition[2],
        sectionMix
      );
      const aboutWeight = Math.max(
        0,
        1 - Math.abs(runtime.sectionPosition - 1)
      );
      const aboutDrift = reducedMotion
        ? 0
        : Math.sin(section.progress * Math.PI * 2) * 0.22 * aboutWeight;
      const contractionScale = 1 - runtime.contraction * 0.1;
      const targetScale =
        mix(
          mix(from.objectScale, to.objectScale, sectionMix),
          chatState.objectScale,
          chatMix
        ) * contractionScale;

      groupRef.current.position.x = damp(
        groupRef.current.position.x,
        mix(pageX, chatState.objectPosition[0], chatMix) + aboutDrift,
        3.2,
        delta
      );
      groupRef.current.position.y = damp(
        groupRef.current.position.y,
        mix(pageY, chatState.objectPosition[1], chatMix) -
          runtime.scrollVelocity * 0.14,
        3.2,
        delta
      );
      groupRef.current.position.z = damp(
        groupRef.current.position.z,
        mix(pageZ, chatState.objectPosition[2], chatMix),
        3.2,
        delta
      );
      groupRef.current.rotation.x = damp(
        groupRef.current.rotation.x,
        mix(
          mix(from.objectRotation[0], to.objectRotation[0], sectionMix),
          chatState.objectRotation[0],
          chatMix
        ) + runtime.pointerY * 0.08,
        3,
        delta
      );
      groupRef.current.rotation.y = damp(
        groupRef.current.rotation.y,
        mix(
          mix(from.objectRotation[1], to.objectRotation[1], sectionMix),
          chatState.objectRotation[1],
          chatMix
        ) +
          runtime.pointerX * 0.1 +
          runtime.scrollVelocity * 0.08,
        3,
        delta
      );
      groupRef.current.rotation.z = damp(
        groupRef.current.rotation.z,
        mix(
          mix(from.objectRotation[2], to.objectRotation[2], sectionMix),
          chatState.objectRotation[2],
          chatMix
        ),
        3,
        delta
      );
      groupRef.current.scale.setScalar(
        damp(groupRef.current.scale.x, targetScale, 3.1, delta)
      );
    }

    const cameraX =
      mix(
        mix(from.cameraPosition[0], to.cameraPosition[0], sectionMix),
        chatState.cameraPosition[0],
        chatMix
      ) + runtime.pointerX * 0.12;
    const cameraY =
      mix(
        mix(from.cameraPosition[1], to.cameraPosition[1], sectionMix),
        chatState.cameraPosition[1],
        chatMix
      ) + runtime.pointerY * 0.08;
    const cameraZ = mix(
      mix(from.cameraPosition[2], to.cameraPosition[2], sectionMix),
      chatState.cameraPosition[2],
      chatMix
    );
    camera.position.x = damp(camera.position.x, cameraX, 3, delta);
    camera.position.y = damp(camera.position.y, cameraY, 3, delta);
    camera.position.z = damp(camera.position.z, cameraZ, 3, delta);

    targetRef.current.set(
      mix(
        mix(from.cameraTarget[0], to.cameraTarget[0], sectionMix),
        chatState.cameraTarget[0],
        chatMix
      ),
      mix(
        mix(from.cameraTarget[1], to.cameraTarget[1], sectionMix),
        chatState.cameraTarget[1],
        chatMix
      ),
      mix(
        mix(from.cameraTarget[2], to.cameraTarget[2], sectionMix),
        chatState.cameraTarget[2],
        chatMix
      )
    );
    camera.lookAt(targetRef.current);

    frameHealthRef.current.time += rawDelta;
    frameHealthRef.current.frames += 1;
    if (frameHealthRef.current.time > 2.5) {
      const fps =
        frameHealthRef.current.frames / frameHealthRef.current.time;
      if (fps < 42 && !reducedMotion) qualityPerformance.regress();
      frameHealthRef.current.time = 0;
      frameHealthRef.current.frames = 0;
    }
  });

  return (
    <>
      <ambientLight intensity={0.18} />
      <pointLight
        position={[2.5, 2.8, 3.5]}
        intensity={1.15}
        color="#168cff"
      />
      <pointLight
        position={[-2.4, -1.6, 2]}
        intensity={0.75}
        color={secondaryLight}
      />
      <group ref={groupRef} position={SCENE_STATES.home.objectPosition}>
        <NeuralCore
          runtimeRef={runtimeRef}
          nodeCount={simplified ? 52 : 88}
          particleCount={simplified ? 240 : 620}
          simplified={simplified}
        />
      </group>
    </>
  );
}
