'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

export interface TiltProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // default 6 degrees
  specular?: boolean;
}

export function Tilt({
  children,
  className = '',
  maxTilt = 6,
  specular = true,
}: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Motion values for tilt angles
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Springs for realistic glass/ice inertia
  const rotateX = useSpring(x, { damping: 20, stiffness: 300 });
  const rotateY = useSpring(y, { damping: 20, stiffness: 300 });

  // Specular reflection position
  const [glarePos, setGlarePos] = useState<{ x: number; y: number } | null>(null);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const pointerX = e.clientX - rect.left;
    const pointerY = e.clientY - rect.top;

    const normX = (pointerX / width) * 2 - 1; // -1 to 1
    const normY = (pointerY / height) * 2 - 1; // -1 to 1

    x.set(-normY * maxTilt);
    y.set(normX * maxTilt);

    if (specular) {
      setGlarePos({
        x: (pointerX / width) * 100,
        y: (pointerY / height) * 100,
      });
    }
  };

  const handlePointerLeave = () => {
    if (prefersReducedMotion) return;
    x.set(0);
    y.set(0);
    setGlarePos(null);
  };

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className={`relative perspective-1000 ${className}`}
    >
      {children}

      {/* Specular Ice Highlight Overlay */}
      {specular && glarePos && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 240px at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.16), transparent 80%)`,
            zIndex: 10,
          }}
        />
      )}
    </motion.div>
  );
}

export default Tilt;
