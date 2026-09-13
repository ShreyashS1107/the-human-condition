import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

export function FinaleFragments3D({
  fragments = [],
  activeCount = 0,
  speed = 1.0,
  isCollapsing = false,
}) {
  const groupRef = useRef();

  // Create initial orbit parameters for each fragment
  const orbitParams = useMemo(() => {
    return fragments.map((_, i) => ({
      radius: 2.2 + (i % 4) * 0.8,
      angle: (i / Math.max(1, fragments.length)) * Math.PI * 2,
      yOffset: ((i % 5) - 2) * 0.65,
      orbitSpeed: (0.4 + (i % 3) * 0.2) * (i % 2 === 0 ? 1 : -1),
      tilt: (i % 4) * 0.25,
    }));
  }, [fragments]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        if (i < activeCount) {
          const param = orbitParams[i];
          if (param) {
            param.angle += delta * speed * param.orbitSpeed;
            const targetX = Math.cos(param.angle) * param.radius;
            const targetZ = Math.sin(param.angle) * param.radius;
            const targetY = param.yOffset + Math.sin(state.clock.elapsedTime * 1.5 + i) * 0.1;

            if (isCollapsing) {
              child.position.lerp(new THREE.Vector3(0, 0, 0), delta * 6);
              child.scale.lerp(new THREE.Vector3(0.001, 0.001, 0.001), delta * 6);
            } else {
              child.position.set(targetX, targetY, targetZ);
              child.lookAt(0, 0, 0);
            }
          }
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {fragments.map((frag, idx) => {
        const isVisible = idx < activeCount && !isCollapsing;
        if (!isVisible && !isCollapsing) return null;

        const isUserAnswer = frag.type === 'USER_ANSWER';
        const displayLabel = frag.text.length > 36 ? frag.text.slice(0, 34) + '...' : frag.text;

        return (
          <group key={idx} position={[0, 0, 0]}>
            {/* Luminous Shard Slate */}
            <mesh position={[0, 0, -0.05]}>
              <planeGeometry args={[displayLabel.length * 0.1 + 0.4, 0.35]} />
              <meshBasicMaterial
                color={isUserAnswer ? '#c49a45' : '#1b1e24'}
                transparent
                opacity={isUserAnswer ? 0.35 : 0.2}
              />
            </mesh>

            {/* 3D Text Label */}
            <Text
              fontSize={isUserAnswer ? 0.14 : 0.1}
              color={isUserAnswer ? '#ffffff' : '#d4cdbe'}
              anchorX="center"
              anchorY="middle"
              maxWidth={3.5}
            >
              {displayLabel.toUpperCase()}
            </Text>
          </group>
        );
      })}
    </group>
  );
}
