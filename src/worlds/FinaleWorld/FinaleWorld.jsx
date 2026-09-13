import React from 'react';
import { NietzscheMachineMesh } from './NietzscheMachineMesh';
import { FinaleFragments3D } from './FinaleFragments3D';
import { FinaleCamera } from './FinaleCamera';

export function FinaleWorld({
  phase = 'INTRO_1',
  machineSpeed = 1.0,
  activeFragmentCount = 0,
  fragments = [],
  isCollapsing = false,
  isDestabilized = false,
}) {
  const isPureBlack = phase === 'PURE_BLACK';

  if (isPureBlack) {
    return <color attach="background" args={['#000000']} />;
  }

  return (
    <group>
      <color attach="background" args={['#000000']} />
      <fog attach="fog" args={['#000000', 4, 18]} />

      {/* Cinematic Finale Camera */}
      <FinaleCamera phase={phase} isDestabilized={isDestabilized} />

      {/* The 3D Nietzsche Machine */}
      <NietzscheMachineMesh
        speed={machineSpeed}
        isCollapsing={isCollapsing}
        isDestabilized={isDestabilized}
      />

      {/* Orbiting Journey Fragments */}
      <FinaleFragments3D
        fragments={fragments}
        activeCount={activeFragmentCount}
        speed={machineSpeed}
        isCollapsing={isCollapsing}
      />

      {/* Ambient and Strobe Lights */}
      <ambientLight intensity={isCollapsing ? 0.05 : 0.18} color="#101217" />
      <directionalLight
        position={[0, 9, 5]}
        intensity={isDestabilized ? 2.8 : 1.2}
        color="#ede5d3"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />
    </group>
  );
}

