'use client';

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Particles } from './Particles';

interface CoreMeshProps {
  isHovered: boolean;
  onHover: (hovered: boolean) => void;
}

/**
 * CoreMesh
 *
 * Faceted metallic icosahedron core with an outer geometric wireframe cage.
 * Responds to pointer position with smooth lerp parallax and gentle rotation.
 */
function CoreMesh({ isHovered, onHover }: CoreMeshProps): React.JSX.Element {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    // 1. Smooth pointer parallax interpolation
    if (groupRef.current) {
      const targetRotationY = state.pointer.x * 0.45;
      const targetRotationX = -state.pointer.y * 0.45;
      const targetPosX = state.pointer.x * 0.25;
      const targetPosY = state.pointer.y * 0.25;

      groupRef.current.rotation.y += (targetRotationY - groupRef.current.rotation.y) * 0.06;
      groupRef.current.rotation.x += (targetRotationX - groupRef.current.rotation.x) * 0.06;

      groupRef.current.position.x += (targetPosX - groupRef.current.position.x) * 0.05;
      groupRef.current.position.y += (targetPosY - groupRef.current.position.y) * 0.05;
    }

    // 2. Slow auto-rotation for core & counter-rotation for wireframe cage
    const rotSpeed = isHovered ? 0.45 : 0.22;
    if (coreRef.current) {
      coreRef.current.rotation.x += delta * rotSpeed;
      coreRef.current.rotation.y += delta * (rotSpeed * 1.3);

      // Smooth hover scale
      const targetScale = isHovered ? 1.08 : 1.0;
      coreRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }

    if (wireframeRef.current) {
      wireframeRef.current.rotation.x -= delta * (rotSpeed * 0.6);
      wireframeRef.current.rotation.z += delta * (rotSpeed * 0.8);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Outer subtle geometric wireframe cage */}
      <mesh ref={wireframeRef}>
        <icosahedronGeometry args={[1.85, 1]} />
        <meshBasicMaterial
          color="#22D3EE"
          wireframe
          transparent
          opacity={0.25}
        />
      </mesh>

      {/* Core reflective faceted icosahedron */}
      <mesh
        ref={coreRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          if (typeof document !== 'undefined') document.body.style.cursor = 'pointer';
          onHover(true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          if (typeof document !== 'undefined') document.body.style.cursor = 'auto';
          onHover(false);
        }}
      >
        <icosahedronGeometry args={[1.35, 1]} />
        <meshStandardMaterial
          color="#140b28"
          roughness={0.15}
          metalness={0.9}
          flatShading
          emissive="#6E56CF"
          emissiveIntensity={0.25}
        />
      </mesh>
    </group>
  );
}

/**
 * SceneContent
 *
 * Houses lights, camera adjustments, core mesh, and particle swarm.
 */
function SceneContent(): React.JSX.Element {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.7} />

      {/* Directional rim light */}
      <directionalLight position={[0, 6, 6]} intensity={1.5} color="#ffffff" />

      {/* Purple Point Light (#6E56CF) */}
      <pointLight
        position={[-4, 3, 2]}
        intensity={2.8}
        color="#6E56CF"
        distance={15}
        decay={2}
      />

      {/* Cyan Point Light (#22D3EE) */}
      <pointLight
        position={[4, -2.5, 3]}
        intensity={3.2}
        color="#22D3EE"
        distance={15}
        decay={2}
      />

      {/* Subtle bottom backlight */}
      <pointLight
        position={[0, -4, -2]}
        intensity={1.2}
        color="#9333EA"
        distance={10}
      />

      {/* Core 3D Mesh */}
      <CoreMesh isHovered={isHovered} onHover={setIsHovered} />

      {/* 1200 Orbiting Particles */}
      <Particles count={1200} radiusMin={2.4} radiusMax={3.6} speed={0.06} />
    </>
  );
}

interface HeroSceneProps {
  className?: string;
  isInView?: boolean;
}

/**
 * HeroScene
 *
 * Configures the R3F Canvas with high performance settings:
 * dpr={[1, 1.5]}, gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
 * Pauses rendering loop via `frameloop="never"` when out of viewport to preserve battery.
 */
export function HeroScene({
  className = '',
  isInView = true,
}: HeroSceneProps): React.JSX.Element {
  return (
    <div className={`relative h-full w-full min-h-[360px] md:min-h-[500px] ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5.8], fov: 45 }}
        dpr={[1, 1.5]}
        frameloop={isInView ? 'always' : 'never'}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ width: '100%', height: '100%', pointerEvents: 'auto' }}
      >
        <SceneContent />
      </Canvas>
    </div>
  );
}

export default HeroScene;
