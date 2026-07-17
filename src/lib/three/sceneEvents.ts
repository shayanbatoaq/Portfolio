export const SCENE_REACTION_EVENT = "shayan:scene-reaction";

export type SceneReactionType =
  | "filter-change"
  | "project-hover"
  | "patricians-hover"
  | "chat-open"
  | "message-submit"
  | "chat-reading";

export interface SceneReaction {
  type: SceneReactionType;
  strength: number;
}

export function emitSceneReaction(
  type: SceneReactionType,
  strength = 1
): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<SceneReaction>(SCENE_REACTION_EVENT, {
      detail: { type, strength },
    })
  );
}

export function subscribeToSceneReactions(
  handler: (reaction: SceneReaction) => void
): () => void {
  if (typeof window === "undefined") return () => undefined;

  const listener = (event: Event) => {
    handler((event as CustomEvent<SceneReaction>).detail);
  };

  window.addEventListener(SCENE_REACTION_EVENT, listener);
  return () => window.removeEventListener(SCENE_REACTION_EVENT, listener);
}
