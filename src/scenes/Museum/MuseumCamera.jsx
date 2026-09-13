import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export function MuseumCamera({ activeRoom }) {
  const { camera, pointer, size } = useThree();
  const aspect = size.width / Math.max(1, size.height);
  const targetPos = useRef(new THREE.Vector3(0, 1.2, 9.2));
  const targetLookAt = useRef(new THREE.Vector3(0, 0.2, -3.5));
  const currentLookAt = useRef(new THREE.Vector3(0, 0.2, -3.5));

  useFrame((state, delta) => {
    const responsiveZDist = aspect < 1 ? Math.max(1.0, (1.0 / aspect) * 1.35) : 1.0;

    if (activeRoom) {
      // Cinematic Framing: Chamber object occupies ~55–65% of frame with complete interaction consequence visibility
      const posX = activeRoom.position[0] + pointer.x * 0.06;
      const posY = 0.3 + pointer.y * 0.04;
      const posZ = activeRoom.position[2] + 5.6 * responsiveZDist;

      targetPos.current.set(posX, posY, posZ);
      targetLookAt.current.set(activeRoom.position[0], 0.22, activeRoom.position[2]);
    } else {
      // Museum Grand Void Overview
      const posX = pointer.x * 0.55;
      const posY = 1.2 + pointer.y * 0.2;
      const posZ = 9.2 * responsiveZDist;

      targetPos.current.set(posX, posY, posZ);
      targetLookAt.current.set(0, 0.2, -3.5);
    }

    camera.position.lerp(targetPos.current, delta * 2.0);
    currentLookAt.current.lerp(targetLookAt.current, delta * 2.4);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
