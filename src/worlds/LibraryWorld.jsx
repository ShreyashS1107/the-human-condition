import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PHILOSOPHERS_DIALOGUE_DATA } from '../data/philosophersDialogue';
import { PhilosopherFigure } from '../scenes/Library/PhilosopherFigure';
import { LibraryCamera } from '../scenes/Library/LibraryCamera';
import { useExperience } from '../hooks/useExperience';

// Towering Archival Bookcases along the grand rear and side walls
function LibraryBookcases() {
  const shelfPositions = useMemo(() => {
    const arr = [];
    // Rear wall multi-tier shelves
    for (let x = -10; x <= 10; x += 2.5) {
      arr.push({ pos: [x, 3.5, -6.5], scale: [2.3, 8.2, 0.65], isSide: false });
    }
    // Left & Right flanking walls
    for (let z = -5; z <= 5; z += 2.5) {
      arr.push({ pos: [-10.5, 3.5, z], scale: [0.65, 8.2, 2.3], isSide: true });
      arr.push({ pos: [10.5, 3.5, z], scale: [0.65, 8.2, 2.3], isSide: true });
    }
    return arr;
  }, []);

  const bookSpineColors = [
    '#1c1613', '#2b1a13', '#161d24', '#2a141b', '#18241b',
    '#382419', '#1d232a', '#241a29', '#141416'
  ];

  return (
    <group>
      {shelfPositions.map((shelf, idx) => (
        <group key={idx} position={shelf.pos}>
          {/* Shelf Wood Cabinet Frame */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={shelf.scale} />
            <meshStandardMaterial
              color="#0e0c0b"
              roughness={0.88}
              metalness={0.12}
            />
          </mesh>

          {/* Gold Rib Horizontal Moulding Trims */}
          {[-2.6, -1.0, 0.6, 2.2].map((yOffset, ribIdx) => (
            <group key={ribIdx} position={[0, yOffset, shelf.isSide ? 0 : 0.05]}>
              <mesh castShadow>
                <boxGeometry
                  args={[
                    shelf.scale[0] * (shelf.isSide ? 1.05 : 0.98),
                    0.05,
                    shelf.scale[2] * (shelf.isSide ? 0.98 : 1.05),
                  ]}
                />
                <meshStandardMaterial
                  color="#c49a45"
                  metalness={0.88}
                  roughness={0.25}
                />
              </mesh>

              {/* Individual Simulated Book Spines on each tier */}
              {[-0.8, -0.5, -0.2, 0.1, 0.4, 0.7].map((offset, bIdx) => {
                const bHeight = 0.62 + ((bIdx + ribIdx) % 4) * 0.04;
                const bColor = bookSpineColors[(idx * 5 + ribIdx * 3 + bIdx) % bookSpineColors.length];
                const posX = shelf.isSide ? 0 : offset;
                const posZ = shelf.isSide ? offset : 0;
                return (
                  <mesh
                    key={bIdx}
                    position={[posX, bHeight / 2 + 0.02, posZ]}
                    castShadow
                  >
                    <boxGeometry
                      args={[
                        shelf.isSide ? 0.48 : 0.24,
                        bHeight,
                        shelf.isSide ? 0.24 : 0.48,
                      ]}
                    />
                    <meshStandardMaterial
                      color={bColor}
                      roughness={0.7}
                      metalness={0.18}
                    />
                  </mesh>
                );
              })}
            </group>
          ))}
        </group>
      ))}
    </group>
  );
}

// Volumetric-Style Angled Light Cones
function VolumetricLightShafts() {
  const shaftsRef = useRef();

  useFrame((state) => {
    if (shaftsRef.current) {
      shaftsRef.current.children.forEach((shaft, i) => {
        const mat = shaft.material;
        if (mat) {
          mat.opacity = 0.14 + Math.sin(state.clock.elapsedTime * 0.4 + i) * 0.04;
        }
      });
    }
  });

  return (
    <group ref={shaftsRef}>
      {[-5, 0, 5].map((x, idx) => (
        <mesh
          key={idx}
          position={[x, 4.5, -2.5]}
          rotation={[0.35, 0, idx === 0 ? 0.15 : idx === 2 ? -0.15 : 0]}
        >
          <cylinderGeometry args={[0.35, 2.4, 9.5, 32, 1, true]} />
          <meshBasicMaterial
            color="#f7ebd2"
            transparent
            opacity={0.14}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

// Floating Wandering Tomes in the Air
function FloatingTomes() {
  const tomesRef = useRef();

  const tomes = useMemo(() => {
    return Array.from({ length: 16 }, () => ({
      pos: [
        (Math.random() - 0.5) * 14,
        1.5 + Math.random() * 3.5,
        (Math.random() - 0.5) * 8 - 1,
      ],
      rot: [Math.random() * 0.4, Math.random() * Math.PI, (Math.random() - 0.5) * 0.3],
      speed: 0.4 + Math.random() * 0.4,
    }));
  }, []);

  useFrame((state, delta) => {
    if (tomesRef.current) {
      tomesRef.current.children.forEach((tome, i) => {
        const item = tomes[i];
        tome.position.y += Math.sin(state.clock.elapsedTime * item.speed + i) * 0.003;
        tome.rotation.y += delta * 0.18;
      });
    }
  });

  return (
    <group ref={tomesRef}>
      {tomes.map((item, idx) => (
        <group key={idx} position={item.pos} rotation={item.rot} castShadow>
          {/* Tome Cover */}
          <mesh castShadow>
            <boxGeometry args={[0.38, 0.06, 0.48]} />
            <meshStandardMaterial color="#2d1717" roughness={0.7} metalness={0.25} />
          </mesh>
          {/* Inner Pages */}
          <mesh position={[0.02, 0, 0]}>
            <boxGeometry args={[0.35, 0.048, 0.45]} />
            <meshStandardMaterial color="#f0e6d2" roughness={0.9} />
          </mesh>
          {/* Corner Gold Clasp */}
          <mesh position={[-0.16, 0.02, -0.21]}>
            <boxGeometry args={[0.05, 0.02, 0.05]} />
            <meshStandardMaterial color="#c49a45" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Drifting Dust Particles
function LibraryDust() {
  const pointsRef = useRef();

  const [positions] = useMemo(() => {
    const count = 550;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 20;
      pos[i + 1] = Math.random() * 8;
      pos[i + 2] = (Math.random() - 0.5) * 14;
    }
    return [pos];
  }, []);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.015;
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
        size={0.045}
        color="#f0e2cc"
        transparent
        opacity={0.55}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function LibraryWorld({
  activePhilosopherId,
  onSelectPhilosopher,
  onInspectBook,
}) {
  const { visitedPhilosophers, discoveredBooks } = useExperience();

  const activePhilosopher = PHILOSOPHERS_DIALOGUE_DATA.find(
    (p) => p.id === activePhilosopherId
  );

  return (
    <group>
      {/* Fog to obscure distant boundaries - deeper and intimate during private philosopher inquest */}
      <fog
        attach="fog"
        args={[
          activePhilosopher ? '#020204' : '#030305',
          activePhilosopher ? 6.0 : 8.0,
          activePhilosopher ? 75.0 : 95.0,
        ]}
      />

      {/* Cinematic Spatial Camera */}
      <LibraryCamera activePhilosopher={activePhilosopher} />

      {/* Grand Hall Floor with Flagstones */}
      <mesh position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[32, 32]} />
        <meshStandardMaterial
          color="#0a090b"
          roughness={0.45}
          metalness={0.55}
        />
      </mesh>

      {/* Grand Hall Bookcases - only visible in Hall Overview */}
      {!activePhilosopher && <LibraryBookcases />}

      {/* Volumetric Light Beams - only visible in Hall Overview */}
      {!activePhilosopher && <VolumetricLightShafts />}

      {/* Floating Tomes - only in Overview */}
      {!activePhilosopher && <FloatingTomes />}

      {/* Ambient Dust Motes */}
      <LibraryDust />

      {/* 5 Philosophical Figures - Strict Isolation: ONLY active philosopher rendered in encounter */}
      {PHILOSOPHERS_DIALOGUE_DATA.map((philosopher) => {
        const isSelected = activePhilosopherId === philosopher.id;
        // If in encounter mode and not selected, do NOT render in frame
        if (activePhilosopherId && !isSelected) return null;

        return (
          <PhilosopherFigure
            key={philosopher.id}
            philosopher={philosopher}
            isFocused={isSelected}
            isVisited={visitedPhilosophers.includes(philosopher.id)}
            hasBookDiscovered={discoveredBooks.includes(philosopher.book.id)}
            onSelect={onSelectPhilosopher}
            onInspectBook={onInspectBook}
          />
        );
      })}

      {/* Grand Hall Ambient and Directional Lighting */}
      <ambientLight intensity={activePhilosopher ? 0.08 : 0.18} color="#15171e" />
      <directionalLight
        position={[0, 12, 6]}
        intensity={activePhilosopher ? 0.6 : 1.2}
        color="#ede3cf"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />
    </group>
  );
}

