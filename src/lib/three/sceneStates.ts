export const PAGE_SECTION_IDS = [
  "home",
  "work",
  "about",
  "patricians",
  "philosophy",
  "contact",
] as const;

export type PageSectionId = (typeof PAGE_SECTION_IDS)[number];
export type SceneStateId = PageSectionId | "chat";
export type NeuralLayout =
  | "core"
  | "flow"
  | "orbits"
  | "modules"
  | "monolith"
  | "signal"
  | "active";
export type SceneVector = readonly [number, number, number];

export interface SceneState {
  layout: NeuralLayout;
  objectPosition: SceneVector;
  objectRotation: SceneVector;
  objectScale: number;
  cameraPosition: SceneVector;
  cameraTarget: SceneVector;
  particleDensity: number;
  nodeSpread: number;
  connectionIntensity: number;
  pulseSpeed: number;
  glowIntensity: number;
  morphAmount: number;
  orbitalSpeed: number;
  colorBalance: number;
  backgroundOpacity: number;
}

export const SCENE_STATES: Record<SceneStateId, SceneState> = {
  home: {
    layout: "core",
    objectPosition: [1.8, -0.1, -0.7],
    objectRotation: [0.08, -0.2, 0],
    objectScale: 0.96,
    cameraPosition: [0, 0, 7.4],
    cameraTarget: [0.35, 0, 0],
    particleDensity: 0.55,
    nodeSpread: 0.78,
    connectionIntensity: 0.44,
    pulseSpeed: 0.52,
    glowIntensity: 0.48,
    morphAmount: 0.08,
    orbitalSpeed: 0.18,
    colorBalance: 0.2,
    backgroundOpacity: 0.58,
  },
  about: {
    layout: "flow",
    objectPosition: [-1.55, 0, -0.85],
    objectRotation: [0.05, 0.18, -0.08],
    objectScale: 1.05,
    cameraPosition: [0, 0, 7.7],
    cameraTarget: [-0.15, 0, 0],
    particleDensity: 0.7,
    nodeSpread: 1.12,
    connectionIntensity: 0.58,
    pulseSpeed: 0.68,
    glowIntensity: 0.52,
    morphAmount: 0.34,
    orbitalSpeed: 0.22,
    colorBalance: 0.34,
    backgroundOpacity: 0.47,
  },
  philosophy: {
    layout: "orbits",
    objectPosition: [0.15, 0, -1],
    objectRotation: [0.16, -0.08, 0.08],
    objectScale: 1.08,
    cameraPosition: [0, 0.1, 8],
    cameraTarget: [0, 0, 0],
    particleDensity: 0.68,
    nodeSpread: 1.18,
    connectionIntensity: 0.62,
    pulseSpeed: 0.58,
    glowIntensity: 0.45,
    morphAmount: 0.56,
    orbitalSpeed: 0.26,
    colorBalance: 0.5,
    backgroundOpacity: 0.38,
  },
  work: {
    layout: "modules",
    objectPosition: [1.35, 0.1, -0.9],
    objectRotation: [-0.06, 0.2, 0.03],
    objectScale: 1.06,
    cameraPosition: [0, 0, 7.5],
    cameraTarget: [0.2, 0, 0],
    particleDensity: 0.76,
    nodeSpread: 1.24,
    connectionIntensity: 0.72,
    pulseSpeed: 0.8,
    glowIntensity: 0.52,
    morphAmount: 0.76,
    orbitalSpeed: 0.3,
    colorBalance: 0.58,
    backgroundOpacity: 0.36,
  },
  patricians: {
    layout: "monolith",
    objectPosition: [1.7, 0, -0.55],
    objectRotation: [0.02, -0.12, -0.04],
    objectScale: 1.12,
    cameraPosition: [0, 0, 7.2],
    cameraTarget: [0.35, 0, 0],
    particleDensity: 0.64,
    nodeSpread: 1.06,
    connectionIntensity: 0.78,
    pulseSpeed: 0.74,
    glowIntensity: 0.66,
    morphAmount: 0.9,
    orbitalSpeed: 0.2,
    colorBalance: 0.38,
    backgroundOpacity: 0.48,
  },
  contact: {
    layout: "signal",
    objectPosition: [0, 0.05, -0.7],
    objectRotation: [0, 0, 0],
    objectScale: 0.94,
    cameraPosition: [0, 0, 7.8],
    cameraTarget: [0, 0, 0],
    particleDensity: 0.48,
    nodeSpread: 0.72,
    connectionIntensity: 0.5,
    pulseSpeed: 0.46,
    glowIntensity: 0.46,
    morphAmount: 1,
    orbitalSpeed: 0.12,
    colorBalance: 0.48,
    backgroundOpacity: 0.42,
  },
  chat: {
    layout: "active",
    objectPosition: [0.9, 0, -0.35],
    objectRotation: [0.04, 0.08, 0],
    objectScale: 1.02,
    cameraPosition: [0, 0, 7.1],
    cameraTarget: [0.15, 0, 0],
    particleDensity: 0.82,
    nodeSpread: 0.92,
    connectionIntensity: 0.86,
    pulseSpeed: 1.05,
    glowIntensity: 0.72,
    morphAmount: 0.64,
    orbitalSpeed: 0.32,
    colorBalance: 0.64,
    backgroundOpacity: 0.54,
  },
};

export interface SceneRuntime {
  sectionPosition: number;
  chatMix: number;
  objectPosition: [number, number, number];
  objectRotation: [number, number, number];
  objectScale: number;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  particleDensity: number;
  nodeSpread: number;
  connectionIntensity: number;
  pulseSpeed: number;
  glowIntensity: number;
  morphAmount: number;
  orbitalSpeed: number;
  colorBalance: number;
  backgroundOpacity: number;
  pointerX: number;
  pointerY: number;
  scrollVelocity: number;
  reactionPulse: number;
  hoverActivity: number;
  signalWave: number;
  contraction: number;
  elapsed: number;
  reducedMotion: boolean;
  mobile: boolean;
}

export function createInitialRuntime(
  reducedMotion: boolean,
  mobile: boolean
): SceneRuntime {
  const state = SCENE_STATES.home;
  return {
    sectionPosition: 0,
    chatMix: 0,
    objectPosition: [...state.objectPosition],
    objectRotation: [...state.objectRotation],
    objectScale: state.objectScale,
    cameraPosition: [...state.cameraPosition],
    cameraTarget: [...state.cameraTarget],
    particleDensity: state.particleDensity,
    nodeSpread: state.nodeSpread,
    connectionIntensity: state.connectionIntensity,
    pulseSpeed: state.pulseSpeed,
    glowIntensity: state.glowIntensity,
    morphAmount: state.morphAmount,
    orbitalSpeed: state.orbitalSpeed,
    colorBalance: state.colorBalance,
    backgroundOpacity: state.backgroundOpacity,
    pointerX: 0,
    pointerY: 0,
    scrollVelocity: 0,
    reactionPulse: 0,
    hoverActivity: 0,
    signalWave: 0,
    contraction: 0,
    elapsed: 0,
    reducedMotion,
    mobile,
  };
}
