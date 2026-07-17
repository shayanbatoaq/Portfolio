import { Vector3 } from "three";

import type { NeuralLayout } from "@/lib/three/sceneStates";

const TAU = Math.PI * 2;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

function seeded(index: number, offset: number): number {
  const value = Math.sin(index * 12.9898 + offset * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

export function writeNodePosition(
  layout: NeuralLayout,
  index: number,
  count: number,
  time: number,
  target: Vector3
): Vector3 {
  const progress = (index + 0.5) / count;
  const phase = index * GOLDEN_ANGLE;

  switch (layout) {
    case "core": {
      const y = 1 - progress * 2;
      const radius = Math.sqrt(Math.max(0, 1 - y * y));
      const breath = 0.84 + Math.sin(time * 0.5 + index * 0.37) * 0.035;
      return target.set(
        Math.cos(phase) * radius * breath,
        y * breath,
        Math.sin(phase) * radius * breath
      );
    }
    case "flow": {
      const y = (progress - 0.5) * 3.8;
      const strand = index % 3;
      const angle = y * 1.45 + strand * (TAU / 3) + time * 0.07;
      return target.set(
        Math.sin(angle) * (0.48 + strand * 0.1),
        y,
        Math.cos(angle) * (0.38 + strand * 0.08)
      );
    }
    case "orbits": {
      const cluster = index % 4;
      const localIndex = Math.floor(index / 4);
      const localCount = Math.ceil(count / 4);
      const angle = (localIndex / localCount) * TAU + time * 0.045;
      const centerX = cluster % 2 === 0 ? -0.95 : 0.95;
      const centerY = cluster < 2 ? 0.68 : -0.68;
      const radius = 0.3 + seeded(index, 2) * 0.22;
      return target.set(
        centerX + Math.cos(angle) * radius,
        centerY + Math.sin(angle) * radius * 0.72,
        Math.sin(angle * 2 + cluster) * 0.3
      );
    }
    case "modules": {
      const columns = 5;
      const rows = Math.ceil(count / columns);
      const column = index % columns;
      const row = Math.floor(index / columns);
      const jitter = (seeded(index, 4) - 0.5) * 0.08;
      return target.set(
        (column - (columns - 1) / 2) * 0.48 + jitter,
        (row - (rows - 1) / 2) * 0.34,
        ((index % 3) - 1) * 0.34 + Math.sin(time * 0.08 + index) * 0.025
      );
    }
    case "monolith": {
      const satelliteStart = Math.floor(count * 0.72);
      if (index < satelliteStart) {
        const columns = 4;
        const rows = Math.ceil(satelliteStart / columns);
        const column = index % columns;
        const row = Math.floor(index / columns);
        return target.set(
          (column - 1.5) * 0.24,
          (row - (rows - 1) / 2) * 0.24,
          ((column + row) % 2 === 0 ? -1 : 1) * 0.2
        );
      }

      const satelliteProgress =
        (index - satelliteStart) / Math.max(count - satelliteStart, 1);
      const angle = satelliteProgress * TAU + time * 0.06;
      return target.set(
        Math.cos(angle) * 1.15,
        Math.sin(angle * 2) * 0.72,
        Math.sin(angle) * 0.58
      );
    }
    case "signal": {
      const angle = progress * TAU * 2;
      const radius = 0.16 + progress * 0.62;
      return target.set(
        Math.cos(angle) * radius,
        (progress - 0.5) * 0.72,
        Math.sin(angle) * radius * 0.5
      );
    }
    case "active": {
      const strand = index % 2;
      const angle = progress * TAU * 3 + strand * Math.PI + time * 0.2;
      const radius = 0.48 + Math.sin(progress * Math.PI) * 0.34;
      return target.set(
        Math.cos(angle) * radius,
        (progress - 0.5) * 1.9,
        Math.sin(angle) * radius
      );
    }
  }
}
