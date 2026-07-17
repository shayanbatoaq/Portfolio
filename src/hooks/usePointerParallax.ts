"use client";

import { useEffect, useRef } from "react";

export interface PointerSnapshot {
  x: number;
  y: number;
  active: boolean;
}

export function usePointerParallax(disabled: boolean) {
  const pointerRef = useRef<PointerSnapshot>({
    x: 0,
    y: 0,
    active: false,
  });

  useEffect(() => {
    if (disabled) {
      pointerRef.current = { x: 0, y: 0, active: false };
      return;
    }

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      pointerRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.y = -((event.clientY / window.innerHeight) * 2 - 1);
      pointerRef.current.active = true;
    };

    const reset = () => {
      pointerRef.current.x = 0;
      pointerRef.current.y = 0;
      pointerRef.current.active = false;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", reset);
    window.addEventListener("blur", reset);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("mouseleave", reset);
      window.removeEventListener("blur", reset);
    };
  }, [disabled]);

  return pointerRef;
}
