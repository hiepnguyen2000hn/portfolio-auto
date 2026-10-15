'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticlesProps {
  count?: number;
  speed?: number;
  seed?: number;
}

function createPrng(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Creates a soft radial circular sprite texture for delicate snowflakes
 */
function createSnowTexture(): THREE.Texture | null {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  gradient.addColorStop(0, 'rgba(234, 244, 251, 1)');
  gradient.addColorStop(0.4, 'rgba(125, 249, 255, 0.7)');
  gradient.addColorStop(1, 'rgba(125, 249, 255, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 32, 32);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * SnowDrift (Particles)
 *
 * 600 points gently falling through a tall box, wrapping seamlessly at the bottom,
 * and drifting horizontally on a sine wave.
 */
export function Particles({
  count = 600,
  speed = 0.6,
  seed = 42,
}: ParticlesProps): React.JSX.Element {
  const pointsRef = useRef<THREE.Points>(null);
  const snowTexture = useMemo(() => createSnowTexture(), []);

  // Initialize initial positions and individual drift offsets deterministically
  const [positions, driftOffsets, speeds] = useMemo(() => {
    const prng = createPrng(seed);
    const pos = new Float32Array(count * 3);
    const offsets = new Float32Array(count);
    const spds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Tall bounding box: X [-5, 5], Y [-4.5, 4.5], Z [-3.5, 3.5]
      pos[i3] = (prng() - 0.5) * 10;
      pos[i3 + 1] = (prng() - 0.5) * 9;
      pos[i3 + 2] = (prng() - 0.5) * 7;

      offsets[i] = prng() * Math.PI * 2;
      spds[i] = 0.4 + prng() * 0.6;
    }

    return [pos, offsets, spds];
  }, [count, seed]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position;
    if (!posAttr) return;
    const array = posAttr.array as Float32Array;
    const time = state.clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const spd = speeds[i] ?? 0.5;
      const offset = driftOffsets[i] ?? 0;

      // Fall vertically
      array[i3 + 1] = (array[i3 + 1] ?? 0) - spd * speed * delta;

      // Wrap at bottom
      if ((array[i3 + 1] ?? 0) < -4.5) {
        array[i3 + 1] = 4.5;
      }

      // Gentle horizontal sine drift
      array[i3] = (array[i3] ?? 0) + Math.sin(time * 0.8 + offset) * 0.003;
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.065}
        map={snowTexture || undefined}
        transparent
        opacity={0.7}
        color="#EAF4FB"
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

export default Particles;
