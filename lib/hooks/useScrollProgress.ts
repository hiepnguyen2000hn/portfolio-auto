'use client';

import { useScroll, type MotionValue, motionValue } from 'framer-motion';
import type React from 'react';
import type Lenis from 'lenis';

/**
 * Singleton MotionValue holding the page scroll progress [0, 1].
 * Shared globally so that only a single scroll subscription exists for the entire app.
 */
export const globalScrollProgress: MotionValue<number> = motionValue(0);

let activeLenis: Lenis | null = null;
let removeLenisHandler: (() => void) | null = null;

/**
 * Registers the active Lenis instance to drive globalScrollProgress.
 * Called exclusively by SmoothScroll provider.
 */
export function registerLenis(lenis: Lenis | null): void {
  if (removeLenisHandler) {
    removeLenisHandler();
    removeLenisHandler = null;
  }

  activeLenis = lenis;

  if (lenis) {
    const handler = (e: { progress: number }) => {
      globalScrollProgress.set(Math.max(0, Math.min(1, e.progress)));
    };
    lenis.on('scroll', handler);
    removeLenisHandler = () => {
      lenis.off('scroll', handler);
    };
  }
}

/**
 * Returns the global page scroll progress (MotionValue from 0 to 1).
 */
export function useScrollProgress(): MotionValue<number> {
  return globalScrollProgress;
}

/**
 * Hook for per-element scroll progress (e.g., parallax, draw-on-scroll).
 * Uses Framer Motion's element-relative calculation.
 */
export function useElementScrollProgress(
  targetRef: React.RefObject<HTMLElement | null>,
  offset: [string, string] = ['start end', 'end start']
): MotionValue<number> {
  const { scrollYProgress } = useScroll({
    target: targetRef as React.RefObject<HTMLElement>,
    offset: offset as unknown as ["start end", "end start"],
  });
  return scrollYProgress;
}
