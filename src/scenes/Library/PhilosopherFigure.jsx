import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { PhilosopherEnvironment } from './PhilosopherEnvironment';
import { soundEngine } from '../../systems/audioEngine';

export function PhilosopherFigure({
  philosopher,
  isFocused,
  isVisited,
  hasBookDiscovered,
  onSelect,
  onInspectBook,
}) {
  const groupRef = useRef();
  const coreRef = useRef();
  const ringRef = useRef();
  const gyroRef = useRef();
  const [isHovered, setIsHovered] = useState(false);

  const active = isFocused;

  useFrame((state, delta) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * (active ? 0.9 : 0.15);
      coreRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.8) * (active ? 0.15 : 0.04);
    }
    if (gyroRef.current) {
      gyroRef.current.rotation.z -= delta * (active ? 0.6 : 0.1);
      gyroRef.current.rotation.x += delta * (active ? 0.1 : 0.02);
    }
    if (ringRef.current && active) {
      ringRef.current.rotation.z += delta * 0.25;
    }
  });

  const handlePointerOver = (e) => {
    e.stopPropagation();
    setIsHovered(true);
    soundEngine.playPhilosopherProximity(philosopher);
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();
    setIsHovered(false);
  };

  const handleClick = (e) => {
    e.stopPropagation();
    soundEngine.playSubtlePulse(philosopher.soundTone.freq, 1.8, 0.25);
    if (onSelect) onSelect(philosopher.id);
  };

  return (
    <group
      ref={groupRef}
      position={philosopher.position}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
      cursor="pointer"
    >
      {/* Invisible interaction bounding box */}
      <mesh visible={false}>
        <boxGeometry args={[2.5, 4.0, 2.5]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Unique Procedural Environment */}
      <PhilosopherEnvironment type={philosopher.environmentType} isFocused={active} />

      {/* Artistic Presence Monolith / Reliquary */}
      <Float speed={1.3} rotationIntensity={0.25} floatIntensity={0.45}>
        <group position={[0, 0.45, 0]}>
          {/* Outer Resonant Beveled Casing */}
          <mesh castShadow>
            <octahedronGeometry args={[0.42, 0]} />
            <meshPhysicalMaterial
              color="#1a1816"
              roughness={0.25}
              metalness={0.88}
              clearcoat={0.5}
              clearcoatRoughness={0.2}
            />
          </mesh>

          {/* Orbiting Antique Brass Gimbal Ring */}
          <mesh ref={gyroRef}>
            <torusGeometry args={[0.62, 0.016, 16, 48]} />
            <meshStandardMaterial
              color="#c49a45"
              metalness={0.92}
              roughness={0.25}
            />
          </mesh>

          {/* Inner Glowing Consciousness Polyhedron */}
          <mesh ref={coreRef} scale={[0.55, 0.55, 0.55]}>
            <dodecahedronGeometry args={[0.3, 0]} />
            <meshStandardMaterial
              color={philosopher.themeColor}
              emissive={philosopher.themeColor}
              emissiveIntensity={active ? 2.8 : 0.8}
              roughness={0.15}
            />
          </mesh>
        </group>
      </Float>

      {/* Sanctuary Floor Threshold Marker with Beveled Stone Ring */}
      <group position={[0, -1.48, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <cylinderGeometry args={[1.15, 1.2, 0.04, 32]} />
          <meshStandardMaterial color="#0b0b0e" roughness={0.85} metalness={0.3} />
        </mesh>
        <mesh ref={ringRef} position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.05, 1.15, 48]} />
          <meshStandardMaterial
            color={active ? '#18171c' : isVisited ? '#c49a45' : philosopher.themeColor}
            emissive={active ? '#000000' : isVisited ? '#c49a45' : philosopher.themeColor}
            emissiveIntensity={active ? 0 : isVisited ? 0.6 : 0.2}
            roughness={active ? 0.9 : 0.2}
            metalness={active ? 0.3 : 0.8}
            transparent
            opacity={active ? 0.35 : isVisited ? 0.6 : 0.25}
          />
        </mesh>
      </group>

      {/* Manifested 3D Book in Environment (after dialogue or discovery) */}
      {(hasBookDiscovered || isVisited) && (
        <group
          position={[0, -0.6, 0.8]}
          onClick={(e) => {
            e.stopPropagation();
            if (onInspectBook) onInspectBook(philosopher.book);
          }}
        >
          <Float speed={2.0} rotationIntensity={0.35} floatIntensity={0.5}>
            {/* Book Leather Cover */}
            <mesh position={[0, 0, 0]} rotation={[0.4, 0, 0]} castShadow>
              <boxGeometry args={[0.5, 0.08, 0.68]} />
              <meshStandardMaterial color="#2d1717" roughness={0.65} metalness={0.3} />
            </mesh>
            {/* Book Gold Spines and Clasp */}
            <mesh position={[0, 0.02, 0]} rotation={[0.4, 0, 0]}>
              <boxGeometry args={[0.46, 0.07, 0.64]} />
              <meshPhysicalMaterial color="#f0e6d2" roughness={0.85} />
            </mesh>
            <mesh position={[0.22, 0.04, 0.1]} rotation={[0.4, 0, 0]}>
              <boxGeometry args={[0.08, 0.02, 0.08]} />
              <meshStandardMaterial color="#c49a45" metalness={0.92} roughness={0.2} />
            </mesh>
            <pointLight position={[0, 0.3, 0]} intensity={1.8} distance={2.2} color="#f0dfba" />
          </Float>
        </group>
      )}
    </group>
  );
}

