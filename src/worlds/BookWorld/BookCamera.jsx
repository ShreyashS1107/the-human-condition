import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export function BookCamera({ cameraMode = 'READING' }) {
  const { camera, pointer, size } = useThree();
  const aspect = size.width / Math.max(1, size.height);
  const targetPos = useRef(new THREE.Vector3(0, 1.25, 1.85));
  const targetLookAt = useRef(new THREE.Vector3(0, 0.42, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 0.42, 0));

  useFrame((state, delta) => {
    const responsiveZDist = aspect < 1 ? Math.max(1.0, (1.0 / aspect) * 1.3) : 1.0;

    switch (cameraMode) {
      case 'APPROACHING':
        // Starts distant and glides in
        targetPos.current.set(0, 1.6 * responsiveZDist, 3.8 * responsiveZDist);
        targetLookAt.current.set(0, 0.5, 0);
        break;

      case 'READING':
        // Intimate reading angle with visible physical book & walnut table in upper frame
        targetPos.current.set(pointer.x * 0.05, 1.25 * responsiveZDist, 1.85 * responsiveZDist);
        targetLookAt.current.set(pointer.x * 0.02, 0.42, 0);
        break;

      case 'LETTER':
        // Intimate manuscript review
        targetPos.current.set(pointer.x * 0.03, 1.15 * responsiveZDist, 1.7 * responsiveZDist);
        targetLookAt.current.set(0, 0.45, 0);
        break;

      case 'CLOSING':
        // Retreating into total darkness
        targetPos.current.set(0, 1.8 * responsiveZDist, 5.0 * responsiveZDist);
        targetLookAt.current.set(0, 0.5, 0);
        break;

      default:
        targetPos.current.set(0, 1.25 * responsiveZDist, 1.85 * responsiveZDist);
        targetLookAt.current.set(0, 0.42, 0);
    }

    const lerpSpeed = cameraMode === 'APPROACHING' ? 1.2 : 2.5;
    camera.position.lerp(targetPos.current, delta * lerpSpeed);
    currentLookAt.current.lerp(targetLookAt.current, delta * (lerpSpeed + 0.5));
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
