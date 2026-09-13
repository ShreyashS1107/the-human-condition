import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 1. Procedural 3D Library Representation
export function LibraryPreview({ isFocused }) {
  const booksRef = useRef();

  // Generate floating book leaves with realistic aspect ratio & slight rotations
  const leaves = useMemo(() => {
    return Array.from({ length: 16 }, () => ({
      pos: [
        (Math.random() - 0.5) * 2.0,
        Math.random() * 2.4 - 0.4,
        (Math.random() - 0.5) * 1.6,
      ],
      rot: [Math.random() * 0.4, Math.random() * Math.PI, (Math.random() - 0.5) * 0.4],
      speed: 0.3 + Math.random() * 0.5,
      rotSpeed: 0.2 + Math.random() * 0.4,
    }));
  }, []);

  // Book spine clusters
  const bookSpineColors = ['#1a1512', '#281a14', '#161e24', '#2c1820', '#1c221a', '#8a775d'];

  useFrame((state, delta) => {
    if (booksRef.current) {
      booksRef.current.children.forEach((child, i) => {
        const leaf = leaves[i];
        if (leaf) {
          child.position.y += Math.sin(state.clock.elapsedTime * leaf.speed + i) * 0.002;
          child.rotation.y += delta * leaf.rotSpeed * (isFocused ? 1.4 : 0.4);
        }
      });
    }
  });

  return (
    <group>
      {/* Towering vertical archive shelves on left and right */}
      {[-1.2, 1.2].map((x, idx) => (
        <group key={idx} position={[x, 0.5, -0.4]}>
          {/* Main Shelf Cabinet Wood Frame */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.32, 4.4, 1.25]} />
            <meshStandardMaterial color="#14110f" roughness={0.85} metalness={0.15} />
          </mesh>

          {/* Book Spines Rows */}
          {[-1.4, -0.6, 0.2, 1.0, 1.8].map((yShelf, sIdx) => (
            <group key={sIdx} position={[x > 0 ? -0.1 : 0.1, yShelf, 0]}>
              {/* Shelf Horizontal Divider with Gilded Trim */}
              <mesh position={[0, -0.32, 0]} castShadow>
                <boxGeometry args={[0.34, 0.05, 1.26]} />
                <meshStandardMaterial color="#c49a45" metalness={0.88} roughness={0.25} />
              </mesh>
              {/* Row of Books with color and height variations */}
              {[-0.45, -0.28, -0.12, 0.04, 0.2, 0.36, 0.5].map((zPos, bIdx) => {
                const height = 0.52 + ((bIdx * 7) % 5) * 0.03;
                const depth = 0.26 + ((bIdx * 3) % 4) * 0.02;
                const color = bookSpineColors[(idx * 7 + sIdx * 3 + bIdx) % bookSpineColors.length];
                return (
                  <mesh key={bIdx} position={[0, height / 2 - 0.3, zPos]} castShadow>
                    <boxGeometry args={[0.26, height, depth]} />
                    <meshStandardMaterial color={color} roughness={0.7} metalness={0.2} />
                  </mesh>
                );
              })}
            </group>
          ))}
        </group>
      ))}

      {/* Floating wandering parchment folios */}
      <group ref={booksRef}>
        {leaves.map((leaf, idx) => (
          <mesh key={idx} position={leaf.pos} rotation={leaf.rot} castShadow>
            <planeGeometry args={[0.22, 0.3]} />
            <meshPhysicalMaterial
              color="#f3ead7"
              side={THREE.DoubleSide}
              roughness={0.8}
              transmission={0.2}
              thickness={0.02}
              transparent
              opacity={isFocused ? 0.95 : 0.65}
            />
          </mesh>
        ))}
      </group>

      {/* Volumetric light beam cone */}
      <mesh position={[0, 1.6, 0.2]} rotation={[0.2, 0, 0]}>
        <cylinderGeometry args={[0.15, 1.4, 3.8, 32, 1, true]} />
        <meshBasicMaterial
          color="#f4e8cc"
          transparent
          opacity={isFocused ? 0.16 : 0.06}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Central localized key light */}
      <pointLight
        position={[0, 1.6, 0.4]}
        intensity={isFocused ? 3.0 : 1.0}
        distance={5.0}
        color="#f6ebd4"
        castShadow
      />
    </group>
  );
}

// 2. Procedural 3D Museum Representation
export function MuseumPreview({ isFocused }) {
  const corridorRef = useRef();
  const monolithRef = useRef();
  const relicRingRef = useRef();

  useFrame((state, delta) => {
    if (monolithRef.current) {
      monolithRef.current.rotation.y += delta * 0.2;
      monolithRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
    }
    if (relicRingRef.current) {
      relicRingRef.current.rotation.z -= delta * 0.25;
      relicRingRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group>
      {/* Enormous Brutalist Doorway Portals receding into the void */}
      <group ref={corridorRef}>
        {[0, -0.9, -1.8, -2.7].map((z, idx) => {
          const scale = 1 - idx * 0.12;
          return (
            <group key={idx} position={[0, 0, z]} scale={[scale, scale, scale]}>
              {/* Left Basalt Pillar with Beveled Base */}
              <mesh position={[-0.95, 0.4, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.18, 3.4, 0.22]} />
                <meshStandardMaterial color="#121418" metalness={0.7} roughness={0.35} />
              </mesh>
              {/* Right Basalt Pillar with Beveled Base */}
              <mesh position={[0.95, 0.4, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.18, 3.4, 0.22]} />
                <meshStandardMaterial color="#121418" metalness={0.7} roughness={0.35} />
              </mesh>
              {/* Heavy Chamfered Architrave Lintel */}
              <mesh position={[0, 2.1, 0]} castShadow receiveShadow>
                <boxGeometry args={[2.1, 0.2, 0.26]} />
                <meshStandardMaterial color="#1e222b" metalness={0.8} roughness={0.3} />
              </mesh>
              {/* Inlaid Cold Blue Luminescent Groove */}
              <mesh position={[0, 1.98, 0.14]}>
                <boxGeometry args={[1.9, 0.02, 0.02]} />
                <meshStandardMaterial
                  color="#4a6572"
                  emissive="#78909c"
                  emissiveIntensity={isFocused ? 1.5 : 0.4}
                />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* Floating Enigmatic Dual-Material Relic in Center */}
      <group position={[0, 0.65, -0.8]}>
        <mesh ref={monolithRef} castShadow>
          <icosahedronGeometry args={[0.42, 0]} />
          <meshPhysicalMaterial
            color="#181a1f"
            metalness={0.9}
            roughness={0.15}
            clearcoat={0.8}
            clearcoatRoughness={0.2}
          />
        </mesh>
        {/* Orbiting Concentric Relic Ring */}
        <mesh ref={relicRingRef}>
          <torusGeometry args={[0.65, 0.018, 16, 48]} />
          <meshStandardMaterial
            color="#c49a45"
            metalness={0.95}
            roughness={0.2}
            emissive="#c49a45"
            emissiveIntensity={isFocused ? 1.2 : 0.3}
          />
        </mesh>
      </group>

      <pointLight
        position={[0, 1.4, 0.3]}
        intensity={isFocused ? 3.2 : 1.0}
        distance={5.0}
        color="#a5c4d4"
        castShadow
      />
    </group>
  );
}

// 3. Procedural 3D Book That Reads You Representation
export function BookPreview({ isFocused }) {
  const bookRef = useRef();
  const eyeRef = useRef();

  useFrame((state, delta) => {
    if (bookRef.current) {
      bookRef.current.position.y = 0.52 + Math.sin(state.clock.elapsedTime * 1.2) * 0.04;
      bookRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.07;
    }
    if (eyeRef.current) {
      const pulse = 1.0 + Math.sin(state.clock.elapsedTime * 2.2) * 0.12;
      eyeRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group>
      {/* Solitary Hexagonal Carved Pedestal Base */}
      <mesh position={[0, -0.6, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[0.55, 0.72, 1.2, 6]} />
        <meshStandardMaterial color="#0e0a09" roughness={0.9} metalness={0.2} />
      </mesh>
      {/* Brass Pedestal Band Inlay */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.56, 0.56, 0.04, 6]} />
        <meshStandardMaterial color="#c49a45" metalness={0.9} roughness={0.25} />
      </mesh>

      {/* Floating Enormous Tome */}
      <group ref={bookRef} position={[0, 0.52, 0]}>
        {/* Leather Spine */}
        <mesh position={[0, -0.02, 0]} rotation={[0.4, 0, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.94, 16, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color="#1a0c0c" roughness={0.7} metalness={0.2} />
        </mesh>

        {/* Left Book Cover */}
        <mesh position={[-0.38, 0, 0]} rotation={[0.4, 0.25, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.72, 0.05, 0.94]} />
          <meshStandardMaterial color="#240f0f" roughness={0.65} metalness={0.25} />
        </mesh>
        {/* Left Parchment Pages Stack (Stratified Block) */}
        <mesh position={[-0.36, 0.04, 0]} rotation={[0.4, 0.25, 0]} castShadow>
          <boxGeometry args={[0.66, 0.06, 0.88]} />
          <meshPhysicalMaterial color="#f0e6d2" roughness={0.88} />
        </mesh>
        {/* Left Antique Brass Corner Fitting */}
        <mesh position={[-0.68, 0.03, -0.38]} rotation={[0.4, 0.25, 0]}>
          <boxGeometry args={[0.1, 0.03, 0.1]} />
          <meshStandardMaterial color="#c49a45" metalness={0.92} roughness={0.2} />
        </mesh>

        {/* Right Book Cover */}
        <mesh position={[0.38, 0, 0]} rotation={[0.4, -0.25, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.72, 0.05, 0.94]} />
          <meshStandardMaterial color="#240f0f" roughness={0.65} metalness={0.25} />
        </mesh>
        {/* Right Parchment Pages Stack */}
        <mesh position={[0.36, 0.04, 0]} rotation={[0.4, -0.25, 0]} castShadow>
          <boxGeometry args={[0.66, 0.06, 0.88]} />
          <meshPhysicalMaterial color="#f0e6d2" roughness={0.88} />
        </mesh>
        {/* Right Antique Brass Corner Fitting */}
        <mesh position={[0.68, 0.03, -0.38]} rotation={[0.4, -0.25, 0]}>
          <boxGeometry args={[0.1, 0.03, 0.1]} />
          <meshStandardMaterial color="#c49a45" metalness={0.92} roughness={0.2} />
        </mesh>

        {/* Central Occult Eye / Luminous Seal */}
        <group ref={eyeRef} position={[0, 0.16, 0]}>
          <mesh>
            <octahedronGeometry args={[0.07, 0]} />
            <meshStandardMaterial
              color="#e63946"
              emissive="#ff3333"
              emissiveIntensity={isFocused ? 3.0 : 1.0}
              roughness={0.1}
            />
          </mesh>
        </group>
      </group>

      <pointLight
        position={[0, 1.5, 0.4]}
        intensity={isFocused ? 3.2 : 1.1}
        distance={4.5}
        color="#e63946"
        castShadow
      />
    </group>
  );
}

