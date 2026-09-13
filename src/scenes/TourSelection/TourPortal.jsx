import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { LibraryPreview, MuseumPreview, BookPreview } from './TourEnvironmentPreview';
import { soundEngine } from '../../systems/audioEngine';

export function TourPortal({
  tour,
  isFocused,
  onFocus,
  onBlur,
  onSelect,
}) {
  const groupRef = useRef();
  const ringRef = useRef();
  const [isHovered, setIsHovered] = useState(false);

  const active = isFocused || isHovered;

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Subtle natural breathing float
      const targetY = tour.position[1] + (active ? 0.2 : 0) + Math.sin(state.clock.elapsedTime * 0.8 + tour.position[0]) * 0.05;
      groupRef.current.position.y += (targetY - groupRef.current.position.y) * delta * 4;

      const targetZ = tour.position[2] + (active ? 0.6 : 0);
      groupRef.current.position.z += (targetZ - groupRef.current.position.z) * delta * 4;
    }

    if (ringRef.current) {
      ringRef.current.rotation.z += delta * (active ? 0.4 : 0.1);
    }
  });

  const handlePointerOver = (e) => {
    e.stopPropagation();
    setIsHovered(true);
    soundEngine.playPortalHover(tour.id);
    if (onFocus) onFocus(tour.id);
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();
    setIsHovered(false);
    if (onBlur) onBlur();
  };

  const handleClick = (e) => {
    e.stopPropagation();
    soundEngine.playSubtlePulse(130, 2.0, 0.3);
    if (onSelect) onSelect(tour.id);
  };

  return (
    <group
      ref={groupRef}
      position={[tour.position[0], tour.position[1], tour.position[2]]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
      cursor="pointer"
    >
      {/* Invisible hit box for reliable pointer interaction */}
      <mesh visible={false}>
        <boxGeometry args={[3.2, 5.0, 3.0]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Threshold Portal Ground Ring with Bevel Plinth */}
      <group position={[0, -1.6, 0]}>
        {/* Dark Stone Plinth Base */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <cylinderGeometry args={[1.5, 1.55, 0.08, 32]} />
          <meshStandardMaterial color="#0c0d10" roughness={0.8} metalness={0.4} />
        </mesh>
        {/* Concentric Emissive Energy Ring */}
        <mesh ref={ringRef} position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.35, 1.48, 48]} />
          <meshStandardMaterial
            color={tour.themeColor}
            emissive={tour.themeColor}
            emissiveIntensity={active ? 1.8 : 0.3}
            roughness={0.2}
            metalness={0.8}
            transparent
            opacity={active ? 0.95 : 0.35}
          />
        </mesh>
      </group>

      {/* Procedural 3D World */}
      {tour.id === 'LIBRARY' && <LibraryPreview isFocused={active} />}
      {tour.id === 'MUSEUM' && <MuseumPreview isFocused={active} />}
      {tour.id === 'BOOK' && <BookPreview isFocused={active} />}
    </group>
  );
}
