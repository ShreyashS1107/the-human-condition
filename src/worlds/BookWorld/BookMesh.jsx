import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function BookMesh({
  isOpen = true,
  isTurningPage = false,
  pageTurnProgress = 0,
}) {
  const leftCoverRef = useRef();
  const rightCoverRef = useRef();
  const turningPageRef = useRef();
  const glowCoreRef = useRef();

  useFrame((state, delta) => {
    // Smooth book cover opening/closing animation
    const targetLeftAngle = isOpen ? -0.42 : 0;
    const targetRightAngle = isOpen ? 0.42 : 0;

    if (leftCoverRef.current) {
      leftCoverRef.current.rotation.y += (targetLeftAngle - leftCoverRef.current.rotation.y) * delta * 3.5;
    }
    if (rightCoverRef.current) {
      rightCoverRef.current.rotation.y += (targetRightAngle - rightCoverRef.current.rotation.y) * delta * 3.5;
    }

    // Organic page turning flip
    if (turningPageRef.current) {
      if (isTurningPage) {
        // Smooth flip from right (+0.4) to left (-0.4)
        const angle = THREE.MathUtils.lerp(0.4, -0.4, pageTurnProgress);
        turningPageRef.current.rotation.y = angle;
        // Parabolic leaf arch
        turningPageRef.current.position.y = 0.08 + Math.sin(pageTurnProgress * Math.PI) * 0.18;
      } else {
        turningPageRef.current.rotation.y = 0.4;
        turningPageRef.current.position.y = 0.06;
      }
    }

    if (glowCoreRef.current) {
      glowCoreRef.current.rotation.y += delta * 0.35;
    }
  });

  return (
    <group position={[0, 0.5, 0]}>
      {/* Central Curved Leather Spine with Embossed Hub Ribs */}
      <mesh position={[0, 0.02, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.07, 0.07, 1.18, 24, 1, false, 0, Math.PI]} />
        <meshPhysicalMaterial
          color="#1a0f0d"
          roughness={0.65}
          metalness={0.25}
          clearcoat={0.3}
          clearcoatRoughness={0.4}
        />
      </mesh>
      {/* Spine Gold Raised Hub Ribs */}
      {[-0.35, 0, 0.35].map((z, idx) => (
        <mesh key={idx} position={[0, 0.03, z]} castShadow>
          <cylinderGeometry args={[0.076, 0.076, 0.04, 24, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color="#c49a45" metalness={0.92} roughness={0.25} />
        </mesh>
      ))}

      {/* Left Heavy Beveled Leather Cover Wing */}
      <group ref={leftCoverRef} position={[-0.06, 0, 0]}>
        {/* Leather Board */}
        <mesh position={[-0.48, 0.02, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.96, 0.045, 1.22]} />
          <meshPhysicalMaterial
            color="#221210"
            roughness={0.62}
            metalness={0.2}
            clearcoat={0.35}
            clearcoatRoughness={0.3}
          />
        </mesh>

        {/* Blind-Tooled Border Filigree */}
        <mesh position={[-0.48, 0.044, 0]}>
          <boxGeometry args={[0.88, 0.002, 1.14]} />
          <meshStandardMaterial color="#351a17" roughness={0.8} />
        </mesh>

        {/* Left Layered Parchment Block (Simulating 500 leaves with visible thickness) */}
        <mesh position={[-0.45, 0.055, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.88, 0.07, 1.14]} />
          <meshPhysicalMaterial
            color="#f2ebd9"
            roughness={0.88}
            reflectivity={0.2}
          />
        </mesh>

        {/* Gold Edge Gilding on Top, Bottom & Outer Edges */}
        <mesh position={[-0.9, 0.055, 0]}>
          <boxGeometry args={[0.015, 0.068, 1.14]} />
          <meshStandardMaterial color="#c49a45" metalness={0.95} roughness={0.25} />
        </mesh>

        {/* Antique Brass Corner Clasp Left Top */}
        <mesh position={[-0.88, 0.045, -0.54]} castShadow>
          <boxGeometry args={[0.12, 0.02, 0.12]} />
          <meshStandardMaterial color="#c49a45" metalness={0.94} roughness={0.22} />
        </mesh>
        {/* Antique Brass Corner Clasp Left Bottom */}
        <mesh position={[-0.88, 0.045, 0.54]} castShadow>
          <boxGeometry args={[0.12, 0.02, 0.12]} />
          <meshStandardMaterial color="#c49a45" metalness={0.94} roughness={0.22} />
        </mesh>
      </group>

      {/* Right Heavy Beveled Leather Cover Wing */}
      <group ref={rightCoverRef} position={[0.06, 0, 0]}>
        {/* Leather Board */}
        <mesh position={[0.48, 0.02, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.96, 0.045, 1.22]} />
          <meshPhysicalMaterial
            color="#221210"
            roughness={0.62}
            metalness={0.2}
            clearcoat={0.35}
            clearcoatRoughness={0.3}
          />
        </mesh>

        {/* Blind-Tooled Border Filigree */}
        <mesh position={[0.48, 0.044, 0]}>
          <boxGeometry args={[0.88, 0.002, 1.14]} />
          <meshStandardMaterial color="#351a17" roughness={0.8} />
        </mesh>

        {/* Right Layered Parchment Block */}
        <mesh position={[0.45, 0.055, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.88, 0.07, 1.14]} />
          <meshPhysicalMaterial
            color="#f2ebd9"
            roughness={0.88}
            reflectivity={0.2}
          />
        </mesh>

        {/* Gold Edge Gilding */}
        <mesh position={[0.9, 0.055, 0]}>
          <boxGeometry args={[0.015, 0.068, 1.14]} />
          <meshStandardMaterial color="#c49a45" metalness={0.95} roughness={0.25} />
        </mesh>

        {/* Antique Brass Corner Clasp Right Top */}
        <mesh position={[0.88, 0.045, -0.54]} castShadow>
          <boxGeometry args={[0.12, 0.02, 0.12]} />
          <meshStandardMaterial color="#c49a45" metalness={0.94} roughness={0.22} />
        </mesh>
        {/* Antique Brass Corner Clasp Right Bottom */}
        <mesh position={[0.88, 0.045, 0.54]} castShadow>
          <boxGeometry args={[0.12, 0.02, 0.12]} />
          <meshStandardMaterial color="#c49a45" metalness={0.94} roughness={0.22} />
        </mesh>
      </group>

      {/* Dynamic Curving Turning Leaf with Casting Shadow */}
      {isTurningPage && (
        <group ref={turningPageRef} position={[0, 0.06, 0]}>
          <mesh position={[0.44, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.88, 0.006, 1.12]} />
            <meshPhysicalMaterial
              color="#f8f1e2"
              roughness={0.85}
              side={THREE.DoubleSide}
              transmission={0.15}
              thickness={0.01}
            />
          </mesh>
        </group>
      )}

      {/* Inlaid Occult Sigil Eye */}
      <mesh ref={glowCoreRef} position={[0, 0.13, 0]}>
        <octahedronGeometry args={[0.07, 0]} />
        <meshStandardMaterial
          color="#c49a45"
          emissive="#e5b452"
          emissiveIntensity={isOpen ? 2.2 : 0.4}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
    </group>
  );
}

