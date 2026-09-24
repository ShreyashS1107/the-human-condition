import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperience } from '../hooks/useExperience';

/**
 * VOID ENVIRONMENT — PASS 04: THE DISTANT MONUMENT
 * 
 * 1. Three Depth Layers (Foreground, Midground, Background)
 * 2. Ancient Imperfect Architectural Remnants (Columns, Arches, Entablatures, Portals)
 * 3. Hero Architecture: The Cyclopean Great Staircase & Broken Void Portal
 * 4. Physical Floating Manuscript Fragments of Human Thought (Parchment & Faded Inscriptions)
 * 5. Pass 04 Addition: The Distant Colossus Monument
 *    - Colossal, ancient, partially destroyed abstract human-form sculpture in extreme distance (Z: -90)
 *    - Seated on a cyclopean throne plinth with broken limb and sheared crown
 *    - Faceless, weathered, mysterious visual landmark looming in the deep fog
 *    - Completely static, unlit by spotlights, discovered gradually through ambient/directional falloff
 *    - Visual storytelling: Architecture (built) + Manuscripts (thought) + Monument (humanity looking at itself) + Darkness (lost)
 */

// ============================================================================
// 1. PROCEDURAL PARCHMENT & INK TEXTURE GENERATORS (Pure Canvas, No Assets)
// ============================================================================

function createParchmentCanvas(text, subtitle, hasDiagram = false) {
  if (typeof document === 'undefined') return null;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 700;
  const ctx = canvas.getContext('2d');

  // Base Aged Parchment Tone
  ctx.fillStyle = '#b8a98f';
  ctx.fillRect(0, 0, 512, 700);

  // Subtle Aged Vignette / Weathering
  const grad = ctx.createRadialGradient(256, 350, 80, 256, 350, 360);
  grad.addColorStop(0, 'rgba(215, 203, 180, 0.6)');
  grad.addColorStop(0.7, 'rgba(175, 158, 132, 0.4)');
  grad.addColorStop(1, 'rgba(95, 82, 65, 0.85)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 700);

  // Weathered Deckled Edge Darkening
  ctx.strokeStyle = '#5a4d3c';
  ctx.lineWidth = 14;
  ctx.strokeRect(6, 6, 500, 688);

  // Faint Ink Rules / Guide Lines
  ctx.strokeStyle = 'rgba(120, 105, 88, 0.25)';
  ctx.lineWidth = 1.0;
  for (let y = 110; y < 650; y += 32) {
    ctx.beginPath();
    ctx.moveTo(40, y);
    ctx.lineTo(472, y);
    ctx.stroke();
  }

  // Optional Ancient Geometric / Compass Diagram
  if (hasDiagram) {
    ctx.strokeStyle = 'rgba(75, 62, 50, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(380, 540, 55, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(380, 540, 32, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(320, 540);
    ctx.lineTo(440, 540);
    ctx.stroke();
  }

  // Faint Simulated Cursive Lines (lost handwriting)
  ctx.fillStyle = 'rgba(58, 47, 36, 0.45)';
  for (let y = 142; y < 620; y += 32) {
    let x = 45;
    while (x < 460) {
      const wordLen = 20 + Math.sin(x * 1.5 + y) * 14 + 16;
      if (Math.sin(x + y * 2) > -0.7) {
        ctx.fillRect(x, y - 6, wordLen, 3.5);
      }
      x += wordLen + 8 + (Math.sin(x * 3) * 4);
    }
  }

  // Main Philosophical Query / Heading Text (if specified)
  if (text) {
    ctx.fillStyle = '#231b14';
    ctx.font = 'bold 34px "Cinzel", "Times New Roman", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '3px';
    ctx.fillText(text, 256, 175);

    if (subtitle) {
      ctx.fillStyle = 'rgba(50, 40, 30, 0.75)';
      ctx.font = 'italic 20px "Cormorant Garamond", Georgia, serif';
      ctx.fillText(subtitle, 256, 215);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.generateMipmaps = true;
  return texture;
}

// Generate Curved Parchment Mesh Geometry
function createCurvedParchmentGeometry(width = 0.36, height = 0.50, curveAmount = 0.035, foldCorner = false) {
  const geom = new THREE.PlaneGeometry(width, height, 8, 8);
  const pos = geom.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const u = x / width + 0.5;
    const v = y / height + 0.5;

    let z = -Math.sin(u * Math.PI) * curveAmount - (v - 0.5) * (curveAmount * 0.4);

    if (foldCorner && u > 0.72 && v > 0.72) {
      z += ((u - 0.72) / 0.28) * ((v - 0.72) / 0.28) * (curveAmount * 2.2);
    }

    pos.setZ(i, z);
  }
  geom.computeVertexNormals();
  return geom;
}

// ============================================================================
// 2. LAYER 1: FOREGROUND ATMOSPHERIC DUST MOTES
// ============================================================================

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

// ============================================================================
// 3. LAYER: FLOATING MANUSCRIPT FRAGMENTS OF HUMAN THOUGHT
// ============================================================================

const MANUSCRIPT_ITEMS = [
  // --- FOREGROUND FRAGMENTS (2 items: peripheral, quiet, close to camera) ---
  {
    id: 'fg-1',
    layer: 'FOREGROUND',
    pos: [-4.6, -0.6, 2.8],
    rot: [0.28, 0.42, -0.18],
    scale: [0.34, 0.48, 1],
    textType: 'REMEMBER',
    hasFold: true,
    speed: 0.25,
    phase: 0.4,
  },
  {
    id: 'fg-2',
    layer: 'FOREGROUND',
    pos: [4.8, 1.2, 2.2],
    rot: [-0.22, -0.38, 0.14],
    scale: [0.32, 0.44, 1],
    textType: 'TIME',
    hasFold: false,
    speed: 0.3,
    phase: 1.8,
  },

  // --- MIDGROUND FRAGMENTS (6 items: near columns, arch, wall remnants) ---
  {
    id: 'mg-1',
    layer: 'MIDGROUND',
    pos: [-12.2, 4.5, -17.5],
    rot: [0.15, 0.6, -0.08],
    scale: [0.38, 0.52, 1],
    textType: 'WHAT_REMAINS',
    hasFold: true,
    speed: 0.22,
    phase: 2.5,
  },
  {
    id: 'mg-2',
    layer: 'MIDGROUND',
    pos: [-6.8, 0.4, -22.5],
    rot: [-0.18, 0.2, 0.12],
    scale: [0.32, 0.44, 1],
    textType: 'UNREADABLE',
    hasFold: false,
    speed: 0.28,
    phase: 4.1,
  },
  {
    id: 'mg-3',
    layer: 'MIDGROUND',
    pos: [-3.2, 5.2, -24.0],
    rot: [0.32, -0.45, -0.15],
    scale: [0.36, 0.50, 1],
    textType: 'WHY',
    hasFold: true,
    speed: 0.2,
    phase: 0.9,
  },
  {
    id: 'mg-4',
    layer: 'MIDGROUND',
    pos: [8.5, 2.0, -18.5],
    rot: [0.12, 0.35, -0.05],
    scale: [0.35, 0.48, 1],
    textType: 'WHAT_CHOOSE',
    hasFold: false,
    speed: 0.26,
    phase: 3.2,
  },
  {
    id: 'mg-5',
    layer: 'MIDGROUND',
    pos: [15.2, 4.4, -16.5],
    rot: [-0.25, -0.3, 0.2],
    scale: [0.34, 0.46, 1],
    textType: 'UNREADABLE_DIAGRAM',
    hasFold: true,
    speed: 0.24,
    phase: 5.0,
  },
  {
    id: 'mg-6',
    layer: 'MIDGROUND',
    pos: [19.8, -1.5, -21.0],
    rot: [0.4, -0.2, -0.25],
    scale: [0.32, 0.42, 1],
    textType: 'UNREADABLE',
    hasFold: false,
    speed: 0.18,
    phase: 1.3,
  },

  // --- BACKGROUND FRAGMENTS (6 items: distant monumental scale) ---
  {
    id: 'bg-1',
    layer: 'BACKGROUND',
    pos: [11.5, 14.5, -66.0],
    rot: [0.2, 0.15, -0.1],
    scale: [1.2, 1.6, 1],
    textType: 'WHAT_REMAINS',
    hasFold: false,
    speed: 0.15,
    phase: 2.1,
  },
  {
    id: 'bg-2',
    layer: 'BACKGROUND',
    pos: [17.5, 5.5, -68.0],
    rot: [-0.15, -0.25, 0.08],
    scale: [1.1, 1.5, 1],
    textType: 'UNREADABLE',
    hasFold: true,
    speed: 0.18,
    phase: 4.6,
  },
  {
    id: 'bg-3',
    layer: 'BACKGROUND',
    pos: [-27.0, 11.0, -60.0],
    rot: [0.18, 0.4, -0.12],
    scale: [1.3, 1.8, 1],
    textType: 'UNREADABLE_DIAGRAM',
    hasFold: false,
    speed: 0.14,
    phase: 0.7,
  },
  {
    id: 'bg-4',
    layer: 'BACKGROUND',
    pos: [-36.0, 21.0, -64.0],
    rot: [-0.22, 0.3, 0.15],
    scale: [1.4, 1.9, 1],
    textType: 'WHY',
    hasFold: true,
    speed: 0.16,
    phase: 3.8,
  },
  {
    id: 'bg-5',
    layer: 'BACKGROUND',
    pos: [36.0, 7.5, -73.0],
    rot: [0.1, -0.35, -0.2],
    scale: [1.5, 2.0, 1],
    textType: 'UNREADABLE',
    hasFold: false,
    speed: 0.12,
    phase: 5.5,
  },
  {
    id: 'bg-6',
    layer: 'BACKGROUND',
    pos: [-46.0, 9.0, -76.0],
    rot: [-0.15, 0.2, 0.1],
    scale: [1.6, 2.2, 1],
    textType: 'UNREADABLE',
    hasFold: false,
    speed: 0.15,
    phase: 1.9,
  },
];

function FloatingManuscripts({ isEncounterActive }) {
  const groupRef = useRef();

  const textures = useMemo(() => {
    return {
      WHAT_REMAINS: createParchmentCanvas('WHAT REMAINS?', 'an unfinished testament', false),
      WHAT_CHOOSE: createParchmentCanvas('WHAT DO YOU CHOOSE?', 'on agency and fate', false),
      WHY: createParchmentCanvas('WHY?', null, false),
      REMEMBER: createParchmentCanvas('REMEMBER', 'fragments of memory', false),
      TIME: createParchmentCanvas('TIME', 'the perpetual flux', true),
      UNREADABLE_DIAGRAM: createParchmentCanvas(null, null, true),
      UNREADABLE: createParchmentCanvas(null, null, false),
    };
  }, []);

  const geometries = useMemo(() => {
    return {
      curved: createCurvedParchmentGeometry(1, 1, 0.04, false),
      curvedFolded: createCurvedParchmentGeometry(1, 1, 0.045, true),
    };
  }, []);

  const materials = useMemo(() => {
    const mats = {};
    Object.keys(textures).forEach((key) => {
      mats[key] = new THREE.MeshStandardMaterial({
        map: textures[key],
        roughness: 0.85,
        metalness: 0.04,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.82,
        shadowSide: THREE.DoubleSide,
      });
    });
    return mats;
  }, [textures]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;
    const speedMult = isEncounterActive ? 0.35 : 1.0;

    groupRef.current.children.forEach((child, i) => {
      const item = MANUSCRIPT_ITEMS[i];
      if (!item) return;

      child.position.y = item.pos[1] + Math.sin(time * item.speed * speedMult + item.phase) * 0.08;
      child.rotation.x = item.rot[0] + Math.sin(time * 0.3 * speedMult + item.phase) * 0.04;
      child.rotation.z = item.rot[2] + Math.cos(time * 0.25 * speedMult + item.phase) * 0.03;
      child.rotation.y += delta * 0.02 * speedMult * (i % 2 === 0 ? 1 : -1);
    });
  });

  return (
    <group ref={groupRef} name="ManuscriptFragments">
      {MANUSCRIPT_ITEMS.map((item) => {
        const isFg = item.layer === 'FOREGROUND';
        if (isEncounterActive && isFg) return null;

        const geom = item.hasFold ? geometries.curvedFolded : geometries.curved;
        const mat = materials[item.textType] || materials.UNREADABLE;

        return (
          <mesh
            key={item.id}
            position={item.pos}
            rotation={item.rot}
            scale={item.scale}
            geometry={geom}
            material={mat}
            castShadow
            receiveShadow
          />
        );
      })}
    </group>
  );
}

// ============================================================================
// 4. LAYER 2: IMPERFECT ANCIENT ARCHITECTURE
// ============================================================================

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

      {/* Stacked Asymmetric Drums */}
      {Array.from({ length: drumCount }).map((_, idx) => {
        const yPos = drumHeight * 0.55 + idx * drumHeight;
        const rotY = idx * 0.14 + (idx % 2 === 0 ? 0.04 : -0.03);
        const radiusBottom = radius * (1.02 - idx * 0.015);
        const radiusTop = radius * (0.99 - idx * 0.015);

        return (
          <group key={idx} position={[0, yPos, 0]} rotation={[0, rotY, 0]}>
            <mesh material={agedStone} castShadow receiveShadow>
              <cylinderGeometry args={[radiusTop, radiusBottom, drumHeight * 0.96, 16]} />
            </mesh>
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
        <mesh position={[0, drumHeight * 0.15, 0]} material={agedStone} castShadow receiveShadow>
          <boxGeometry args={[radius * 2.2, drumHeight * 0.35, radius * 2.2]} />
        </mesh>
        <mesh
          position={[radius * 0.25, drumHeight * 0.42, -radius * 0.2]}
          rotation={[0.08, 0.25, -0.06]}
          material={darkBasalt}
          castShadow
        >
          <boxGeometry args={[radius * 1.4, drumHeight * 0.25, radius * 1.3]} />
        </mesh>
      </group>

      {/* Fallen / Dislodged Drum */}
      {hasFallenDrum && (
        <group position={[radius * 2.4, drumHeight * 0.4, radius * 1.2]} rotation={[1.45, 0.2, 0.6]}>
          <mesh material={agedStone} castShadow receiveShadow>
            <cylinderGeometry args={[radius * 0.95, radius, drumHeight * 0.9, 16]} />
          </mesh>
          <mesh position={[0.4, -drumHeight * 0.4, 0.3]} material={darkBasalt} castShadow>
            <dodecahedronGeometry args={[0.25, 0]} />
          </mesh>
        </group>
      )}
    </group>
  );
}

function MidgroundArchitecture({ materials }) {
  const { agedStone, darkBasalt, weatheredStone, bronze } = materials;

  return (
    <group name="MidgroundRemnants">
      {/* 1. LEFT FLANK: Colossal Broken Arch & Entablature Remnants (Z: -20 to -24) */}
      <group position={[-17, 0, -22]}>
        <mesh position={[0, -2.5, 0]} material={darkBasalt} receiveShadow>
          <boxGeometry args={[5.2, 3.6, 5.2]} />
        </mesh>
        <mesh position={[0, 0.2, 0]} material={agedStone} castShadow receiveShadow>
          <boxGeometry args={[4.2, 2.2, 4.2]} />
        </mesh>

        <mesh position={[0, 8.5, 0]} material={agedStone} castShadow receiveShadow>
          <boxGeometry args={[3.2, 14.8, 3.2]} />
        </mesh>

        <mesh position={[0, 16.4, 0]} material={weatheredStone} castShadow receiveShadow>
          <boxGeometry args={[4.4, 1.2, 4.4]} />
        </mesh>

        {/* Colossal Fractured Architrave / Lintel Span */}
        <group position={[5.5, 17.5, 0]}>
          <mesh position={[0, 0, 0]} material={agedStone} castShadow receiveShadow>
            <boxGeometry args={[11.5, 1.3, 2.8]} />
          </mesh>
          <mesh position={[-1.2, 1.0, 0]} material={weatheredStone} castShadow receiveShadow>
            <boxGeometry args={[9.2, 0.7, 3.2]} />
          </mesh>
          <mesh
            position={[5.2, 0.3, 0.1]}
            rotation={[0.08, 0.3, -0.15]}
            material={darkBasalt}
            castShadow
          >
            <boxGeometry args={[2.2, 1.6, 2.4]} />
          </mesh>
          {[-3.5, 0.5].map((cx, i) => (
            <mesh key={i} position={[cx, 0.7, 1.42]} material={bronze}>
              <boxGeometry args={[0.22, 0.08, 0.04]} />
            </mesh>
          ))}
        </group>

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

      {/* 2. CENTER-LEFT: Ruined Colonnade Grouping */}
      <RuinedColumn
        position={[-8.5, -3.8, -25]}
        drumCount={5}
        radius={0.88}
        drumHeight={2.6}
        hasFallenDrum={true}
        rotationY={0.3}
        materials={materials}
      />
      <RuinedColumn
        position={[-5.0, -3.8, -28]}
        drumCount={3}
        radius={0.92}
        drumHeight={2.6}
        hasFallenDrum={false}
        rotationY={-0.4}
        materials={materials}
      />
      <RuinedColumn
        position={[-2.2, -3.8, -29]}
        drumCount={1}
        radius={0.95}
        drumHeight={2.4}
        hasFallenDrum={true}
        rotationY={0.8}
        materials={materials}
      />

      {/* 3. RIGHT FLANK: Monumental Monolithic Portal Wall & Doorframe Remnants */}
      <group position={[18, 0, -21]}>
        <mesh position={[0, -3.5, 0]} material={darkBasalt} receiveShadow>
          <boxGeometry args={[8.5, 3.0, 5.0]} />
        </mesh>

        <mesh
          position={[0, 7.5, 0]}
          rotation={[-0.02, -0.22, 0.01]}
          material={agedStone}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[5.2, 20.0, 2.6]} />
        </mesh>
        <mesh
          position={[-2.4, 6.0, 0.4]}
          rotation={[-0.02, -0.22, 0.01]}
          material={weatheredStone}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[1.2, 17.0, 2.2]} />
        </mesh>

        <mesh
          position={[5.5, 6.0, -3.5]}
          material={agedStone}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[2.6, 21.0, 2.6]} />
        </mesh>

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

      {/* 4. SUBTERRANEAN FOUNDATIONS */}
      <group position={[0, -6.2, -23]}>
        <mesh material={darkBasalt} receiveShadow>
          <boxGeometry args={[74, 2.2, 34]} />
        </mesh>
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

// ============================================================================
// 5. PASS 04: THE DISTANT MONUMENT (COLOSSAL HUMAN-FORM SCULPTURE)
// ============================================================================

/**
 * An immense, ancient, partially destroyed abstract human-form sculpture.
 * Placed in the extreme distance (Z: -92m, X: -32m) opposite the Great Staircase.
 * Suggests a colossal seated figure whose upper body/head fades into the dark ceilingless fog.
 * Weathered stone, faceless, fractured shoulder/arm, non-emissive, completely static.
 */
function DistantColossusMonument({ materials }) {
  const { darkBasalt, distantStone, weatheredStone } = materials;

  return (
    <group position={[-32, 0, -92]} rotation={[0, 0.22, 0]} name="DistantColossusMonument">
      {/* 1. Colossal Stepped Throne Pedestal */}
      {/* Lowest Plinth Block */}
      <mesh position={[0, -8.0, 0]} material={darkBasalt}>
        <boxGeometry args={[36.0, 6.0, 30.0]} />
      </mesh>
      {/* Stepped Upper Pedestal Tier */}
      <mesh position={[0, -3.5, 0]} material={distantStone}>
        <boxGeometry args={[28.0, 4.0, 24.0]} />
      </mesh>
      {/* Monolithic Throne Backrest Slab (rising behind the figure) */}
      <mesh position={[0, 26.0, -5.5]} material={darkBasalt}>
        <boxGeometry args={[20.0, 65.0, 5.5]} />
      </mesh>

      {/* 2. Seated Lower Body & Draped Monolithic Masses */}
      {/* Central Lap / Throne Base Mass */}
      <mesh position={[0, 3.5, 3.0]} material={distantStone}>
        <boxGeometry args={[18.0, 14.0, 16.0]} />
      </mesh>
      {/* Intact Left Leg / Knee Mass extending forward */}
      <mesh position={[-5.5, 1.0, 7.5]} material={distantStone}>
        <boxGeometry args={[6.5, 16.0, 10.0]} />
      </mesh>
      {/* Severed / Fractured Right Leg Stump (shattered at knee level) */}
      <mesh position={[5.5, -3.2, 5.0]} material={distantStone}>
        <boxGeometry args={[6.5, 8.0, 7.0]} />
      </mesh>
      {/* Dislodged Fallen Knee Block resting angled on plinth */}
      <mesh
        position={[6.8, -5.2, 9.2]}
        rotation={[0.18, 0.35, -0.12]}
        material={weatheredStone}
      >
        <boxGeometry args={[3.8, 2.8, 4.2]} />
      </mesh>

      {/* 3. Colossal Torso & Shoulders */}
      {/* Main Monumental Torso */}
      <mesh position={[0, 24.0, 0]} rotation={[-0.03, 0, 0]} material={distantStone}>
        <boxGeometry args={[19.5, 26.0, 11.0]} />
      </mesh>
      {/* Chiseled Pectoral Plane */}
      <mesh position={[0, 30.5, 4.5]} material={distantStone}>
        <boxGeometry args={[16.5, 9.5, 3.0]} />
      </mesh>

      {/* Intact Left Shoulder Mass */}
      <mesh position={[-11.2, 33.5, 0]} material={distantStone}>
        <boxGeometry args={[8.5, 8.5, 9.0]} />
      </mesh>
      {/* Left Forearm resting on lap */}
      <mesh position={[-11.5, 20.5, 2.5]} material={distantStone}>
        <boxGeometry args={[5.0, 18.0, 5.5]} />
      </mesh>

      {/* Fractured Right Shoulder (severed at upper bicep with exposed fracture wedge) */}
      <mesh position={[10.5, 32.5, 0]} material={distantStone}>
        <boxGeometry args={[7.5, 6.5, 8.0]} />
      </mesh>
      <mesh
        position={[11.2, 28.5, 0.5]}
        rotation={[0.15, -0.2, 0.28]}
        material={weatheredStone}
      >
        <boxGeometry args={[4.2, 4.8, 5.2]} />
      </mesh>

      {/* 4. Colossal Faceless Head & Weathered Visage */}
      {/* Monumental Neck */}
      <mesh position={[0, 38.5, 0]} material={distantStone}>
        <cylinderGeometry args={[3.0, 3.6, 6.0, 14]} />
      </mesh>
      {/* Faceless Cranium / Weathered Head Mass */}
      <mesh position={[0, 46.5, 1.0]} material={distantStone}>
        <boxGeometry args={[8.5, 12.0, 9.5]} />
      </mesh>
      {/* Chiseled Monolithic Brow & Jawline Plane (faceless, abstract ancient idol) */}
      <mesh position={[0, 44.5, 4.8]} material={weatheredStone}>
        <boxGeometry args={[7.2, 6.5, 3.8]} />
      </mesh>
      {/* Fractured Head Crown (sheared top stone fading into void darkness) */}
      <mesh
        position={[1.2, 53.0, 0.5]}
        rotation={[0.08, 0.18, -0.06]}
        material={darkBasalt}
      >
        <boxGeometry args={[6.0, 4.5, 7.0]} />
      </mesh>
    </group>
  );
}

// ============================================================================
// 6. LAYER 3: BACKGROUND MONUMENTAL RUINS + HERO STRUCTURES
// ============================================================================

function BackgroundArchitecture({ materials }) {
  const { darkBasalt, distantStone, weatheredStone } = materials;

  return (
    <group name="BackgroundMonuments">
      {/* HERO STRUCTURE 1: THE CYCLOPEAN GREAT STAIRCASE & BROKEN VOID PORTAL */}
      <group position={[14, 0, -74]}>
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

        <mesh position={[-7.5, 18.0, -17.0]} material={distantStone}>
          <boxGeometry args={[4.2, 38.0, 4.2]} />
        </mesh>
        <mesh position={[7.5, 20.0, -17.0]} material={distantStone}>
          <boxGeometry args={[4.6, 42.0, 4.6]} />
        </mesh>

        <group position={[1.5, 36.5, -17.0]}>
          <mesh position={[2.0, 0, 0]} material={distantStone}>
            <boxGeometry args={[16.0, 4.5, 5.0]} />
          </mesh>
          <mesh
            position={[-7.0, 0.8, 0.2]}
            rotation={[0, 0.12, -0.08]}
            material={weatheredStone}
          >
            <boxGeometry args={[6.5, 4.8, 5.2]} />
          </mesh>
        </group>
      </group>

      {/* HERO STRUCTURE 2 (PASS 04): THE DISTANT COLOSSUS MONUMENT */}
      <DistantColossusMonument materials={materials} />

      {/* FAR LEFT: Distant Hypostyle Pillars & Towering Architrave Beams */}
      <mesh position={[-36, 18.0, -64]} material={distantStone}>
        <cylinderGeometry args={[3.4, 3.9, 58.0, 16]} />
      </mesh>
      <mesh position={[-24, 16.0, -72]} material={distantStone}>
        <cylinderGeometry args={[3.2, 3.7, 54.0, 16]} />
      </mesh>
      <mesh
        position={[-30, 38.0, -68]}
        rotation={[0, 0.35, 0.02]}
        material={distantStone}
      >
        <boxGeometry args={[22.0, 3.8, 4.2]} />
      </mesh>

      {/* PERIPHERAL HORIZON MEGALITHS */}
      <mesh
        position={[-56, 20.0, -84]}
        rotation={[0, 0.22, 0]}
        material={darkBasalt}
      >
        <boxGeometry args={[28.0, 52.0, 4.0]} />
      </mesh>

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

// ============================================================================
// 7. MAIN VOID ENVIRONMENT EXPORT
// ============================================================================

export function VoidEnvironment() {
  const { currentStage, stages, activeRoomId, activePhilosopherId, inspectingBook } = useExperience();

  const materials = useMemo(() => {
    return {
      agedStone: new THREE.MeshStandardMaterial({
        color: '#0a0b0e',
        roughness: 0.92,
        metalness: 0.04,
      }),
      darkBasalt: new THREE.MeshStandardMaterial({
        color: '#050608',
        roughness: 0.98,
        metalness: 0.02,
      }),
      weatheredStone: new THREE.MeshStandardMaterial({
        color: '#0e1014',
        roughness: 0.88,
        metalness: 0.06,
      }),
      distantStone: new THREE.MeshStandardMaterial({
        color: '#050608',
        roughness: 0.98,
        metalness: 0.02,
      }),
      bronze: new THREE.MeshStandardMaterial({
        color: '#2a241b',
        roughness: 0.62,
        metalness: 0.82,
      }),
    };
  }, []);

  if (currentStage === stages.ENDING) {
    return null;
  }

  const isEncounterActive = Boolean(activeRoomId || activePhilosopherId || inspectingBook);

  return (
    <group name="VoidEnvironment">
      {/* 1. FOREGROUND LAYER: Sparse Atmospheric Dust */}
      <ForegroundAtmosphere isEncounterActive={isEncounterActive} />

      {/* 2. MIDGROUND LAYER: Ancient Imperfect Architectural Remnants */}
      <MidgroundArchitecture materials={materials} />

      {/* 3. BACKGROUND LAYER: Distant Monumental Ruins, The Great Staircase & The Distant Colossus */}
      <BackgroundArchitecture materials={materials} />

      {/* 4. PHYSICAL FLOATING MANUSCRIPTS: Fragments of Human Thought */}
      <FloatingManuscripts isEncounterActive={isEncounterActive} />
    </group>
  );
}
