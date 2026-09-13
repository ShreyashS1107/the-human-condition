import React, { useEffect } from 'react';
import { soundEngine } from '../../systems/audioEngine';

export function OpeningTransition({ onComplete, duration = 1800 }) {
  useEffect(() => {
    soundEngine.playTransitionSwell();

    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, duration);

    return () => clearTimeout(timer);
  }, [onComplete, duration]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#000000',
        zIndex: 50,
        pointerEvents: 'all',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: `openingFadeThrough ${duration}ms var(--ease-cinematic) forwards`,
      }}
    >
      <div
        className="font-mono"
        style={{
          fontSize: '0.7rem',
          letterSpacing: '0.4em',
          color: 'rgba(217, 205, 180, 0.4)',
          textTransform: 'uppercase',
          animation: 'pulseSlow 2s infinite ease-in-out',
        }}
      >
        // ENTERING VOID //
      </div>
    </div>
  );
}
