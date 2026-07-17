"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  DynamicDrawUsage,
  InstancedMesh,
  LineBasicMaterial,
  Matrix4,
  MeshBasicMaterial,
  Quaternion,
  Vector3,
} from "three";
import type { MutableRefObject } from "react";

import { writeNodePosition } from "@/lib/three/nodeLayouts";
import {
  PAGE_SECTION_IDS,
  SCENE_STATES,
  type SceneRuntime,
} from "@/lib/three/sceneStates";

interface NodeNetworkProps {
  runtimeRef: MutableRefObject<SceneRuntime>;
  count: number;
}

export default function NodeNetwork({
  runtimeRef,
  count,
}: NodeNetworkProps) {
  const nodesRef = useRef<InstancedMesh>(null);
  const nodeMaterialRef = useRef<MeshBasicMaterial>(null);
  const linesRef = useRef<BufferGeometry>(null);
  const lineMaterialRef = useRef<LineBasicMaterial>(null);

  const linePositions = useMemo(() => new Float32Array(count * 4 * 3), [count]);
  const pageA = useMemo(
    () => Array.from({ length: count }, () => new Vector3()),
    [count]
  );
  const pageB = useMemo(
    () => Array.from({ length: count }, () => new Vector3()),
    [count]
  );
  const chatPositions = useMemo(
    () => Array.from({ length: count }, () => new Vector3()),
    [count]
  );
  const finalPositions = useMemo(
    () => Array.from({ length: count }, () => new Vector3()),
    [count]
  );
  const matrix = useMemo(() => new Matrix4(), []);
  const quaternion = useMemo(() => new Quaternion(), []);
  const scale = useMemo(() => new Vector3(), []);
  const primary = useMemo(() => new Color("#3a8cff"), []);
  const secondary = useMemo(() => new Color("#8857ff"), []);
  const mixedColor = useMemo(() => new Color(), []);

  useEffect(() => {
    const attribute = linesRef.current?.getAttribute("position");
    if (attribute instanceof BufferAttribute) {
      attribute.setUsage(DynamicDrawUsage);
    }
  }, []);

  useFrame(() => {
    const runtime = runtimeRef.current;
    const sectionPosition = Math.max(
      0,
      Math.min(PAGE_SECTION_IDS.length - 1, runtime.sectionPosition)
    );
    const firstIndex = Math.floor(sectionPosition);
    const secondIndex = Math.min(firstIndex + 1, PAGE_SECTION_IDS.length - 1);
    const sectionMix = sectionPosition - firstIndex;
    const firstLayout = SCENE_STATES[PAGE_SECTION_IDS[firstIndex]].layout;
    const secondLayout = SCENE_STATES[PAGE_SECTION_IDS[secondIndex]].layout;
    const chatLayout = SCENE_STATES.chat.layout;
    const activeCount = Math.max(
      18,
      Math.floor(count * (0.58 + runtime.particleDensity * 0.42))
    );

    for (let index = 0; index < count; index += 1) {
      writeNodePosition(
        firstLayout,
        index,
        count,
        runtime.elapsed,
        pageA[index]
      );
      writeNodePosition(
        secondLayout,
        index,
        count,
        runtime.elapsed,
        pageB[index]
      );
      writeNodePosition(
        chatLayout,
        index,
        count,
        runtime.elapsed,
        chatPositions[index]
      );

      const position = finalPositions[index]
        .lerpVectors(pageA[index], pageB[index], sectionMix)
        .lerp(chatPositions[index], runtime.chatMix)
        .multiplyScalar(runtime.nodeSpread);
      position.z *= 0.9 + runtime.morphAmount * 0.24;

      if (!runtime.mobile && !runtime.reducedMotion) {
        const pointerX = runtime.pointerX * 1.65;
        const pointerY = runtime.pointerY * 1.1;
        const deltaX = position.x - pointerX;
        const deltaY = position.y - pointerY;
        const distanceSquared = deltaX * deltaX + deltaY * deltaY;
        const influence = Math.max(0, 1 - distanceSquared / 1.25) * 0.09;
        if (influence > 0) {
          position.x += deltaX * influence;
          position.y += deltaY * influence;
        }
      }

      const nodeScale =
        index < activeCount
          ? (0.72 + (index % 5) * 0.065) *
            (1 + runtime.reactionPulse * 0.12)
          : 0.001;
      scale.setScalar(nodeScale);
      matrix.compose(position, quaternion, scale);
      nodesRef.current?.setMatrixAt(index, matrix);
    }

    if (nodesRef.current) nodesRef.current.instanceMatrix.needsUpdate = true;

    let cursor = 0;
    for (let index = 0; index < count; index += 1) {
      const next = (index + 1) % count;
      const cross = (index + 7) % count;
      const source = finalPositions[index];
      const nextPosition = finalPositions[next];
      const crossPosition = finalPositions[cross];

      linePositions[cursor++] = source.x;
      linePositions[cursor++] = source.y;
      linePositions[cursor++] = source.z;
      linePositions[cursor++] = nextPosition.x;
      linePositions[cursor++] = nextPosition.y;
      linePositions[cursor++] = nextPosition.z;
      linePositions[cursor++] = source.x;
      linePositions[cursor++] = source.y;
      linePositions[cursor++] = source.z;
      linePositions[cursor++] = crossPosition.x;
      linePositions[cursor++] = crossPosition.y;
      linePositions[cursor++] = crossPosition.z;
    }

    const lineAttribute = linesRef.current?.getAttribute("position");
    if (lineAttribute) lineAttribute.needsUpdate = true;
    linesRef.current?.setDrawRange(0, activeCount * 4);

    mixedColor.lerpColors(primary, secondary, runtime.colorBalance);
    if (nodeMaterialRef.current) {
      nodeMaterialRef.current.color.copy(mixedColor);
      nodeMaterialRef.current.opacity =
        runtime.backgroundOpacity *
        (0.32 + runtime.glowIntensity * 0.28);
    }
    if (lineMaterialRef.current) {
      lineMaterialRef.current.color.copy(mixedColor);
      lineMaterialRef.current.opacity =
        runtime.backgroundOpacity *
        runtime.connectionIntensity *
        (0.13 + runtime.hoverActivity * 0.07);
    }
  });

  return (
    <>
      <instancedMesh
        ref={nodesRef}
        args={[undefined, undefined, count]}
        frustumCulled={false}
      >
        <sphereGeometry args={[0.042, 7, 7]} />
        <meshBasicMaterial
          ref={nodeMaterialRef}
          transparent
          opacity={0.5}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </instancedMesh>

      <lineSegments frustumCulled={false}>
        <bufferGeometry ref={linesRef}>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          ref={lineMaterialRef}
          transparent
          opacity={0.12}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </lineSegments>
    </>
  );
}
