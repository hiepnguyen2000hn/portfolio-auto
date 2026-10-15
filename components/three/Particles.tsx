'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticlesProps {
  count?: number;
  radiusMin?: number;
  radiusMax?: number;
  speed?: number;
  seed?: number;
}

/**
 * Seeded Mulberry32 pseudo-random generator.
 * Pure and deterministic, avoiding React 19 react-hooks/purity lint errors.
 */
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
 * Generates particles buffer data deterministically
 */
function generateParticlesData(
  count: number,
  radiusMin: number,
  radiusMax: number,
  seed: number
): [Float32Array, Float32Array] {
  const prng = createPrng(seed);
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);

  // Color 1: Cyan (#22D3EE -> [0.133, 0.827, 0.933])
  const colorCyan = new THREE.Color('#22D3EE');
  // Color 2: Purple (#6E56CF -> [0.431, 0.337, 0.812])
  const colorPurple = new THREE.Color('#6E56CF');
  // Color 3: Light accent highlight
  const colorWhite = new THREE.Color('#E0E7FF');

  const tempColor = new THREE.Color();

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    // Uniform spherical shell distribution using deterministic PRNG
    const u = prng();
    const v = prng();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = radiusMin + prng() * (radiusMax - radiusMin);

    const sinPhi = Math.sin(phi);
    pos[i3] = r * sinPhi * Math.cos(theta);
    pos[i3 + 1] = r * sinPhi * Math.sin(theta);
    pos[i3 + 2] = r * Math.cos(phi);

    // Interpolate colors based on deterministic PRNG
    const mixRatio = prng();
    if (mixRatio < 0.45) {
      tempColor.copy(colorCyan).lerp(colorWhite, prng() * 0.3);
    } else if (mixRatio < 0.9) {
      tempColor.copy(colorPurple).lerp(colorWhite, prng() * 0.3);
    } else {
      tempColor.copy(colorWhite);
    }

    col[i3] = tempColor.r;
    col[i3 + 1] = tempColor.g;
    col[i3 + 2] = tempColor.b;
  }

  return [pos, col];
}

/**
 * Particles
 *
 * Renders an optimized 3D particle swarm distributed uniformly
 * across a spherical shell (radius 2.5 to 3.5), with custom vertex colors
 * blending purple (#6E56CF) and cyan (#22D3EE).
 */
export function Particles({
  count = 1200,
  radiusMin = 2.5,
  radiusMax = 3.5,
  speed = 0.05,
  seed = 42,
}: ParticlesProps): React.JSX.Element {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate spherical particle positions and two-tone vertex colors deterministically
  const [positions, colors] = useMemo(() => {
    return generateParticlesData(count, radiusMin, radiusMax, seed);
  }, [count, radiusMin, radiusMax, seed]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    // Slow ambient rotation around multiple axes
    pointsRef.current.rotation.y += delta * speed;
    pointsRef.current.rotation.x += delta * (speed * 0.35);

    // Subtle gentle breathing effect
    const time = state.clock.getElapsedTime();
    const scale = 1 + Math.sin(time * 0.8) * 0.02;
    pointsRef.current.scale.set(scale, scale, scale);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

export default Particles;
