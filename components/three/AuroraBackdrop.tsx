'use client';

import React, { useRef, useEffect } from 'react';
import { globalScrollProgress } from '@/lib/hooks/useScrollProgress';
import { useCanRender3D } from '@/lib/hooks/useCanRender3D';

/**
 * AuroraBackdrop
 *
 * Full-page, fixed, pointer-events-none ambient background backdrop.
 * Renders flowing aurora curves using the arctic aurora color stops:
 * - Aurora Teal: #2DD4BF
 * - Primary Sky: #38BDF8
 * - Deep Aurora: #4F7CFF
 *
 * Driven smoothly by page scroll progress at ~20% opacity,
 * pauses rendering when offscreen or document is hidden to conserve GPU.
 */
export function AuroraBackdrop(): React.JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canRender3D = useCanRender3D();

  useEffect(() => {
    if (!canRender3D) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;

    const handleResize = () => {
      canvas.width = Math.min(window.innerWidth, 1920);
      canvas.height = Math.min(window.innerHeight, 1080);
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    const handleVisibility = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    let time = 0;

    const render = () => {
      if (isVisible) {
        time += 0.008;
        const width = canvas.width;
        const height = canvas.height;
        const scrollP = globalScrollProgress.get();

        ctx.clearRect(0, 0, width, height);

        // Aurora Wave 1: Teal (#2DD4BF)
        const grad1 = ctx.createRadialGradient(
          width * (0.3 + Math.sin(time * 0.7) * 0.15),
          height * (0.2 + scrollP * 0.3),
          50,
          width * 0.4,
          height * 0.4,
          width * 0.6
        );
        grad1.addColorStop(0, 'rgba(45, 212, 191, 0.18)');
        grad1.addColorStop(0.6, 'rgba(45, 212, 191, 0.05)');
        grad1.addColorStop(1, 'rgba(45, 212, 191, 0)');
        ctx.fillStyle = grad1;
        ctx.fillRect(0, 0, width, height);

        // Aurora Wave 2: Sky Blue (#38BDF8)
        const grad2 = ctx.createRadialGradient(
          width * (0.7 + Math.cos(time * 0.6) * 0.15),
          height * (0.5 + Math.sin(time * 0.5) * 0.1),
          80,
          width * 0.65,
          height * 0.55,
          width * 0.55
        );
        grad2.addColorStop(0, 'rgba(56, 189, 248, 0.16)');
        grad2.addColorStop(0.5, 'rgba(56, 189, 248, 0.04)');
        grad2.addColorStop(1, 'rgba(56, 189, 248, 0)');
        ctx.fillStyle = grad2;
        ctx.fillRect(0, 0, width, height);

        // Aurora Wave 3: Deep Aurora Blue (#4F7CFF)
        const grad3 = ctx.createRadialGradient(
          width * (0.5 + Math.sin(time * 0.4) * 0.2),
          height * (0.8 - scrollP * 0.2),
          100,
          width * 0.5,
          height * 0.7,
          width * 0.7
        );
        grad3.addColorStop(0, 'rgba(79, 124, 255, 0.14)');
        grad3.addColorStop(0.6, 'rgba(79, 124, 255, 0.03)');
        grad3.addColorStop(1, 'rgba(79, 124, 255, 0)');
        ctx.fillStyle = grad3;
        ctx.fillRect(0, 0, width, height);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [canRender3D]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-30 overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full opacity-90 transition-opacity duration-1000"
      />
    </div>
  );
}

export default AuroraBackdrop;
