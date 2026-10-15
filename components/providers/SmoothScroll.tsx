"use client";

import * as React from "react";
import Lenis from "lenis";
import { registerLenis } from "@/lib/hooks/useScrollProgress";

export interface SmoothScrollProps {
  children: React.ReactNode;
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  React.useEffect(() => {
    if (typeof window === "undefined" || !("ResizeObserver" in window)) {
      return;
    }

    // Check if user prefers reduced motion
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    registerLenis(lenis);

    let animationFrameId: number;

    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      registerLenis(null);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}

export { SmoothScroll as SmoothScrollProvider };
