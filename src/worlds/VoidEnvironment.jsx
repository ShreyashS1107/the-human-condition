import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperience } from '../hooks/useExperience';

/**
 * VOID ENVIRONMENT — PASS 01: PHYSICAL DEPTH ONLY
 * 
 * 3-Layer Spatial Void Architecture:
 * 1. FOREGROUND: Extremely sparse, slow drifting atmospheric dust motes close to camera.
 * 2. MIDGROUND: Massive dark architectural silhouettes (broken arch fragments, megalithic slabs, ruined pillars).
 * 3. BACKGROUND: Extremely distant monumental silhouettes (cyclopean columns, colossal wall fragments)
 *    barely visible against the black void, establishing impossible scale and parallax.
 */

// 1. FOREGROUND LAYER: Sparse Atmospheric Dust Motes close to camera
function ForegroundAtmosphere({ isEncounterActive }) {
  const pointsRef = useRef();

  const [positions] = useMemo(() => {
    const count = 190;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 22;
      pos[i + 1] = (Math.random() - 0.5) * 12 + 1.5;
      pos[i + 2] = (Math.random() - 0.5) * 16 + 2;
    }
    return [pos];
  }, []);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.006;
      pointsRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.06;
    }
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
        size={0.032}
        color="#857e74"
        transparent
        opacity={isEncounterActive ? 0.12 : 0.22}
        blending={THREE.NormalBlending}
        depthWrite={false}
      />
    </points>
  );
}

// 2. MIDGROUND LAYER: Dark Architectural Silhouettes & Massive Structural Masses (Z: -16 to -32)
function MidgroundArchitecture() {
  const stoneMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#090a0d',
        roughness: 0.94,
        metalness: 0.06,
      }),
    []
  );

  return (
    <group>
      {/* --- Left Flank: Colossal Broken Arch & Massive Supporting Pylon --- */}
      {/* Supporting Pillar */}
      <mesh
        position={[-18, 5.0, -22]}
        material={stoneMaterial}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[2.8, 22.0, 2.8]} />
      </mesh>
      {/* Stepped Capital Block */}
      <mesh
        position={[-18, 14.5, -22]}
        material={stoneMaterial}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[3.8, 1.2, 3.8]} />
      </mesh>
      {/* Colossal Lintel / Arch Fragment spanning beyond upper frame */}
      <mesh
        position={[-12, 15.5, -21.5]}
        rotation={[0.04, 0.18, -0.05]}
        material={stoneMaterial}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[14.0, 2.6, 3.2]} />
      </mesh>

      {/* --- Right Flank: Massive Megalithic Slab & Ruined Pylons --- */}
      {/* Colossal Vertical Megalith Wall */}
      <mesh
        position={[17.5, 6.5, -20]}
        rotation={[-0.03, -0.28, 0.02]}
        material={stoneMaterial}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[4.4, 24.0, 2.2]} />
      </mesh>
      {/* Massive Base Foundation Footing */}
      <mesh
        position={[17.5, -4.5, -19.5]}
        material={stoneMaterial}
        receiveShadow
      >
        <boxGeometry args={[7.2, 2.4, 4.2]} />
      </mesh>
      {/* Peripheral Towering Pylon */}
      <mesh
        position={[23.5, 8.0, -25]}
        material={stoneMaterial}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[2.4, 26.0, 2.4]} />
      </mesh>

      {/* --- Midground Spaced Ruined Pillars --- */}
      <mesh
        position={[-7.5, 4.5, -26]}
        material={stoneMaterial}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[0.9, 1.1, 19.0, 16]} />
      </mesh>
      <mesh
        position={[8.5, 6.0, -27]}
        material={stoneMaterial}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[1.0, 1.2, 22.0, 16]} />
      </mesh>

      {/* --- Deep Subterranean Ground Foundation Tier --- */}
      <mesh
        position={[0, -5.5, -22]}
        material={stoneMaterial}
        receiveShadow
      >
        <boxGeometry args={[68, 1.8, 30]} />
      </mesh>
    </group>
  );
}

// 3. BACKGROUND LAYER: Distant Monumental Silhouettes (Z: -45 to -85)
function BackgroundArchitecture() {
  const distantStoneMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#050608',
        roughness: 0.98,
        metalness: 0.02,
      }),
    []
  );

  return (
    <group>
      {/* --- Distant Colossal Hypostyle Hall Columns reaching into infinite height --- */}
      <mesh
        position={[-34, 18, -62]}
        material={distantStoneMaterial}
      >
        <cylinderGeometry args={[3.4, 3.8, 58.0, 16]} />
      </mesh>
      <mesh
        position={[32, 20, -66]}
        material={distantStoneMaterial}
      >
        <cylinderGeometry args={[3.8, 4.2, 62.0, 16]} />
      </mesh>
      <mesh
        position={[-50, 16, -78]}
        material={distantStoneMaterial}
      >
        <cylinderGeometry args={[4.2, 4.6, 56.0, 16]} />
      </mesh>
      <mesh
        position={[48, 18, -75]}
        material={distantStoneMaterial}
      >
        <cylinderGeometry args={[4.4, 4.8, 60.0, 16]} />
      </mesh>

      {/* --- Distant Colossal Wall Segment Silhouette --- */}
      <mesh
        position={[-20, 20, -78]}
        rotation={[0, 0.16, 0]}
        material={distantStoneMaterial}
      >
        <boxGeometry args={[26.0, 50.0, 3.6]} />
      </mesh>

      {/* --- Distant Ruined Great Arch Span --- */}
      <mesh
        position={[15, 26, -72]}
        rotation={[0, -0.12, 0.03]}
        material={distantStoneMaterial}
      >
        <boxGeometry args={[38.0, 4.2, 4.2]} />
      </mesh>

      {/* --- Far Horizon Megaliths --- */}
      <mesh
        position={[-60, 22, -85]}
        material={distantStoneMaterial}
      >
        <boxGeometry args={[8.0, 54.0, 4.0]} />
      </mesh>
      <mesh
        position={[58, 24, -84]}
        material={distantStoneMaterial}
      >
        <boxGeometry args={[8.0, 56.0, 4.0]} />
      </mesh>
    </group>
  );
}

export function VoidEnvironment() {
  const { currentStage, stages, activeRoomId, activePhilosopherId, inspectingBook } = useExperience();

  // Do not render void environment in pure black ending sequence
  if (currentStage === stages.ENDING) {
    return null;
  }

  const isEncounterActive = Boolean(activeRoomId || activePhilosopherId || inspectingBook);

  return (
    <group name="VoidEnvironment">
      {/* 1. FOREGROUND LAYER: Sparse Atmospheric Dust Motes */}
      <ForegroundAtmosphere isEncounterActive={isEncounterActive} />

      {/* 2. MIDGROUND LAYER: Dark Architectural Silhouettes */}
      <MidgroundArchitecture />

      {/* 3. BACKGROUND LAYER: Distant Monumental Ruined Silhouettes */}
      <BackgroundArchitecture />
    </group>
  );
}
