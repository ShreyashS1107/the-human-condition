import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoomInteraction } from './RoomInteraction';
import { soundEngine } from '../../systems/audioEngine';

export function RoomPortal({
  room,
  isFocused,
  isVisited,
  onSelect,
}) {
  const groupRef = useRef();
  const ringRef = useRef();
  const [isHovered, setIsHovered] = useState(false);

  useFrame((state, delta) => {
    if (groupRef.current) {
      if (isFocused) {
        // Active room has gentle breathing
        const targetY = room.position[1] + 0.08 + Math.sin(state.clock.elapsedTime * 0.7 + room.position[0]) * 0.03;
        groupRef.current.position.y += (targetY - groupRef.current.position.y) * delta * 4;
        groupRef.current.position.z += (room.position[2] + 0.15 - groupRef.current.position.z) * delta * 4;
      } else {
        // Inactive room returns smoothly to resting position
        groupRef.current.position.y += (room.position[1] - groupRef.current.position.y) * delta * 4;
        groupRef.current.position.z += (room.position[2] - groupRef.current.position.z) * delta * 4;
      }
    }

    if (ringRef.current && isFocused) {
      ringRef.current.rotation.z += delta * 0.25;
    }
  });

  const handlePointerOver = (e) => {
    e.stopPropagation();
    if (!isFocused && onSelect) {
      setIsHovered(true);
      soundEngine.playMuseumRoomAcoustic(room);
    }
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();
    setIsHovered(false);
  };

  const handleClick = (e) => {
    e.stopPropagation();
    if (!isFocused) {
      soundEngine.playSubtlePulse(room.soundProfile.freq, 1.8, 0.25);
      if (onSelect) onSelect(room.id);
    }
  };

  return (
    <group
      ref={groupRef}
      position={room.position}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
      cursor={isFocused ? 'default' : 'pointer'}
    >
      {/* Invisible interaction raycast bounding box */}
      {!isFocused && (
        <mesh visible={false}>
          <boxGeometry args={[2.5, 4.0, 2.5]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      )}

      {/* Surreal Monolithic Doorway Arch */}
      <group position={[0, 0, -0.4]}>
        {/* Left Basalt Column */}
        <mesh position={[-0.85, 0.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.16, 3.4, 0.16]} />
          <meshStandardMaterial color="#101217" metalness={0.75} roughness={0.3} />
        </mesh>
        {/* Right Basalt Column */}
        <mesh position={[0.85, 0.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.16, 3.4, 0.16]} />
          <meshStandardMaterial color="#101217" metalness={0.75} roughness={0.3} />
        </mesh>
        {/* Top Arch Lintel */}
        <mesh position={[0, 1.85, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.86, 0.16, 0.18]} />
          <meshStandardMaterial color="#1a1d24" metalness={0.85} roughness={0.25} />
        </mesh>
        {/* Inlaid Fine Metal Line */}
        <mesh position={[0, 1.76, 0.1]}>
          <boxGeometry args={[1.7, 0.02, 0.02]} />
          <meshStandardMaterial color="#c49a45" metalness={0.92} roughness={0.2} />
        </mesh>
      </group>

      {/* Interactive 3D Room Installation - ONLY ACTIVE WHEN FOCUSED */}
      <RoomInteraction room={room} isActive={isFocused} />

      {/* Threshold Ground Circle with Stepped Base */}
      <group position={[0, -1.42, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <cylinderGeometry args={[1.05, 1.1, 0.04, 32]} />
          <meshStandardMaterial color="#0b0d10" roughness={0.8} metalness={0.4} />
        </mesh>
        <mesh ref={ringRef} position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.95, 1.05, 48]} />
          <meshStandardMaterial
            color={isFocused ? '#181b22' : isVisited ? '#c49a45' : room.themeColor}
            emissive={isFocused ? '#000000' : isVisited ? '#c49a45' : room.themeColor}
            emissiveIntensity={isFocused ? 0 : isHovered ? 0.8 : isVisited ? 0.4 : 0.15}
            roughness={isFocused ? 0.9 : 0.2}
            metalness={isFocused ? 0.3 : 0.8}
            transparent
            opacity={isFocused ? 0.35 : isHovered ? 0.7 : isVisited ? 0.5 : 0.2}
          />
        </mesh>
      </group>
    </group>
  );
}

