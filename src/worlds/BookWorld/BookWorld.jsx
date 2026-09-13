import React from 'react';
import { BookEnvironment } from './BookEnvironment';
import { BookMesh } from './BookMesh';
import { BookCamera } from './BookCamera';

export function BookWorld({
  isOpen = true,
  isTurningPage = false,
  pageTurnProgress = 0,
  cameraMode = 'READING',
}) {
  return (
    <group>
      {/* Dark chamber fog */}
      <fog attach="fog" args={['#020203', 2, 9]} />

      {/* Cinematic Camera */}
      <BookCamera cameraMode={cameraMode} />

      {/* Ritual Chamber Environment */}
      <BookEnvironment spotlightIntensity={isOpen ? 3.2 : 0.8} />

      {/* Procedural 3D Codex */}
      <BookMesh
        isOpen={isOpen}
        isTurningPage={isTurningPage}
        pageTurnProgress={pageTurnProgress}
      />
    </group>
  );
}
