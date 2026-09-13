import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 1. Socrates: Sparse Classical Athenian Stone Architecture & Doric Colonnade
export function SocratesEnvironment({ isFocused }) {
  return (
    <group>
      {/* Classical Stone Colonnade with Stepped Stylobate */}
      <mesh position={[0, -1.48, -0.6]} receiveShadow>
        <boxGeometry args={[2.8, 0.08, 1.2]} />
        <meshStandardMaterial color="#beb39a" roughness={0.88} />
      </mesh>

      {[-0.95, 0, 0.95].map((x, idx) => (
        <group key={idx} position={[x, 0, -0.6]}>
          {/* Column Base with Torus Moulding */}
          <mesh position={[0, -1.38, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.24, 0.28, 0.16, 24]} />
            <meshStandardMaterial color="#c2b69d" roughness={0.85} />
          </mesh>
          {/* Fluted Column Shaft */}
          <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.19, 0.22, 2.7, 24]} />
            <meshStandardMaterial color="#d8cdb7" roughness={0.82} />
          </mesh>
          {/* Doric Capital & Echinus */}
          <mesh position={[0, 1.45, 0]} castShadow>
            <boxGeometry args={[0.48, 0.16, 0.48]} />
            <meshStandardMaterial color="#c2b69d" roughness={0.85} />
          </mesh>
        </group>
      ))}

      {/* Classical Architrave & Entablature */}
      <mesh position={[0, 1.62, -0.6]} castShadow receiveShadow>
        <boxGeometry args={[2.65, 0.22, 0.54]} />
        <meshStandardMaterial color="#d8cdb7" roughness={0.82} />
      </mesh>

      {/* Bronze Offering Kylix / Vessel */}
      <mesh position={[0, -1.35, 0.2]} castShadow>
        <cylinderGeometry args={[0.18, 0.06, 0.12, 16]} />
        <meshStandardMaterial color="#8a6d3b" metalness={0.88} roughness={0.3} />
      </mesh>

      {/* Warm Socratic Daylight with Soft Shadow Casting */}
      <pointLight
        position={[0, 1.2, 0.6]}
        intensity={isFocused ? 3.4 : 0}
        distance={5.0}
        color="#f9ebd2"
        castShadow={isFocused}
      />
    </group>
  );
}

// 2. Nietzsche: Fractured Abyss, Obsidian Monoliths & Unstable Geometry
export function NietzscheEnvironment({ isFocused }) {
  const shardsRef = useRef();

  useFrame((state, delta) => {
    if (!isFocused || !shardsRef.current) return;
    shardsRef.current.children.forEach((child, i) => {
      child.rotation.z += delta * (i % 2 === 0 ? 0.3 : -0.3);
      child.position.y += Math.sin(state.clock.elapsedTime * 1.6 + i) * 0.004;
    });
  });

  return (
    <group>
      {/* Fractured Obelisk Monoliths at Unstable Brutal Angles */}
      <mesh position={[-0.85, 0.25, -0.5]} rotation={[0.22, 0.38, -0.26]} castShadow receiveShadow>
        <boxGeometry args={[0.34, 3.4, 0.34]} />
        <meshPhysicalMaterial
          color="#161214"
          roughness={0.3}
          metalness={0.9}
          clearcoat={0.6}
          clearcoatRoughness={0.3}
        />
      </mesh>
      <mesh position={[0.85, 0.45, -0.4]} rotation={[-0.28, -0.22, 0.36]} castShadow receiveShadow>
        <boxGeometry args={[0.28, 3.2, 0.28]} />
        <meshPhysicalMaterial
          color="#140f11"
          roughness={0.3}
          metalness={0.9}
          clearcoat={0.6}
          clearcoatRoughness={0.3}
        />
      </mesh>

      {/* Suspended Shattered Sharp Tetrahedral Fragments */}
      <group ref={shardsRef} position={[0, 0.8, 0]}>
        {[-0.45, 0, 0.45].map((x, idx) => (
          <mesh key={idx} position={[x, idx * 0.35, 0.22]} castShadow>
            <tetrahedronGeometry args={[0.28, 0]} />
            <meshStandardMaterial
              color="#8b1c1c"
              emissive="#500e0e"
              emissiveIntensity={isFocused ? 1.2 : 0.2}
              roughness={0.25}
              metalness={0.92}
            />
          </mesh>
        ))}
      </group>

      {/* Aggressive Crimson Edge Light */}
      <pointLight
        position={[0, 1.6, 0.6]}
        intensity={isFocused ? 4.0 : 0}
        distance={4.8}
        color="#e63946"
        castShadow={isFocused}
      />
    </group>
  );
}

// 3. Dostoevsky: Claustrophobic Heavy Timber & Iron Cage
export function DostoevskyEnvironment({ isFocused }) {
  const lanternRef = useRef();

  useFrame((state) => {
    if (!isFocused || !lanternRef.current) return;
    // Subtle lantern flicker
    const flicker = 1.0 + Math.sin(state.clock.elapsedTime * 8) * 0.08 + Math.sin(state.clock.elapsedTime * 23) * 0.04;
    lanternRef.current.intensity = (isFocused ? 3.0 : 0) * flicker;
  });

  return (
    <group>
      {/* Heavy Narrow Dark Oak Timber Beams Framing the Cell */}
      <mesh position={[-0.8, 0.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.22, 3.4, 0.85]} />
        <meshStandardMaterial color="#120c07" roughness={0.96} metalness={0.1} />
      </mesh>
      <mesh position={[0.8, 0.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.22, 3.4, 0.85]} />
        <meshStandardMaterial color="#120c07" roughness={0.96} metalness={0.1} />
      </mesh>
      <mesh position={[0, 1.65, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.82, 0.22, 0.85]} />
        <meshStandardMaterial color="#120c07" roughness={0.96} metalness={0.1} />
      </mesh>

      {/* Wrought Iron Grate Bars */}
      {[-0.4, 0, 0.4].map((x, idx) => (
        <mesh key={idx} position={[x, 0.2, -0.35]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 2.8, 8]} />
          <meshStandardMaterial color="#1a1a1e" metalness={0.95} roughness={0.4} />
        </mesh>
      ))}

      {/* Distressed Uneven Floor Planks */}
      <mesh position={[0, -1.48, 0]} receiveShadow>
        <boxGeometry args={[1.8, 0.08, 1.25]} />
        <meshStandardMaterial color="#0d0805" roughness={0.98} />
      </mesh>

      {/* Flickering Kerosene Lantern Atmosphere */}
      <pointLight
        ref={lanternRef}
        position={[0, 0.3, 0.35]}
        intensity={isFocused ? 3.0 : 0}
        distance={4.2}
        color="#ff9f43"
        castShadow={isFocused}
      />
    </group>
  );
}

// 4. Camus: Pale Limestone Monoliths & Solitary Sisyphus Stone
export function CamusEnvironment({ isFocused }) {
  const stoneRef = useRef();

  useFrame((state, delta) => {
    if (!isFocused || !stoneRef.current) return;
    stoneRef.current.rotation.y += delta * 0.12;
    stoneRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.05;
  });

  return (
    <group>
      {/* Clean, minimalist monolithic travertine limestone slab */}
      <mesh position={[0, 0.25, -0.6]} castShadow receiveShadow>
        <boxGeometry args={[1.9, 3.2, 0.18]} />
        <meshStandardMaterial color="#d2dcde" roughness={0.88} metalness={0.08} />
      </mesh>

      {/* Low Pedestal with Sisyphus Basalt Stone */}
      <mesh position={[0, -1.22, 0.2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.65, 0.75, 0.45, 6]} />
        <meshStandardMaterial color="#82959e" roughness={0.85} metalness={0.15} />
      </mesh>
      <mesh ref={stoneRef} position={[0, -0.72, 0.2]} castShadow>
        <dodecahedronGeometry args={[0.34, 0]} />
        <meshStandardMaterial color="#37474f" roughness={0.78} metalness={0.25} />
      </mesh>

      {/* Lucid Cool Mediterranean Sunlight */}
      <pointLight
        position={[0, 1.8, 0.7]}
        intensity={isFocused ? 3.4 : 0}
        distance={5.0}
        color="#e0f7fa"
        castShadow={isFocused}
      />
    </group>
  );
}

// 5. Woolf: Shifting Fluid Memory, Fluted Glass & Time Waves
export function WoolfEnvironment({ isFocused }) {
  const wavesRef = useRef();

  useFrame((state, delta) => {
    if (!isFocused || !wavesRef.current) return;
    wavesRef.current.children.forEach((child, i) => {
      child.rotation.y += delta * 0.16 * (i % 2 === 0 ? 1 : -1);
      child.rotation.x = Math.sin(state.clock.elapsedTime * 0.8 + i) * 0.15;
    });
  });

  return (
    <group>
      {/* Translucent Fluted Optical Glass Screen in Background */}
      <mesh position={[0, 0.25, -0.5]}>
        <boxGeometry args={[1.8, 3.0, 0.06]} />
        <meshPhysicalMaterial
          color="#1e3240"
          roughness={0.15}
          transmission={0.65}
          thickness={0.4}
          ior={1.45}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Drifting Concentric Platinum Memory Waves */}
      <group ref={wavesRef} position={[0, 0.2, 0]}>
        {[1.25, 0.95, 0.65].map((radius, idx) => (
          <mesh key={idx} rotation={[Math.PI / 4, idx * 0.5, 0]}>
            <torusGeometry args={[radius, 0.022, 16, 64]} />
            <meshStandardMaterial
              color="#5482a6"
              emissive="#244560"
              emissiveIntensity={isFocused ? 1.0 : 0.2}
              roughness={0.18}
              metalness={0.9}
            />
          </mesh>
        ))}
      </group>

      {/* Luminous Lighthouse Light Sweep */}
      <pointLight
        position={[0, 1.5, 0.5]}
        intensity={isFocused ? 3.6 : 0}
        distance={5.0}
        color="#81d4fa"
        castShadow={isFocused}
      />
    </group>
  );
}

// Main Selector Environment
export function PhilosopherEnvironment({ type, isFocused }) {
  switch (type) {
    case 'classical_stone':
      return <SocratesEnvironment isFocused={isFocused} />;
    case 'fractured_abyss':
      return <NietzscheEnvironment isFocused={isFocused} />;
    case 'narrow_shadows':
      return <DostoevskyEnvironment isFocused={isFocused} />;
    case 'silent_monolith':
      return <CamusEnvironment isFocused={isFocused} />;
    case 'fluid_stream':
      return <WoolfEnvironment isFocused={isFocused} />;
    default:
      return <SocratesEnvironment isFocused={isFocused} />;
  }
}

