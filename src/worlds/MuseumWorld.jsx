import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { MUSEUM_ROOMS_DATA } from '../data/museumRooms';
import { RoomPortal } from '../scenes/Museum/RoomPortal';
import { MuseumCamera } from '../scenes/Museum/MuseumCamera';
import { useExperience } from '../hooks/useExperience';

// Floating Surreal Colonnade Bridges in the Void
function FloatingBridges() {
  const bridgesRef = useRef();

  useFrame((state, delta) => {
    if (bridgesRef.current) {
      bridgesRef.current.children.forEach((child, i) => {
        child.position.y += Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.002;
        child.rotation.y += delta * 0.02 * (i % 2 === 0 ? 1 : -1);
      });
    }
  });

  return (
    <group ref={bridgesRef}>
      {/* Floating horizontal walkway monoliths */}
      {[-6, -2, 2, 6].map((x, idx) => (
        <group key={idx} position={[x, -1.8, -4.5]}>
          {/* Main Dark Slate Block */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[3.2, 0.16, 1.3]} />
            <meshStandardMaterial color="#0b0d10" roughness={0.75} metalness={0.4} />
          </mesh>
          {/* Brass Joinery Pins */}
          {[-1.4, 1.4].map((pinX, pIdx) => (
            <mesh key={pIdx} position={[pinX, 0.09, 0]} castShadow>
              <cylinderGeometry args={[0.04, 0.04, 0.06, 12]} />
              <meshStandardMaterial color="#c49a45" metalness={0.92} roughness={0.25} />
            </mesh>
          ))}
          {/* Subtle under-rim glow */}
          <mesh position={[0, -0.09, 0]}>
            <boxGeometry args={[3.0, 0.02, 1.1]} />
            <meshBasicMaterial color="#3a506b" transparent opacity={0.25} />
          </mesh>
        </group>
      ))}

      {/* Distant Floating Surreal Polyhedrons in Void */}
      <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.6}>
        <mesh position={[0, 4.2, -10]} castShadow>
          <octahedronGeometry args={[1.6, 0]} />
          <meshPhysicalMaterial
            color="#14171e"
            roughness={0.25}
            metalness={0.88}
            clearcoat={0.6}
            clearcoatRoughness={0.2}
          />
        </mesh>
      </Float>
    </group>
  );
}

export function MuseumWorld({
  activeRoomId,
  onSelectRoom,
}) {
  const { visitedMuseumRooms } = useExperience();

  const activeRoom = MUSEUM_ROOMS_DATA.find((r) => r.id === activeRoomId);

  return (
    <group>
      {/* Deep cosmic void fog - tighter and intimate when inside an encounter chamber */}
      <fog
        attach="fog"
        args={[
          activeRoom ? '#030406' : '#050608',
          activeRoom ? 3.0 : 5.0,
          activeRoom ? 15.0 : 22.0,
        ]}
      />

      {/* Cinematic Camera Interpolation */}
      <MuseumCamera activeRoom={activeRoom} />

      {/* Floating Surreal Architecture - only visible in Void Overview */}
      {!activeRoom && <FloatingBridges />}

      {/* 7 Floating Chamber Portals - Strict Isolation Rule: ONLY active chamber rendered in encounter */}
      {MUSEUM_ROOMS_DATA.map((room) => {
        const isSelected = activeRoomId === room.id;
        // If in encounter mode and not selected, do NOT render in frame
        if (activeRoomId && !isSelected) return null;

        return (
          <RoomPortal
            key={room.id}
            room={room}
            isFocused={isSelected}
            isVisited={visitedMuseumRooms.includes(room.id)}
            onSelect={onSelectRoom}
          />
        );
      })}

      {/* Void Lighting with Soft Directional Shadows */}
      <ambientLight intensity={activeRoom ? 0.08 : 0.16} color="#12151c" />
      <directionalLight
        position={[0, 12, 5]}
        intensity={activeRoom ? 0.7 : 1.1}
        color="#dbe2ef"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />
    </group>
  );
}

