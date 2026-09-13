import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export function FinaleCamera({
  phase = 'INTRO_1',
  isDestabilized = false,
}) {
  const { camera, pointer, size } = useThree();
  const aspect = size.width / Math.max(1, size.height);
  const targetPos = useRef(new THREE.Vector3(0, 0, 7.5));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    const responsiveZDist = aspect < 1 ? Math.max(1.0, (1.0 / aspect) * 1.3) : 1.0;

    switch (phase) {
      case 'INTRO_1':
      case 'INTRO_2':
        targetPos.current.set(0, 0, 7.8 * responsiveZDist);
        targetLookAt.current.set(0, 0, 0);
        break;

      case 'RECONSTRUCT':
        targetPos.current.set(pointer.x * 0.4, pointer.y * 0.2, 6.8 * responsiveZDist);
        targetLookAt.current.set(pointer.x * 0.1, 0, 0);
        break;

      case 'ACCELERATE':
        // Camera moves closer into the swirling eye of the machine
        targetPos.current.set(
          Math.sin(state.clock.elapsedTime * 0.8) * 0.6,
          Math.cos(state.clock.elapsedTime * 0.6) * 0.3,
          5.0 * responsiveZDist
        );
        targetLookAt.current.set(0, 0, 0);
        break;

      case 'COLLAPSE_SILENCE':
      case 'QUESTION_1':
      case 'QUESTION_2':
        // Dead still, framed with majesty
        targetPos.current.set(0, 0, 5.8 * responsiveZDist);
        targetLookAt.current.set(0, 0, 0);
        break;

      case 'BREAKDOWN':
        // Unstable impossible camera roll and disorientation
        targetPos.current.set(
          Math.sin(state.clock.elapsedTime * 4.0) * 1.2,
          Math.cos(state.clock.elapsedTime * 3.5) * 0.8,
          (4.5 + Math.sin(state.clock.elapsedTime * 2.0) * 1.0) * responsiveZDist
        );
        targetLookAt.current.set(
          Math.sin(state.clock.elapsedTime * 3.0) * 0.4,
          Math.cos(state.clock.elapsedTime * 2.5) * 0.4,
          0
        );
        camera.rotation.z = Math.sin(state.clock.elapsedTime * 2.5) * 0.4;
        break;

      default:
        targetPos.current.set(0, 0, 7.5 * responsiveZDist);
        targetLookAt.current.set(0, 0, 0);
    }

    const lerpSpeed = phase === 'BREAKDOWN' ? 4.0 : 2.5;
    camera.position.lerp(targetPos.current, delta * lerpSpeed);
    currentLookAt.current.lerp(targetLookAt.current, delta * (lerpSpeed + 0.5));
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
