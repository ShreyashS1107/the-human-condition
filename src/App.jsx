import React, { useEffect } from 'react';
import { ExperienceProvider } from './systems/ExperienceContext';
import { CanvasContainer } from './components/CanvasContainer';
import { CinematicOverlay } from './components/CinematicOverlay';
import { SceneManager } from './scenes/SceneManager';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { soundEngine } from './systems/audioEngine';
import { narrationEngine } from './systems/voice/narrationEngine';

function ExperienceRoot() {
  useSmoothScroll(true);

  // Global subtle keyboard mute toggle ('M')
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'm' || e.key === 'M') {
        const isMuted = soundEngine.toggleMute();
        if (isMuted) {
          narrationEngine.stop();
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <main style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <CanvasContainer />
      <CinematicOverlay />
      <SceneManager />
    </main>
  );
}

export default function App() {
  return (
    <ExperienceProvider>
      <ExperienceRoot />
    </ExperienceProvider>
  );
}
