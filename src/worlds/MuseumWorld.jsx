import React from 'react';
import { MUSEUM_ROOMS_DATA } from '../data/museumRooms';
import { RoomPortal } from '../scenes/Museum/RoomPortal';
import { MuseumCamera } from '../scenes/Museum/MuseumCamera';
import { useExperience } from '../hooks/useExperience';

// Dark Stone Gallery Platform Flags in the Void
function GalleryFlags() {
  return (
    <group position={[0, -1.8, -4.0]}>
      {/* Dark monolithic walkway flagstones */}
      {[-6, -2, 2, 6].map((x, idx) => (
        <group key={idx} position={[x, 0, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[3.2, 0.16, 1.4]} />
            <meshStandardMaterial color="#0a0b0e" roughness={0.9} metalness={0.1} />
          </mesh>
          {/* Subtle bronze mortise inlays */}
          {[-1.4, 1.4].map((pinX, pIdx) => (
            <mesh key={pIdx} position={[pinX, 0.085, 0]} castShadow>
              <cylinderGeometry args={[0.035, 0.035, 0.02, 12]} />
              <meshStandardMaterial color="#8a7342" metalness={0.85} roughness={0.35} />
            </mesh>
          ))}
        </group>
      ))}
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
      {/* Subtle void fog - intimate focus in active encounter, deep expansive falloff in overview */}
      <fog
        attach="fog"
        args={[
          activeRoom ? '#020305' : '#020305',
          activeRoom ? 6.0 : 8.0,
          activeRoom ? 75.0 : 95.0,
        ]}
      />

      {/* Cinematic Camera Interpolation */}
      <MuseumCamera activeRoom={activeRoom} />

      {/* Gallery Walkway Flags - only visible in Void Overview */}
      {!activeRoom && <GalleryFlags />}

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

