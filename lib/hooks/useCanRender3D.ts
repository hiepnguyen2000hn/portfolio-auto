'use client';

import { useSyncExternalStore } from 'react';

export type Render3DTier = 'full' | 'reduced' | 'fallback';

export interface CapabilitySnapshot {
  tier: Render3DTier;
  canRender3D: boolean;
}

function evaluateCapabilities(): CapabilitySnapshot {
  if (typeof window === 'undefined') {
    return { tier: 'fallback', canRender3D: false };
  }

  try {
    // 1. Check prefers-reduced-motion: immediate fallback
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches) {
      return { tier: 'fallback', canRender3D: false };
    }

    // 2. Data saver mode: immediate fallback
    const navWithConn = navigator as unknown as {
      connection?: { saveData?: boolean };
    };
    if (navWithConn.connection?.saveData === true) {
      return { tier: 'fallback', canRender3D: false };
    }

    // 3. Check WebGL support (webgl2 / webgl)
    const canvas = document.createElement('canvas');
    const gl = (canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')) as
      | WebGLRenderingContext
      | WebGL2RenderingContext
      | null;

    if (!gl) {
      return { tier: 'fallback', canRender3D: false };
    }

    // Clean up test context
    const loseContext = gl.getExtension('WEBGL_lose_context');
    if (loseContext) {
      loseContext.loseContext();
    }

    // 4. Low-power mobile devices: concurrency <= 4 and mobile screen width
    // Middle tier 'reduced': crystal only, no shards, no snow, dpr 1
    const concurrency = navigator.hardwareConcurrency ?? 4;
    const isMobileWidth = window.innerWidth < 768;
    if (concurrency <= 4 && isMobileWidth) {
      return { tier: 'reduced', canRender3D: true };
    }

    // Full tier: full 3D scene with crystal, shards, and snow drift
    return { tier: 'full', canRender3D: true };
  } catch {
    return { tier: 'fallback', canRender3D: false };
  }
}

// Client snapshot cache
let cachedSnapshot: CapabilitySnapshot | null = null;

function getSnapshot(): CapabilitySnapshot {
  if (cachedSnapshot === null) {
    cachedSnapshot = evaluateCapabilities();
  }
  return cachedSnapshot;
}

const SERVER_SNAPSHOT: CapabilitySnapshot = {
  tier: 'fallback',
  canRender3D: false,
};

function getServerSnapshot(): CapabilitySnapshot {
  return SERVER_SNAPSHOT;
}

function subscribe(onStoreChange: () => void): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const handleMotionChange = () => {
    cachedSnapshot = evaluateCapabilities();
    onStoreChange();
  };

  motionQuery.addEventListener?.('change', handleMotionChange);

  return () => {
    motionQuery.removeEventListener?.('change', handleMotionChange);
  };
}

/**
 * Hook to retrieve the 3D capability tier:
 * - 'full': crystal core + orbiting shards + snow drift + full dpr
 * - 'reduced': crystal core only, dpr 1, for constrained mobile devices
 * - 'fallback': static CSS frosted aurora fallback (no WebGL)
 */
export function use3DCapability(): CapabilitySnapshot {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Hook returning whether 3D rendering is enabled ('full' or 'reduced')
 */
export function useCanRender3D(): boolean {
  return use3DCapability().canRender3D;
}

/**
 * Resets the cached capability snapshot (used in test environments)
 */
export function resetCanRender3DCache(): void {
  cachedSnapshot = null;
}
