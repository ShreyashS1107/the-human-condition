import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function DustParticles() {
  const pointsRef = useRef();

  const [positions] = useMemo(() => {
    const count = 240;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 3.4;
      pos[i + 1] = Math.random() * 2.8;
      pos[i + 2] = (Math.random() - 0.5) * 3.4;
    }
    return [pos];
  }, []);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.02;
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
        size={0.035}
        color="#f2ebd9"
        transparent
        opacity={0.45}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function BookEnvironment({ spotlightIntensity = 3.2 }) {
  return (
    <group>
      {/* Heavy Ritual Dark Walnut Altar Table */}
      <group position={[0, 0, 0]}>
        {/* Table Top Slab with Chamfered Edge */}
        <mesh position={[0, 0.44, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.7, 0.08, 1.85]} />
          <meshPhysicalMaterial
            color="#140f0c"
            roughness={0.65}
            metalness={0.15}
            clearcoat={0.3}
          />
        </mesh>
        {/* Inlaid Gold Marquetry Rim Line */}
        <mesh position={[0, 0.482, 0]} castShadow>
          <boxGeometry args={[2.62, 0.004, 1.77]} />
          <meshStandardMaterial color="#c49a45" metalness={0.92} roughness={0.25} />
        </mesh>
        {/* Table Pedestal Trestle Legs */}
        {[-0.95, 0.95].map((x, idx) => (
          <mesh key={idx} position={[x, -0.02, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.18, 0.84, 1.4]} />
            <meshStandardMaterial color="#0f0b09" roughness={0.88} />
          </mesh>
        ))}
        {/* Central Cross Stretcher Beam */}
        <mesh position={[0, -0.2, 0]} castShadow>
          <boxGeometry args={[1.72, 0.1, 0.14]} />
          <meshStandardMaterial color="#0f0b09" roughness={0.88} />
        </mesh>
      </group>

      {/* Silhouette of Solitary High-Backed Chair in Background */}
      <group position={[0, 0.25, -1.25]} rotation={[0, Math.PI, 0]}>
        {/* Chair Seat */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.74, 0.08, 0.74]} />
          <meshStandardMaterial color="#0d0a09" roughness={0.9} />
        </mesh>
        {/* Chair High Back with Leather Cushion */}
        <mesh position={[0, 0.7, -0.34]} castShadow receiveShadow>
          <boxGeometry args={[0.68, 1.4, 0.08]} />
          <meshStandardMaterial color="#160e0c" roughness={0.8} />
        </mesh>
        {/* Chair Finial Knobs */}
        {[-0.32, 0.32].map((x, i) => (
          <mesh key={i} position={[x, 1.44, -0.34]} castShadow>
            <sphereGeometry args={[0.04, 12, 12]} />
            <meshStandardMaterial color="#c49a45" metalness={0.9} roughness={0.3} />
          </mesh>
        ))}
        {/* Chair Legs */}
        {[-0.32, 0.32].map((x, i) => (
          <React.Fragment key={i}>
            <mesh position={[x, -0.35, -0.32]} castShadow>
              <cylinderGeometry args={[0.035, 0.035, 0.7, 12]} />
              <meshStandardMaterial color="#0d0a09" roughness={0.9} />
            </mesh>
            <mesh position={[x, -0.35, 0.32]} castShadow>
              <cylinderGeometry args={[0.035, 0.035, 0.7, 12]} />
              <meshStandardMaterial color="#0d0a09" roughness={0.9} />
            </mesh>
          </React.Fragment>
        ))}
      </group>

      {/* Dark Slate Floor */}
      <mesh position={[0, -0.45, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[22, 22]} />
        <meshStandardMaterial color="#050506" roughness={0.6} metalness={0.4} />
      </mesh>

      {/* Focused Solitary Theatrical Key Spotlight onto the Book */}
      <spotLight
        position={[0, 4.8, 0.5]}
        target-position={[0, 0.5, 0]}
        intensity={spotlightIntensity}
        angle={0.48}
        penumbra={0.75}
        distance={9}
        color="#fff4e0"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />

      {/* Soft Fill and Floor Rim */}
      <pointLight position={[0, 1.8, 1.4]} intensity={0.4} color="#a67c52" />
      <ambientLight intensity={0.06} color="#0d0e12" />

      {/* Dust motes */}
      <DustParticles />
    </group>
  );
}

