import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperience } from '../hooks/useExperience';

/**
 * VOID ENVIRONMENT — PASS 02: ANCIENT ARCHITECTURAL REMNANTS
 * 
 * Culturally ambiguous, imperfect, monumental remnants of an impossible ancient civilization / museum.
 * 
 * 3 Spatial Layers:
 * 1. FOREGROUND: Sparse atmospheric dust motes with gentle drifting parallax.
 * 2. MIDGROUND: Asymmetric groupings of broken multi-drum columns, fractured arches,
 *    entablatures with bronze joinery, fallen stone blocks, and stepped foundation courses.
 * 3. BACKGROUND: Colossal distant ruins, featuring ONE striking monumental structure:
 *    The Great Cyclopean Staircase & Broken Monolithic Portal looming in the far void.
 */

// Precomputed deterministic distribution for foreground atmospheric dust motes
function createDustPositions(count = 190) {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const s1 = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
    const s2 = Math.sin(i * 26.6514 + 45.164) * 23421.6312;
    const s3 = Math.sin(i * 39.3467 + 11.876) * 31415.9265;
    
    const r1 = s1 - Math.floor(s1);
    const r2 = s2 - Math.floor(s2);
    const r3 = s3 - Math.floor(s3);

    pos[i * 3] = (r1 - 0.5) * 22;
    pos[i * 3 + 1] = (r2 - 0.5) * 12 + 1.5;
    pos[i * 3 + 2] = (r3 - 0.5) * 16 + 2;
  }
  return pos;
}

const STATIC_DUST_POSITIONS = createDustPositions(190);

// 1. FOREGROUND LAYER: Atmospheric Dust Motes
function ForegroundAtmosphere({ isEncounterActive }) {
  const pointsRef = useRef();

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.005;
      pointsRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[STATIC_DUST_POSITIONS, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#827b72"
        transparent
        opacity={isEncounterActive ? 0.10 : 0.20}
        blending={THREE.NormalBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Multi-Drum Ruined Column with Fractured Cap & Subtle Offsets
function RuinedColumn({
  position = [0, 0, 0],
  drumCount = 5,
  radius = 0.9,
  drumHeight = 2.8,
  hasFallenDrum = false,
  rotationY = 0,
  materials,
}) {
  const { agedStone, darkBasalt, bronze } = materials;

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Column Plinth Base */}
      <mesh position={[0, drumHeight * 0.15, 0]} material={darkBasalt} castShadow receiveShadow>
        <boxGeometry args={[radius * 2.5, drumHeight * 0.3, radius * 2.5]} />
      </mesh>
      <mesh position={[0, drumHeight * 0.35, 0]} material={agedStone} castShadow receiveShadow>
        <cylinderGeometry args={[radius * 1.15, radius * 1.25, drumHeight * 0.2, 16]} />
      </mesh>

      {/* Stacked Asymmetric Drums with slight joint irregularities */}
      {Array.from({ length: drumCount }).map((_, idx) => {
        const yPos = drumHeight * 0.55 + idx * drumHeight;
        // Subtle drum rotation offset for ancient stone masonry realism
        const rotY = idx * 0.14 + (idx % 2 === 0 ? 0.04 : -0.03);
        const radiusBottom = radius * (1.02 - idx * 0.015);
        const radiusTop = radius * (0.99 - idx * 0.015);
        
        return (
          <group key={idx} position={[0, yPos, 0]} rotation={[0, rotY, 0]}>
            <mesh material={agedStone} castShadow receiveShadow>
              <cylinderGeometry args={[radiusTop, radiusBottom, drumHeight * 0.96, 16]} />
            </mesh>
            {/* Subtle Oxidized Bronze Joinery Cramp at drum seams */}
            {idx > 0 && idx < drumCount && idx % 2 === 1 && (
              <mesh position={[radiusTop * 0.88, -drumHeight * 0.48, 0]} material={bronze}>
                <boxGeometry args={[0.08, 0.04, 0.12]} />
              </mesh>
            )}
          </group>
        );
      })}

      {/* Fractured / Chipped Column Capital Top */}
      <group position={[0, drumHeight * 0.55 + drumCount * drumHeight, 0]}>
        {/* Weathered Abacus Block */}
        <mesh position={[0, drumHeight * 0.15, 0]} material={agedStone} castShadow receiveShadow>
          <boxGeometry args={[radius * 2.2, drumHeight * 0.35, radius * 2.2]} />
        </mesh>
        {/* Fractured top stone fragment */}
        <mesh
          position={[radius * 0.25, drumHeight * 0.42, -radius * 0.2]}
          rotation={[0.08, 0.25, -0.06]}
          material={darkBasalt}
          castShadow
        >
          <boxGeometry args={[radius * 1.4, drumHeight * 0.25, radius * 1.3]} />
        </mesh>
      </group>

      {/* Fallen / Dislodged Drum resting on ground */}
      {hasFallenDrum && (
        <group position={[radius * 2.4, drumHeight * 0.4, radius * 1.2]} rotation={[1.45, 0.2, 0.6]}>
          <mesh material={agedStone} castShadow receiveShadow>
            <cylinderGeometry args={[radius * 0.95, radius, drumHeight * 0.9, 16]} />
          </mesh>
          {/* Chipped stone piece next to fallen drum */}
          <mesh position={[0.4, -drumHeight * 0.4, 0.3]} material={darkBasalt} castShadow>
            <dodecahedronGeometry args={[0.25, 0]} />
          </mesh>
        </group>
      )}
    </group>
  );
}

// 2. MIDGROUND LAYER: Recognizable Ancient Architectural Remnants (Z: -16 to -32)
function MidgroundArchitecture({ materials }) {
  const { agedStone, darkBasalt, weatheredStone, bronze } = materials;

  return (
    <group name="MidgroundRemnants">
      {/* ========================================================================= */}
      {/* 1. LEFT FLANK: Colossal Broken Arch & Entablature Remnants (Z: -20 to -24) */}
      {/* ========================================================================= */}
      <group position={[-17, 0, -22]}>
        {/* Massive Cyclopean Stepped Foundation Pier */}
        <mesh position={[0, -2.5, 0]} material={darkBasalt} receiveShadow>
          <boxGeometry args={[5.2, 3.6, 5.2]} />
        </mesh>
        <mesh position={[0, 0.2, 0]} material={agedStone} castShadow receiveShadow>
          <boxGeometry args={[4.2, 2.2, 4.2]} />
        </mesh>

        {/* Towering Colonnade Pier */}
        <mesh position={[0, 8.5, 0]} material={agedStone} castShadow receiveShadow>
          <boxGeometry args={[3.2, 14.8, 3.2]} />
        </mesh>

        {/* Stepped Moulding & Architrave Capital */}
        <mesh position={[0, 16.4, 0]} material={weatheredStone} castShadow receiveShadow>
          <boxGeometry args={[4.4, 1.2, 4.4]} />
        </mesh>

        {/* Colossal Fractured Architrave / Lintel Span extending to the right and breaking off */}
        <group position={[5.5, 17.5, 0]}>
          {/* Main Lower Fascia Band */}
          <mesh position={[0, 0, 0]} material={agedStone} castShadow receiveShadow>
            <boxGeometry args={[11.5, 1.3, 2.8]} />
          </mesh>
          {/* Upper Stepped Cornice with jagged broken end */}
          <mesh position={[-1.2, 1.0, 0]} material={weatheredStone} castShadow receiveShadow>
            <boxGeometry args={[9.2, 0.7, 3.2]} />
          </mesh>
          {/* Exposed Fractured Stone Breakage Block at fracture point */}
          <mesh
            position={[5.2, 0.3, 0.1]}
            rotation={[0.08, 0.3, -0.15]}
            material={darkBasalt}
            castShadow
          >
            <boxGeometry args={[2.2, 1.6, 2.4]} />
          </mesh>
          {/* Ancient Bronze Cramps holding ancient masonry seams */}
          {[-3.5, 0.5].map((cx, i) => (
            <mesh key={i} position={[cx, 0.7, 1.42]} material={bronze}>
              <boxGeometry args={[0.22, 0.08, 0.04]} />
            </mesh>
          ))}
        </group>

        {/* Dislodged Fallen Architrave Block lying partially buried below */}
        <mesh
          position={[7.5, -4.2, 2.2]}
          rotation={[0.18, 0.45, -0.12]}
          material={agedStone}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[4.2, 1.4, 2.4]} />
        </mesh>
      </group>

      {/* ========================================================================= */}
      {/* 2. CENTER-LEFT: Ruined Colonnade Grouping with Varied Broken Heights      */}
      {/* ========================================================================= */}
      {/* Tallest Standing Column (Fractured Capital) */}
      <RuinedColumn
        position={[-8.5, -3.8, -25]}
        drumCount={5}
        radius={0.88}
        drumHeight={2.6}
        hasFallenDrum={true}
        rotationY={0.3}
        materials={materials}
      />
      {/* Medium Broken Column (Severed at 3rd drum) */}
      <RuinedColumn
        position={[-5.0, -3.8, -28]}
        drumCount={3}
        radius={0.92}
        drumHeight={2.6}
        hasFallenDrum={false}
        rotationY={-0.4}
        materials={materials}
      />
      {/* Low Ruined Stump Column with chipped fluting */}
      <RuinedColumn
        position={[-2.2, -3.8, -29]}
        drumCount={1}
        radius={0.95}
        drumHeight={2.4}
        hasFallenDrum={true}
        rotationY={0.8}
        materials={materials}
      />

      {/* ========================================================================= */}
      {/* 3. RIGHT FLANK: Monumental Monolithic Portal Wall & Doorframe Remnants   */}
      {/* ========================================================================= */}
      <group position={[18, 0, -21]}>
        {/* Massive Stepped Plinth Base */}
        <mesh position={[0, -3.5, 0]} material={darkBasalt} receiveShadow>
          <boxGeometry args={[8.5, 3.0, 5.0]} />
        </mesh>

        {/* Colossal Vertical Monolith Wall Slab with recessed architectural reveal */}
        <mesh
          position={[0, 7.5, 0]}
          rotation={[-0.02, -0.22, 0.01]}
          material={agedStone}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[5.2, 20.0, 2.6]} />
        </mesh>
        {/* Inner Doorway Jamb Reveal (Stepped cathedral/temple portal profile) */}
        <mesh
          position={[-2.4, 6.0, 0.4]}
          rotation={[-0.02, -0.22, 0.01]}
          material={weatheredStone}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[1.2, 17.0, 2.2]} />
        </mesh>

        {/* Adjacent Ruined Pylon Shaft */}
        <mesh
          position={[5.5, 6.0, -3.5]}
          material={agedStone}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[2.6, 21.0, 2.6]} />
        </mesh>

        {/* Broken Ancient Stairway Remnant (3 monumental stone steps leading to nowhere) */}
        <group position={[-3.8, -3.2, 1.8]} rotation={[0, -0.2, 0]}>
          <mesh position={[0, 0, 0]} material={darkBasalt} receiveShadow>
            <boxGeometry args={[4.8, 0.6, 2.0]} />
          </mesh>
          <mesh position={[0, 0.6, -0.5]} material={agedStone} receiveShadow>
            <boxGeometry args={[4.4, 0.6, 1.8]} />
          </mesh>
          <mesh position={[0, 1.2, -1.0]} material={weatheredStone} receiveShadow>
            <boxGeometry args={[3.8, 0.6, 1.6]} />
          </mesh>
        </group>
      </group>

      {/* ========================================================================= */}
      {/* 4. SUBTERRANEAN FOUNDATIONS: Cyclopean Tiered Terraces across Midground  */}
      {/* ========================================================================= */}
      <group position={[0, -6.2, -23]}>
        {/* Broad deep sunken terrace foundation */}
        <mesh material={darkBasalt} receiveShadow>
          <boxGeometry args={[74, 2.2, 34]} />
        </mesh>
        {/* Stepped upper foundation course with intentional broken gaps */}
        <mesh position={[-16, 1.4, -2]} material={agedStone} receiveShadow>
          <boxGeometry args={[32, 0.8, 14]} />
        </mesh>
        <mesh position={[18, 1.4, -1]} material={agedStone} receiveShadow>
          <boxGeometry args={[28, 0.8, 16]} />
        </mesh>
      </group>
    </group>
  );
}

// 3. BACKGROUND LAYER: Distant Monumental Ruins & THE ONE STRIKING STRUCTURE (Z: -45 to -85)
function BackgroundArchitecture({ materials }) {
  const { darkBasalt, distantStone, weatheredStone } = materials;

  return (
    <group name="BackgroundMonuments">
      {/* ================================================================================== */}
      {/* HERO STRUCTURE (PASS 02): THE CYCLOPEAN GREAT STAIRCASE & BROKEN VOID PORTAL       */}
      {/* Position: X: 12 to 24, Z: -74, Y: 0 to 46. Looming monumental doorway into void.  */}
      {/* ================================================================================== */}
      <group position={[14, 0, -74]}>
        {/* 1. Titanic Great Staircase (6 colossal cyclopean tiers ascending into darkness) */}
        {Array.from({ length: 6 }).map((_, stepIdx) => {
          const stepY = stepIdx * 2.2 - 6.0;
          const stepZ = -stepIdx * 2.8;
          const stepWidth = 24.0 - stepIdx * 1.2;
          return (
            <mesh
              key={stepIdx}
              position={[0, stepY, stepZ]}
              material={stepIdx % 2 === 0 ? darkBasalt : distantStone}
            >
              <boxGeometry args={[stepWidth, 2.4, 4.6]} />
            </mesh>
          );
        })}

        {/* 2. Colossal Portal Doorframe flanking piers */}
        {/* Left Titanic Doorway Pier */}
        <mesh position={[-7.5, 18.0, -17.0]} material={distantStone}>
          <boxGeometry args={[4.2, 38.0, 4.2]} />
        </mesh>
        {/* Right Titanic Doorway Pier */}
        <mesh position={[7.5, 20.0, -17.0]} material={distantStone}>
          <boxGeometry args={[4.6, 42.0, 4.6]} />
        </mesh>

        {/* 3. Colossal Broken Portal Architrave Lintel spanning above doorway */}
        <group position={[1.5, 36.5, -17.0]}>
          {/* Intact Right Architrave Span */}
          <mesh position={[2.0, 0, 0]} material={distantStone}>
            <boxGeometry args={[16.0, 4.5, 5.0]} />
          </mesh>
          {/* Fractured Overhang on Left extending into black void */}
          <mesh
            position={[-7.0, 0.8, 0.2]}
            rotation={[0, 0.12, -0.08]}
            material={weatheredStone}
          >
            <boxGeometry args={[6.5, 4.8, 5.2]} />
          </mesh>
        </group>
      </group>

      {/* ================================================================================== */}
      {/* 2. FAR LEFT: Distant Hypostyle Pillars & Towering Architrave Beams (Z: -62 to -78) */}
      {/* ================================================================================== */}
      {/* Colossal Column 1 */}
      <mesh position={[-36, 18.0, -64]} material={distantStone}>
        <cylinderGeometry args={[3.4, 3.9, 58.0, 16]} />
      </mesh>
      {/* Colossal Column 2 */}
      <mesh position={[-24, 16.0, -72]} material={distantStone}>
        <cylinderGeometry args={[3.2, 3.7, 54.0, 16]} />
      </mesh>
      {/* Distant Horizontal Entablature Span between pillars */}
      <mesh
        position={[-30, 38.0, -68]}
        rotation={[0, 0.35, 0.02]}
        material={distantStone}
      >
        <boxGeometry args={[22.0, 3.8, 4.2]} />
      </mesh>

      {/* ================================================================================== */}
      {/* 3. PERIPHERAL HORIZON MEGALITHS (Z: -80 to -88)                                    */}
      {/* ================================================================================== */}
      {/* Distant Fractured Cyclopean Wall Slab on Left Horizon */}
      <mesh
        position={[-56, 20.0, -84]}
        rotation={[0, 0.22, 0]}
        material={darkBasalt}
      >
        <boxGeometry args={[28.0, 52.0, 4.0]} />
      </mesh>

      {/* Distant Towering Monolithic Pylon on Right Horizon */}
      <mesh
        position={[46, 22.0, -82]}
        rotation={[0, -0.18, 0]}
        material={darkBasalt}
      >
        <boxGeometry args={[9.0, 56.0, 5.0]} />
      </mesh>
      <mesh
        position={[58, 18.0, -86]}
        material={darkBasalt}
      >
        <cylinderGeometry args={[4.2, 4.8, 54.0, 14]} />
      </mesh>
    </group>
  );
}

export function VoidEnvironment() {
  const { currentStage, stages, activeRoomId, activePhilosopherId, inspectingBook } = useExperience();

  // Create shared, highly tuned architectural materials
  const materials = useMemo(() => {
    return {
      // Aged matte stone (midground columns, architraves, doorframes)
      agedStone: new THREE.MeshStandardMaterial({
        color: '#0a0b0e',
        roughness: 0.92,
        metalness: 0.04,
      }),
      // Older dark basalt (footings, cyclopean foundations, fallen blocks)
      darkBasalt: new THREE.MeshStandardMaterial({
        color: '#050608',
        roughness: 0.98,
        metalness: 0.02,
      }),
      // Weathered porous stone (stepped mouldings, arch crowns, reveals catching soft light)
      weatheredStone: new THREE.MeshStandardMaterial({
        color: '#0e1014',
        roughness: 0.88,
        metalness: 0.06,
      }),
      // Distant monumental stone (background hero staircase and distant monoliths)
      distantStone: new THREE.MeshStandardMaterial({
        color: '#050608',
        roughness: 0.98,
        metalness: 0.02,
      }),
      // Tiny antique oxidized bronze joinery details (cramps, mortise dowels - no glow)
      bronze: new THREE.MeshStandardMaterial({
        color: '#2a241b',
        roughness: 0.62,
        metalness: 0.82,
      }),
    };
  }, []);

  // Pure black ending stage disables void environment
  if (currentStage === stages.ENDING) {
    return null;
  }

  const isEncounterActive = Boolean(activeRoomId || activePhilosopherId || inspectingBook);

  return (
    <group name="VoidEnvironment">
      {/* 1. FOREGROUND LAYER: Sparse Atmospheric Dust */}
      <ForegroundAtmosphere isEncounterActive={isEncounterActive} />

      {/* 2. MIDGROUND LAYER: Imperfect Ancient Architectural Remnants */}
      <MidgroundArchitecture materials={materials} />

      {/* 3. BACKGROUND LAYER: Distant Monumental Ruins + The Great Cyclopean Staircase & Portal */}
      <BackgroundArchitecture materials={materials} />
    </group>
  );
}
