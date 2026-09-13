import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function NietzscheMachineMesh({
  speed = 1.0,
  isCollapsing = false,
  isDestabilized = false,
}) {
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();
  const ring4Ref = useRef();
  const coreRef = useRef();
  const frameGroupRef = useRef();

  useFrame((state, delta) => {
    const s = speed * delta;

    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += s * 0.45;
      ring1Ref.current.rotation.y += s * 0.65;
      if (isDestabilized) ring1Ref.current.rotation.z += delta * 3.8;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y -= s * 0.55;
      ring2Ref.current.rotation.z += s * 0.35;
      if (isDestabilized) ring2Ref.current.rotation.x += delta * 3.2;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z += s * 0.75;
      ring3Ref.current.rotation.x -= s * 0.45;
    }
    if (ring4Ref.current) {
      ring4Ref.current.rotation.x += s * 1.0;
      ring4Ref.current.rotation.y -= s * 0.35;
    }
    if (coreRef.current) {
      coreRef.current.rotation.y += s * 1.4;
      coreRef.current.rotation.x += s * 0.9;
      const coreScale = isCollapsing ? 0.04 : 1.0 + Math.sin(state.clock.elapsedTime * 2.8) * 0.1;
      coreRef.current.scale.set(coreScale, coreScale, coreScale);
    }
    if (frameGroupRef.current && isCollapsing) {
      frameGroupRef.current.scale.lerp(new THREE.Vector3(0.005, 0.005, 0.005), delta * 5.5);
    }
  });

  return (
    <group ref={frameGroupRef} position={[0, 0, 0]}>
      {/* Ring 1: Outermost Heavy Oxidized Black Metal Gimbal */}
      <group ref={ring1Ref}>
        <mesh castShadow receiveShadow>
          <torusGeometry args={[3.25, 0.045, 16, 72]} />
          <meshPhysicalMaterial
            color="#12100e"
            roughness={0.25}
            metalness={0.92}
            clearcoat={0.5}
            clearcoatRoughness={0.2}
          />
        </mesh>
        {/* Brass Axis Pivot Hubs & Counterweights */}
        {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => (
          <group key={i} position={[Math.cos(angle) * 3.25, Math.sin(angle) * 3.25, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.08, 0.08, 0.16, 16]} />
              <meshStandardMaterial color="#c49a45" metalness={0.95} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0, 0.1]}>
              <sphereGeometry args={[0.045, 12, 12]} />
              <meshStandardMaterial
                color="#e5b452"
                emissive="#c49a45"
                emissiveIntensity={isDestabilized ? 2.5 : 0.8}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* Ring 2: Secondary Interlocking Torus with Astronomical Teeth */}
      <group ref={ring2Ref} rotation={[Math.PI / 3, Math.PI / 4, 0]}>
        <mesh castShadow receiveShadow>
          <torusGeometry args={[2.45, 0.048, 16, 64]} />
          <meshPhysicalMaterial
            color="#221812"
            roughness={0.3}
            metalness={0.88}
            clearcoat={0.4}
          />
        </mesh>
        {/* Broken Crimson Prism Brackets */}
        {[-2.45, 2.45].map((x, i) => (
          <mesh key={i} position={[x, 0, 0]} castShadow>
            <boxGeometry args={[0.18, 0.18, 0.42]} />
            <meshStandardMaterial
              color="#8b1c1c"
              emissive="#500e0e"
              emissiveIntensity={isDestabilized ? 2.0 : 0.4}
              metalness={0.9}
              roughness={0.25}
            />
          </mesh>
        ))}
      </group>

      {/* Ring 3: Concentric Dark Steel Gyro Ring */}
      <group ref={ring3Ref} rotation={[-Math.PI / 4, 0, Math.PI / 6]}>
        <mesh castShadow receiveShadow>
          <torusGeometry args={[1.75, 0.036, 16, 54]} />
          <meshPhysicalMaterial
            color="#181412"
            roughness={0.22}
            metalness={0.94}
            clearcoat={0.6}
          />
        </mesh>
        {/* Fine Brass Teeth along Ring 3 */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((idx) => {
          const a = (idx * Math.PI) / 4;
          return (
            <mesh key={idx} position={[Math.cos(a) * 1.75, Math.sin(a) * 1.75, 0]}>
              <boxGeometry args={[0.04, 0.04, 0.08]} />
              <meshStandardMaterial color="#c49a45" metalness={0.95} roughness={0.2} />
            </mesh>
          );
        })}
      </group>

      {/* Ring 4: Innermost High-Speed Gold Lattice Armature */}
      <group ref={ring4Ref}>
        <mesh castShadow>
          <torusGeometry args={[1.05, 0.03, 16, 40]} />
          <meshStandardMaterial
            color="#c49a45"
            metalness={0.95}
            roughness={0.18}
            emissive="#c49a45"
            emissiveIntensity={isDestabilized ? 1.5 : 0.3}
          />
        </mesh>
      </group>

      {/* Central Abstract Philosophical Polyhedral Core */}
      <group ref={coreRef}>
        {/* Outer Crystalline Icosahedron Lattice */}
        <mesh castShadow>
          <icosahedronGeometry args={[0.46, 0]} />
          <meshPhysicalMaterial
            color="#1f1814"
            roughness={0.12}
            metalness={0.96}
            clearcoat={0.8}
            clearcoatRoughness={0.1}
          />
        </mesh>
        {/* Pulsating Internal Luminous Core */}
        <mesh scale={[0.62, 0.62, 0.62]}>
          <dodecahedronGeometry args={[0.34, 0]} />
          <meshStandardMaterial
            color="#f39c12"
            emissive={isDestabilized ? '#ff3838' : '#e67e22'}
            emissiveIntensity={isDestabilized ? 4.5 : 1.8}
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* Thin Luminous Alignment Filaments */}
      {[-1.5, 0, 1.5].map((y, idx) => (
        <mesh key={idx} position={[0, y, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.008, 0.008, 6.8, 8]} />
          <meshBasicMaterial
            color={isDestabilized ? '#ff4d4d' : '#e8dec8'}
            transparent
            opacity={isDestabilized ? 0.45 : 0.2}
          />
        </mesh>
      ))}

      {/* Central Radiance Point Light */}
      <pointLight
        position={[0, 0, 0]}
        intensity={isDestabilized ? 4.8 : 2.2}
        distance={9}
        color={isDestabilized ? '#ff4d4d' : '#f7eedb'}
        castShadow
      />
    </group>
  );
}

