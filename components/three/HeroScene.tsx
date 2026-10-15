'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { Particles } from './Particles';
import { globalScrollProgress } from '@/lib/hooks/useScrollProgress';
import type { Render3DTier } from '@/lib/hooks/useCanRender3D';

interface FrostShardsProps {
  count?: number;
}

/**
 * FrostShards
 *
 * 8 thin flat ice shards orbiting the core at varying radii and speeds,
 * rendered via InstancedMesh for a single draw call.
 */
function FrostShards({ count = 8 }: FrostShardsProps): React.JSX.Element {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Compute deterministic orbit parameters for each shard
  const shardsData = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      radius: 2.2 + (i % 4) * 0.35,
      speed: 0.2 + (i * 0.08),
      yOffset: ((i / count) - 0.5) * 1.8,
      angleOffset: (i / count) * Math.PI * 2,
      rotSpeedX: 0.4 + (i * 0.1),
      rotSpeedY: 0.5 + (i * 0.12),
      scale: 0.25 + (i % 3) * 0.08,
    }));
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();

    shardsData.forEach((shard, i) => {
      const angle = time * shard.speed + shard.angleOffset;
      const x = Math.cos(angle) * shard.radius;
      const z = Math.sin(angle) * shard.radius;
      const y = shard.yOffset + Math.sin(time * 0.5 + i) * 0.2;

      dummy.position.set(x, y, z);
      dummy.rotation.set(
        time * shard.rotSpeedX,
        time * shard.rotSpeedY,
        angle
      );
      dummy.scale.set(shard.scale, shard.scale * 1.6, shard.scale * 0.2);
      dummy.updateMatrix();

      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <coneGeometry args={[0.5, 1, 3]} />
      <meshStandardMaterial
        color="#EAF4FB"
        roughness={0.15}
        metalness={0.8}
        transparent
        opacity={0.65}
      />
    </instancedMesh>
  );
}

interface CoreCrystalProps {
  isReducedTier?: boolean;
}

/**
 * CoreCrystal
 *
 * Faceted ice crystal icosahedron using MeshTransmissionMaterial
 * with ior ≈ 1.31 (real ice refraction) and soft chromatic aberration.
 */
function CoreCrystal({ isReducedTier = false }: CoreCrystalProps): React.JSX.Element {
  const crystalRef = useRef<THREE.Mesh>(null);
  const outerWireRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (crystalRef.current) {
      // Gentle constant rotation
      crystalRef.current.rotation.x += delta * 0.18;
      crystalRef.current.rotation.y += delta * 0.28;
    }

    if (outerWireRef.current) {
      outerWireRef.current.rotation.x -= delta * 0.12;
      outerWireRef.current.rotation.z += delta * 0.16;
    }
  });

  return (
    <group>
      {/* Hairline subtle geometric cage */}
      <mesh ref={outerWireRef}>
        <icosahedronGeometry args={[1.75, 1]} />
        <meshBasicMaterial
          color="#7DF9FF"
          wireframe
          transparent
          opacity={0.18}
        />
      </mesh>

      {/* Main Ice Crystal Core */}
      <mesh ref={crystalRef}>
        <icosahedronGeometry args={[1.35, 1]} />
        {isReducedTier ? (
          <meshStandardMaterial
            color="#0B1420"
            roughness={0.1}
            metalness={0.85}
            emissive="#38BDF8"
            emissiveIntensity={0.3}
          />
        ) : (
          <MeshTransmissionMaterial
            resolution={256}
            samples={4}
            ior={1.31}
            transmission={0.96}
            thickness={0.8}
            roughness={0.06}
            chromaticAberration={0.06}
            color="#EAF4FB"
            distortion={0.15}
            temporalDistortion={0.1}
          />
        )}
      </mesh>
    </group>
  );
}

interface SceneContentProps {
  tier: Render3DTier;
}

/**
 * SceneContent
 *
 * Handles camera dolly, scroll rotation, lights, and capability tier branching.
 */
function SceneContent({ tier }: SceneContentProps): React.JSX.Element {
  const groupRef = useRef<THREE.Group>(null);
  const pointerLightRef = useRef<THREE.PointLight>(null);
  const { camera } = useThree();

  useFrame((state) => {
    // 1. Read shared scroll progress without extra scroll event listener
    const scrollP = globalScrollProgress.get();

    // Camera dollies z: 5.8 -> 7.5
    const targetZ = 5.8 + scrollP * 1.7;
    camera.position.z += (targetZ - camera.position.z) * 0.1;

    // Group rotates ~25° (0.43 rad) across scroll range
    if (groupRef.current) {
      const scrollRotation = scrollP * 0.43;
      const targetRotY = state.pointer.x * 0.35 + scrollRotation;
      const targetRotX = -state.pointer.y * 0.35;

      groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * 0.05;
      groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * 0.05;
    }

    // 2. Small pointer-following light across crystal surface
    if (pointerLightRef.current) {
      pointerLightRef.current.position.x = state.pointer.x * 3;
      pointerLightRef.current.position.y = state.pointer.y * 3;
    }
  });

  const isReduced = tier === 'reduced';

  return (
    <>
      <ambientLight intensity={0.8} />

      {/* Two rim lights in aurora stops */}
      <directionalLight
        position={[-5, 4, 3]}
        intensity={2.6}
        color="#38BDF8"
      />
      <directionalLight
        position={[5, -3, 3]}
        intensity={2.8}
        color="#2DD4BF"
      />

      {/* Pointer-following specular light */}
      <pointLight
        ref={pointerLightRef}
        position={[0, 0, 3]}
        intensity={1.8}
        color="#7DF9FF"
        distance={8}
      />

      <group ref={groupRef}>
        <CoreCrystal isReducedTier={isReduced} />
        {!isReduced && <FrostShards count={8} />}
      </group>

      {!isReduced && <Particles count={600} />}
    </>
  );
}

export interface HeroSceneProps {
  className?: string;
  isInView?: boolean;
  tier?: Render3DTier;
}

/**
 * HeroScene
 *
 * R3F Canvas configured with Drei MeshTransmissionMaterial ice crystal,
 * instanced frost shards, falling snow drift, and scroll camera dolly.
 */
export function HeroScene({
  className = '',
  isInView = true,
  tier = 'full',
}: HeroSceneProps): React.JSX.Element {
  return (
    <div className={`relative h-full w-full min-h-[360px] md:min-h-[500px] ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5.8], fov: 45 }}
        dpr={tier === 'reduced' ? 1 : [1, 1.5]}
        frameloop={isInView ? 'always' : 'never'}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ width: '100%', height: '100%', pointerEvents: 'auto' }}
      >
        <SceneContent tier={tier} />
      </Canvas>
    </div>
  );
}

export default HeroScene;
