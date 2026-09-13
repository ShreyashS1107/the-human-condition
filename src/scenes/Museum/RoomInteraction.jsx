import React, { useRef, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { soundEngine } from '../../systems/audioEngine';

// 1. MEANING: "THE EMPTY SCALE"
// An antique stone and brass balance scale.
// The left plate is loaded with symbolic weight and tilted down; the right plate is empty.
// User clicks the loaded side. The objects slide and dissolve away.
// The scale slowly oscillates and settles into perfect level balance with both sides empty.
export function MeaningRoom({ isActive }) {
  const beamPivotRef = useRef();
  const leftPlateRef = useRef();
  const rightPlateRef = useRef();
  const weightsRef = useRef();

  const [isInteracted, setIsInteracted] = useState(false);
  const animProgress = useRef(0); // 0 = weighted (tilted), 1 = empty (level balance)
  const weightsFallProgress = useRef(0);

  useFrame((state, delta) => {
    if (!isActive) return;

    const targetProgress = isInteracted ? 1 : 0;
    animProgress.current += (targetProgress - animProgress.current) * delta * 2.0;

    // Beam tilt: initial tilt is -0.18 rad (left down, right up). When interacted, goes to 0 (level).
    // Gentle natural settling oscillation when animating to 0
    const oscillation = isInteracted && animProgress.current < 0.98
      ? Math.sin(animProgress.current * Math.PI * 4) * (1 - animProgress.current) * 0.04
      : 0;

    const currentAngle = (-0.18 * (1 - animProgress.current)) + oscillation;

    if (beamPivotRef.current) {
      beamPivotRef.current.rotation.z = currentAngle;
    }

    // Keep plates hanging vertically (counter-rotate and adjust Y offsets based on beam tilt)
    const plateArmLength = 1.05;
    const leftYOffset = Math.sin(currentAngle) * plateArmLength;
    const rightYOffset = -Math.sin(currentAngle) * plateArmLength;

    if (leftPlateRef.current) {
      leftPlateRef.current.position.y = -0.5 + leftYOffset;
      leftPlateRef.current.rotation.z = -currentAngle;
    }

    if (rightPlateRef.current) {
      rightPlateRef.current.position.y = -0.5 + rightYOffset;
      rightPlateRef.current.rotation.z = -currentAngle;
    }

    // When interacted, the weights slide/fall off and dissolve away
    if (isInteracted) {
      weightsFallProgress.current = Math.min(1, weightsFallProgress.current + delta * 2.2);
    } else {
      weightsFallProgress.current = 0;
    }

    if (weightsRef.current) {
      weightsRef.current.position.y = -weightsFallProgress.current * 1.6;
      weightsRef.current.position.x = -weightsFallProgress.current * 0.35;
      weightsRef.current.rotation.z = -weightsFallProgress.current * 0.8;
      weightsRef.current.visible = weightsFallProgress.current < 0.99;
    }
  });

  const handleInteract = (e) => {
    e.stopPropagation();
    if (!isActive) return;
    if (!isInteracted) {
      setIsInteracted(true);
      soundEngine.playSubtlePulse(140, 2.0, 0.25);
    } else {
      soundEngine.playSubtlePulse(180, 0.5, 0.08);
    }
  };

  return (
    <group onClick={handleInteract} cursor={isActive ? 'pointer' : 'default'} position={[0, 0.1, 0]}>
      {/* Heavy Obsidian Altar Base */}
      <mesh position={[0, -1.25, 0]} receiveShadow>
        <boxGeometry args={[2.2, 0.16, 1.4]} />
        <meshPhysicalMaterial color="#08090c" roughness={0.7} metalness={0.4} />
      </mesh>

      {/* Inlaid Fine Brass Rim on Base */}
      <mesh position={[0, -1.16, 0]}>
        <boxGeometry args={[2.08, 0.02, 1.28]} />
        <meshStandardMaterial color="#c49a45" metalness={0.92} roughness={0.25} />
      </mesh>

      {/* Central Scale Fulcrum Column */}
      <mesh position={[0, -0.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.07, 0.12, 1.9, 20]} />
        <meshStandardMaterial color="#1a1d24" metalness={0.85} roughness={0.25} />
      </mesh>

      {/* Top Fulcrum Brass Cap & Pivot Node */}
      <mesh position={[0, 0.78, 0]} castShadow>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#c49a45" metalness={0.92} roughness={0.2} />
      </mesh>

      {/* Pivoting Scale Crossbar Beam */}
      <group ref={beamPivotRef} position={[0, 0.78, 0]}>
        {/* Main Horizontal Brass Beam */}
        <mesh castShadow>
          <boxGeometry args={[2.2, 0.045, 0.045]} />
          <meshStandardMaterial color="#c49a45" metalness={0.92} roughness={0.25} />
        </mesh>

        {/* Beam Center Dial Pointer */}
        <mesh position={[0, -0.15, 0.03]} castShadow>
          <cylinderGeometry args={[0.012, 0.005, 0.3, 8]} />
          <meshStandardMaterial color="#e5b452" metalness={0.95} roughness={0.15} />
        </mesh>

        {/* Left End Finial Pivot */}
        <mesh position={[-1.05, 0, 0]} castShadow>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshStandardMaterial color="#c49a45" metalness={0.9} roughness={0.25} />
        </mesh>

        {/* Right End Finial Pivot */}
        <mesh position={[1.05, 0, 0]} castShadow>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshStandardMaterial color="#c49a45" metalness={0.9} roughness={0.25} />
        </mesh>
      </group>

      {/* Left Plate & Suspension */}
      <group position={[-1.05, 0.78, 0]}>
        <group ref={leftPlateRef}>
          {/* Suspension Struts */}
          <mesh position={[0, 0.28, 0]}>
            <cylinderGeometry args={[0.008, 0.18, 0.58, 3, 1, true]} />
            <meshStandardMaterial color="#8a775d" metalness={0.8} roughness={0.3} wireframe />
          </mesh>
          {/* Plate Disc */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.38, 0.42, 0.03, 32]} />
            <meshStandardMaterial color="#c49a45" metalness={0.88} roughness={0.3} />
          </mesh>

          {/* Pile of Symbolic Objects on Left Plate */}
          <group ref={weightsRef} position={[0, 0.06, 0]}>
            {/* Weight 1: Brass Octahedron */}
            <mesh position={[-0.08, 0.06, 0.05]} castShadow>
              <octahedronGeometry args={[0.09, 0]} />
              <meshStandardMaterial color="#e5b452" metalness={0.95} roughness={0.2} />
            </mesh>
            {/* Weight 2: Dark Obsidian Dodecahedron */}
            <mesh position={[0.08, 0.07, -0.04]} castShadow>
              <dodecahedronGeometry args={[0.08, 0]} />
              <meshPhysicalMaterial color="#181a20" roughness={0.2} metalness={0.8} />
            </mesh>
            {/* Weight 3: Crimson Tetrahedron */}
            <mesh position={[0, 0.15, 0.02]} castShadow>
              <tetrahedronGeometry args={[0.07, 0]} />
              <meshStandardMaterial color="#a84242" metalness={0.85} roughness={0.3} />
            </mesh>
          </group>
        </group>
      </group>

      {/* Right Plate & Suspension (Empty) */}
      <group position={[1.05, 0.78, 0]}>
        <group ref={rightPlateRef}>
          {/* Suspension Struts */}
          <mesh position={[0, 0.28, 0]}>
            <cylinderGeometry args={[0.008, 0.18, 0.58, 3, 1, true]} />
            <meshStandardMaterial color="#8a775d" metalness={0.8} roughness={0.3} wireframe />
          </mesh>
          {/* Plate Disc */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.38, 0.42, 0.03, 32]} />
            <meshStandardMaterial color="#c49a45" metalness={0.88} roughness={0.3} />
          </mesh>
        </group>
      </group>

      {/* Top Warm Key Light */}
      <pointLight
        position={[0, 2.0, 0.8]}
        intensity={isActive ? 3.0 : 0}
        color="#f0dfba"
        distance={5.0}
        castShadow={isActive}
      />
    </group>
  );
}

// 2. DEATH: BRAND NEW REDESIGNED INSTALLATION — THE IRREVERSIBLE WEIGHT
// A balanced basalt monolith stele with a hairline gold life fissure standing upright on an altar.
// Interacting triggers an irrevocable fracture and heavy pivot flat onto the stone altar,
// producing a deep sub-bass strike that decays into permanent chilling stillness.
export function DeathRoom({ isActive }) {
  const stelePivotRef = useRef();
  const [isFallen, setIsFallen] = useState(false);
  const fallProgress = useRef(0);

  useFrame((state, delta) => {
    if (!isActive || !stelePivotRef.current) return;

    const targetAngle = isFallen ? Math.PI / 2 : 0;
    // Heavy physical gravity pivot with sudden deceleration
    fallProgress.current += (targetAngle - fallProgress.current) * delta * 4.5;
    stelePivotRef.current.rotation.x = fallProgress.current;
  });

  const handleSteleClick = (e) => {
    e.stopPropagation();
    if (!isActive) return;

    if (!isFallen) {
      setIsFallen(true);
      // Deep 55Hz subterranean resonance that instantly decays to silence
      soundEngine.playSubtlePulse(55.0, 3.5, 0.45);
    } else {
      // Hollow dead stone click if already fallen
      soundEngine.playSubtlePulse(40.0, 0.4, 0.08);
    }
  };

  return (
    <group onClick={handleSteleClick} cursor={isActive ? 'pointer' : 'default'}>
      {/* Heavy Obsidian Altar Base Sarcophagus */}
      <mesh position={[0, -1.25, 0]} receiveShadow>
        <boxGeometry args={[1.5, 0.18, 1.5]} />
        <meshPhysicalMaterial
          color="#060709"
          roughness={0.12}
          metalness={0.88}
          clearcoat={0.9}
        />
      </mesh>

      {/* Raised Pivot Fulcrum Pedestal */}
      <mesh position={[0, -1.14, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.22, 0.28, 0.08, 16]} />
        <meshStandardMaterial color="#1a1d24" roughness={0.7} metalness={0.4} />
      </mesh>

      {/* Pivoting Monument Stele */}
      <group ref={stelePivotRef} position={[0, -1.1, 0]}>
        {/* Main Basalt Stele Monolith */}
        <mesh position={[0, 0.95, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.55, 1.9, 0.18]} />
          <meshPhysicalMaterial
            color={isFallen ? '#0a0c10' : '#14171f'}
            roughness={isFallen ? 0.95 : 0.75}
            metalness={0.3}
            reflectivity={0.2}
          />
        </mesh>

        {/* Life Fissure / Hairline Fracture along spine */}
        <mesh position={[0, 0.95, 0.095]}>
          <planeGeometry args={[0.04, 1.85]} />
          <meshStandardMaterial
            color={isFallen ? '#1c2024' : '#d4af37'}
            emissive={isFallen ? '#000000' : '#d4af37'}
            emissiveIntensity={isFallen ? 0 : isActive ? 1.8 : 0.4}
            roughness={0.2}
          />
        </mesh>

        {/* Monolithic Top Cap */}
        <mesh position={[0, 1.92, 0]} castShadow>
          <boxGeometry args={[0.58, 0.06, 0.2]} />
          <meshStandardMaterial color="#101217" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>

      {/* Piercing Cold Light */}
      <pointLight
        position={[0, 2.0, 0.8]}
        intensity={isActive ? (isFallen ? 0.8 : 2.6) : 0}
        distance={4.2}
        color={isFallen ? '#4a5568' : '#cbd5e1'}
        castShadow={isActive}
      />
    </group>
  );
}

// 3. LOVE: Two luminous polarities that attract but asymptotically can never touch
export function LoveRoom({ isActive }) {
  const { pointer } = useThree();
  const leftOrbRef = useRef();
  const rightOrbRef = useRef();
  const ringAlphaRef = useRef();
  const ringBetaRef = useRef();
  const springDist = useRef(1.2);

  useFrame((state, delta) => {
    if (!isActive) return;

    // User proximity pulls forces closer, but an asymptotic barrier prevents full contact
    const targetDist = Math.max(0.42, 1.35 - Math.abs(pointer.x) * 0.95);
    springDist.current += (targetDist - springDist.current) * delta * 3.5;

    if (leftOrbRef.current && rightOrbRef.current) {
      leftOrbRef.current.position.x = -springDist.current;
      leftOrbRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.08;

      rightOrbRef.current.position.x = springDist.current;
      rightOrbRef.current.position.y = Math.cos(state.clock.elapsedTime * 1.5) * 0.08;
    }
    if (ringAlphaRef.current) {
      ringAlphaRef.current.rotation.z += delta * 0.8;
    }
    if (ringBetaRef.current) {
      ringBetaRef.current.rotation.z -= delta * 0.8;
    }
  });

  return (
    <group position={[0, 0.45, 0]}>
      {/* Force Alpha (Solar Spun Gold Polarity) */}
      <group ref={leftOrbRef} position={[-1.2, 0, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.24, 32, 32]} />
          <meshPhysicalMaterial
            color="#d4af37"
            emissive="#c49a45"
            emissiveIntensity={isActive ? 2.6 : 0.4}
            roughness={0.15}
            metalness={0.92}
          />
        </mesh>
        <mesh ref={ringAlphaRef}>
          <torusGeometry args={[0.38, 0.012, 16, 36]} />
          <meshStandardMaterial color="#f5d061" emissive="#f5d061" emissiveIntensity={isActive ? 1.2 : 0.2} />
        </mesh>
        <pointLight intensity={isActive ? 1.8 : 0} distance={3.0} color="#d4af37" castShadow={isActive} />
      </group>

      {/* Force Beta (Lunar Crimson/Platinum Polarity) */}
      <group ref={rightOrbRef} position={[1.2, 0, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.24, 32, 32]} />
          <meshPhysicalMaterial
            color="#a84242"
            emissive="#ff4d4d"
            emissiveIntensity={isActive ? 2.6 : 0.4}
            roughness={0.15}
            metalness={0.88}
          />
        </mesh>
        <mesh ref={ringBetaRef}>
          <torusGeometry args={[0.38, 0.012, 16, 36]} />
          <meshStandardMaterial color="#ff7675" emissive="#ff7675" emissiveIntensity={isActive ? 1.2 : 0.2} />
        </mesh>
        <pointLight intensity={isActive ? 1.8 : 0} distance={3.0} color="#ff4d4d" castShadow={isActive} />
      </group>

      {/* Tension Energy Thread between them */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.012, 0.012, 2.6, 8]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={isActive ? 0.3 : 0.05} />
      </mesh>
    </group>
  );
}

// 4. FREEDOM: "THE OPEN GATE"
// An enormous monolithic stone gateway standing in the void.
// The gate is initially wide open, revealing an illuminated distant horizon.
// User clicks the gate. The heavy doors swing slowly shut, completely enclosing the opening.
// The final frame is the solid, impenetrable closed stone gate.
export function FreedomRoom({ isActive }) {
  const leftDoorRef = useRef();
  const rightDoorRef = useRef();
  const horizonRef = useRef();
  const [isClosed, setIsClosed] = useState(false);
  const closeProgress = useRef(0); // 0 = fully open, 1 = fully closed

  useFrame((state, delta) => {
    if (!isActive) return;

    const targetProgress = isClosed ? 1 : 0;
    closeProgress.current += (targetProgress - closeProgress.current) * delta * 2.2;

    // Door open angles: Open = -1.4 rad (left), +1.4 rad (right). Closed = 0 rad.
    const currentOpenAngle = 1.4 * (1 - closeProgress.current);

    if (leftDoorRef.current) {
      leftDoorRef.current.rotation.y = -currentOpenAngle;
    }
    if (rightDoorRef.current) {
      rightDoorRef.current.rotation.y = currentOpenAngle;
    }

    if (horizonRef.current) {
      horizonRef.current.material.opacity = (1 - closeProgress.current) * 0.95;
      horizonRef.current.visible = closeProgress.current < 0.98;
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    if (!isActive) return;
    if (!isClosed) {
      setIsClosed(true);
      soundEngine.playSubtlePulse(75.0, 2.8, 0.35);
    } else {
      soundEngine.playSubtlePulse(50.0, 0.5, 0.08);
    }
  };

  return (
    <group onClick={handleClick} cursor={isActive ? 'pointer' : 'default'} position={[0, 0.1, 0]}>
      {/* Heavy Ground Threshold Stepped Base */}
      <mesh position={[0, -1.25, 0]} receiveShadow>
        <boxGeometry args={[2.6, 0.16, 1.4]} />
        <meshPhysicalMaterial color="#0a0c10" roughness={0.8} metalness={0.3} />
      </mesh>

      {/* Massive Left Stone Gate Jamb */}
      <mesh position={[-1.15, 0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.32, 3.2, 0.38]} />
        <meshStandardMaterial color="#12151c" roughness={0.7} metalness={0.4} />
      </mesh>

      {/* Massive Right Stone Gate Jamb */}
      <mesh position={[1.15, 0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.32, 3.2, 0.38]} />
        <meshStandardMaterial color="#12151c" roughness={0.7} metalness={0.4} />
      </mesh>

      {/* Heavy Top Architrave / Lintel */}
      <mesh position={[0, 1.85, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.62, 0.28, 0.42]} />
        <meshStandardMaterial color="#181c24" roughness={0.65} metalness={0.45} />
      </mesh>

      {/* Left Stone Door (Hinged at x = -0.99) */}
      <group position={[-0.99, 0.3, 0]}>
        <group ref={leftDoorRef}>
          <mesh position={[0.495, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.99, 2.75, 0.1]} />
            <meshStandardMaterial color="#161920" roughness={0.75} metalness={0.35} />
          </mesh>
          {/* Iron Door Studs */}
          {[-0.8, 0, 0.8].map((y, idx) => (
            <mesh key={idx} position={[0.85, y, 0.06]} castShadow>
              <cylinderGeometry args={[0.025, 0.025, 0.02, 12]} />
              <meshStandardMaterial color="#c49a45" metalness={0.92} roughness={0.25} />
            </mesh>
          ))}
        </group>
      </group>

      {/* Right Stone Door (Hinged at x = 0.99) */}
      <group position={[0.99, 0.3, 0]}>
        <group ref={rightDoorRef}>
          <mesh position={[-0.495, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.99, 2.75, 0.1]} />
            <meshStandardMaterial color="#161920" roughness={0.75} metalness={0.35} />
          </mesh>
          {/* Iron Door Studs */}
          {[-0.8, 0, 0.8].map((y, idx) => (
            <mesh key={idx} position={[-0.85, y, 0.06]} castShadow>
              <cylinderGeometry args={[0.025, 0.025, 0.02, 12]} />
              <meshStandardMaterial color="#c49a45" metalness={0.92} roughness={0.25} />
            </mesh>
          ))}
        </group>
      </group>

      {/* Distant Illuminated Horizon Beyond the Gate */}
      <mesh ref={horizonRef} position={[0, 0.35, -1.6]}>
        <planeGeometry args={[2.2, 2.8]} />
        <meshBasicMaterial color="#a5d6a7" transparent opacity={0.95} />
      </mesh>

      {/* Horizon Luminous Core Light */}
      <pointLight
        position={[0, 0.5, -1.2]}
        intensity={isActive && !isClosed ? 2.4 : 0}
        color="#81d4fa"
        distance={4.0}
      />

      {/* Front Architectural Key Light */}
      <pointLight
        position={[0, 1.8, 1.2]}
        intensity={isActive ? 2.6 : 0}
        color="#cbd5e1"
        distance={4.8}
        castShadow={isActive}
      />
    </group>
  );
}

// 5. IDENTITY: "THE DELAYED MIRROR"
// One tall dark mirror with an abstract silhouette reflection.
// As the user moves the pointer, the reflection follows with increasing noticeable delay.
// Eventually the reflection diverges and rests offset from the user's position.
export function IdentityRoom({ isActive }) {
  const { pointer } = useThree();
  const avatarRef = useRef();
  const lagPos = useRef(new THREE.Vector3(0, 0.35, 0.05));
  const divergenceAccumulator = useRef(0);
  const [isDiverged, setIsDiverged] = useState(false);

  useFrame((state, delta) => {
    if (!isActive || !avatarRef.current) return;

    // Accumulate movement divergence
    const pointerDist = Math.sqrt(pointer.x * pointer.x + pointer.y * pointer.y);
    divergenceAccumulator.current += delta * (pointerDist > 0.05 ? 0.35 : 0.05);

    const divergedAmount = Math.min(1, divergenceAccumulator.current);
    if (divergedAmount > 0.6 && !isDiverged) {
      setIsDiverged(true);
    }

    // Tracking speed smoothly drops from 6.0 down to 1.2
    const currentSpeed = 6.0 - divergedAmount * 4.8;

    // Autonomous discrepancy offset that builds over time
    const autonomousOffsetX = Math.sin(state.clock.elapsedTime * 0.9) * (divergedAmount * 0.32);
    const autonomousOffsetY = Math.cos(state.clock.elapsedTime * 0.7) * (divergedAmount * 0.18);

    const targetX = (pointer.x * (1 - divergedAmount * 0.45) * 0.75) + autonomousOffsetX;
    const targetY = (0.35 + pointer.y * (1 - divergedAmount * 0.45) * 0.45) + autonomousOffsetY;

    lagPos.current.x += (targetX - lagPos.current.x) * delta * currentSpeed;
    lagPos.current.y += (targetY - lagPos.current.y) * delta * currentSpeed;

    avatarRef.current.position.set(lagPos.current.x, lagPos.current.y, 0.06);

    // Autonomous subtle tilt divergence
    avatarRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.8) * (divergedAmount * 0.25);
    avatarRef.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.6) * (divergedAmount * 0.2);
  });

  const handleClick = (e) => {
    e.stopPropagation();
    if (!isActive) return;
    divergenceAccumulator.current = 1.0;
    setIsDiverged(true);
    soundEngine.playSubtlePulse(196.0, 1.5, 0.2);
  };

  return (
    <group onClick={handleClick} cursor={isActive ? 'pointer' : 'default'} position={[0, 0.15, 0]}>
      {/* Stone Pedestal Base */}
      <mesh position={[0, -1.25, 0]} receiveShadow>
        <boxGeometry args={[2.0, 0.16, 1.2]} />
        <meshPhysicalMaterial color="#0c0e12" roughness={0.8} metalness={0.3} />
      </mesh>

      {/* Tall Dark Obsidian Mirror Frame */}
      <mesh position={[0, 0.35, -0.05]} castShadow receiveShadow>
        <boxGeometry args={[1.75, 2.9, 0.12]} />
        <meshStandardMaterial color="#12151c" roughness={0.7} metalness={0.6} />
      </mesh>

      {/* Fine Antique Brass Moulding Inlay */}
      <mesh position={[0, 0.35, 0.015]}>
        <boxGeometry args={[1.65, 2.8, 0.02]} />
        <meshStandardMaterial color="#c49a45" metalness={0.92} roughness={0.25} />
      </mesh>

      {/* Deep Obsidian Reflective Glass Plane */}
      <mesh position={[0, 0.35, 0.03]}>
        <planeGeometry args={[1.52, 2.66]} />
        <meshPhysicalMaterial
          color="#161b24"
          metalness={0.96}
          roughness={0.06}
          clearcoat={1.0}
          clearcoatRoughness={0.04}
        />
      </mesh>

      {/* Stylized Abstract Humanoid Silhouette / Reflection Avatar */}
      <group ref={avatarRef} position={[0, 0.35, 0.06]}>
        {/* Head / Consciousness Node */}
        <mesh position={[0, 0.32, 0]} castShadow>
          <sphereGeometry args={[0.15, 24, 24]} />
          <meshPhysicalMaterial
            color="#90a4ae"
            emissive="#546e7a"
            emissiveIntensity={isActive ? (isDiverged ? 0.9 : 0.4) : 0}
            roughness={0.2}
            metalness={0.85}
            clearcoat={0.6}
          />
        </mesh>
        {/* Torso / Abstract Shoulders Silhouette */}
        <mesh position={[0, -0.05, 0]} castShadow>
          <boxGeometry args={[0.42, 0.46, 0.1]} />
          <meshPhysicalMaterial
            color="#607d8b"
            roughness={0.3}
            metalness={0.8}
            clearcoat={0.4}
          />
        </mesh>
      </group>

      {/* Chiaroscuro Uncanny Key Light */}
      <pointLight
        position={[0, 1.6, 0.8]}
        intensity={isActive ? 2.8 : 0}
        color="#78909c"
        distance={4.5}
        castShadow={isActive}
      />
    </group>
  );
}

// 6. TIME: Movement leaves decaying temporal trails and entropy
export function TimeRoom({ isActive }) {
  const { pointer } = useThree();
  const trailPointsRef = useRef();
  const astrolabeRef = useRef();

  const [trailPositions] = useMemo(() => {
    const count = 36;
    const pos = new Float32Array(count * 3);
    return [pos];
  }, []);

  useFrame((state, delta) => {
    if (!isActive) return;

    if (astrolabeRef.current) {
      astrolabeRef.current.rotation.y += delta * 0.3;
      astrolabeRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
    if (trailPointsRef.current) {
      const positions = trailPointsRef.current.geometry.attributes.position.array;
      // Shift trails back
      for (let i = positions.length - 1; i >= 3; i--) {
        positions[i] = positions[i - 3];
      }
      positions[0] = pointer.x * 1.25;
      positions[1] = 0.45 + pointer.y * 0.8;
      positions[2] = 0.2;
      trailPointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group position={[0, 0.25, 0]}>
      {/* Central Astrolabe / Temporal Column */}
      <group ref={astrolabeRef} position={[0, 0.45, -0.3]}>
        <mesh castShadow>
          <torusGeometry args={[0.65, 0.024, 16, 48]} />
          <meshStandardMaterial color="#c49a45" metalness={0.92} roughness={0.25} />
        </mesh>
        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[0.55, 0.018, 16, 48]} />
          <meshStandardMaterial color="#8a775d" metalness={0.85} roughness={0.35} />
        </mesh>
        <mesh>
          <cylinderGeometry args={[0.02, 0.02, 1.4, 12]} />
          <meshStandardMaterial color="#e5b452" metalness={0.95} roughness={0.2} />
        </mesh>
      </group>

      {/* Temporal Golden Sand Trails */}
      <points ref={trailPointsRef} visible={isActive}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[trailPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial size={0.065} color="#e5b452" transparent opacity={0.75} />
      </points>

      <pointLight
        position={[0, 1.4, 0.5]}
        intensity={isActive ? 3.0 : 0}
        color="#c49a45"
        distance={4.8}
        castShadow={isActive}
      />
    </group>
  );
}

// 7. LONELINESS: Ring of 6 wrought-iron lanterns where each touch permanently extinguishes a flame
export function LonelinessRoom({ isActive }) {
  const [extinguishedCount, setExtinguishedCount] = useState(0);

  const lanterns = useMemo(() => {
    return [
      [-0.95, 0.85, -0.4],
      [0.95, 0.85, -0.4],
      [-1.15, 0.05, 0],
      [1.15, 0.05, 0],
      [-0.75, -0.65, 0.3],
      [0.75, -0.65, 0.3],
    ];
  }, []);

  const handleExtinguish = (idx, e) => {
    e.stopPropagation();
    if (!isActive) return;
    soundEngine.playSubtlePulse(110 - extinguishedCount * 12, 1.5, 0.15);
    setExtinguishedCount((prev) => Math.min(lanterns.length, prev + 1));
  };

  const remainingRatio = (lanterns.length - extinguishedCount) / lanterns.length;

  return (
    <group position={[0, 0.3, 0]}>
      {/* Sanctuary Ring of Wrought-Iron Lanterns */}
      {lanterns.map((pos, idx) => {
        const isLit = idx >= extinguishedCount;
        return (
          <group
            key={idx}
            position={pos}
            onClick={(e) => isLit && handleExtinguish(idx, e)}
            cursor={isActive && isLit ? 'pointer' : 'default'}
          >
            {/* Lantern Stone Pedestal */}
            <mesh position={[0, -0.15, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.08, 0.1, 0.12, 8]} />
              <meshStandardMaterial color="#0c0e12" roughness={0.9} />
            </mesh>
            {/* Lantern Frame & Core */}
            <mesh castShadow>
              <octahedronGeometry args={[0.11, 0]} />
              <meshStandardMaterial
                color={isLit ? '#64b5f6' : '#141820'}
                emissive={isLit ? '#64b5f6' : '#000000'}
                emissiveIntensity={isLit ? (isActive ? 2.5 : 0.5) : 0}
                roughness={isLit ? 0.1 : 0.9}
              />
            </mesh>
            {isLit && isActive && <pointLight intensity={0.8} distance={1.4} color="#64b5f6" />}
          </group>
        );
      })}

      {/* Central Ambient Void Isolation Glow */}
      <pointLight
        position={[0, 0.5, 0]}
        intensity={isActive ? 2.2 * (0.15 + remainingRatio * 0.85) : 0}
        color="#3a506b"
        distance={4.0}
      />
    </group>
  );
}

// Main Room Interaction Router
export function RoomInteraction({ room, isActive }) {
  switch (room.id) {
    case 'MEANING':
      return <MeaningRoom isActive={isActive} />;
    case 'DEATH':
      return <DeathRoom isActive={isActive} />;
    case 'LOVE':
      return <LoveRoom isActive={isActive} />;
    case 'FREEDOM':
      return <FreedomRoom isActive={isActive} />;
    case 'IDENTITY':
      return <IdentityRoom isActive={isActive} />;
    case 'TIME':
      return <TimeRoom isActive={isActive} />;
    case 'LONELINESS':
      return <LonelinessRoom isActive={isActive} />;
    default:
      return <MeaningRoom isActive={isActive} />;
  }
}

