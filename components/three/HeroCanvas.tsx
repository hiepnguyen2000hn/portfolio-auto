'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useCanRender3D } from '@/lib/hooks/useCanRender3D';
import { HeroFallback } from './HeroFallback';

/**
 * Dynamic import of HeroScene with SSR disabled to prevent
 * any WebGL / canvas server-side rendering errors, with
 * HeroFallback provided as loading placeholder.
 */
const DynamicHeroScene = dynamic(
  () => import('./HeroScene').then((mod) => mod.HeroScene),
  {
    ssr: false,
    loading: () => <HeroFallback />,
  }
);

interface HeroCanvasProps {
  className?: string;
}

/**
 * HeroCanvas
 *
 * Client boundary managing 3D render capability checks and viewport visibility.
 * If 3D rendering is not supported (hardware, data saver, or reduced motion),
 * falls back gracefully to CSS-based `HeroFallback`.
 * When out of viewport, uses `IntersectionObserver` to pause the R3F render loop.
 */
export function HeroCanvas({ className = '' }: HeroCanvasProps): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const canRender3D = useCanRender3D();
  const [isInView, setIsInView] = useState<boolean>(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) {
          setIsInView(entry.isIntersecting);
        }
      },
      {
        threshold: 0.05,
        rootMargin: '120px',
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative flex h-full w-full items-center justify-center ${className}`}
    >
      {canRender3D ? (
        <DynamicHeroScene isInView={isInView} />
      ) : (
        <HeroFallback />
      )}
    </div>
  );
}

export default HeroCanvas;
