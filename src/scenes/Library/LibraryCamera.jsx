import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export function LibraryCamera({ activePhilosopher }) {
  const { camera, pointer, size } = useThree();
  const aspect = size.width / Math.max(1, size.height);
  const targetPos = useRef(new THREE.Vector3(0, 1.3, 7.8));
  const targetLookAt = useRef(new THREE.Vector3(0, 0.2, -2.5));
  const currentLookAt = useRef(new THREE.Vector3(0, 0.2, -2.5));

  useFrame((state, delta) => {
    const responsiveZDist = aspect < 1 ? Math.max(1.0, (1.0 / aspect) * 1.3) : 1.0;

    if (activePhilosopher) {
      // Cinematic dialogue framing: The philosopher reliquary, plinth, and full architectural setting occupy ~55–65% of frame
      const posX = activePhilosopher.position[0] + pointer.x * 0.06;
      const posY = 0.35 + pointer.y * 0.04;
      const posZ = activePhilosopher.position[2] + 5.5 * responsiveZDist;

      targetPos.current.set(posX, posY, posZ);
      targetLookAt.current.set(activePhilosopher.position[0], 0.22, activePhilosopher.position[2]);
    } else {
      // Grand Hall Overview Camera
      const posX = pointer.x * 0.55;
      const posY = 1.3 + pointer.y * 0.2;
      const posZ = 7.8 * responsiveZDist;

      targetPos.current.set(posX, posY, posZ);
      targetLookAt.current.set(0, 0.2, -2.5);
    }

    camera.position.lerp(targetPos.current, delta * 2.0);
    currentLookAt.current.lerp(targetLookAt.current, delta * 2.4);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
