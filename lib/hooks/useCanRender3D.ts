'use client';

import { useSyncExternalStore } from 'react';

function checkCapabilities(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    // 1. Check prefers-reduced-motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches) {
      return false;
    }

    // 2. Check WebGL support (webgl2 / webgl)
    const canvas = document.createElement('canvas');
    const gl = (canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')) as
      | WebGLRenderingContext
      | WebGL2RenderingContext
      | null;

    if (!gl) {
      return false;
    }

    // Release test WebGL context if extension available
    const loseContext = gl.getExtension('WEBGL_lose_context');
    if (loseContext) {
      loseContext.loseContext();
    }

    // 3. Check low-end device constraints
    // - hardwareConcurrency <= 4 and screen width < 768px
    const concurrency = navigator.hardwareConcurrency ?? 4;
    const isMobileWidth = window.innerWidth < 768;
    if (concurrency <= 4 && isMobileWidth) {
      return false;
    }

    // - Data saver mode
    const navWithConn = navigator as unknown as {
      connection?: { saveData?: boolean };
    };
    if (navWithConn.connection?.saveData === true) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

// Client snapshot cache to maintain referential stability for useSyncExternalStore
let cachedSnapshot: boolean | null = null;

function getSnapshot(): boolean {
  if (cachedSnapshot === null) {
    cachedSnapshot = checkCapabilities();
  }
  return cachedSnapshot;
}

function getServerSnapshot(): boolean {
  return false;
}

function subscribe(onStoreChange: () => void): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const handleMotionChange = () => {
    cachedSnapshot = checkCapabilities();
    onStoreChange();
  };

  motionQuery.addEventListener?.('change', handleMotionChange);

  return () => {
    motionQuery.removeEventListener?.('change', handleMotionChange);
  };
}

/**
 * Hook to detect whether the current client device/browser is capable of and
 * suitable for rendering 3D WebGL scenes.
 *
 * Checks:
 * 1. prefers-reduced-motion: Returns false if user prefers reduced motion
 * 2. WebGL availability: Verifies webgl2 or webgl context creation on a test canvas
 * 3. Low-end device constraints:
 *    - navigator.hardwareConcurrency <= 4 AND viewport width < 768px
 *    - Data saver mode enabled (navigator.connection?.saveData === true)
 *
 * Implemented using useSyncExternalStore to eliminate cascading effect renders and ensure SSR safety.
 */
export function useCanRender3D(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Resets the cached snapshot (primarily used in test environments)
 */
export function resetCanRender3DCache(): void {
  cachedSnapshot = null;
}
